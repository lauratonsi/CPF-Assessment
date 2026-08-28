# CPF Assessment — Cyber-Physical Function Assessment

Strumento a supporto del **Cap. 4** della tesi (cybersecurity, convergenza IT/OT,
regolazione europea). Implementa il modello di misurazione del **Cap. 3**:
valutazione delle capacità cyber-fisiche con **unità di analisi = la funzione**,
quattro dimensioni indipendenti, profilo corrente/obiettivo, soglie non
compensabili, priorità di intervento e di verifica distinte.

## Architettura

App **statica client-side**, nessun server, nessun build step. Si apre
`index.html` direttamente (anche da `file://`). Le valutazioni sono salvate in
`localStorage` ed esportabili/importabili come JSON.

```
index.html               elenco valutazioni, nuova / importa
step1-regimi.html         classificatore multi-regime (NIS2/CER/DORA/CRA/Macchine/AI Act) → profilo organizzazione
step2-funzione.html       definizione della funzione cyber-fisica (§3.2)
step3-dipendenze.html     mappatura dipendenze B→A (§3.4)
step4a-conseguenze.html   conseguenze intollerabili → percorsi di compromissione → capacità richieste/essenziali (CCE, §3.1/§3.6)
step4b-capacita.html      profilo capacità corrente/obiettivo, 4 dimensioni × 6-7 domini (§3.5-3.6)
dashboard.html            esito: gap, divari essenziali, priorità, grafici

data/                     configurazione fissa, caricata come <script> (popola window.CPF.data)
  regime_classifier.js    le 11 domande dello Step 1
  regime_rules.js         liste per il motore di inferenza (settori CER, categorie DORA, Allegati CRA, canali AI Act, interazioni)
  scope_sectors.js        settori NIS2 Allegati I-II + casi speciali + soglie dimensionali (portato dal vecchio tool)
  capability_domains.js   i 6-7 domini fissi (§2.9)
  scales.js               scale ordinali 1-5 + forza probatoria
  dependency_taxonomy.js  classi/posizioni/accoppiamento/tipi di guasto (id + enum, per l'editor)
  dependency_reference.js  legenda narrativa §3.4 (per lo Step 3, resa a schermo)
  assessment_schema.js    schema assessment + esempio + CPF.blankAssessment()
  organization_schema.js  profilo organizzazione riutilizzabile + CPF.cloneRegimeProfile()

assets/
  theme.css               palette e linguaggio visivo (da NIS2 Gap Tool)
  app.js                  persistenza localStorage + export/import + guard quota + calcoli derivati (§3.6)
  regime-engine.js        CPF.classifyRegimes(answers) → regime_profile (funzione pura, testabile)
  dumbbell.js             grafico gap a manubrio per dominio (sostituisce il radar, §3.6-3.7)
  vendor/                 librerie vendorizzate (d3-sankey per le dipendenze) — da aggiungere
```

**Profilo organizzazione riutilizzabile:** lo Step 1 produce un `organizations/<id>.json` (localStorage, chiave `cpf-org-<id>`). Ogni nuova valutazione ne clona il `regime_profile` con `CPF.cloneRegimeProfile()`; il clone resta modificabile per singola valutazione, con un flag `overridden_from_org_profile` per campo (una funzione può ricadere in un regime che non riguarda l'organizzazione nel suo complesso — es. CRA per un singolo prodotto digitale).

## Stato

- **index.html** — funzionante: profili organizzazione + valutazioni, import/export.
- **Step 1** (`step1-regimi.html`) — **funzionante end-to-end**: form delle 11 domande, `CPF.classifyRegimes` in tempo reale, pannello risultato con qualificazione + trace motivato voce per voce + interazioni + priorità di verifica. Salva un profilo organizzazione; "Avanti" crea una valutazione clonando il profilo.
- **Step 3** (`step3-dipendenze.html`) — **legenda §3.4 completa e resa** (notazione B→A, 4 classi, accoppiamento + NAT/blackout 2003, posizioni upstream/internal/downstream con ruolo nel modello, tipi di guasto, dependency curves, radicamento empirico Rydén Sonesson / Gudrun 2005). L'editor delle dipendenze è ancora segnaposto (si aggancia alla funzione dello Step 2).
- **Step 2, 4a, 4b, Esito** — ancora segnaposto.
- **tests/engine.html** — 31 asserzioni sul motore, tutte verdi (eseguibili anche via `jsc`).

Da fare: rendering dei form Step 2-4b, calcoli derivati completi (`domainPriority`), Sankey delle dipendenze, cablaggio della dashboard.

### Criticità della funzione (§3.2)

Scala ordinale 1-4 (Bassa / Media / Alta / Molto alta) in `data/scales.js`, dai criteri
CER artt. 6-7. Si raccoglie nello **Step 2**. Alimenta la priorità sostanziale in §3.6:
`f(criticità, essenzialità, gap)`; separata dalla priorità di verifica quando la forza
probatoria non è corroborata.

### Radar → grafico gap a manubrio

Niente radar: §3.6 ammette un valore aggregato solo come «indicatore descrittivo o
comparativo secondario» e §3.7 avverte che le scale sono ordinali, non cardinali. Un
radar con area piena comunica una falsa rassicurazione a colpo d'occhio. Al suo posto,
per ogni dominio: una riga per dimensione, `● corrente ──▶ ○ obiettivo`, gap come barra,
forza probatoria nello stile del marker (pieno / mezzo / tratteggiato), soglia non
compensabile come linea verticale con riga marcata `⚠`.

## Modello (sintesi)

- **Unità**: la funzione cyber-fisica, non l'organizzazione né il settore.
- **Quattro dimensioni indipendenti** per capacità: consolidamento, estensione,
  efficacia, prestazione osservata (scale 1-5 cumulative).
- **Forza probatoria** separata per livello (corroborata / parziale /
  non determinabile). L'incertezza non abbassa il livello: genera una
  *priorità di verifica* distinta dalla priorità di intervento.
- **Profilo obiettivo** costruito da conseguenze intollerabili → percorsi di
  compromissione → capacità richieste (logica CCE, Bochman & Freeman 2021, INL).
- **Capacità essenziali** con soglie non compensabili (anello debole): mai
  assorbite in una media.
- **Dipendenze**: notazione B→A (Rinaldi/Peerenboom/Kelly 2001; Argonne 2015).

Strumento orientativo, non parere legale.
