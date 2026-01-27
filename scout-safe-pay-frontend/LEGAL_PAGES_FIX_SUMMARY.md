# Legal Pages HTML Tag Fix - Summary

## Problem
next-intl doesn't support HTML tags (`<strong>`, `<br>`, etc.) in JSON translation strings directly, causing FORMATTING_ERROR:
```
The intl string context variable "strong" was not provided to the string "<strong>Company:</strong> AutoScout24 SafeTrade SRL"
```

## Solution
Split translations containing HTML tags into separate label/value pairs and use React components in pages instead of `dangerouslySetInnerHTML`.

## Changes Applied

### 1. Translation Files Updated (All 6 Languages)
- ✅ `messages/en.json`
- ✅ `messages/ro.json`
- ✅ `messages/de.json`
- ✅ `messages/es.json`
- ✅ `messages/fr.json`
- ✅ `messages/it.json`

### 2. Page Components Updated
- ✅ `src/app/[locale]/legal/privacy/page.tsx`
- ✅ `src/app/[locale]/legal/terms/page.tsx`
- ✅ `src/app/[locale]/legal/cookies/page.tsx`
- ✅ `src/app/[locale]/legal/refund/page.tsx`
- ✅ `src/app/[locale]/legal/purchase-agreement/page.tsx`

### 3. Pattern Applied

**BEFORE (Broken):**
```json
{
  "section1_company": "<strong>Company:</strong> AutoScout24 SafeTrade SRL"
}
```
```tsx
<li dangerouslySetInnerHTML={{ __html: t('section1_company') }} />
```

**AFTER (Fixed):**
```json
{
  "section1_company_label": "Company",
  "section1_company_value": "AutoScout24 SafeTrade SRL"
}
```
```tsx
<li><strong>{t('section1_company_label')}:</strong> {t('section1_company_value')}</li>
```

## Statistics
- **Total translations updated:** ~700+ (117 per language × 6 languages)
- **HTML tags removed:** 141 from en.json (similar in other languages)
- **dangerouslySetInnerHTML removed:** All occurrences in legal pages

## Verification
✅ All JSON files are valid
✅ No HTML tags remain in translation files
✅ No dangerouslySetInnerHTML in legal pages
✅ Visual appearance remains identical (using React `<strong>` components)

## Testing
To test the pages:
```bash
npm run dev
# Visit:
# - http://localhost:3000/en/legal/privacy
# - http://localhost:3000/en/legal/terms
# - http://localhost:3000/en/legal/cookies
# - http://localhost:3000/en/legal/refund
# - http://localhost:3000/en/legal/purchase-agreement
```

All pages should render without FORMATTING_ERROR and display properly formatted content with bold labels.
