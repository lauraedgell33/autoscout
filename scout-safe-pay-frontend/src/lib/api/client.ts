// Re-export the optimized API client
// This file maintains backward compatibility with existing imports
import { apiClient as optimizedClient } from '../api-client';

export const apiClient = optimizedClient;
export default apiClient;

