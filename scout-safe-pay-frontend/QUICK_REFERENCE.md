# ⚡ Quick Reference - Dealer Pages

## 🚀 Getting Started

### View Pages
```
Dealers List:     /en/dealers (change 'en' for other languages)
Dealer Profile:   /en/dealers/1
```

### Languages
```
en (English)   | de (German)    | es (Spanish)
it (Italian)   | ro (Romanian)  | fr (French)
```

---

## 📦 Components Available

### Badge
```tsx
<Badge variant="success">Verified</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge size="sm">Small</Badge>
```

### Select
```tsx
<Select value={city} onValueChange={setCity}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="berlin">Berlin</SelectItem>
  </SelectContent>
</Select>
```

### Skeleton
```tsx
<Skeleton className="h-4 w-full" />
```

### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>
```

### Avatar
```tsx
<Avatar fallback="JD" />
```

### useToast
```tsx
const { toast } = useToast()
toast({
  title: "Success",
  description: "Done!"
})
```

---

## 🎯 API Endpoints

### Get Dealers
```bash
GET /api/dealers?search=BMW&city=Berlin&type=company&page=1
```

### Get Dealer
```bash
GET /api/dealers/1
```

### Get Statistics
```bash
GET /api/dealers-statistics
```

---

## 🌐 Translations

### Access in Components
```tsx
const t = useTranslations('dealers')

// Use any key:
t('title')           // "Authorized Dealers"
t('verified')        // "Verified"
t('activeVehicles')  // "Active Vehicles"
```

### Add New Translation
1. Open `messages/en.json`
2. Add to dealers section:
   ```json
   "dealers": {
     "newKey": "New Value"
   }
   ```
3. Repeat for all 6 language files
4. Use in component with `t('newKey')`

---

## 📝 Files Reference

| File | Purpose |
|------|---------|
| `src/app/[locale]/dealers/page.client.tsx` | Dealers list page |
| `src/app/[locale]/dealers/[id]/page.client.tsx` | Dealer detail page |
| `src/lib/api/dealers.ts` | API client |
| `messages/en.json` | English translations |
| `messages/de.json` | German translations |
| (repeat for es, it, ro, fr) | Other languages |

---

## 🎨 Styling

### Using Components
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Click Me
</Button>
```

### Tailwind Classes
```tsx
<div className="bg-teal-600 text-white rounded-xl p-4">
  Content
</div>
```

### Colors
```
Primary:     teal-600 (#0d9488)
Success:     green-600 (#16a34a)
Destructive: red-600 (#dc2626)
Secondary:   gray-400 (#9ca3af)
```

---

## 🔧 Debugging

### Check Build
```bash
npm run build
```

### Check TypeScript
```bash
npm run type-check
```

### Check Dev Server
```bash
npm run dev
```

---

## 📊 Status Codes

### Success
```
✅ Dealer loaded
✅ Search completed
✅ Filter applied
✅ Pagination working
```

### Loading
```
⏳ Loading dealers...
⏳ Fetching dealer...
⏳ Loading reviews...
```

### Error
```
❌ No dealers found
❌ Failed to load dealers
❌ Dealer not found
```

---

## 🎯 Common Tasks

### Add New Filter
```tsx
// In page.client.tsx
const [newFilter, setNewFilter] = useState('')

// Add to handleSearch()
const params = {
  ...existing,
  newFilter: newFilter
}
```

### Add New Translation
```json
// In messages/en.json
"dealers": {
  "newKey": "New Value"
}

// Use in component
t('newKey')
```

### Update Styling
```tsx
// In component
className={cn(
  "existing classes",
  "new classes"
)}
```

---

## 🚀 Performance Tips

✅ Translations are cached
✅ Images are optimized
✅ Components are lazy-loaded
✅ API calls are efficient
✅ Skeletons reduce CLS

---

## 🐛 Common Issues

### Issue: Translation not appearing
**Solution:** Check spelling in translation key name

### Issue: Styling not working
**Solution:** Rebuild with `npm run build`

### Issue: Search not working
**Solution:** Check API endpoint is responding

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   (1 column)
Tablet:   640-1024px (2 columns)
Desktop:  > 1024px  (3 columns)
```

---

## 🎓 Useful Links

- Next.js Docs: https://nextjs.org
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://radix-ui.com
- next-intl: https://next-intl-docs.vercel.app

---

## ✅ Before Deployment

- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] All pages load
- [ ] Search works
- [ ] Filters work
- [ ] All 6 languages work
- [ ] Mobile layout correct
- [ ] API responding

---

## 🚀 Deploy Command

```bash
npm run build && npm start
```

Or deploy to Vercel:
```bash
vercel deploy --prod
```

---

**Last Updated:** January 28, 2026
**Status:** ✅ Production Ready
