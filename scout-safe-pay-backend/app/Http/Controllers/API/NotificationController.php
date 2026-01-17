<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $perPage = $request->input('per_page', 15);
        $unreadOnly = $request->boolean('unread_only', false);
        
        $query = $user->notifications();
        
        if ($unreadOnly) {
            $query->whereNull('read_at');
        }
        
        $notifications = $query->latest()->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'notifications' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'last_page' => $notifications->lastPage(),
            ],
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    public function unreadCount()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = Auth::user();
        
        $notification = $user->notifications()->findOrFail($id);
        $notification->markAsRead();
        
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'notification' => $notification
        ]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        
        $user->unreadNotifications->markAsRead();
        
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function delete($id)
    {
        $user = Auth::user();
        
        $notification = $user->notifications()->findOrFail($id);
        $notification->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Notification deleted'
        ]);
    }

    public function deleteAll()
    {
        $user = Auth::user();
        
        $user->notifications()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'All notifications deleted'
        ]);
    }
}
