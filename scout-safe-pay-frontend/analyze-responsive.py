#!/usr/bin/env python3
"""
Responsive Design & Mobile Optimization Analysis
"""

import re
from pathlib import Path
from collections import defaultdict

class ResponsiveAnalyzer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.issues = defaultdict(list)
        self.stats = defaultdict(int)
        
    def analyze_responsive_classes(self):
        """Check for responsive design patterns"""
        print("📱 Analyzing responsive design...")
        
        src_path = self.base_path / 'src'
        files = list(src_path.rglob('*.tsx')) + list(src_path.rglob('*.ts'))
        
        responsive_patterns = {
            'sm:': 0,  # 640px
            'md:': 0,  # 768px
            'lg:': 0,  # 1024px
            'xl:': 0,  # 1280px
            '2xl:': 0, # 1536px
        }
        
        mobile_issues = []
        
        for file in files:
            content = file.read_text(encoding='utf-8')
            
            # Count responsive classes
            for pattern in responsive_patterns:
                responsive_patterns[pattern] += content.count(pattern)
            
            # Check for potential mobile issues
            if 'className=' in content:
                # Fixed widths without responsive
                if re.search(r'w-\d{3,}(?!\s+(sm:|md:|lg:|xl:))', content):
                    mobile_issues.append({
                        'file': str(file.relative_to(self.base_path)),
                        'issue': 'Fixed width without responsive breakpoint'
                    })
                
                # Fixed heights that might overflow
                if re.search(r'h-\d{3,}', content):
                    mobile_issues.append({
                        'file': str(file.relative_to(self.base_path)),
                        'issue': 'Fixed height - might overflow on mobile'
                    })
        
        self.stats['responsive_classes'] = sum(responsive_patterns.values())
        self.stats['files_with_responsive'] = len([f for f in files if any(
            p in f.read_text(encoding='utf-8') for p in responsive_patterns
        )])
        
        if len(mobile_issues) > 0:
            self.issues['mobile'].extend(mobile_issues[:10])
        
        print(f"   ✓ Found {self.stats['responsive_classes']} responsive classes")
        print(f"   📊 Responsive breakdown:")
        for pattern, count in responsive_patterns.items():
            print(f"      {pattern} {count} usages")
    
    def check_mobile_optimization(self):
        """Check mobile-specific optimizations"""
        print("\n📱 Checking mobile optimizations...")
        
        # Check for viewport meta tag
        layout_file = self.base_path / 'src' / 'app' / '[locale]' / 'layout.tsx'
        if layout_file.exists():
            content = layout_file.read_text()
            if 'viewport' in content:
                print("   ✓ Viewport meta tag configured")
            else:
                self.issues['mobile'].append('Missing viewport meta tag')
        
        # Check for touch-friendly sizes (min 44x44px)
        print("   ℹ️  Button sizes should be minimum 44x44px for touch")
        
        # Check for horizontal scroll prevention
        tailwind_config = self.base_path / 'tailwind.config.js'
        if tailwind_config.exists():
            content = tailwind_config.read_text()
            if 'overflow-x-hidden' in content or 'max-w' in content:
                print("   ✓ Overflow prevention configured")
    
    def check_performance(self):
        """Check performance optimizations"""
        print("\n⚡ Checking performance optimizations...")
        
        # Check for Image component usage
        src_path = self.base_path / 'src'
        files = list(src_path.rglob('*.tsx'))
        
        using_next_image = 0
        using_img_tag = 0
        
        for file in files:
            content = file.read_text(encoding='utf-8')
            if 'next/image' in content:
                using_next_image += 1
            if re.search(r'<img\s', content):
                using_img_tag += 1
                self.issues['performance'].append({
                    'file': str(file.relative_to(self.base_path)),
                    'issue': 'Using <img> instead of Next.js Image component'
                })
        
        self.stats['next_image_usage'] = using_next_image
        self.stats['img_tag_usage'] = using_img_tag
        
        print(f"   Next/Image usage: {using_next_image} files")
        print(f"   <img> tag usage: {using_img_tag} files")
        
        # Check for font optimization
        layout_file = self.base_path / 'src' / 'app' / '[locale]' / 'layout.tsx'
        if layout_file.exists():
            content = layout_file.read_text()
            if 'next/font' in content:
                print("   ✓ Font optimization enabled")
            else:
                print("   ⚠️  Consider using next/font for better performance")
    
    def check_accessibility(self):
        """Check accessibility features"""
        print("\n♿ Checking accessibility...")
        
        src_path = self.base_path / 'src'
        files = list(src_path.rglob('*.tsx'))
        
        missing_alt = []
        missing_aria = []
        
        for file in files:
            content = file.read_text(encoding='utf-8')
            
            # Check for images without alt
            if '<img' in content and 'alt=' not in content and 'next/image' not in content:
                missing_alt.append(str(file.relative_to(self.base_path)))
            
            # Check for buttons without aria-label on icon-only buttons
            if 'button' in content.lower():
                # Simple heuristic
                pass
        
        if missing_alt:
            self.issues['accessibility'].append({
                'type': 'missing_alt',
                'count': len(missing_alt),
                'files': missing_alt[:5]
            })
        
        print(f"   Images without alt: {len(missing_alt)}")
    
    def generate_report(self):
        """Generate optimization report"""
        print("\n" + "="*80)
        print("📊 RESPONSIVE DESIGN & OPTIMIZATION REPORT")
        print("="*80)
        
        print("\n📈 STATISTICS:")
        print(f"  • Responsive classes: {self.stats.get('responsive_classes', 0)}")
        print(f"  • Files with responsive design: {self.stats.get('files_with_responsive', 0)}")
        print(f"  • Next/Image usage: {self.stats.get('next_image_usage', 0)} files")
        print(f"  • <img> tag usage: {self.stats.get('img_tag_usage', 0)} files")
        
        print("\n🎯 RECOMMENDATIONS:")
        
        total_issues = sum(len(v) for v in self.issues.values())
        
        if total_issues == 0:
            print("  ✅ No major issues found!")
        else:
            print(f"  Found {total_issues} optimization opportunities\n")
            
            for category, issue_list in self.issues.items():
                if issue_list:
                    print(f"\n  📌 {category.upper()}:")
                    for issue in issue_list[:5]:
                        if isinstance(issue, dict):
                            if 'file' in issue:
                                print(f"     • {issue['file']}: {issue['issue']}")
                            else:
                                print(f"     • {issue}")
                        else:
                            print(f"     • {issue}")
        
        print("\n" + "="*80)
        
        # Recommendations
        print("\n💡 OPTIMIZATION RECOMMENDATIONS:")
        print("="*80)
        
        print("\n1. MOBILE OPTIMIZATION:")
        print("   • Add mobile menu for navigation")
        print("   • Optimize images for mobile (use next/image)")
        print("   • Test touch targets (minimum 44x44px)")
        print("   • Add mobile-specific layouts where needed")
        
        print("\n2. PERFORMANCE:")
        print("   • Replace <img> tags with next/image")
        print("   • Add loading states for API calls")
        print("   • Implement lazy loading for heavy components")
        print("   • Optimize bundle size")
        
        print("\n3. RESPONSIVE DESIGN:")
        print("   • Test on all breakpoints (sm, md, lg, xl)")
        print("   • Ensure tables are scrollable on mobile")
        print("   • Check form layouts on small screens")
        print("   • Test navigation on tablet")
        
        print("\n4. ACCESSIBILITY:")
        print("   • Add alt text to all images")
        print("   • Ensure keyboard navigation works")
        print("   • Add ARIA labels where needed")
        print("   • Test with screen readers")
        
        print("\n5. SEO:")
        print("   • Add meta descriptions")
        print("   • Optimize title tags")
        print("   • Add Open Graph tags")
        print("   • Generate sitemap.xml")
        
        print("\n" + "="*80)

def main():
    analyzer = ResponsiveAnalyzer('/home/x/Documents/scout/scout-safe-pay-frontend')
    
    print("🚀 Starting responsive design analysis...\n")
    
    analyzer.analyze_responsive_classes()
    analyzer.check_mobile_optimization()
    analyzer.check_performance()
    analyzer.check_accessibility()
    analyzer.generate_report()
    
    print("\n✅ Analysis complete!")

if __name__ == '__main__':
    main()
