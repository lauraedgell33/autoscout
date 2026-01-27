#!/usr/bin/env python3
import json
import copy

# Comprehensive translation dictionary
full_translations = {
    'de': {
        # Keep as is - technical terms, brands, emails
        'ATVs': 'ATVs',
        'Quads': 'Quads',
        'Status': 'Status',
        'Diesel': 'Diesel',
        'Hybrid': 'Hybrid',
        'SUV': 'SUV',
        'Van': 'Van',
        'Pickup': 'Pickup',
        'PDF, PNG, JPG (max 10MB)': 'PDF, PNG, JPG (max 10MB)',
        'Google Analytics:': 'Google Analytics:',
        'Facebook Pixel:': 'Facebook Pixel:',
        'Hotjar:': 'Hotjar:',
        'Chrome:': 'Chrome:',
        'Firefox:': 'Firefox:',
        'Safari:': 'Safari:',
        'Edge:': 'Edge:',
        'Incident Response': 'Vorfallreaktion',
        
        # Legal/business terms that need translation
        'Privacy Policy': 'Datenschutzerklärung',
        'Terms of Service': 'Nutzungsbedingungen',
        'Cookie Policy': 'Cookie-Richtlinie',
        'Contact': 'Kontakt',
        'Legal': 'Rechtliches',
    },
    'es': {
        'ATVs': 'Quads',
        'Quads': 'Quads',
        'Status': 'Estado',
        'Diesel': 'Diésel',
        'Hybrid': 'Híbrido',
        'SUV': 'SUV',
        'Van': 'Furgoneta',
        'Pickup': 'Pickup',
        'PDF, PNG, JPG (max 10MB)': 'PDF, PNG, JPG (máx 10MB)',
        'Google Analytics:': 'Google Analytics:',
        'Facebook Pixel:': 'Facebook Pixel:',
        'Hotjar:': 'Hotjar:',
        'Chrome:': 'Chrome:',
        'Firefox:': 'Firefox:',
        'Safari:': 'Safari:',
        'Edge:': 'Edge:',
        'Incident Response': 'Respuesta a Incidentes',
    },
    'it': {
        'ATVs': 'Quad',
        'Quads': 'Quad',
        'Status': 'Stato',
        'Diesel': 'Diesel',
        'Hybrid': 'Ibrido',
        'SUV': 'SUV',
        'Van': 'Furgone',
        'Pickup': 'Pickup',
        'PDF, PNG, JPG (max 10MB)': 'PDF, PNG, JPG (max 10MB)',
        'Google Analytics:': 'Google Analytics:',
        'Facebook Pixel:': 'Facebook Pixel:',
        'Hotjar:': 'Hotjar:',
        'Chrome:': 'Chrome:',
        'Firefox:': 'Firefox:',
        'Safari:': 'Safari:',
        'Edge:': 'Edge:',
        'Incident Response': 'Risposta agli Incidenti',
    },
    'ro': {
        'ATVs': 'ATV-uri',
        'Quads': 'Quad-uri',
        'Status': 'Status',
        'Diesel': 'Motorină',
        'Hybrid': 'Hibrid',
        'SUV': 'SUV',
        'Van': 'Dubă',
        'Pickup': 'Pickup',
        'PDF, PNG, JPG (max 10MB)': 'PDF, PNG, JPG (max 10MB)',
        'Google Analytics:': 'Google Analytics:',
        'Facebook Pixel:': 'Facebook Pixel:',
        'Hotjar:': 'Hotjar:',
        'Chrome:': 'Chrome:',
        'Firefox:': 'Firefox:',
        'Safari:': 'Safari:',
        'Edge:': 'Edge:',
        'Incident Response': 'Răspuns la Incidente',
    },
    'fr': {
        'ATVs': 'Quads',
        'Quads': 'Quads',
        'Status': 'Statut',
        'Diesel': 'Diesel',
        'Hybrid': 'Hybride',
        'SUV': 'SUV',
        'Van': 'Fourgon',
        'Pickup': 'Pick-up',
        'PDF, PNG, JPG (max 10MB)': 'PDF, PNG, JPG (max 10Mo)',
        'Google Analytics:': 'Google Analytics:',
        'Facebook Pixel:': 'Facebook Pixel:',
        'Hotjar:': 'Hotjar:',
        'Chrome:': 'Chrome:',
        'Firefox:': 'Firefox:',
        'Safari:': 'Safari:',
        'Edge:': 'Edge:',
        'Incident Response': 'Réponse aux Incidents',
    }
}

# Patterns that should remain unchanged (emails, phones, company names, technical identifiers)
KEEP_AS_IS_PATTERNS = [
    '@',  # emails
    '+',  # phone numbers
    'AutoScout24',  # company name
    'SafeTrade',  # company name
    'SRL',  # legal entity
    'legal@',
    'privacy@',
    'dpo@',
]

def should_keep_as_is(value):
    """Check if a value should remain untranslated"""
    if not isinstance(value, str):
        return False
    
    # Keep empty strings
    if value == '':
        return True
    
    # Keep if matches any pattern
    for pattern in KEEP_AS_IS_PATTERNS:
        if pattern in value:
            return True
    
    return False

def translate_value(en_value, lang_code):
    """Translate a single value if possible"""
    # Keep as is if matches patterns
    if should_keep_as_is(en_value):
        return en_value
    
    # Try dictionary lookup
    if en_value in full_translations[lang_code]:
        return full_translations[lang_code][en_value]
    
    # Return original if no translation found
    return en_value

def translate_dict(en_dict, lang_dict, lang_code):
    """Recursively translate dictionary"""
    for key, en_value in en_dict.items():
        if isinstance(en_value, dict):
            if key not in lang_dict:
                lang_dict[key] = {}
            if isinstance(lang_dict[key], dict):
                translate_dict(en_value, lang_dict[key], lang_code)
        else:
            # If missing or equals English value, try to translate
            if key not in lang_dict or lang_dict[key] == en_value:
                lang_dict[key] = translate_value(en_value, lang_code)

# Process all languages
languages = ['de', 'es', 'it', 'ro', 'fr']

with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

for lang in languages:
    with open(f'messages/{lang}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    translate_dict(en_data, data, lang)
    
    # Save updated file
    with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Updated {lang}.json")

print("\n✓ All translations processed!")
