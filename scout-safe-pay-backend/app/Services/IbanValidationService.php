<?php

namespace App\Services;

class IbanValidationService
{
    public static function validate(string $iban): bool
    {
        $iban = strtoupper(str_replace(' ', '', $iban));
        if (strlen($iban) < 15 || strlen($iban) > 34) return false;
        if (!preg_match('/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/', $iban)) return false;
        
        $countryLengths = self::getCountryLengths();
        $country = substr($iban, 0, 2);
        if (!isset($countryLengths[$country]) || strlen($iban) !== $countryLengths[$country]) return false;
        
        return self::mod97Check($iban);
    }

    private static function mod97Check(string $iban): bool
    {
        $rearranged = substr($iban, 4) . substr($iban, 0, 4);
        $numeric = '';
        for ($i = 0; $i < strlen($rearranged); $i++) {
            $char = $rearranged[$i];
            $numeric .= ctype_alpha($char) ? (ord($char) - ord('A') + 10) : $char;
        }
        
        $checksum = '';
        for ($i = 0; $i < strlen($numeric); $i++) {
            $checksum .= $numeric[$i];
            if (strlen($checksum) > 9) $checksum = bcmod($checksum, '97');
        }
        return bcmod($checksum, '97') === '1';
    }

    private static function getCountryLengths(): array
    {
        return [
            'AD' => 24, 'AE' => 23, 'AL' => 28, 'AT' => 20, 'AZ' => 28,
            'BA' => 20, 'BE' => 16, 'BG' => 22, 'BH' => 22, 'BR' => 29,
            'BY' => 28, 'CH' => 21, 'CR' => 22, 'CY' => 28, 'CZ' => 24,
            'DE' => 22, 'DK' => 18, 'DO' => 28, 'EE' => 20, 'EG' => 29,
            'ES' => 24, 'FI' => 18, 'FO' => 18, 'FR' => 27, 'GB' => 22,
            'GE' => 22, 'GI' => 23, 'GL' => 18, 'GR' => 27, 'GT' => 28,
            'HR' => 21, 'HU' => 28, 'IE' => 22, 'IL' => 23, 'IS' => 26,
            'IT' => 27, 'JO' => 30, 'KW' => 30, 'KZ' => 20, 'LB' => 28,
            'LC' => 32, 'LI' => 21, 'LT' => 20, 'LU' => 20, 'LV' => 21,
            'MC' => 27, 'MD' => 24, 'ME' => 22, 'MK' => 19, 'MR' => 27,
            'MT' => 31, 'MU' => 30, 'NL' => 18, 'NO' => 15, 'PK' => 24,
            'PL' => 28, 'PS' => 29, 'PT' => 25, 'QA' => 29, 'RO' => 24,
            'RS' => 22, 'SA' => 24, 'SE' => 24, 'SI' => 19, 'SK' => 24,
            'SM' => 27, 'TN' => 24, 'TR' => 26, 'UA' => 29, 'VA' => 22,
            'VG' => 24, 'XK' => 20,
        ];
    }

    public static function format(string $iban): string
    {
        $iban = strtoupper(str_replace(' ', '', $iban));
        return trim(chunk_split($iban, 4, ' '));
    }

    public static function mask(string $iban): string
    {
        $iban = str_replace(' ', '', $iban);
        $length = strlen($iban);
        if ($length <= 4) return str_repeat('*', $length);
        $masked = str_repeat('*', $length - 4) . substr($iban, -4);
        return self::format($masked);
    }

    public static function getCountry(string $iban): string
    {
        return strtoupper(substr(str_replace(' ', '', $iban), 0, 2));
    }
}
