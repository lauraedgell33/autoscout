// Real-time WebSocket client for live updates, messaging, and presence
import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

type EventCallback = (data: any) => void;
type ConnectionCallback = (status: 'connected' | 'disconnected' | 'error') => void;

interface WebSocketConfig {
  url?: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  reconnectBackoff?: number;
  heartbeatInterval?: number;
}

class RealtimeClient {
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private connectionListeners: Set<ConnectionCallback> = new Set();
  private config: Required<WebSocketConfig>;
  private reconnectAttempts = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: any[] = [];
  private isConnected = false;

  constructor(config: WebSocketConfig = {}) {
    this.config = {
      url: config.url || this.getWebSocketURL(),
      reconnectAttempts: config.reconnectAttempts ?? 5,
      reconnectDelay: config.reconnectDelay ?? 1000,
      reconnectBackoff: config.reconnectBackoff ?? 2,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
    };
  }

  private getWebSocketURL(): string {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev';
    const wsProtocol = baseURL.startsWith('https') ? 'wss' : 'ws';
    const wsPath = baseURL.replace(/^https?:\/\//, '').replace(/\/api$/, '');
    return `${wsProtocol}://${wsPath}`;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const authToken = token || useAuthStore.getState().token;
        const url = `${this.config.url}?token=${authToken}`;

        this.websocket = new WebSocket(url);

        this.websocket.onopen = () => {
          console.log('🔗 WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.notifyConnectionChange('connected');
          resolve();
        };

        this.websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.notifyConnectionChange('error');
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.isConnected = false;
          this.stopHeartbeat();
          this.notifyConnectionChange('disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.stopHeartbeat();
    this.isConnected = false;
  }

  /**
   * Send message through WebSocket
   */
  send(event: string, data: any): void {
    const message = { event, data, timestamp: new Date().toISOString() };

    if (this.isConnected && this.websocket) {
      try {
        this.websocket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        this.messageQueue.push(message);
      }
    } else {
      this.messageQueue.push(message);
    }
  }

  /**
   * Subscribe to event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionListeners.add(callback);

    return () => {
      this.connectionListeners.delete(callback);
    };
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(message: any): void {
    const { event, data } = message;

    if (event === 'pong') {
      return; // Ignore heartbeat pongs
    }

    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }

    // Also emit to wildcard listeners
    if (this.eventListeners.has('*')) {
      this.eventListeners.get('*')!.forEach((callback) => {
        try {
          callback({ event, data });
        } catch (error) {
          console.error('Error in wildcard listener:', error);
        }
      });
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.websocket) {
        this.send('ping', {});
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      try {
        this.websocket?.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to flush queued message:', error);
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    const delay = this.config.reconnectDelay * Math.pow(this.config.reconnectBackoff, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Notify connection status change
   */
  private notifyConnectionChange(status: 'connected' | 'disconnected' | 'error'): void {
    this.connectionListeners.forEach((callback) => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  /**
   * Get connection status
   */
  isConnectedNow(): boolean {
    return this.isConnected;
  }

  /**
   * Get queued messages count
   */
  getQueuedMessagesCount(): number {
    return this.messageQueue.length;
  }
}

// Singleton instance
export const realtimeClient = new RealtimeClient();

/**
 * React hook for real-time events
 */
export function useRealtimeEvent(event: string, callback: EventCallback) {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = realtimeClient.on(event, callback);

    return () => {
      unsubscribeRef.current?.();
    };
  }, [event, callback]);
}

/**
 * React hook for connection status
 */
export function useRealtimeConnection() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubscribeRef.current = realtimeClient.onConnectionChange(setStatus);

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  return status;
}

export default realtimeClient;
