<div class="space-y-6">
    <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-semibold text-gray-700">Transaction ID:</span>
                <span class="text-gray-900">#{{ $transaction->id }}</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">Amount:</span>
                <span class="text-gray-900">€{{ number_format($transaction->amount, 2) }}</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">Buyer:</span>
                <span class="text-gray-900">{{ $transaction->buyer->name }}</span>
            </div>
            <div>
                <span class="font-semibold text-gray-700">Vehicle:</span>
                <span class="text-gray-900">{{ $transaction->vehicle->make }} {{ $transaction->vehicle->model }}</span>
            </div>
        </div>
    </div>

    @if($transaction->payment_proof)
        @php
            $extension = pathinfo($transaction->payment_proof, PATHINFO_EXTENSION);
            $isPdf = strtolower($extension) === 'pdf';
        @endphp
        
        <div class="border border-gray-200 rounded-lg p-4">
            @if($isPdf)
                <div class="text-center space-y-4">
                    <svg class="w-20 h-20 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                        <p class="font-medium text-gray-900 mb-1">PDF Payment Receipt</p>
                        <p class="text-sm text-gray-500">Click below to open the document</p>
                    </div>
                    <a 
                        href="{{ Storage::disk('local')->url($transaction->payment_proof) }}" 
                        target="_blank" 
                        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        Open PDF Document
                    </a>
                </div>
            @else
                <img 
                    src="{{ Storage::disk('local')->url($transaction->payment_proof) }}" 
                    alt="Payment Proof" 
                    class="w-full h-auto rounded-lg"
                    style="max-height: 600px; object-fit: contain;"
                />
            @endif
        </div>

        <div class="flex justify-between items-center pt-4 border-t">
            <a 
                href="{{ Storage::disk('local')->url($transaction->payment_proof) }}" 
                download
                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
            </a>
            
            <span class="text-xs text-gray-500">
                Uploaded: {{ $transaction->updated_at->diffForHumans() }}
            </span>
        </div>
    @else
        <div class="text-center py-8">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500">No payment proof uploaded yet</p>
        </div>
    @endif
</div>
