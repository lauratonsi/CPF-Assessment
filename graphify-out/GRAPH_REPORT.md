# Graph Report - CPF Assesment  (2026-08-28)

## Corpus Check
- Corpus is ~5,028 words - fits in a single context window. You may not need a graph.

## Summary
- 155 nodes · 213 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.78)
- Token cost: 252,000 input · 30,000 output

## Community Hubs (Navigation)
- Regimi europei e sovrapposizioni
- Modello di misurazione (Cap. 3)
- Il tool CPF Assessment
- Ricomposizione tecnica e standard
- Dipendenze infrastrutturali
- Convergenza IT/OT e attacchi ICS
- Classificazione regimi e funzione (Step 1-2)
- Nesso safety-cybersecurity
- Mappatura dipendenze B-A (Step 3)
- CER e minacce ibride a cascata
- Calcolo priorità (TODO app.js)
- Aurora Generator Test
- Knapp 2024 (riferimento)

## God Nodes (most connected - your core abstractions)
1. `CPF Assessment (Cyber-Physical Function Assessment)` - 15 edges
2. `step4-capacita.html — capability assessment` - 12 edges
3. `step1-regimi.html — multi-regime classifier` - 11 edges
4. `Funzione cyber-fisica (unità di analisi del modello)` - 11 edges
5. `NIS2 — Direttiva (UE) 2022/2555` - 10 edges
6. `dashboard.html — outcome (gap, essential gaps, priorities, charts)` - 9 edges
7. `Regolamento Macchine — Regolamento (UE) 2023/1230` - 9 edges
8. `Tassonomia delle dipendenze e interdipendenze (Rinaldi / Argonne)` - 9 edges
9. `Cap. 2 — La governance europea del rischio cyber-fisico: pluralità normativa e ricomposizione tecnica` - 8 edges
10. `Cyber Resilience Act — Regolamento (UE) 2024/2847` - 8 edges

## Surprising Connections (you probably didn't know these)
- `CPF Assessment (Cyber-Physical Function Assessment)` --references--> `Unit of analysis = the cyber-physical function`  [EXTRACTED]
  README.md → step2-funzione.html
- `step2-funzione.html — cyber-physical function definition` --references--> `NIS2`  [INFERRED]
  step2-funzione.html → step1-regimi.html
- `CPF Assessment (Cyber-Physical Function Assessment)` --references--> `Dependency notation B→A`  [EXTRACTED]
  README.md → step3-dipendenze.html
- `CPF Assessment (Cyber-Physical Function Assessment)` --references--> `Consolidamento (consolidation) — capability dimension`  [EXTRACTED]
  README.md → step4-capacita.html
- `CPF Assessment (Cyber-Physical Function Assessment)` --references--> `Efficacia (effectiveness) — capability dimension`  [EXTRACTED]
  README.md → step4-capacita.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CPF Assessment wizard flow (Regimi → Funzione → Dipendenze → Capacità → Esito)** — index_cpf_assessment, step1_regimi_classificatore_multi_regime, step2_funzione_definizione, step3_dipendenze_mappatura, step4_capacita_valutazione, dashboard_esito [EXTRACTED 1.00]
- **Four independent cumulative capability dimensions** — step4_capacita_consolidamento, step4_capacita_estensione, step4_capacita_efficacia, step4_capacita_prestazione_osservata [EXTRACTED 1.00]
- **Weakest-link / uncertainty safeguards against averaging capability scores** — step4_capacita_soglie_non_compensabili, step4_capacita_forza_probatoria, dashboard_priorita_verifica [INFERRED 0.75]
- **Le quattro dimensioni indipendenti e non compensabili della valutazione delle capacità cyber-fisiche** — tesi_laura_tonsi_consolidamento, tesi_laura_tonsi_estensione, tesi_laura_tonsi_efficacia, tesi_laura_tonsi_prestazione_osservata [EXTRACTED 1.00]
- **Regime cumulativo su prodotti-macchine-IA: CRA + Regolamento Macchine + AI Act** — tesi_laura_tonsi_cyber_resilience_act, tesi_laura_tonsi_regolamento_macchine, tesi_laura_tonsi_ai_act, tesi_laura_tonsi_applicazione_cumulativa [INFERRED 0.85]
- **Le salvaguardie contro l'aggregazione: capacità essenziali, soglie non compensabili, principio dell'anello debole, incertezza probatoria** — tesi_laura_tonsi_capacita_essenziali, tesi_laura_tonsi_soglie_non_compensabili, tesi_laura_tonsi_principio_anello_debole, tesi_laura_tonsi_incertezza_probatoria [INFERRED 0.75]

## Communities (19 total, 3 thin omitted)

### Community 0 - "Regimi europei e sovrapposizioni"
Cohesion: 0.11
Nodes (25): AI Act — Regolamento (UE) 2024/1689, Applicazione cumulativa dei regimi (CRA + Macchine + AI Act), Cap. 1 — Dalla separazione alla convergenza: evoluzione IT/OT e nascita del rischio cyber-fisico, Cap. 2 — La governance europea del rischio cyber-fisico: pluralità normativa e ricomposizione tecnica, Cyber Resilience Act — Regolamento (UE) 2024/2847, Digital Omnibus — COM(2025) 837 final, D.Lgs. 138/2024 — recepimento italiano della NIS2 (ruolo ACN), DORA — Regolamento (UE) 2022/2554 (Digital Operational Resilience Act) (+17 more)

### Community 1 - "Modello di misurazione (Cap. 3)"
Cohesion: 0.13
Nodes (24): Bochman & Freeman (2021) — Countering Cyber Sabotage: Introducing CCE, Capacità essenziali vs accessorie (ai fini dell'aggregazione), Cap. 3 — Misurare le capacità cyber-fisiche: consolidamento, estensione, efficacia e prestazione, Consequence-driven, Cyber-informed Engineering (CCE) — assume breach, orientamento alle conseguenze, Critica alla logica check-the-box / conformità come regolarità documentale, Dimensione: consolidamento (istituzionalizzazione della capacità), Criticità della funzione (rilevanza rispetto alla continuità del servizio), Funzione cyber-fisica (unità di analisi del modello) (+16 more)

### Community 2 - "Il tool CPF Assessment"
Cohesion: 0.18
Nodes (21): dashboard.html — outcome (gap, essential gaps, priorities, charts), Priorità di intervento (remediation priority), Priorità di verifica (verification priority), index.html — saved assessments / new / import, Thesis section 2.9 (the 6-7 fixed capability domains), Thesis sections 3.5-3.6 (capability profile: current/target, 4 dimensions), Static client-side architecture (localStorage, JSON import/export), Bochman & Freeman 2021 (CCE, INL) (+13 more)

### Community 3 - "Ricomposizione tecnica e standard"
Cohesion: 0.14
Nodes (16): Canavese et al. (2026) — Uncovering Challenges of Cybersecurity Cross-Regulation in EU Legislation, Domini di capacità §2.9 (conoscenza asset/dipendenze, segmentazione, gestione vulnerabilità/modifiche, monitoraggio, risposta, continuità/ripristino, filiera), ENISA (2025h) — Technical Implementation Guidance on Commission Implementing Regulation (EU) 2024/2690, Forza probatoria delle evidenze (corroborata / parziale / non determinabile), Gap (divario tra livello corrente corroborato e livello obiettivo), Serie IEC 62443 — cybersecurity dei sistemi di automazione e controllo industriale, Incertezza probatoria (assenza di prova ≠ prova dell'assenza), Industrial DMZ (Livello 3.5) (+8 more)

### Community 4 - "Dipendenze infrastrutturali"
Cohesion: 0.15
Nodes (14): Argonne National Laboratory (2015) — Analysis of Critical Infrastructure Dependencies and Interdependencies, Blackout nordamericano del 2003, Grado di accoppiamento: tight coupling vs loose coupling, Classi di dipendenza: fisica, cyber, logica, geografica (E→{A,B}), Dependency curves (variazione temporale della capacità operativa dopo la perdita della risorsa), Tassonomia delle dipendenze e interdipendenze (Rinaldi / Argonne), Tipi di guasto: cascading, escalating, common-cause, Lewis (2020) — Critical Infrastructure Protection / Normal Accident Theory (+6 more)

### Community 5 - "Convergenza IT/OT e attacchi ICS"
Cohesion: 0.17
Nodes (13): Air gap / illusione dell'isolamento fisico, Assante & Lee (2015) — The Industrial Control System Cyber Kill Chain (SANS), Sistema cyber-fisico, ICS Cyber Kill Chain (Stage 1 / Stage 2), INCONTROLLER/PIPEDREAM (2022) — piattaforma offensiva modulare OT, Information Technology (IT), Convergenza IT/OT, Loss, Denial e Manipulation della vista e del controllo (+5 more)

### Community 6 - "Classificazione regimi e funzione (Step 1-2)"
Cohesion: 0.20
Nodes (12): Thesis section 3.2 (definition of the cyber-physical function), Thesis Chapter 2 (regulatory regimes), AI Act, CER (Critical Entities Resilience), step1-regimi.html — multi-regime classifier, CRA (Cyber Resilience Act), DORA, NIS2 (+4 more)

### Community 7 - "Nesso safety-cybersecurity"
Cohesion: 0.25
Nodes (8): Triade CIA (Confidentiality, Integrity, Availability), Cybersecurity come presupposto della safety fisica, Principio fail-safe, Principio fail-secure, RESS 1.1.9 e 1.2.1 — protezione dall'alterazione e sicurezza dei sistemi di comando, Safe state (stato fisicamente sicuro), Safety Instrumented System (SIS), TRISIS/TRITON (2017) — attacco al Safety Instrumented System

### Community 8 - "Mappatura dipendenze B-A (Step 3)"
Cohesion: 0.40
Nodes (6): Thesis section 3.4 (dependency mapping B→A), Argonne 2015 (infrastructure dependency taxonomy), Rinaldi, Peerenboom & Kelly 2001 (infrastructure interdependencies), step3-dipendenze.html — dependency mapping, Dependency notation B→A, Dependency taxonomy (class / position / coupling / failure type)

### Community 9 - "CER e minacce ibride a cascata"
Cohesion: 0.40
Nodes (6): CER — Direttiva (UE) 2022/2557 sulla resilienza dei soggetti critici, Complementarità NIS2/CER (soggetto critico CER ⇒ soggetto essenziale NIS2), D.Lgs. 134/2024 — recepimento italiano della CER, Effetti a cascata / system of systems / interdipendenze, Minacce ibride ed effetti a cascata intersettoriali, Rinaldi, Peerenboom & Kelly (2001) — Identifying, Understanding and Analyzing Critical Infrastructure Interdependencies

## Knowledge Gaps
- **44 isolated node(s):** `NIS2 Gap Tool (predecessor tool)`, `Thesis Chapter 3 (measurement model)`, `Thesis section 3.2 (definition of the cyber-physical function)`, `Thesis section 3.4 (dependency mapping B→A)`, `Thesis sections 3.5-3.6 (capability profile: current/target, 4 dimensions)` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Funzione cyber-fisica (unità di analisi del modello)` connect `Modello di misurazione (Cap. 3)` to `Ricomposizione tecnica e standard`, `Dipendenze infrastrutturali`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `Cap. 2 — La governance europea del rischio cyber-fisico: pluralità normativa e ricomposizione tecnica` connect `Regimi europei e sovrapposizioni` to `CER e minacce ibride a cascata`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `Ricomposizione tecnica dei requisiti nell'unità dell'architettura IT/OT` connect `Ricomposizione tecnica e standard` to `Regimi europei e sovrapposizioni`, `Modello di misurazione (Cap. 3)`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `NIS2 Gap Tool (predecessor tool)`, `Thesis Chapter 3 (measurement model)`, `Thesis section 3.2 (definition of the cyber-physical function)` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Regimi europei e sovrapposizioni` be split into smaller, more focused modules?**
  _Cohesion score 0.11333333333333333 - nodes in this community are weakly interconnected._
- **Should `Modello di misurazione (Cap. 3)` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Ricomposizione tecnica e standard` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._