# Legal Pages Translation Guide

## Overview

All 5 legal pages have been fully translated into 6 languages (EN, RO, DE, ES, FR, IT) with professional legal terminology appropriate for each jurisdiction.

## Translation Structure

### Key Naming Convention
```
legal.[page].[section]_[element]
```

### Pages & Key Counts

1. **Privacy Policy** (`legal.privacy.*`) - **107 keys**
   - Introduction
   - 11 main sections (Data Controller, Information Collection, Usage, Legal Basis, Data Sharing, Retention, Rights, Security, Cookies, Children's Privacy, Contact)
   - GDPR compliance focused

2. **Terms & Conditions** (`legal.terms.*`) - **93 keys**
   - 13 sections covering legal agreements
   - User obligations and platform rules
   - Payment and transaction terms
   - Liability and dispute resolution

3. **Cookies Policy** (`legal.cookies.*`) - **74 keys**
   - 4 cookie types (Essential, Performance, Functionality, Marketing)
   - Detailed cookie tables with names, purposes, durations
   - Third-party services and management instructions

4. **Refund Policy** (`legal.refund.*`) - **127 keys**
   - 9 detailed sections
   - Multiple refund scenarios with specific conditions
   - Timeline table with processing times
   - Buyer and seller obligations

5. **Purchase Agreement** (`legal.purchase.*`) - **109 keys**
   - 15 legal sections
   - Binding contract template
   - Vehicle-specific transaction terms
   - Electronic signature provisions

## Total Translation Count

**510 translation keys × 6 languages = 3,060 total translations**

## Language Files

All translations stored in:
```
messages/
├── en.json  🇬🇧 English (Original)
├── ro.json  🇷🇴 Romanian (Professional legal)
├── de.json  🇩🇪 German (Professional legal)
├── es.json  🇪🇸 Spanish (Professional legal)
├── fr.json  🇫🇷 French (Professional legal)
└── it.json  🇮🇹 Italian (Professional legal)
```

## Page Components

All pages located in:
```
src/app/[locale]/legal/
├── privacy/page.tsx
├── terms/page.tsx
├── cookies/page.tsx
├── refund/page.tsx
└── purchase-agreement/page.tsx
```

## Usage in Components

All pages use the `getTranslations` pattern:

```tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.[page]')
  return {
    title: `${t('title')} | AutoScout24 SafeTrade`,
    description: t('meta_description')
  }
}

export default async function PageComponent() {
  const t = await getTranslations('legal.[page]')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p dangerouslySetInnerHTML={{ __html: t('content_with_html') }} />
    </div>
  )
}
```

## HTML Content Preservation

Translations containing HTML use `dangerouslySetInnerHTML`:

```tsx
<li dangerouslySetInnerHTML={{ __html: t('section1_company') }} />
```

This preserves formatting like `<strong>`, `<ul>`, `<li>`, `<a>` tags in translations.

## Preserved Elements

The following remain unchanged across all languages:

### Technical Elements
- Cookie names: `auth_token`, `_ga`, `_gid`, `_fbp`, etc.
- HTML table structures
- Link URLs and href attributes

### Business Elements
- Date formats: "January 15, 2026"
- Email addresses: privacy@autoscout24-safetrade.com
- Phone numbers: +49 30 555 1234
- Monetary values: €100, 2.5%, 1.5%
- Placeholders: [Seller Name], [Vehicle Make], [Amount] EUR

### Legal Elements
- Company name: AutoScout24 SafeTrade
- All placeholder fields in Purchase Agreement

## Translation Quality

All translations feature:
- ✓ Professional legal terminology
- ✓ Jurisdiction-appropriate language
- ✓ Consistent terminology across all pages
- ✓ Proper grammar and syntax
- ✓ Cultural adaptation where necessary
- ✓ GDPR/legal compliance focus

## Example Translations

### Privacy Policy Introduction

**EN:** AutoScout24 SafeTrade is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, process, and protect your information in compliance with GDPR and applicable data protection laws.

**RO:** AutoScout24 SafeTrade se angajează să vă protejeze confidențialitatea și datele personale. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, procesăm și protejăm informațiile dumneavoastră în conformitate cu GDPR și legile aplicabile de protecție a datelor.

**DE:** AutoScout24 SafeTrade verpflichtet sich, Ihre Privatsphäre und personenbezogenen Daten zu schützen. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen in Übereinstimmung mit der DSGVO und geltenden Datenschutzgesetzen erfassen, verwenden, verarbeiten und schützen.

## Validation

All files validated with:
```bash
jq empty messages/*.json
```

✓ Zero syntax errors across all 6 language files

## Maintenance

To add new content:

1. Add English key to `messages/en.json` under appropriate `legal.[page].*` section
2. Translate to other 5 languages maintaining same key name
3. Update component to use `t('new_key')`
4. Test in all languages
5. Validate JSON syntax

## Testing

Test translations by switching locale in the app:
```
http://localhost:3000/en/legal/privacy
http://localhost:3000/ro/legal/privacy
http://localhost:3000/de/legal/privacy
http://localhost:3000/es/legal/privacy
http://localhost:3000/fr/legal/privacy
http://localhost:3000/it/legal/privacy
```

---

**Status:** ✅ Complete and Production-Ready

**Last Updated:** January 2026

**Translation Count:** 3,060 professional legal translations across 6 languages
