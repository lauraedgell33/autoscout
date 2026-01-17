<div class="space-y-2">
    @if($path)
        @php
            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $isPdf = strtolower($extension) === 'pdf';
        @endphp
        
        @if($isPdf)
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <svg class="w-16 h-16 mx-auto text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-medium text-gray-700 mb-2">PDF Document</p>
                <a 
                    href="{{ Storage::disk('local')->url($path) }}" 
                    target="_blank" 
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Open PDF
                </a>
            </div>
        @else
            <img 
                src="{{ Storage::disk('local')->url($path) }}" 
                alt="Payment Proof" 
                class="max-w-full h-auto rounded-lg border border-gray-300"
                style="max-height: 500px;"
            />
            <a 
                href="{{ Storage::disk('local')->url($path) }}" 
                target="_blank" 
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Open in new tab
            </a>
        @endif
    @else
        <div class="text-gray-500 italic">
            No payment proof uploaded
        </div>
    @endif
</div>
