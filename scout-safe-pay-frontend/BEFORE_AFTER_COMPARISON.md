# Before/After Comparison

## Example 1: Privacy Policy - Section 1 (Company Details)

### BEFORE (Broken):
**Translation (en.json):**
```json
"section1_company": "<strong>Company:</strong> AutoScout24 SafeTrade SRL",
"section1_email": "<strong>Email:</strong> privacy@autoscout24-safetrade.com"
```

**Component (page.tsx):**
```tsx
<li dangerouslySetInnerHTML={{ __html: t('section1_company') }} />
<li dangerouslySetInnerHTML={{ __html: t('section1_email') }} />
```

**Error:**
```
FORMATTING_ERROR: The intl string context variable "strong" was not provided
```

---

### AFTER (Fixed):
**Translation (en.json):**
```json
"section1_company_label": "Company",
"section1_company_value": "AutoScout24 SafeTrade SRL",
"section1_email_label": "Email",
"section1_email_value": "privacy@autoscout24-safetrade.com"
```

**Component (page.tsx):**
```tsx
<li><strong>{t('section1_company_label')}:</strong> {t('section1_company_value')}</li>
<li><strong>{t('section1_email_label')}:</strong> {t('section1_email_value')}</li>
```

**Result:** ✅ No errors, proper rendering with bold labels

---

## Example 2: Terms - Section 2 (Definitions)

### BEFORE (Broken):
**Translation:**
```json
"section2_def1": "<strong>\"Platform\"</strong> - The AutoScout24 SafeTrade website"
```

**Component:**
```tsx
<li dangerouslySetInnerHTML={{ __html: t('section2_def1') }} />
```

---

### AFTER (Fixed):
**Translation:**
```json
"section2_def1_label": "\"Platform\"",
"section2_def1_value": "The AutoScout24 SafeTrade website"
```

**Component:**
```tsx
<li><strong>{t('section2_def1_label')}</strong> - {t('section2_def1_value')}</li>
```

**Result:** ✅ Clean, safe rendering

---

## Example 3: Refund - Section 2 (Refund Conditions)

### BEFORE (Broken):
**Translation:**
```json
"section2_condition1": "<strong>Vehicle Misrepresentation:</strong> Full refund if vehicle doesn't match listing"
```

---

### AFTER (Fixed):
**Translation:**
```json
"section2_condition1_label": "Vehicle Misrepresentation",
"section2_condition1_value": "Full refund if vehicle doesn't match listing"
```

**Component:**
```tsx
<li><strong>{t('section2_condition1_label')}:</strong> {t('section2_condition1_value')}</li>
```

---

## Key Benefits

1. **✅ No HTML in translations** - Clean, translatable text only
2. **✅ Type-safe** - next-intl can validate translation keys
3. **✅ Security** - No dangerouslySetInnerHTML vulnerabilities
4. **✅ Maintainable** - Clear separation of labels and values
5. **✅ Consistent styling** - React components ensure uniform appearance
6. **✅ Identical visual output** - Users see the same bold formatting
