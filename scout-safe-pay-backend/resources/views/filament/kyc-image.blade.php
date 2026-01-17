<div class="space-y-2">
    @if($path)
        @php
            $pathParts = explode('/', $path);
            $userId = $pathParts[1] ?? null;
            $type = $pathParts[2] ?? null;
            $filename = $pathParts[3] ?? null;
        @endphp
        @if($userId && $type && $filename)
            <img 
                src="{{ route('admin.kyc-image', ['user_id' => $userId, 'type' => $type, 'filename' => $filename]) }}" 
                alt="KYC Document" 
                class="max-w-full h-auto rounded-lg border border-gray-300"
                style="max-height: 400px;"
            />
            <a 
                href="{{ route('admin.kyc-image', ['user_id' => $userId, 'type' => $type, 'filename' => $filename]) }}" 
                target="_blank" 
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Open in new tab
            </a>
        @else
            <div class="text-gray-500 italic">Invalid image path</div>
        @endif
    @else
        <div class="text-gray-500 italic">Image not found</div>
    @endif
</div>
