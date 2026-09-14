# Graph Report - CPF Assesment  (2026-09-13)

## Corpus Check
- Corpus is ~49,148 words - fits in a single context window. You may not need a graph.

## Summary
- 107 nodes · 98 edges · 30 communities (26 shown, 4 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 105,544 input · 0 output

## Community Hubs (Navigation)
- Model Rationale & Page Renderers
- Verification & Case Studies
- Capability Dimensions & Compensation
- Regime Engine & Tests
- App Shell (Header/Footer/A11y)
- Theme Toggle
- Dumbbell Chart
- Criticality Cross-Check Loop
- Step1 Org Init

## God Nodes (most connected - your core abstractions)
1. `Tesi: Dall'IT all'OT — misurare, verificare e regolare il rischio cyber-fisico` - 8 edges
2. `decorate() — gap/threshold/priority feedback` - 6 edges
3. `build()` - 5 edges
4. `Test page — regime engine` - 4 edges
5. `Quattro dimensioni ordinali di capacità, senza compensazione` - 4 edges
6. `CPF Assessment (tool)` - 4 edges
7. `Dashboard Main IIFE` - 4 edges
8. `backToTop()` - 3 edges
9. `current()` - 3 edges
10. `mount()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `depFlow() SVG Dependency Diagram` --semantically_similar_to--> `CPF.renderDumbbell`  [INFERRED] [semantically similar]
  pages/dashboard.html → assets/dumbbell.js
- `Dashboard Main IIFE` --calls--> `CPF.buildReport`  [EXTRACTED]
  pages/dashboard.html → assets/report.js
- `calcs test runner page (§3.6 derived calculations)` --conceptually_related_to--> `decorate() — gap/threshold/priority feedback`  [INFERRED]
  tests/calcs.html → pages/step4b-capacita.html
- `Dashboard Main IIFE` --calls--> `CPF.renderDumbbell`  [EXTRACTED]
  pages/dashboard.html → assets/dumbbell.js
- `CPF.buildReport` --references--> `Test Engine Page`  [EXTRACTED]
  assets/report.js → pages/test.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Capability scoring functions validated together by the calcs test suite (§3.6)** — tests_calcs_page [EXTRACTED 1.00]
- **CPF Assessment wizard flow (Step1 → Step2 → Step3 → Step4a → Step4b → Dashboard)** — index_renderassessments, pages_step1_regimi_recompute, pages_step2_funzione_read, pages_step3_dipendenze_depissues, pages_step4a_conseguenze_reconciletargets, pages_step4b_capacita_decorate, pages_dashboard_dashboard_main [EXTRACTED 1.00]
- **Bidirectional criticality/dependency consistency check between Step 2 and Step 3** — pages_step2_funzione_renderreview, pages_step3_dipendenze_downstreamcriticalityhint, readme_dependency_model [INFERRED 0.85]
- **Dashboard Outcome Rendering Pipeline** — pages_dashboard_dashboard_main, assets_report_buildreport, assets_dumbbell_renderdumbbell, pages_dashboard_depflow [EXTRACTED 1.00]
- **Engine Test Verification Chain** — pages_test_page, tests_runner_runtests, tests_cases_cpf_test_cases, assets_report_buildreport [EXTRACTED 1.00]
- **Case Study Data Consumption** — pages_casi_studio_page, data_case_studies_casestudies, data_case_studies_casestudiessynthesis, tests_cases [EXTRACTED 1.00]

## Communities (30 total, 4 thin omitted)

### Community 0 - "Model Rationale & Page Renderers"
Cohesion: 0.13
Nodes (15): CPF.renderDumbbell, Dashboard Main IIFE, depFlow() SVG Dependency Diagram, renderResult() / tagFor(), read()/persist() / badge(), depIssues() — critical-ring / coupling flags, pathCard()/capRow() — consequence→path→capability mapping (CCE), Ridondanza reale vs nominale — infrastrutture sottomarine del Baltico (§5.4.2) (+7 more)

### Community 1 - "Verification & Case Studies"
Cohesion: 0.19
Nodes (11): CPF.buildReport, CPF.data.caseStudies, CPF.data.caseStudiesSynthesis, Casi di Riferimento Page, Test Engine Page, test.html run() Function, CPF_TEST_CASES Array, has() (+3 more)

### Community 2 - "Capability Dimensions & Compensation"
Cohesion: 0.19
Nodes (12): persist() / save & next handlers, compGroupBlock() — accessory-capability compensation UI, decorate() — gap/threshold/priority feedback, Quattro dimensioni ordinali di capacità, senza compensazione, Matrice di corroborazione (§3.5), CPF Assessment (tool), domainPriority — regola ordinale, non somma (§3.6-3.7), Forza probatoria separata dal livello (+4 more)

### Community 4 - "App Shell (Header/Footer/A11y)"
Cohesion: 0.48
Nodes (5): a11y(), absorbToggle(), backToTop(), build(), footer()

### Community 6 - "Theme Toggle"
Cohesion: 0.60
Nodes (5): apply(), current(), mount(), render(), systemDark()

## Knowledge Gaps
- **10 isolated node(s):** `depIssues() — critical-ring / coupling flags`, `pathCard()/capRow() — consequence→path→capability mapping (CCE)`, `Laura Tonsi (autrice)`, `Prof. Michele Colajanni (relatore)`, `renderReview() — coherence-check panel` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tesi: Dall'IT all'OT — misurare, verificare e regolare il rischio cyber-fisico` connect `Model Rationale & Page Renderers` to `Capability Dimensions & Compensation`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `Dashboard Main IIFE` connect `Model Rationale & Page Renderers` to `Verification & Case Studies`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `decorate() — gap/threshold/priority feedback` (e.g. with `reconcileTargets()` and `calcs test runner page (§3.6 derived calculations)`) actually correct?**
  _`decorate() — gap/threshold/priority feedback` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `depIssues() — critical-ring / coupling flags`, `pathCard()/capRow() — consequence→path→capability mapping (CCE)`, `Laura Tonsi (autrice)` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Model Rationale & Page Renderers` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._