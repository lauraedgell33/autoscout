# 🚀 DMARC Configuration - Vercel DNS

## Instrucțiuni Exacte pentru Vercel

### Pasul 1: Accesează Vercel Dashboard

1. Mergi la: **https://vercel.com/dashboard**
2. Login cu contul tău Vercel

### Pasul 2: Găsește Domeniul

1. Click pe **"Domains"** în sidebar (sau Settings → Domains)
2. SAU du-te direct la: https://vercel.com/dashboard/domains
3. Găsește **autoscout24safetrade.com** în listă
4. Click pe domeniu

### Pasul 3: Adaugă DNS Record

1. Scroll până la secțiunea **"DNS Records"**
2. Click butonul **"Add"** sau **"Add Record"**

### Pasul 4: Completează Datele

**Type:** Selectează `TXT`

**Name:** `_dmarc`
- ⚠️ **NU scrie** `.autoscout24safetrade.com` la final
- **Doar:** `_dmarc`
- Vercel adaugă automat domeniul

**Value:** 
```
v=DMARC1; p=none; rua=mailto:dmarc@autoscout24safetrade.com; ruf=mailto:dmarc@autoscout24safetrade.com; fo=1; pct=100
```

**TTL:** Lasă default (de obicei `3600` sau Auto)

### Pasul 5: Salvează

1. Click **"Add"** sau **"Save"**
2. Vercel va valida și adăuga recordul
3. **DONE!** ✅

---

## 📸 Visual Guide (Vercel Interface)

```
┌─────────────────────────────────────────────────────────┐
│ DNS Records for autoscout24safetrade.com               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ [+ Add Record]                                           │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Type: [TXT ▼]                                      │  │
│ │                                                     │  │
│ │ Name: _dmarc                                       │  │
│ │                                                     │  │
│ │ Value:                                             │  │
│ │ ┌─────────────────────────────────────────────┐   │  │
│ │ │ v=DMARC1; p=none; rua=mailto:dmarc@...     │   │  │
│ │ └─────────────────────────────────────────────┘   │  │
│ │                                                     │  │
│ │ TTL: [Auto ▼]                                      │  │
│ │                                                     │  │
│ │        [Cancel]  [Add Record]                      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Copy-Paste

### Name:
```
_dmarc
```

### Value:
```
v=DMARC1; p=none; rua=mailto:dmarc@autoscout24safetrade.com; ruf=mailto:dmarc@autoscout24safetrade.com; fo=1; pct=100
```

---

## ✅ După Adăugare

### Verifică în Vercel:
1. DNS record-ul ar trebui să apară în listă:
   ```
   Type  Name    Value                    TTL
   TXT   _dmarc  v=DMARC1; p=none; rua... 3600
   ```

### Așteaptă Propagarea (5-15 minute)

### Verifică cu DNS Lookup:
```bash
dig TXT _dmarc.autoscout24safetrade.com +short
```

**Rezultat așteptat:**
```
"v=DMARC1; p=none; rua=mailto:dmarc@autoscout24safetrade.com; ruf=mailto:dmarc@autoscout24safetrade.com; fo=1; pct=100"
```

### Verifică în MailerSend:
1. Mergi la: https://app.mailersend.com
2. Click **"Domains"**
3. Click pe **autoscout24safetrade.com**
4. Status DMARC ar trebui să fie: **✅ Valid** (după propagare)

---

## 🎯 Bonus: Verifică și DKIM în MailerSend

Cât timp ești în MailerSend:

1. **Domains → autoscout24safetrade.com**
2. Verifică secțiunea **"DNS Records"**
3. Ar trebui să vezi:
   - ✅ SPF (deja configurată)
   - ✅ DKIM (verifică dacă este activată)
   - ✅ DMARC (va apărea după ce adaugi în Vercel)

### Dacă DKIM lipsește:

4. MailerSend îți va arăta ce DKIM record să adaugi
5. Va fi ceva gen:
   ```
   Name:  mailersend._domainkey
   Type:  TXT
   Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3...
   ```
6. Adaugi-l în Vercel exact ca pe DMARC (pasii de mai sus)

---

## 📊 DNS Records Complete (target final)

După configurare, în Vercel ar trebui să ai:

```
Type  Name                      Value                           
TXT   @                         v=spf1 include:_spf.mailersend.net ~all ✅
TXT   _dmarc                    v=DMARC1; p=none; rua=mailto:... 🆕
TXT   mailersend._domainkey     v=DKIM1; k=rsa; p=MIGfMA0... ⚠️ (check)
```

---

## 🐛 Troubleshooting Vercel

### Record nu apare după Save?
- Refresh pagina
- Vercel validează automat - ar trebui să apară instant

### Eroare la salvare?
- Verifică că Name este exact: `_dmarc` (fără spații)
- Verifică că Value nu are line breaks (tot pe o linie)
- Verifică că nu există deja un _dmarc record

### DMARC încă Invalid în MailerSend după 1 oră?
1. Verifică că recordul există în Vercel DNS
2. Test cu: https://mxtoolbox.com/dmarc.aspx
3. Poate fi nevoie să refresh/revalidate domain în MailerSend

---

## 📧 Email pentru Rapoarte DMARC

**Important:** Creează email-ul `dmarc@autoscout24safetrade.com`

### Opțiuni:

1. **În MailerSend:**
   - Adaugă email inbound
   - Forward către email-ul tău personal

2. **În Forge (dacă ai email server):**
   - Adaugă email alias
   - Forward către email-ul tău

3. **Simplu - Forward în Gmail/Outlook:**
   - Configurează forwarding de la orice email
   - Către email-ul tău principal

---

## ✅ Checklist Final

- [ ] Login la Vercel Dashboard
- [ ] Domains → autoscout24safetrade.com
- [ ] Add DNS Record (TXT)
- [ ] Name: `_dmarc`
- [ ] Value: `v=DMARC1; p=none; rua=mailto:dmarc@...`
- [ ] Save/Add Record
- [ ] Așteaptă 5-15 minute
- [ ] Verifică cu dig sau online tool
- [ ] Check MailerSend Dashboard
- [ ] Status: Valid ✅

---

## 🎯 După Configurare

**Beneficii:**
- ✅ Email deliverability îmbunătățit
- ✅ MailerSend DMARC status: Valid
- ✅ Protecție împotriva email spoofing
- ✅ Rapoarte DMARC pentru monitoring
- ✅ Reputație sender mai bună

**Timp estimat:** 2-3 minute pentru adăugare + 5-15 minute propagare DNS

---

**Gata! După ce adaugi în Vercel, revino și spune-mi dacă a mers! 🚀**
