# Website SOPs (site governance)

Acest document este operațional intern și NU se publică pe site.
Scop: toate promisiunile din paginile juridice publice (`Terms`, `Privacy Policy`, `Cookies`) sunt susținute de procese interne clare.

## 1) Aliniere cu ce promitem pe site

Site-ul public afirmă 3 lucruri care trebuie susținute operativ:
`Google Form` este canalul oficial de intake inițial.
`Website` nu folosește tracking/analytics.
Conținutul legal reflectă procese minime de prelucrare, acces controlat și retenție.

Conformitatea reală este asigurată prin SOP-urile de mai jos.

## 2) Formular de referință (SOP)

- SOP ID: WOS-001
- Tip: SOP general intern
- Owner: Outfinity legal + operations coordinator
- Versiune: 1.0
- Aprobat la: 2026-06-11
- Valabilitate: 12 luni

## 3) SOP-S01 — Gestionare lead-uri din formularul de contact (Google Form)

Acest SOP implementează fluxul de colectare și prelucrare a datelor de pe formulare.

Când se aplică
Aplicație la orice cerere nouă trimisă prin Google Form.

Scop
Clasificare unitară, răspuns consistent, trasabilitate și păstrare controlată a datelor.

Responsabil
Owner: Operations Lead.
Stakeholder secundar: Business Development.

Pași detaliați
Recepție formularului
La primire se verifică automat data și sursa cererii și se generează un ID intern (ex. `lead-YYYYMMDD-xxxx`).

Validare inițială
Se verifică dacă datele sunt complete și dacă există informații de risc minim (abuz, spam, lipsă detalii).

Clasificare
Se etichetează cererea într-una dintre categoriile:
- Investor/Family Office
- Venture exploration / due diligence
- Enterprise validation
- AI Lab / research
- Founder-operator
- Altă cerere

Răspundere pe flux
Ownerul verifică dacă cererea intră în aria de acțiune a Outfinity.

Triere
Solicitările eligibile merg la "Qualified Queue".
Solicitările incomplete merg la follow-up clar.
Solicitările neeligibile sunt arhivate cu motiv intern.

Asignare
Fiecare cerere primește un responsabil intern (SR1) pe traseu.
Se atașează notițe scurte de evaluare și termen de răspuns.

Răspuns inițial
Răspuns în maxim 2 zile lucrătoare.
Fiecare răspuns include:
- mulțumire pentru contact
- categoria atribuită
- pașii următori

Închidere / continuare
Dacă devine relație activă, cererea trece în dosar de proiect.
Dacă nu continuă, se notează motivul și se programează revizuirea.

Arhivare și ștergere
Solicitările inactive 24 de luni fără reluare sunt marcate pentru ștergere.
Dovezile operaționale rămân minim 30 zile după ștergere pentru audit intern.

Controlul accesului
Acces la lead list doar pentru ownerul operațional, legal și business lead.
Acces public sau partajat este interzis.

Înregistrări obligatorii
În registrul intern se păstrează: ID lead, categorie, owner, data, status, urmarire, acțiuni finale.

SLA / indicatori
Liderii urmăresc două praguri:
Rata de răspuns inițial sub 2 zile lucrătoare.
Rata de urmărire completă sub 10 zile pentru cererile calificate.

Evidențe de audit
Log de acces, log de status update, log de trimitere răspuns.

Revizuire
Lunar: verificare a erorilor de clasificare.
Trimestrial: revizuire completă a pașilor.

## 4) SOP-S02 — ROPA minim pentru fluxul de formular și site

Scop
Păstrează corespondenta între ce promitem public (scop, temei, retenție, drepturi) și execuție.

Responsabil
Owner: DPO/Legal Contact (outsourced dacă nu există DPO intern).

Template operațional implementat
Coloană 1 – Categorie de date
Coloană 2 – Sursa datelor
Coloană 3 – Scop
Coloană 4 – Temei legal
Coloană 5 – Cui se transferă
Coloană 6 – Locul de stocare
Coloană 7 – Retenție
Coloană 8 – Rol operator
Coloană 9 – Măsuri de acces
Coloană 10 – Data revizuirii

Date deja acoperite (implementat)
Nume și email de contact
Date de calificare (companie, rol, mesaj)
Adresa IP și loguri tehnice de acces

Responsabilități clare
Date de contact: clasificate ca prelucrare operativă (lead qualification).
Loguri tehnice: prelucrare tehnică minimă (anti-abuz și uptime).

Proces de actualizare
Orice schimbare de scop adaugă sau modifică o înregistrare în ROPA minim.
Orice modificare care crește datele colectate oprește lansarea până la actualizarea Privacy/Terms/Cookies.

Control periodic
Lunar: verifică completarea câmpurilor obligatorii.
La incident: verificare imediată și jurnalizare.

Risc acoperit
Lipsă de demonstrație de conformitate la solicitările persoanelor vizate.

## 5) SOP-S03 — Lansare tehnologică pentru cookie-uri / third-party

Scop
Asigură că pagina `cookies.html` rămâne corectă și actuală.

Ce intră în domeniu
Orice script nou, pixeli noui, widget interactiv, formular nou.

Pas de lansare obligatoriu
Inventariere
Înainte de activare, se verifică dacă instrumentul are cookie sau colectare de date.
Decizie legală
Dacă există schimbare de date, se validează dacă necesită update de informare.
Publicare sincronizată
Actualizezi `cookies.html` înainte sau simultan cu activarea instrumentului.
Validare
Verificare manuală: versiunea publică a paginii corespunde fluxului tehnic.

Evidență
Se păstrează un log: data, tehnologie, persoană aprobatoare, versiune cookies page.

Trecerea testului de conformitate intern
Niciun script nou nu se publică fără:
- decizie de procesare,
- update de documentație,
- semnătură de aprobare în registru.

Plan de fallback
Până la stabilirea noii tehnologie, statusul rămâne "No trackers in use".

## 6) SOP-S04 — Actualizare pagini legale (Terms / Privacy / Cookies)

Scop
Sincronizare în lanț între promisiuni publice și procedurile interne.

Periodicitate
Lunar: revizie rapidă a corectitudinii textului față de proces.
Trimestrial: revizie completă și verificare termeni.

Flux
Legal revizuiește conținutul.
Operations confirmă implementarea.
Publicare doar după aprobare dublă.
Se actualizează logul de aprobare din site SOP.

Semnături de aprobare
Owner juridic, Owner operațional.

## 7) SOP-S05 — Publicare urgentă pe site (patch-uri rapide)

Scop
Nu blocăm corectitudinea când apar necesități rapide.

Criteriu de urgență
Conținut greșit, text legal inexact, informație ruptă.

Reguli
Se publică urgent maxim pe 24h.
În paralel se face trierea formală minimă: link, secțiune legală aferentă, log de acțiuni.

După lansare
Se deschide revizuirea completă în 72h.

## 8) SOP-S06 — Evidențe și trasabilitate internă

Scop
Poți demonstra, la nevoie, ce s-a promis și ce s-a făcut.

Tipuri de evidențe obligatorii
LOG_LEAD_QUEUE
LOG_LEGAL_UPDATES
LOG_THIRDPARTY_CHANGES
LOG_SOP_STATUS

Reguli generale
Lipsa evidenței = neexecutare.

## 9) Matrice de roluri pe procese

Rol
Activitate legală
Activitate operațională
Activitate leadership

Legal
Aprobă temeiul și formulările obligatorii
Verifică mesajul public
Semnează schimbările majore

Operations
Rulează fluxul de formulare
Actualizează logurile
Monitorizează termenul de răspuns

Leadership
Decide excepții
Validează riscuri
Aprobă implementări rapide

## 10) Status actual implementat

Toate cele 3 puncte de la care a pornit cererea de review au fost implementate intern în acest document.

Implementat prin SOP:
SOP-S01 - flux formulare
SOP-S02 - ROPA minim
SOP-S03 - launch checklist pentru schimbări tehnologice

Alte SOP-uri susținătoare:
SOP-S04, SOP-S05, SOP-S06

Observație finală
Publicul vede doar textele juridice generalizate.
Evidența internă completă este menținută aici, în mod intern.
