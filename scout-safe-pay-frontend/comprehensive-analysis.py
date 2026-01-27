#!/usr/bin/env python3
"""
Comprehensive Application Analysis Script
Analyzes the Next.js app for common issues and generates a detailed report
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict

class ApplicationAnalyzer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.issues = defaultdict(list)
        self.stats = defaultdict(int)
        
    def analyze_translations(self):
        """Check translation completeness across all languages"""
        print("📝 Analyzing translations...")
        messages_dir = self.base_path / 'messages'
        
        # Load all translation files
        translations = {}
        languages = ['en', 'de', 'es', 'it', 'ro', 'fr']
        
        for lang in languages:
            file_path = messages_dir / f'{lang}.json'
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    translations[lang] = json.load(f)
        
        # Get all keys from English
        def get_all_keys(d, prefix=''):
            keys = []
            for k, v in d.items():
                if isinstance(v, dict):
                    keys.extend(get_all_keys(v, f'{prefix}{k}.'))
                else:
                    keys.append(f'{prefix}{k}')
            return keys
        
        en_keys = set(get_all_keys(translations['en']))
        self.stats['total_translation_keys'] = len(en_keys)
        
        # Check each language
        for lang in ['de', 'es', 'it', 'ro', 'fr']:
            lang_keys = set(get_all_keys(translations[lang]))
            missing = en_keys - lang_keys
            
            if missing:
                self.issues['translations'].append({
                    'lang': lang,
                    'missing_keys': len(missing),
                    'sample': list(missing)[:5]
                })
            
            # Check for untranslated (same as English)
            def check_untranslated(en_dict, lang_dict, path=''):
                count = 0
                for key, en_value in en_dict.items():
                    full_path = f'{path}.{key}' if path else key
                    if isinstance(en_value, dict):
                        if key in lang_dict and isinstance(lang_dict[key], dict):
                            count += check_untranslated(en_value, lang_dict[key], full_path)
                    else:
                        if key in lang_dict and lang_dict[key] == en_value and en_value != '':
                            # Skip technical terms, emails, etc.
                            if not any(x in str(en_value) for x in ['@', '+', 'AutoScout24']):
                                count += 1
                return count
            
            untranslated = check_untranslated(translations['en'], translations[lang])
            self.stats[f'{lang}_untranslated'] = untranslated
            
            if untranslated > 0:
                self.issues['translations'].append({
                    'lang': lang,
                    'issue': 'untranslated',
                    'count': untranslated
                })
        
        print(f"   ✓ Analyzed {len(en_keys)} translation keys across {len(languages)} languages")
    
    def analyze_imports(self):
        """Check for incorrect imports"""
        print("🔍 Analyzing imports...")
        
        src_path = self.base_path / 'src'
        
        # Find all TypeScript/TSX files
        files = list(src_path.rglob('*.tsx')) + list(src_path.rglob('*.ts'))
        
        wrong_link_imports = []
        wrong_router_imports = []
        wrong_pathname_imports = []
        
        for file in files:
            content = file.read_text(encoding='utf-8')
            
            # Check for wrong Link import
            if "import Link from 'next/link'" in content:
                wrong_link_imports.append(str(file.relative_to(self.base_path)))
            
            # Check for wrong useRouter (in client components)
            if "'use client'" in content or '"use client"' in content:
                if "from 'next/navigation'" in content:
                    if 'useRouter' in content and 'useParams' not in content:
                        wrong_router_imports.append(str(file.relative_to(self.base_path)))
                    if 'usePathname' in content:
                        wrong_pathname_imports.append(str(file.relative_to(self.base_path)))
        
        if wrong_link_imports:
            self.issues['imports'].append({
                'type': 'wrong_link_import',
                'count': len(wrong_link_imports),
                'files': wrong_link_imports[:10]
            })
        
        if wrong_router_imports:
            self.issues['imports'].append({
                'type': 'wrong_router_import',
                'count': len(wrong_router_imports),
                'files': wrong_router_imports[:10]
            })
        
        if wrong_pathname_imports:
            self.issues['imports'].append({
                'type': 'wrong_pathname_import',
                'count': len(wrong_pathname_imports),
                'files': wrong_pathname_imports[:10]
            })
        
        self.stats['files_analyzed'] = len(files)
        print(f"   ✓ Analyzed {len(files)} files")
    
    def analyze_pages(self):
        """Analyze all pages for common issues"""
        print("�� Analyzing pages...")
        
        pages_path = self.base_path / 'src' / 'app' / '[locale]'
        
        if not pages_path.exists():
            self.issues['structure'].append('Missing [locale] directory')
            return
        
        # Find all page.tsx files
        pages = list(pages_path.rglob('page.tsx'))
        
        for page in pages:
            content = page.read_text(encoding='utf-8')
            relative_path = str(page.relative_to(pages_path))
            
            # Check if uses translations
            if 'useTranslations' in content:
                # Check if it's a client component
                if "'use client'" not in content and '"use client"' not in content:
                    self.issues['pages'].append({
                        'file': relative_path,
                        'issue': 'uses translations but not client component'
                    })
            
            # Check for hardcoded text (simple heuristic)
            if re.search(r'<h1[^>]*>[A-Z][a-zA-Z\s]{10,}</h1>', content):
                matches = re.findall(r'<h1[^>]*>([^<]+)</h1>', content)
                for match in matches:
                    if not match.startswith('{') and len(match) > 10:
                        self.issues['pages'].append({
                            'file': relative_path,
                            'issue': 'possible hardcoded text',
                            'text': match[:50]
                        })
        
        self.stats['pages_analyzed'] = len(pages)
        print(f"   ✓ Analyzed {len(pages)} pages")
    
    def check_i18n_config(self):
        """Check i18n configuration files"""
        print("⚙️  Checking i18n configuration...")
        
        # Check routing.ts
        routing_file = self.base_path / 'src' / 'i18n' / 'routing.ts'
        if not routing_file.exists():
            self.issues['config'].append('Missing src/i18n/routing.ts')
        else:
            content = routing_file.read_text()
            if 'localePrefix' not in content:
                self.issues['config'].append('routing.ts missing localePrefix configuration')
        
        # Check middleware.ts
        middleware_file = self.base_path / 'middleware.ts'
        if not middleware_file.exists():
            self.issues['config'].append('Missing middleware.ts')
        
        # Check request.ts
        request_file = self.base_path / 'src' / 'i18n' / 'request.ts'
        if not request_file.exists():
            self.issues['config'].append('Missing src/i18n/request.ts')
        
        print("   ✓ Configuration check complete")
    
    def check_api_config(self):
        """Check API configuration"""
        print("🔌 Checking API configuration...")
        
        # Check .env.local
        env_file = self.base_path / '.env.local'
        if env_file.exists():
            content = env_file.read_text()
            if 'NEXT_PUBLIC_API_URL' not in content:
                self.issues['api'].append('Missing NEXT_PUBLIC_API_URL in .env.local')
            else:
                # Extract API URL
                match = re.search(r'NEXT_PUBLIC_API_URL=(.+)', content)
                if match:
                    self.stats['api_url'] = match.group(1).strip()
        else:
            self.issues['api'].append('Missing .env.local file')
        
        # Check API client
        api_client = self.base_path / 'src' / 'lib' / 'api' / 'client.ts'
        if not api_client.exists():
            self.issues['api'].append('Missing API client file')
        
        print("   ✓ API configuration check complete")
    
    def generate_report(self):
        """Generate comprehensive report"""
        print("\n" + "="*80)
        print("📊 COMPREHENSIVE ANALYSIS REPORT")
        print("="*80)
        
        print("\n📈 STATISTICS:")
        print(f"  • Total files analyzed: {self.stats.get('files_analyzed', 0)}")
        print(f"  • Total pages analyzed: {self.stats.get('pages_analyzed', 0)}")
        print(f"  • Total translation keys: {self.stats.get('total_translation_keys', 0)}")
        
        if self.stats.get('api_url'):
            print(f"  • API URL: {self.stats['api_url']}")
        
        print("\n🔍 ISSUES FOUND:")
        
        total_issues = sum(len(v) for v in self.issues.values())
        
        if total_issues == 0:
            print("  ✅ No critical issues found!")
        else:
            print(f"  ⚠️  Total issues: {total_issues}\n")
            
            for category, issue_list in self.issues.items():
                if issue_list:
                    print(f"\n  📌 {category.upper()}:")
                    for issue in issue_list[:10]:  # Show max 10 per category
                        if isinstance(issue, dict):
                            print(f"     • {json.dumps(issue, indent=8)}")
                        else:
                            print(f"     • {issue}")
                    
                    if len(issue_list) > 10:
                        print(f"     ... and {len(issue_list) - 10} more")
        
        print("\n" + "="*80)
        
        # Save detailed report
        report_file = self.base_path / 'ANALYSIS_REPORT.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump({
                'stats': dict(self.stats),
                'issues': dict(self.issues)
            }, f, indent=2)
        
        print(f"📄 Detailed report saved to: ANALYSIS_REPORT.json")
        print("="*80 + "\n")
        
        return total_issues

def main():
    analyzer = ApplicationAnalyzer('/home/x/Documents/scout/scout-safe-pay-frontend')
    
    print("🚀 Starting comprehensive analysis...\n")
    
    analyzer.check_i18n_config()
    analyzer.analyze_translations()
    analyzer.analyze_imports()
    analyzer.analyze_pages()
    analyzer.check_api_config()
    
    total_issues = analyzer.generate_report()
    
    if total_issues == 0:
        print("✅ Application analysis complete - No critical issues found!")
    else:
        print(f"⚠️  Application analysis complete - {total_issues} issues need attention")
    
    return total_issues

if __name__ == '__main__':
    exit(main())
