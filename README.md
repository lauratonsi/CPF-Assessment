# CPF Assessment — Cyber-Physical Function Assessment

Strumento a supporto del **Capitolo 4** della tesi (cybersecurity, convergenza
IT/OT, regolazione europea). Implementa il modello di misurazione del **Capitolo
3**: valutazione delle capacità cyber-fisiche con **unità di analisi = la
funzione**, quattro dimensioni ordinali indipendenti, profilo corrente/obiettivo,
soglie non compensabili, priorità di intervento e di verifica tenute distinte.

## Architettura

App **statica client-side**: nessun server, nessun build step. Si apre
`index.html` direttamente (anche da `file://`), funziona offline. Le valutazioni
vivono in `localStorage` e si esportano/importano come JSON. La configurazione è
in file `data/*.js` caricati come `<script>` che popolano `window.CPF.data.*`.
`shell.js` inietta su ogni pagina la barra applicativa, uno skip-link e il
landmark `<main>`; lo stepper porta `aria-current`/`aria-label`.

```
index.html                 ingresso: profili organizzazione + valutazioni, nuova / importa / esito dimostrativo

pages/                      i sei passi del wizard + verifica
  step1-regimi.html         classificatore multi-regime (NIS2/CER/DORA/CRA/Reg. Macchine/AI Act) → profilo organizzazione
  step2-funzione.html       definizione della funzione cyber-fisica (§3.2): identità, regimi rilevanti, criticità 1-4,
                            esempi compilati + "Controllo di coerenza" euristico
  step3-dipendenze.html     legenda §3.4 + editor delle dipendenze B→A (classe/posizione/accoppiamento/guasto, anelli critici)
  step4a-conseguenze.html   conseguenze intollerabili → percorsi di compromissione → capacità richieste/essenziali (CCE, §3.1);
                            genera il profilo obiettivo per dimensione (§3.6)
  step4b-capacita.html      profilo corrente per i domini richiesti: 4 dimensioni × livello/forza probatoria, feedback live sui divari
  dashboard.html            esito: renderizza CPF.buildReport() — regimi, dipendenze (diagramma SVG), dumbbell per
                            dominio, tabella dei divari, divari essenziali, priorità di intervento / di verifica,
                            export JSON + stampa
  test.html                 "Verifica del motore": esegue in pagina l'intera batteria di test, con spiegazione e sorgente dei casi

data/                       configurazione fissa (window.CPF.data.*)
  regime_classifier.js      metadati e domande dello Step 1
  regime_rules.js           liste per il motore (settori CER, categorie DORA, Allegati CRA, canali AI Act
                            art. 6 come modificato dal Reg. 2026/1744, interazioni §2.8.1)
  scope_sectors.js          settori NIS2 Allegati I-II + casi speciali + soglie dimensionali (Racc. 2003/361/CE)
  capability_domains.js     i 6-7 domini di capacità (§2.9)
  scales.js                 scale ordinali 1-5 (4 dimensioni) + matrice di corroborazione §3.5 (tipi di evidenza
                            per proprietà) + criticità funzione + forza probatoria
  dependency_taxonomy.js    id/enum per l'editor delle dipendenze (§3.4)
  dependency_reference.js   legenda narrativa §3.4 resa nello Step 3
  assessment_schema.js      forma della valutazione salvata + factory (blankAssessment / blankDependency /
                            blankConsequence / blankPath / blankCapabilityTarget / blankCurrentProfile)
  organization_schema.js    profilo organizzazione riutilizzabile + CPF.cloneRegimeProfile()
  function_examples.js      3 funzioni-tipo compilate per intero (Step 2)
  demo_assessment.js        valutazione dimostrativa completa (usata dalla dashboard quando non c'è nulla di attivo)

assets/
  theme.css                 sistema di stile: token, tipografia IBM Plex, componenti
  vendor/fonts/             IBM Plex Sans / Serif / Mono (woff2, per uso offline)
  app.js                    persistenza localStorage + export/import + guard quota
                            + calcoli §3.6 (dimensionGap, essentialShortfall, domainPriority — a regola
                              ordinale, non a somma —, rankDomains) + CPF.evidenceCurrency() (attualità §3.5)
                            + CPF.reviewFunction() (euristiche di coerenza per lo Step 2)
  regime-engine.js          CPF.classifyRegimes(answers) → regime_profile — funzione pura, ogni esito con trace motivato
  report.js                 CPF.buildReport(assessment) → sintesi dell'esito (regimi + dipendenze + divari +
                            divari essenziali + due priorità), funzione pura che la dashboard renderizza
  dumbbell.js               grafico gap a manubrio per dominio (sostituisce il radar, §3.6-3.7)
  nav.js                    stepper: attributi ARIA + stato di completamento reale + riga di contesto
  shell.js                  barra applicativa fissa (monogramma, wordmark, tasto tema) + skip-link + landmark <main>
  theme-toggle.js           tema chiaro/scuro persistito

tests/
  cases.js                  batteria unica di casi { suite, group, name, fn } — suite engine / calcs / review / report
  runner.js                 renderer condiviso: CPF.runTests({ suites, mount, summary })
  engine.html               runner della suite "engine"
  calcs.html                runner della suite "calcs"
```

**Profilo organizzazione riutilizzabile.** Lo Step 1 produce un profilo salvato in
`localStorage` (chiave `cpf-org-<id>`). Ogni nuova valutazione ne clona il
`regime_profile` con `CPF.cloneRegimeProfile()`; il clone resta modificabile per
singola funzione, con un flag `overridden_from_org_profile` per regime — una
funzione può ricadere in un regime che non riguarda l'organizzazione nel suo
complesso (es. CRA per un singolo prodotto digitale).

## Stato

Tutti e sei i passi del wizard e la dashboard sono **costruiti e funzionanti
end-to-end**. Il flusso: Step 1 → profilo organizzazione; "Avanti" clona il
profilo in una valutazione; Step 2-4b compilano la funzione, le dipendenze, le
conseguenze/percorsi e il profilo di capacità con autosave; la dashboard rende
l'esito e permette export JSON / stampa. Senza una valutazione attiva la
dashboard mostra un **esito dimostrativo** completo.

### Aperto

- **Vendorizzare `d3-sankey`** per un diagramma delle dipendenze più ricco nella
  dashboard (ora è un diagramma SVG a tre colonne fatto a mano).
- **Consolidare gli `<script>` per pagina.** Ogni pagina elenca a mano i file
  `data/*.js` + `assets/*.js` nell'ordine di caricamento. Funziona ed è esplicito
  (un file mancante dà subito un `ReferenceError` che lo nomina), ma un
  `assets/cpf.bundle.js` concatenato ridurrebbe la ripetizione — richiede però
  un passo di build, oggi assente per scelta.

## Test

`tests/cases.js` raccoglie tutte le asserzioni in un unico file, indipendente
dall'interfaccia; girano in pagina e a riga di comando.

- **In pagina:** apri `pages/test.html` (tutte le suite, con spiegazione e
  sorgente di ogni caso), oppure `tests/engine.html` / `tests/calcs.html`.
- **Headless** (nessun `node` sulla macchina — si usa `jsc`):

  ```sh
  JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc
  # shim minimo per window/localStorage/document, poi:
  "$JSC" shim.js data/*.js assets/app.js assets/regime-engine.js assets/report.js \
    tests/cases.js tests/runner.js \
    -e 'var r = CPF.runTests({}); print(r.pass + "/" + r.total);'
  ```

Suite: **engine** (classificazione multi-regime, Cap. 2), **calcs** (calcoli
derivati §3.6), **review** (euristiche di coerenza dello Step 2), **report**
(`CPF.buildReport` — la sintesi che la dashboard renderizza).

## Il modello (sintesi)

- **Unità di analisi:** la funzione cyber-fisica, mai l'organizzazione o il settore.
- **Quattro dimensioni indipendenti** per capacità — consolidamento, estensione,
  efficacia, prestazione osservata — su scala **ordinale** 1-5. Nessuna
  compensazione tra dimensioni.
- **Matrice di corroborazione** (§3.5): per ciascuna dimensione lo strumento
  elenca i tipi di evidenza che possono sostenere quella proprietà (una policy
  attesta la formalizzazione, non l'attuazione; un log un comportamento, non la
  sua continuità). Ogni livello porta la **data dell'evidenza**: un riscontro
  valido alla raccolta può non rappresentare più lo stato corrente.
- **Forza probatoria** separata dal livello (corroborata / parziale / non
  determinabile). L'incertezza non abbassa il livello: genera una **priorità di
  verifica** distinta dalla priorità di intervento («assenza di prova ≠ prova
  dell'assenza»).
- **Priorità come regola ordinale, non come somma** (§3.6-3.7): `domainPriority`
  mappa (criticità, essenzialità, ampiezza del divario) su tre bande, senza
  sommare ordinali. La scala di criticità 1-4 è un'operazionalizzazione dello
  strumento — la tesi fissa i criteri (CER artt. 6-7), non una scala.
- **Profilo obiettivo** fissato *a priori* dalle conseguenze intollerabili →
  percorsi di compromissione → capacità richieste (logica CCE, Bochman & Freeman
  2021, INL). Non si adatta alle capacità già presenti.
- **Capacità essenziali** con soglie non compensabili (anello debole): mai
  assorbite in una media; un divario essenziale porta la priorità di intervento
  ad «alta» a prescindere dall'aggregato.
- **Aggregati** solo descrittivi/secondari (§3.6-3.7): niente radar ad area
  piena, che comunicherebbe una falsa rassicurazione. Al suo posto un grafico a
  manubrio per dominio.
- **Dipendenze:** relazione orientata B → A, quattro classi, accoppiamento,
  posizione, tipi di guasto (Rinaldi/Peerenboom/Kelly 2001; Argonne 2015; NAT).
  La classe *geografica* è segnalata come struttura E → {A, B} (causa comune),
  non come relazione reciproca.
- **Criticità della funzione:** raccolta nello Step 2 dai criteri CER artt. 6-7;
  entra in `domainPriority()` come `f(criticità, essenzialità, ampiezza del divario)`.
- **Tracciabilità:** ogni classificazione di regime porta un `trace` di coppie
  `{ esito, base }` che la motivano — esempio di trasparenza metodologica per il
  Capitolo 4, verificabile dalla pagina `test.html`.

### Aderenza al testo della tesi

Il modello è quello del Capitolo 3; il Capitolo 2 alimenta il motore dei regimi.
Sono **operazionalizzazioni dello strumento**, non prescrizioni del testo: la
scala 1-4 della criticità, il mapping a bande di `domainPriority`, la soglia di
24 mesi di `evidenceCurrency`. Ciascuna è marcata come tale nel codice.

Non è codificato ciò che la tesi non riscontra: il calendario differenziato di
applicabilità dei sistemi AI ad alto rischio e le integrazioni all'art. 5 AI Act
sono stati rimossi da `regime_rules.js` in attesa di un riferimento a fonte
primaria per il Capitolo 4 (vedi commenti nel file).

Strumento orientativo, non parere legale. Non codifica designazioni caso per caso
di CER, esclusioni per sicurezza nazionale/difesa, né la valutazione integrale di
conformità.
