# 🧪 Ghid de Testare End-to-End - AutoScout Application

**Data:** 29 Ianuarie 2026  
**Versiune:** 1.0

---

## 📋 Pregătire pentru Testare

### Configurare Inițială

1. **Backend:**
   - URL: `https://adminautoscout.dev/api`
   - Verifică că backend-ul rulează
   - Verifică baza de date este configurată

2. **Frontend:**
   - URL: `http://localhost:3000`
   - Rulează: `npm run dev`

3. **Conturi de Test:**
   - **Buyer:** buyer@test.com / password123
   - **Seller:** seller@test.com / password123
   - **Admin:** admin@test.com / password123

---

## 🔐 Test 1: Autentificare și Înregistrare

### 1.1 Înregistrare Utilizator Nou

✅ **Pași:**
1. Navighează la `/auth/register`
2. Completează formularul:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - User Type: Buyer
3. Click "Register"

✅ **Rezultat Așteptat:**
- Toast notification: "Registration successful"
- Redirect la dashboard
- Utilizator autentificat

### 1.2 Login

✅ **Pași:**
1. Navighează la `/auth/login`
2. Completează:
   - Email: test@example.com
   - Password: password123
3. Click "Login"

✅ **Rezultat Așteptat:**
- Toast notification: "Login successful"
- Redirect la dashboard
- User menu visible în navigation

### 1.3 Logout

✅ **Pași:**
1. Click pe user menu (top-right)
2. Click "Logout"

✅ **Rezultat Așteptat:**
- Toast notification: "Logged out successfully"
- Redirect la homepage
- User menu dispare

---

## 🏦 Test 2: Conturi Bancare

### 2.1 Vizualizare Listă Conturi

✅ **Pași:**
1. Login ca utilizator autentificat
2. Navighează la `/bank-accounts`

✅ **Rezultat Așteptat:**
- Pagina se încarcă fără erori
- Loading spinner apare și dispare
- Lista de conturi (sau mesaj "No bank accounts")

### 2.2 Adăugare Cont Bancar

✅ **Pași:**
1. Pe pagina `/bank-accounts`
2. Click "Add Bank Account"
3. Completează formularul:
   - Account Holder: John Doe
   - IBAN: RO49AAAA1B31007593840000
   - BIC/SWIFT: AAAAROBB
   - Bank Name: Sample Bank
   - ✓ Set as primary
4. Click "Add Account"

✅ **Rezultat Așteptat:**
- Loading button arată spinner
- Toast notification: "Bank account added successfully"
- Modal se închide
- Noul cont apare în listă cu badge "Primary"

### 2.3 Setare Cont Principal

✅ **Pași:**
1. Adaugă cel puțin 2 conturi bancare
2. Click "Set as Primary" pe un cont non-primary

✅ **Rezultat Așteptat:**
- Loading button activ
- Toast notification: "Primary account updated"
- Badge "Primary" se mută pe noul cont

### 2.4 Ștergere Cont

✅ **Pași:**
1. Click iconița de trash pe un cont NON-primary
2. Confirmă ștergerea

✅ **Rezultat Așteptat:**
- Confirm dialog apare
- Toast notification: "Bank account deleted"
- Contul dispare din listă

---

## 🚗 Test 3: Vehicule

### 3.1 Browsing Vehicule

✅ **Pași:**
1. Navighează la `/vehicles`
2. Aplică filtre:
   - Category: Car
   - Price Max: 50000
   - Sort by: Price (ascending)

✅ **Rezultat Așteptat:**
- Lista se încarcă cu loading state
- Vehiculele sunt filtrate corect
- Paginare funcționează

### 3.2 Vizualizare Detalii Vehicul

✅ **Pași:**
1. Click pe un vehicul din listă
2. Verifică pagina de detalii

✅ **Rezultat Așteptat:**
- Detalii complete vehicul
- Galerie imagini
- Informații seller
- Buton "Buy Now" sau "Contact Seller"

### 3.3 Adăugare Vehicul (Seller)

✅ **Pași:**
1. Login ca seller
2. Navighează la `/vehicles/add`
3. Completează formularul
4. Upload imagini
5. Click "Submit"

✅ **Rezultat Așteptat:**
- Toast notification: "Vehicle created successfully"
- Redirect la pagina vehiculului
- Vehicul apare în "My Vehicles"

---

## 📦 Test 4: Flux Complet Comandă

### 4.1 Creare Comandă (Buyer)

✅ **Pași:**
1. Login ca buyer
2. Alege un vehicul
3. Click "Buy Now"
4. Confirmă suma
5. Click "Create Order"

✅ **Rezultat Așteptat:**
- Toast notification: "Order created successfully"
- Redirect la `/orders/{id}`
- Status: "pending_contract"

### 4.2 Generare Contract (Seller/Admin)

✅ **Pași:**
1. Pe pagina comenzii
2. Click "Generate Contract"

✅ **Rezultat Așteptat:**
- Loading button activ
- Toast notification: "Contract generated successfully"
- Status update: "contract_generated"
- Link download contract disponibil

### 4.3 Upload Contract Semnat (Buyer)

✅ **Pași:**
1. Download contract generat
2. "Semnează" (pentru test, folosește același PDF)
3. Click "Choose File"
4. Selectează PDF
5. Click "Upload Signed Contract"

✅ **Rezultat Așteptat:**
- Toast notification: "Contract uploaded successfully"
- Status update: "contract_signed"
- Payment instructions apar

### 4.4 Instrucțiuni Plată

✅ **Pași:**
1. După upload contract
2. Click "View Payment Instructions"

✅ **Rezultat Așteptat:**
- Modal cu detalii bancare:
  - IBAN
  - BIC/SWIFT
  - Account Holder
  - Reference number
  - Amount
- Buton "Copy" pentru fiecare câmp

### 4.5 Confirmare Plată (Admin)

✅ **Pași:**
1. Login ca admin
2. Navighează la comanda
3. Click "Confirm Payment Received"

✅ **Rezultat Așteptat:**
- Toast notification: "Payment confirmed"
- Status update: "payment_received"

### 4.6 Marcare Gata pentru Livrare (Seller)

✅ **Pași:**
1. Login ca seller
2. Click "Mark Ready for Delivery"

✅ **Rezultat Așteptat:**
- Toast notification: "Marked as ready for delivery"
- Status update: "ready_for_delivery"

### 4.7 Confirmare Livrare (Buyer/Seller)

✅ **Pași:**
1. Click "Confirm Delivery"

✅ **Rezultat Așteptat:**
- Toast notification: "Marked as delivered"
- Status update: "delivered"
- Opțiune "Leave Review" apare

### 4.8 Finalizare Comandă

✅ **Rezultat Așteptat:**
- Status final: "completed"
- Fonduri eliberate către seller
- Invoice generat automat

---

## ⭐ Test 5: Sistem Recenzii

### 5.1 Adăugare Recenzie

✅ **Pași:**
1. După livrare completă
2. Click "Leave Review"
3. Selectează rating (1-5 stele)
4. Adaugă titlu (opțional)
5. Adaugă comentariu (opțional)
6. Click "Submit Review"

✅ **Rezultat Așteptat:**
- Toast notification: "Review submitted successfully!"
- Review apare cu status "pending"
- Badge "Verified Purchase" vizibil

### 5.2 Vizualizare Recenzii Vehicul

✅ **Pași:**
1. Navighează la pagina vehiculului
2. Scroll la secțiunea Reviews

✅ **Rezultat Așteptat:**
- Review statistics (average rating, count)
- Listă recenzii aprobate
- Rating distribution

### 5.3 Moderare Recenzie (Admin)

✅ **Pași:**
1. Login ca admin
2. Navighează la `/admin/reviews`
3. Alege o recenzie pending
4. Click "Approve" sau "Reject"

✅ **Rezultat Așteptat:**
- Toast notification: "Review approved/rejected"
- Status update
- Review devine vizibilă (approved) sau ascunsă (rejected)

---

## ⚖️ Test 6: Dispute

### 6.1 Creare Dispută

✅ **Pași:**
1. Pe pagina comenzii
2. Click "Open Dispute"
3. Completează:
   - Reason: "Vehicle not as described"
   - Description: Detalii probleme
4. Click "Open Dispute"

✅ **Rezultat Așteptat:**
- Toast notification: "Dispute created successfully"
- Redirect la pagina disputei
- Status: "open"

### 6.2 Adăugare Răspuns la Dispută

✅ **Pași:**
1. Pe pagina disputei
2. Click "Show Responses"
3. Scrie un mesaj
4. Click "Add Response"

✅ **Rezultat Așteptat:**
- Toast notification: "Response added"
- Răspuns apare în listă
- Timestamp corect

### 6.3 Rezolvare Dispută (Admin)

✅ **Pași:**
1. Login ca admin
2. Navighează la dispută
3. Adaugă rezoluție
4. Click "Mark as Resolved"

✅ **Rezultat Așteptat:**
- Status update: "resolved"
- Rezoluție vizibilă pentru ambele părți
- Dispute închisă pentru răspunsuri noi

---

## 🍪 Test 7: Cookie Consent

### 7.1 Banner Cookie Consent

✅ **Pași:**
1. Deschide aplicația în incognito mode
2. Verifică banner-ul de cookies

✅ **Rezultat Așteptat:**
- Banner apare în partea de jos
- 3 opțiuni disponibile:
  - Accept All
  - Essential Only
  - Customize

### 7.2 Accept All Cookies

✅ **Pași:**
1. Click "Accept All"

✅ **Rezultat Așteptat:**
- Banner dispare
- Preferințe salvate
- Banner nu mai apare la reload

### 7.3 Customize Cookies

✅ **Pași:**
1. Click "Customize"
2. Toggle cookies:
   - Essential: ON (disabled)
   - Analytics: ON
   - Marketing: OFF
   - Preferences: ON
3. Click "Save Preferences"

✅ **Rezultat Așteptat:**
- Preferințe salvate
- Banner dispare
- Settings pot fi schimbate din `/cookies`

---

## 💬 Test 8: Mesagerie

### 8.1 Trimitere Mesaj

✅ **Pași:**
1. Pe pagina comenzii
2. Scroll la secțiunea Messages
3. Scrie un mesaj
4. Click "Send"

✅ **Rezultat Așteptat:**
- Toast notification: "Message sent"
- Mesaj apare instant
- Timestamp corect
- "Sent by you" vizibil

### 8.2 Primire Mesaj

✅ **Pași:**
1. Login cu alt utilizator (cealaltă parte)
2. Navighează la comandă
3. Verifică mesajele

✅ **Rezultat Așteptat:**
- Mesaj nou vizibil
- Badge "unread" (opțional)
- Numele sender-ului

### 8.3 Marcare ca Citit

✅ **Pași:**
1. Click pe mesaj sau "Mark as Read"

✅ **Rezultat Așteptat:**
- Status mesaj update
- Unread count scade

---

## 🔔 Test 9: Notificări

### 9.1 Primire Notificare

✅ **Pași:**
1. Efectuează o acțiune care generează notificare (ex: confirmare plată)
2. Click pe icon notificări (navigation bar)

✅ **Rezultat Așteptat:**
- Lista notificări apare
- Notificare nouă cu badge "new"
- Unread count actualizat

### 9.2 Vizualizare Toate Notificările

✅ **Pași:**
1. Navighează la `/notifications`

✅ **Rezultat Așteptat:**
- Toate notificările listate
- Filtre funcționale (All, Unread, Alerts)
- Pagination (dacă > 20)

### 9.3 Mark All as Read

✅ **Pași:**
1. Click "Mark All as Read"

✅ **Rezultat Așteptat:**
- Toate notificările marcate
- Unread count = 0
- Visual update

---

## 🔒 Test 10: GDPR

### 10.1 Export Date Personale

✅ **Pași:**
1. Navighează la `/settings/privacy`
2. Click "Export My Data"

✅ **Rezultat Așteptat:**
- Download începe
- Fișier JSON cu toate datele
- Toast notification: "Data exported"

### 10.2 Cerere Ștergere Cont

✅ **Pași:**
1. Click "Request Account Deletion"
2. Adaugă motivul (opțional)
3. Confirmă

✅ **Rezultat Așteptat:**
- Toast notification cu data ștergerii
- Cont marcat pentru ștergere
- Email confirmație (opțional)

### 10.3 Anulare Ștergere Cont

✅ **Pași:**
1. Click "Cancel Deletion Request"

✅ **Rezultat Așteptat:**
- Toast notification: "Deletion cancelled"
- Cont reactivat

---

## 📊 Checklist Final de Testare

### Funcționalități Core
- [ ] Autentificare (Register, Login, Logout)
- [ ] Dashboard utilizator
- [ ] Browsing vehicule
- [ ] Filtre și search vehicule
- [ ] Detalii vehicul

### Banking & Payments
- [ ] Adăugare cont bancar
- [ ] Setare cont principal
- [ ] Ștergere cont bancar
- [ ] Vizualizare instrucțiuni plată

### Order Flow
- [ ] Creare comandă
- [ ] Generare contract
- [ ] Upload contract semnat
- [ ] Confirmare plată
- [ ] Marcare gata pentru livrare
- [ ] Confirmare livrare
- [ ] Finalizare comandă

### Social Features
- [ ] Adăugare recenzie
- [ ] Vizualizare recenzii
- [ ] Moderare recenzii (admin)
- [ ] Creare dispută
- [ ] Răspuns la dispută
- [ ] Rezolvare dispută (admin)

### Communication
- [ ] Trimitere mesaj
- [ ] Primire mesaj
- [ ] Marcare mesaj ca citit
- [ ] Notificări real-time
- [ ] Mark all notifications as read

### Privacy & Compliance
- [ ] Cookie consent banner
- [ ] Customize cookie preferences
- [ ] Export date GDPR
- [ ] Request account deletion
- [ ] Cancel deletion

### UI/UX
- [ ] Toast notifications funcționează
- [ ] Loading states vizibile
- [ ] Error handling clar
- [ ] Responsive design
- [ ] Navigation funcțională

---

## 🐛 Raportare Bug-uri

### Template Bug Report

```markdown
**Titlu:** [Scurtă descriere problemă]

**Severitate:** Critical / High / Medium / Low

**Pași de Reproducere:**
1. 
2. 
3. 

**Rezultat Așteptat:**


**Rezultat Actual:**


**Screenshots:**


**Environment:**
- Browser: 
- OS: 
- User Role: 
```

---

## ✅ Criterii de Succes

### Must Have (Blocker pentru producție)
- ✅ Autentificare funcționează 100%
- ✅ Flux comandă completează fără erori
- ✅ Plăți sunt procesate corect
- ✅ Date sunt salvate persistent
- ✅ Cookie consent funcționează

### Should Have
- ✅ Toast notifications pentru toate acțiunile
- ✅ Loading states pentru toate request-urile
- ✅ Error messages user-friendly
- ✅ Mobile responsive

### Nice to Have
- ⏳ Real-time notifications
- ⏳ Email notifications
- ⏳ Push notifications

---

**Ultima actualizare:** 29 Ianuarie 2026  
**Status:** ✅ Gata pentru testare
