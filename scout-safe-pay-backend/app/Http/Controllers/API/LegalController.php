<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LegalDocument;
use App\Models\UserConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LegalController extends Controller
{
    /**
     * Get active legal document by type
     */
    public function getDocument(Request $request, string $type): JsonResponse
    {
        $language = $request->get('language', 'en');
        
        $document = LegalDocument::getActiveDocument($type, $language);
        
        if (!$document) {
            return response()->json([
                'message' => 'Document not found'
            ], 404);
        }
        
        return response()->json($document);
    }

    /**
     * Get all active legal documents
     */
    public function getAllDocuments(Request $request): JsonResponse
    {
        $language = $request->get('language', 'en');
        
        $types = [
            LegalDocument::TYPE_TERMS_OF_SERVICE,
            LegalDocument::TYPE_PRIVACY_POLICY,
            LegalDocument::TYPE_COOKIE_POLICY,
            LegalDocument::TYPE_PURCHASE_AGREEMENT,
            LegalDocument::TYPE_REFUND_POLICY,
        ];
        
        $documents = [];
        foreach ($types as $type) {
            $doc = LegalDocument::getActiveDocument($type, $language);
            if ($doc) {
                $documents[$type] = $doc;
            }
        }
        
        return response()->json($documents);
    }

    /**
     * Record user consent
     */
    public function recordConsent(Request $request): JsonResponse
    {
        $request->validate([
            'legal_document_id' => 'required|exists:legal_documents,id',
            'accepted' => 'required|boolean',
        ]);

        $consent = UserConsent::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'legal_document_id' => $request->legal_document_id,
            ],
            [
                'accepted' => $request->accepted,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'accepted_at' => $request->accepted ? now() : null,
                'revoked_at' => !$request->accepted ? now() : null,
            ]
        );

        return response()->json([
            'message' => 'Consent recorded successfully',
            'consent' => $consent
        ]);
    }

    /**
     * Get user consents
     */
    public function getUserConsents(): JsonResponse
    {
        $consents = UserConsent::with('legalDocument')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json($consents);
    }

    /**
     * Check if user has accepted required documents
     */
    public function checkConsents(Request $request): JsonResponse
    {
        $requiredTypes = $request->get('types', [
            LegalDocument::TYPE_TERMS_OF_SERVICE,
            LegalDocument::TYPE_PRIVACY_POLICY,
        ]);

        $language = $request->get('language', 'en');
        $missingConsents = [];

        foreach ($requiredTypes as $type) {
            $document = LegalDocument::getActiveDocument($type, $language);
            
            if ($document) {
                $consent = UserConsent::where('user_id', Auth::id())
                    ->where('legal_document_id', $document->id)
                    ->where('accepted', true)
                    ->whereNull('revoked_at')
                    ->first();

                if (!$consent) {
                    $missingConsents[] = [
                        'type' => $type,
                        'document' => $document
                    ];
                }
            }
        }

        return response()->json([
            'has_all_consents' => empty($missingConsents),
            'missing_consents' => $missingConsents
        ]);
    }

    /**
     * Get Terms of Service document
     */
    public function getTerms(Request $request): JsonResponse
    {
        return $this->getDocument($request, LegalDocument::TYPE_TERMS_OF_SERVICE);
    }

    /**
     * Get Privacy Policy document
     */
    public function getPrivacy(Request $request): JsonResponse
    {
        return $this->getDocument($request, LegalDocument::TYPE_PRIVACY_POLICY);
    }

    /**
     * Get Cookie Policy document
     */
    public function getCookies(Request $request): JsonResponse
    {
        return $this->getDocument($request, LegalDocument::TYPE_COOKIE_POLICY);
    }
}

