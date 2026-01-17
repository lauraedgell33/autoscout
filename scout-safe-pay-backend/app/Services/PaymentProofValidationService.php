<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class PaymentProofValidationService
{
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    public static function validate(UploadedFile $file): array
    {
        $errors = [];

        if (!in_array($file->getMimeType(), self::ALLOWED_TYPES)) {
            $errors[] = 'Invalid file type. Only PDF, JPG, and PNG files are allowed.';
        }

        if ($file->getSize() > self::MAX_SIZE) {
            $errors[] = 'File size exceeds 10MB limit.';
        }

        if ($file->getMimeType() !== 'application/pdf') {
            try {
                $img = Image::make($file);
                if ($img->width() < 800 || $img->height() < 600) {
                    $errors[] = 'Image resolution too low. Minimum 800x600 pixels required.';
                }
            } catch (\Exception $e) {
                $errors[] = 'Invalid image file.';
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'metadata' => [
                'size' => $file->getSize(),
                'type' => $file->getMimeType(),
                'original_name' => $file->getClientOriginalName(),
            ],
        ];
    }

    public static function extractPaymentReference(UploadedFile $file): ?string
    {
        try {
            $ocrService = config('services.ocr.provider', 'aws'); // aws, google, or tesseract
            
            switch ($ocrService) {
                case 'aws':
                    return self::extractUsingAwsTextract($file);
                case 'google':
                    return self::extractUsingGoogleVision($file);
                case 'tesseract':
                    return self::extractUsingTesseract($file);
                default:
                    return self::extractUsingRegex($file);
            }
        } catch (\Exception $e) {
            Log::error('OCR extraction failed', ['error' => $e->getMessage()]);
            return null;
        }
    }
    
    private static function extractUsingAwsTextract(UploadedFile $file): ?string
    {
        $awsKey = config('services.aws.textract_key');
        $awsSecret = config('services.aws.textract_secret');
        $awsRegion = config('services.aws.region', 'eu-central-1');
        
        if (!$awsKey || !$awsSecret) {
            Log::info('AWS Textract not configured, using fallback');
            return self::extractUsingRegex($file);
        }
        
        // Upload to S3 temporarily
        $path = $file->store('temp-ocr', 's3');
        
        // Call AWS Textract API
        $client = new \Aws\Textract\TextractClient([
            'version' => 'latest',
            'region' => $awsRegion,
            'credentials' => [
                'key' => $awsKey,
                'secret' => $awsSecret,
            ],
        ]);
        
        $result = $client->detectDocumentText([
            'Document' => [
                'S3Object' => [
                    'Bucket' => config('filesystems.disks.s3.bucket'),
                    'Name' => $path,
                ],
            ],
        ]);
        
        // Extract text and find reference
        $fullText = '';
        foreach ($result['Blocks'] as $block) {
            if ($block['BlockType'] === 'LINE') {
                $fullText .= $block['Text'] . ' ';
            }
        }
        
        // Clean up temp file
        Storage::disk('s3')->delete($path);
        
        return self::findReferenceInText($fullText);
    }
    
    private static function extractUsingGoogleVision(UploadedFile $file): ?string
    {
        $googleKey = config('services.google.vision_api_key');
        
        if (!$googleKey) {
            return self::extractUsingRegex($file);
        }
        
        $imageContent = base64_encode(file_get_contents($file->getRealPath()));
        
        $response = Http::post('https://vision.googleapis.com/v1/images:annotate?key=' . $googleKey, [
            'requests' => [[
                'image' => ['content' => $imageContent],
                'features' => [['type' => 'TEXT_DETECTION']],
            ]],
        ]);
        
        if ($response->successful() && $text = $response->json('responses.0.fullTextAnnotation.text')) {
            return self::findReferenceInText($text);
        }
        
        return null;
    }
    
    private static function extractUsingTesseract(UploadedFile $file): ?string
    {
        // Requires tesseract-ocr installed: sudo apt-get install tesseract-ocr
        if (!shell_exec('which tesseract')) {
            return self::extractUsingRegex($file);
        }
        
        $tempPath = $file->getRealPath();
        $outputPath = sys_get_temp_dir() . '/ocr_output';
        
        shell_exec("tesseract {$tempPath} {$outputPath}");
        
        if (file_exists($outputPath . '.txt')) {
            $text = file_get_contents($outputPath . '.txt');
            unlink($outputPath . '.txt');
            return self::findReferenceInText($text);
        }
        
        return null;
    }
    
    private static function extractUsingRegex(UploadedFile $file): ?string
    {
        // Fallback: try to extract from filename or metadata
        $filename = $file->getClientOriginalName();
        return self::findReferenceInText($filename);
    }
    
    private static function findReferenceInText(string $text): ?string
    {
        // Look for payment reference patterns
        // Example: SCOUTSAFE-2024-123456, REF:ABC123, etc.
        $patterns = [
            '/SCOUTSAFE-\d{4}-\d{6}/',
            '/REF[:\s]?([A-Z0-9]{6,20})/',
            '/REFERENCE[:\s]?([A-Z0-9]{6,20})/',
            '/\b[A-Z0-9]{8,16}\b/', // Generic alphanumeric
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, strtoupper($text), $matches)) {
                return $matches[0];
            }
        }
        
        return null;
    }

    public static function detectFraudIndicators(UploadedFile $file): array
    {
        $indicators = [];

        // Check for duplicate submissions
        $hash = md5_file($file->getRealPath());
        if (self::isDuplicateProof($hash)) {
            $indicators[] = 'duplicate_file';
        }

        // Check for image manipulation (basic)
        if ($file->getMimeType() !== 'application/pdf') {
            try {
                $img = Image::make($file);
                $exif = @exif_read_data($file->getRealPath());
                
                if ($exif && isset($exif['Software'])) {
                    $software = strtolower($exif['Software']);
                    if (strpos($software, 'photoshop') !== false || strpos($software, 'gimp') !== false) {
                        $indicators[] = 'edited_image';
                    }
                }
            } catch (\Exception $e) {
                // Ignore EXIF errors
            }
        }

        return $indicators;
    }

    private static function isDuplicateProof(string $hash): bool
    {
        // Check database for existing payment proofs with same hash
        return \App\Models\Payment::where('proof_file_hash', $hash)->exists();
    }

    public static function storeProof(UploadedFile $file, string $transactionCode, int $paymentId): string
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = sprintf(
            '%s-%s-%s.%s',
            $transactionCode,
            $paymentId,
            now()->timestamp,
            $extension
        );

        $path = $file->storeAs('payment-proofs', $fileName, 'private');
        
        \App\Models\Payment::where('id', $paymentId)->update([
            'proof_file_hash' => md5_file($file->getRealPath()),
        ]);

        return $path;
    }

    public static function generateVerificationReport(UploadedFile $file, array $validationResult, array $fraudIndicators): array
    {
        return [
            'timestamp' => now()->toIso8601String(),
            'file_metadata' => $validationResult['metadata'],
            'validation_passed' => $validationResult['valid'],
            'validation_errors' => $validationResult['errors'],
            'fraud_indicators' => $fraudIndicators,
            'risk_score' => self::calculateRiskScore($fraudIndicators),
            'recommendation' => self::getRecommendation($validationResult['valid'], $fraudIndicators),
        ];
    }

    private static function calculateRiskScore(array $fraudIndicators): int
    {
        $score = 0;
        foreach ($fraudIndicators as $indicator) {
            $scores = [
                'duplicate_file' => 50,
                'edited_image' => 30,
                'low_quality' => 20,
            ];
            $score += $scores[$indicator] ?? 10;
        }
        return min(100, $score);
    }

    private static function getRecommendation(bool $valid, array $fraudIndicators): string
    {
        if (!$valid) return 'reject';
        if (empty($fraudIndicators)) return 'auto_approve';
        if (count($fraudIndicators) >= 2) return 'manual_review_high';
        return 'manual_review_low';
    }
}
