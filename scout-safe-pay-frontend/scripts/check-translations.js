#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

// Load all translation files
const langs = ['en', 'de', 'ro', 'es', 'fr', 'it', 'nl'];
const translations = {};

for (const lang of langs) {
  const filePath = path.join(messagesDir, `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Deep compare function to get all nested keys
function getNestedKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getNestedKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Get all EN keys as the reference
const allEnKeys = getNestedKeys(translations.en);
console.log('=== TRANSLATION CHECK ===\n');
console.log(`Reference language: EN (${allEnKeys.length} keys)\n`);

const missingByLang = {};
const report = [];

// Check each language
for (const lang of langs) {
  if (lang === 'en') continue;
  
  const langKeys = getNestedKeys(translations[lang]);
  const langSet = new Set(langKeys);
  
  const missing = allEnKeys.filter(k => !langSet.has(k));
  const extra = langKeys.filter(k => !new Set(allEnKeys).has(k));
  
  missingByLang[lang] = missing;
  
  console.log(`=== ${lang.toUpperCase()} ===`);
  console.log(`Total keys: ${langKeys.length}`);
  
  if (missing.length > 0) {
    console.log(`❌ Missing keys (${missing.length}):`);
    missing.slice(0, 20).forEach(k => console.log(`   - ${k}`));
    if (missing.length > 20) console.log(`   ... and ${missing.length - 20} more`);
  } else {
    console.log(`✅ All keys present`);
  }
  
  if (extra.length > 0) {
    console.log(`⚠️  Extra keys (${extra.length}):`);
    extra.slice(0, 5).forEach(k => console.log(`   - ${k}`));
    if (extra.length > 5) console.log(`   ... and ${extra.length - 5} more`);
  }
  
  console.log('');
}

// Find common missing keys across all languages
const commonMissing = allEnKeys.filter(k => {
  return langs.filter(l => l !== 'en').every(l => missingByLang[l]?.includes(k));
});

if (commonMissing.length > 0) {
  console.log('=== KEYS MISSING IN ALL NON-EN LANGUAGES ===');
  commonMissing.forEach(k => console.log(`- ${k}`));
}

// Output summary
console.log('\n=== SUMMARY ===');
for (const lang of langs) {
  if (lang === 'en') continue;
  const missing = missingByLang[lang]?.length || 0;
  const status = missing === 0 ? '✅' : `❌ (${missing} missing)`;
  console.log(`${lang.toUpperCase()}: ${status}`);
}
