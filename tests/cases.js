/* CPF Assessment — batteria di test condivisa.
   Un solo file di casi, usato da:
     - tests/engine.html   (suite "engine")
     - tests/calcs.html    (suite "calcs")
     - pages/test.html      (tutte le suite, vista integrata nel sito)

   Ogni caso: { suite, group, name, fn }.  fn() lancia un'eccezione se fallisce.
   Nessuna dipendenza dal DOM: i casi girano anche sotto jsc con uno shim minimo. */
(function (root) {
  var T = (root.CPF_TEST_CASES = []);

  function eq(actual, expected, what) {
    var a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) throw new Error((what ? what + ": " : "") + "atteso " + e + ", ottenuto " + a);
  }
  function ok(cond, what) { if (!cond) throw new Error(what || "condizione falsa"); }
  function has(arr, re, what) {
    ok((arr || []).some(function (x) { return re.test(String(x)); }), what || ("nessun elemento corrisponde a " + re));
  }
  function traceHas(node, re, what) {
    ok((node.trace || []).some(function (s) { return re.test(s.esito) || re.test(s.base); }), what || ("trace privo di " + re));
  }
  function t(suite, group, name, fn) { T.push({ suite: suite, group: group, name: name, fn: fn }); }

  var C = function (a) { return root.CPF.classifyRegimes(a); };

  /* ================================================================
     SUITE "engine" — CPF.sizeClass / CPF.classifyRegimes
     ================================================================ */

  /* ---- sizeClass (Racc. 2003/361/CE) ---- */
  t("engine", "sizeClass", "600 dip / 900 M€ → grande", function () {
    eq(root.CPF.sizeClass({ employees: 600, turnover_meur: 900, balance_meur: 800 }), "grande");
  });
  t("engine", "sizeClass", "120 dip / 30 M€ → media", function () {
    eq(root.CPF.sizeClass({ employees: 120, turnover_meur: 30, balance_meur: 20 }), "media");
  });
  t("engine", "sizeClass", "20 dip / 5 M€ → piccola", function () {
    eq(root.CPF.sizeClass({ employees: 20, turnover_meur: 5, balance_meur: 4 }), "piccola");
  });
  t("engine", "sizeClass", "8 dip / 1 M€ → micro", function () {
    eq(root.CPF.sizeClass({ employees: 8, turnover_meur: 1, balance_meur: 1 }), "micro");
  });
  t("engine", "sizeClass", "solo dipendenti (120) senza dati economici → media", function () {
    eq(root.CPF.sizeClass({ employees: 120, turnover_meur: null, balance_meur: null }), "media");
  });
  t("engine", "sizeClass", "solo dipendenti (300) senza dati economici → grande", function () {
    eq(root.CPF.sizeClass({ employees: 300, turnover_meur: null, balance_meur: null }), "grande");
  });
  t("engine", "sizeClass", "nessun dato → null", function () {
    eq(root.CPF.sizeClass({ employees: null, turnover_meur: null, balance_meur: null }), null);
  });

  /* ---- NIS2: catena di precedenza (§2.1.1) ---- */
  t("engine", "NIS2", "Allegato I + grande → essenziale", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 600, turnover_meur: 900, balance_meur: 800 } });
    eq(p.nis2.applicable, true, "applicable"); eq(p.nis2.qualification, "essenziale", "qualification");
  });
  t("engine", "NIS2", "Allegato I + media → importante", function () {
    eq(C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 120, turnover_meur: 30, balance_meur: 20 } }).nis2.qualification, "importante");
  });
  t("engine", "NIS2", "Allegato II + grande → importante", function () {
    eq(C({ sector_annex: "annex_ii", sector_nis2: "chimica", size: { employees: 600, turnover_meur: 900, balance_meur: 800 } }).nis2.qualification, "importante");
  });
  t("engine", "NIS2", "Allegato II + media → importante", function () {
    eq(C({ sector_annex: "annex_ii", sector_nis2: "chimica", size: { employees: 120, turnover_meur: 30, balance_meur: 20 } }).nis2.qualification, "importante");
  });
  t("engine", "NIS2", "Allegato I + piccola → fuori perimetro (size-cap rule)", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 20, turnover_meur: 5, balance_meur: 4 } });
    eq(p.nis2.applicable, false, "applicable"); eq(p.nis2.qualification, "fuori_perimetro", "qualification");
    traceHas(p.nis2, /size-cap rule/, "spiega la size-cap rule");
  });
  t("engine", "NIS2", "nessun settore, nessun caso speciale → fuori perimetro", function () {
    eq(C({}).nis2.applicable, false);
  });
  t("engine", "NIS2", "caso speciale (servizi fiduciari qualificati) → essenziale a prescindere dalla dimensione", function () {
    eq(C({ size: { employees: 5, turnover_meur: 1, balance_meur: 1 }, nis2_special_cases: ["trust_qualified"] }).nis2.qualification, "essenziale");
  });
  t("engine", "NIS2", "telco piccola → in perimetro, importante", function () {
    var p = C({ size: { employees: 20, turnover_meur: 5, balance_meur: 4 }, nis2_special_cases: ["telco"] });
    eq(p.nis2.applicable, true, "applicable"); eq(p.nis2.qualification, "importante", "qualification");
  });
  t("engine", "NIS2", "telco grande → in perimetro, essenziale", function () {
    eq(C({ size: { employees: 600, turnover_meur: 900, balance_meur: 800 }, nis2_special_cases: ["telco"] }).nis2.qualification, "essenziale");
  });
  t("engine", "NIS2", "designazione CER come soggetto critico forza NIS2 essenziale (art. 3 §1 lett. f)", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 20, turnover_meur: 5, balance_meur: 4 }, cer_sector: "energia", cer_formally_designated: true });
    eq(p.nis2.qualification, "essenziale", "nis2"); eq(p.cer.designation, "soggetto_critico", "cer");
  });
  t("engine", "NIS2", "designazione discrezionale dello Stato membro (importante) su soggetto altrimenti fuori perimetro", function () {
    eq(C({ ms_designation: "importante" }).nis2.qualification, "importante");
  });
  t("engine", "NIS2", "qualifica ACN formalmente notificata prevale sul calcolo orientativo", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 20, turnover_meur: 5, balance_meur: 4 }, acn_formal_qualification: "essenziale" });
    eq(p.nis2.qualification, "essenziale", "qualification"); eq(p.nis2.formal_acn_qualification, true, "flag ACN");
  });
  t("engine", "NIS2", "sola registrazione ACN (nessuna qualifica) → flag di verifica, nessuna qualificazione", function () {
    var p = C({ acn_platform_registered: true });
    eq(p.nis2.applicable, false, "non qualificato");
    has(p.verification_flags, /ACN/, "verifica ACN");
  });

  /* ---- CER (Dir. 2022/2557 / D.Lgs. 134/2024) ---- */
  t("engine", "CER", "settore + criteri di impatto ma nessuna designazione → potenziale soggetto critico + verifica", function () {
    var p = C({ cer_sector: "acqua_potabile", cer_significance: ["utenti", "alternative"] });
    eq(p.cer.designation, "potenziale_soggetto_critico", "designation");
    has(p.verification_flags, /CER/, "flag di verifica CER");
  });
  t("engine", "CER", "settore senza alcun criterio → non designato", function () {
    eq(C({ cer_sector: "acqua_potabile" }).cer.designation, "non_designato");
  });
  t("engine", "CER", "designato + Piano di Resilienza adottato → traccia di attuazione", function () {
    traceHas(C({ cer_sector: "acqua_potabile", cer_formally_designated: true, cer_resilience_plan_adopted: true }).cer, /Piano di Resilienza/, "piano di resilienza");
  });
  t("engine", "CER", "designato senza Piano di Resilienza → flag di verifica sul piano", function () {
    has(C({ cer_sector: "acqua_potabile", cer_formally_designated: true }).verification_flags, /Piano di Resilienza/, "verifica piano");
  });
  t("engine", "CER", "settore nazionale acque irrigue riconosciuto", function () {
    eq(C({ cer_sector: "acque_irrigue", cer_formally_designated: true }).cer.applicable, true);
  });

  /* ---- DORA (Reg. 2022/2554) ---- */
  t("engine", "DORA", "entità finanziaria → applicabile con nota lex specialis", function () {
    var p = C({ dora_financial_entity: true });
    eq(p.dora.applicable, true, "applicable");
    ok(/lex specialis|luogo delle corrispondenti/i.test(p.dora.note || ""), "nota lex specialis");
  });
  t("engine", "DORA", "fornitore TIC terzo critico (art. 31) → applicabile, ramo distinto", function () {
    var p = C({ dora_ict_tpp_critical: true });
    eq(p.dora.applicable, true, "applicable");
    traceHas(p.dora, /fornitore TIC|art\. 31|Lead Overseer|sorveglianza/i, "ramo fornitore TIC");
  });
  t("engine", "DORA", "non entità finanziaria né TIP critico → non applicabile", function () {
    eq(C({}).dora.applicable, false);
  });

  /* ---- PSNC / lex specialis nazionale (D.Lgs. 138/2024 art. 33) ---- */
  t("engine", "PSNC", "asset nel Perimetro + NIS2 applicabile → prevalenza per ambito + interazione + verifica", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "energia", size: { employees: 600, turnover_meur: 900, balance_meur: 800 }, psnc_assets: true });
    eq(p.psnc.applicable, true, "psnc");
    eq(p.nis2.psnc_exclusion, true, "nis2.psnc_exclusion");
    ok(p.interactions.some(function (i) { return i.type === "lex specialis nazionale"; }), "interazione PSNC");
    has(p.verification_flags, /PSNC/, "verifica PSNC");
  });
  t("engine", "PSNC", "nessun asset indicato → non applicabile", function () {
    eq(C({}).psnc.applicable, false);
  });

  /* ---- CRA (Reg. 2024/2847) ---- */
  t("engine", "CRA", "immette prodotto senza categoria → applicabile, ordinario in via prudenziale, flag di verifica", function () {
    var p = C({ cra_places_product: true, cra_role: "fabbricante" });
    eq(p.cra.applicable, true, "applicable"); eq(p.cra.category, "ordinario", "category");
    has(p.verification_flags, /CRA/, "verifica categoria");
  });
  t("engine", "CRA", "categoria critica dichiarata → riportata nel profilo", function () {
    eq(C({ cra_places_product: true, cra_role: "fabbricante", cra_category: "critico" }).cra.category, "critico");
  });
  t("engine", "CRA", "ruolo importatore/distributore → traccia di obblighi ridotti", function () {
    traceHas(C({ cra_places_product: true, cra_role: "importatore_distributore" }).cra, /importatore|ridotti/i, "obblighi ridotti");
  });
  t("engine", "CRA", "non immette prodotti → non applicabile", function () {
    eq(C({}).cra.applicable, false);
  });

  /* ---- Regolamento Macchine (Reg. 2023/1230) ---- */
  t("engine", "Macchine", "fabbricante + software di sicurezza → organismo notificato obbligatorio", function () {
    var p = C({ macchine_roles: ["fabbricante"], macchine_annex_i_part_a_flags: ["safety_software"] });
    eq(p.macchine.applicable, true, "applicable"); eq(p.macchine.notified_body_required, true, "notified body");
  });
  t("engine", "Macchine", "fabbricante senza componenti Allegato I Parte A → nessun organismo notificato", function () {
    eq(C({ macchine_roles: ["fabbricante"] }).macchine.notified_body_required, false);
  });
  t("engine", "Macchine", "modifica sostanziale → traccia di equiparazione al fabbricante", function () {
    traceHas(C({ macchine_roles: ["modifica_sostanziale"] }).macchine, /modifica sostanziale|equiparazione/i, "modifica sostanziale");
  });
  t("engine", "Macchine", "connessione digitale che incide sulla safety → verifica RESS 1.1.9 / 1.2.1", function () {
    has(C({ macchine_roles: ["fabbricante"], macchine_digital_connection: true }).verification_flags, /1\.1\.9|1\.2\.1/, "verifica RESS");
  });

  /* ---- AI Act (Reg. 2024/1689 + Digital Omnibus, Reg. (UE) 2026/1744) ---- */
  t("engine", "AI Act", "nessun sistema di IA → non applicabile", function () {
    eq(C({}).ai_act.applicable, false);
  });
  t("engine", "AI Act", "pratica vietata (art. 5) → status vietato, nota art. 5", function () {
    var p = C({ ai_system: true, ai_prohibited: true });
    eq(p.ai_act.status, "vietato", "status");
    traceHas(p.ai_act, /art\. 5|vietat/i, "nota art. 5");
    has(p.notes, /pratiche vietate|art\. 5/i, "nota pratiche vietate");
  });
  t("engine", "AI Act", "IA presente ma fuori dai due canali → non ad alto rischio + nota trasparenza (art. 50)", function () {
    var p = C({ ai_system: true });
    eq(p.ai_act.high_risk, false, "high_risk");
    has(p.notes, /[Aa]rt\. 50|trasparenza/, "nota trasparenza");
  });
  t("engine", "AI Act", "canale 6.1 con finalità di sicurezza → alto rischio, esclusione 6.3 non invocabile", function () {
    var p = C({ ai_system: true, ai_channel1: true, ai_channel1_safety_purpose: true, ai_exclusion_conditions: ["procedurale"] });
    eq(p.ai_act.high_risk, true, "high_risk"); eq(p.ai_act.channel, "art6_1", "channel");
  });
  t("engine", "AI Act", "Reg. 2026/1744 — canale 6.1 SENZA finalità di sicurezza (e nessun uso Allegato III) → non alto rischio, da verificare", function () {
    var p = C({ ai_system: true, ai_channel1: true });
    eq(p.ai_act.high_risk, false, "high_risk"); eq(p.ai_act.status, "canale_6_1_non_attivato", "status");
    has(p.verification_flags, /2026\/1744|finalità.*sicurezza/i, "verifica finalità");
  });
  t("engine", "AI Act", "Reg. 2026/1744 — canale 6.1 non attivato ma uso Allegato III → alto rischio sul canale 6.2", function () {
    var p = C({ ai_system: true, ai_channel1: true, ai_channel2: true });
    eq(p.ai_act.high_risk, true, "high_risk"); eq(p.ai_act.channel, "art6_2", "channel");
  });
  t("engine", "AI Act", "canale 6.1 → il narrowing del Reg. 2026/1744 è nel trace (finalità di sicurezza)", function () {
    var p = C({ ai_system: true, ai_channel1: true, ai_channel1_safety_purpose: true });
    eq(p.ai_act.channel, "art6_1");
    traceHas(p.ai_act, /finalità di sicurezza|6\.1/i, "trace canale 6.1");
  });
  t("engine", "AI Act", "canale 6.2 + condizione di esclusione (art. 6.3) + no profilazione → alto rischio escluso", function () {
    eq(C({ ai_system: true, ai_channel2: true, ai_exclusion_conditions: ["procedurale"], ai_profiling: false }).ai_act.high_risk, "escluso");
  });
  t("engine", "AI Act", "canale 6.2 + esclusione ma con profilazione di persone fisiche → resta alto rischio", function () {
    eq(C({ ai_system: true, ai_channel2: true, ai_exclusion_conditions: ["procedurale"], ai_profiling: true }).ai_act.high_risk, true);
  });
  t("engine", "AI Act", "canale 6.2 senza esclusioni → alto rischio", function () {
    eq(C({ ai_system: true, ai_channel2: true }).ai_act.high_risk, true);
  });
  t("engine", "AI Act", "uso Allegato III selezionato → etichetta dell'uso nel trace", function () {
    traceHas(C({ ai_system: true, ai_channel2: true, ai_annex_iii_use: "infra_critiche" }).ai_act, /infrastrutture digitali critiche|acqua, gas/i, "etichetta uso");
  });
  t("engine", "AI Act", "alto rischio + supervisione e robustezza non pronte → open_requirements = [oversight, robustness]", function () {
    var p = C({ ai_system: true, ai_channel2: true });
    eq(p.ai_act.open_requirements.slice().sort(), ["oversight", "robustness"]);
    has(p.verification_flags, /art\. 14/, "verifica art. 14");
    has(p.verification_flags, /art\. 15/, "verifica art. 15");
  });
  t("engine", "AI Act", "alto rischio + entrambi i requisiti pronti → open_requirements vuoto", function () {
    eq(C({ ai_system: true, ai_channel2: true, ai_oversight_ready: true, ai_robustness_ready: true }).ai_act.open_requirements, []);
  });
  t("engine", "AI Act", "alto rischio in ambiente OT con dati di campo → nota art. 437-bis c.p. + limite epistemico Modbus/OPC", function () {
    var p = C({ ai_system: true, ai_channel2: true, ai_ot_field_data: true });
    has(p.notes, /437-bis/, "nota art. 437-bis");
    traceHas(p.ai_act, /limite epistemico|Modbus|OPC/i, "limite epistemico OT");
    has(p.verification_flags, /man-in-the-middle|Modbus\/OPC/i, "verifica catena sensori");
  });

  /* ---- interazioni tra regimi ---- */
  t("engine", "Interazioni", "CRA + Macchine + AI Act → almeno 3 interazioni cumulative", function () {
    var p = C({ cra_places_product: true, macchine_roles: ["fabbricante"], ai_system: true, ai_channel1: true, ai_channel1_safety_purpose: true });
    ok(p.interactions.length >= 3, "trovate " + p.interactions.length);
  });
  t("engine", "Interazioni", "entità finanziaria in Allegato I → interazione NIS2/DORA lex specialis", function () {
    var p = C({ sector_annex: "annex_i", sector_nis2: "bancario", size: { employees: 600, turnover_meur: 900, balance_meur: 800 }, dora_financial_entity: true });
    ok(p.interactions.some(function (i) { return i.pair.indexOf("nis2") !== -1 && i.pair.indexOf("dora") !== -1; }), "interazione NIS2/DORA");
  });
  t("engine", "Traccia", "ogni regime porta un trace non vuoto (motivazione, §3.6-3.7)", function () {
    var p = C({});
    ["nis2", "cer", "dora", "cra", "macchine", "ai_act", "psnc"].forEach(function (k) {
      ok((p[k].trace || []).length > 0, k + ".trace vuoto");
    });
  });

  /* ================================================================
     SUITE "calcs" — calcoli derivati §3.6 (assets/app.js)
     ================================================================ */
  var mk = function (cur, tgt, ess, thr) {
    return { domain_id: "segmentazione", current_profile: cur, target_profile: tgt, is_essential: ess, non_compensable_threshold: thr };
  };

  t("calcs", "dimensionGap", "livello non determinabile → incertezza_probatoria, gap null", function () {
    eq(root.CPF.dimensionGap({ level: 3, evidentiary_strength: "non_determinabile" }, { level: 4 }), { state: "incertezza_probatoria", gap: null });
  });
  t("calcs", "dimensionGap", "corroborato 2→4 → gap 2", function () {
    eq(root.CPF.dimensionGap({ level: 2, evidentiary_strength: "corroborata" }, { level: 4 }).gap, 2);
  });
  t("calcs", "essentialShortfall", "essenziale, corrente < soglia → divario_essenziale (have/need)", function () {
    var s = root.CPF.essentialShortfall(mk({ estensione: { level: 2, evidentiary_strength: "corroborata" } }, {}, true, { dimension: "estensione", min_level: 5, rationale: "x" }));
    eq(s.kind, "divario_essenziale"); eq([s.have, s.need], [2, 5]);
  });
  t("calcs", "essentialShortfall", "soglia su livello non determinabile → verifica (non intervento)", function () {
    eq(root.CPF.essentialShortfall(mk({ estensione: { level: 2, evidentiary_strength: "non_determinabile" } }, {}, true, { dimension: "estensione", min_level: 5, rationale: "x" })).kind, "verifica");
  });
  t("calcs", "domainPriority", "crit 4 + essenziale + gap 3 corroborato → intervento alta, nessuna verifica", function () {
    var p = root.CPF.domainPriority(mk(
      { consolidamento: { level: 2, evidentiary_strength: "corroborata" }, estensione: { level: 2, evidentiary_strength: "corroborata" } },
      { consolidamento: { level: 4 }, estensione: { level: 5 } }, true, null), 4);
    eq(p.priorita_intervento.band, "alta"); eq(p.priorita_verifica, null);
  });
  t("calcs", "domainPriority", "divario essenziale → intervento alta anche con criticità 1 (anello debole)", function () {
    var p = root.CPF.domainPriority(mk({ estensione: { level: 2, evidentiary_strength: "corroborata" } }, { estensione: { level: 3 } }, true, { dimension: "estensione", min_level: 5, rationale: "x" }), 1);
    eq(p.priorita_intervento.band, "alta"); eq(!!p.priorita_intervento.essential_shortfall, true);
  });
  t("calcs", "domainPriority", "livello non determinabile → solo verifica, nessun intervento", function () {
    var p = root.CPF.domainPriority(mk({ consolidamento: { level: 3, evidentiary_strength: "non_determinabile" } }, { consolidamento: { level: 4 } }, false, null), 3);
    eq(p.priorita_intervento, null); eq(!!p.priorita_verifica, true);
  });
  t("calcs", "domainPriority", "livello parziale + gap → verifica, non intervento", function () {
    var p = root.CPF.domainPriority(mk({ efficacia: { level: 2, evidentiary_strength: "parziale" } }, { efficacia: { level: 4 } }, false, null), 2);
    eq(p.priorita_intervento, null); eq(p.priorita_verifica.items.length, 1);
  });
  t("calcs", "domainPriority", "nessun divario, tutto corroborato → nessuna priorità", function () {
    var p = root.CPF.domainPriority(mk({ consolidamento: { level: 4, evidentiary_strength: "corroborata" } }, { consolidamento: { level: 4 } }, false, null), 3);
    eq(p.priorita_intervento, null); eq(p.priorita_verifica, null);
  });
  t("calcs", "blankCurrentProfile", "4 dimensioni, livello non attribuito (null) + non determinabile, estensione con esclusioni []", function () {
    var cp = root.CPF.blankCurrentProfile();
    eq(Object.keys(cp).sort(), ["consolidamento", "efficacia", "estensione", "prestazione_osservata"]);
    eq(cp.consolidamento.evidentiary_strength, "non_determinabile");
    eq(cp.consolidamento.level, null);
    eq(cp.estensione.excluded_essential_components, []);
  });
  t("calcs", "dimensionGap", "livello corrente non attribuito (null) → incertezza_probatoria", function () {
    eq(root.CPF.dimensionGap({ level: null, evidentiary_strength: "corroborata" }, { level: 4 }).state, "incertezza_probatoria");
  });
  t("calcs", "essentialShortfall", "current_profile assente → null, nessun errore", function () {
    eq(root.CPF.essentialShortfall({ is_essential: true, non_compensable_threshold: { dimension: "estensione", min_level: 4, rationale: "x" } }), null);
  });
  t("calcs", "essentialShortfall", "soglia su livello non attribuito (null) → verifica", function () {
    eq(root.CPF.essentialShortfall(mk({ estensione: { level: null, evidentiary_strength: "non_determinabile" } }, {}, true, { dimension: "estensione", min_level: 5, rationale: "x" })).kind, "verifica");
  });
  t("calcs", "integrazione 4a→4b", "target da 4a + corrente da 4b → divario essenziale rilevato e priorità alta", function () {
    var e = root.CPF.blankCapabilityTarget("segmentazione", true);
    e.non_compensable_threshold = { dimension: "estensione", min_level: 5, rationale: "x" };
    e.current_profile = root.CPF.blankCurrentProfile();
    e.current_profile.estensione = { level: 2, evidentiary_strength: "corroborata", evidence_notes: "", excluded_essential_components: [] };
    var s = root.CPF.essentialShortfall(e);
    eq(s.kind, "divario_essenziale"); eq([s.have, s.need], [2, 5]);
    eq(root.CPF.domainPriority(e, 3).priorita_intervento.band, "alta");
  });
  t("calcs", "rankDomains", "il dominio con divario essenziale precede quello senza divari", function () {
    var noGap = mk({ consolidamento: { level: 4, evidentiary_strength: "corroborata" } }, { consolidamento: { level: 4 } }, false, null);
    var essShort = mk({ estensione: { level: 2, evidentiary_strength: "corroborata" } }, { estensione: { level: 3 } }, true, { dimension: "estensione", min_level: 5, rationale: "x" });
    essShort.domain_id = "vulnerabilita";
    eq(root.CPF.rankDomains([noGap, essShort], 3)[0].domain_id, "vulnerabilita");
  });

  /* --- priorità come regola ordinale (§3.6-3.7), non somma di punteggi --- */
  t("calcs", "domainPriority", "regola: non essenziale, criticità bassa, divario contenuto → intervento bassa", function () {
    var p = root.CPF.domainPriority(mk({ efficacia: { level: 3, evidentiary_strength: "corroborata" } }, { efficacia: { level: 4 } }, false, null), 1);
    eq(p.priorita_intervento.band, "bassa");
  });
  t("calcs", "domainPriority", "regola: non essenziale, criticità alta, divario ampio → intervento media", function () {
    var p = root.CPF.domainPriority(mk({ efficacia: { level: 2, evidentiary_strength: "corroborata" } }, { efficacia: { level: 4 } }, false, null), 3);
    eq(p.priorita_intervento.band, "media");
  });
  t("calcs", "domainPriority", "regola: essenziale (senza soglia) con divario contenuto e criticità bassa → intervento media, mai bassa", function () {
    var p = root.CPF.domainPriority(mk({ efficacia: { level: 3, evidentiary_strength: "corroborata" } }, { efficacia: { level: 4 } }, true, null), 1);
    eq(p.priorita_intervento.band, "media");
  });
  t("calcs", "domainPriority", "regola: criticità assente trattata come neutra (2)", function () {
    var p = root.CPF.domainPriority(mk({ efficacia: { level: 3, evidentiary_strength: "corroborata" } }, { efficacia: { level: 4 } }, false, null), null);
    eq(p.priorita_intervento.band, "bassa");
  });
  t("calcs", "domainPriority", "verifica: incertezza su soglia essenziale + funzione critica → verifica alta", function () {
    var p = root.CPF.domainPriority(mk({ estensione: { level: null, evidentiary_strength: "non_determinabile" } }, {}, true, { dimension: "estensione", min_level: 5, rationale: "x" }), 4);
    eq(p.priorita_verifica.band, "alta");
    eq(!!p.priorita_verifica.essential_uncertainty, true);
  });

  /* --- attualità dell'evidenza (§3.5) --- */
  t("calcs", "evidenceCurrency", "data assente → stato 'assente'", function () {
    eq(root.CPF.evidenceCurrency("").state, "assente");
  });
  t("calcs", "evidenceCurrency", "evidenza di 6 mesi (default 24) → recente", function () {
    eq(root.CPF.evidenceCurrency("2026-01", 24, "2026-07-01").state, "recente");
  });
  t("calcs", "evidenceCurrency", "evidenza di 30 mesi → da_rivalutare", function () {
    var c = root.CPF.evidenceCurrency("2024-01", 24, "2026-07-01");
    eq(c.state, "da_rivalutare"); eq(c.months, 30);
  });
  t("calcs", "blankCurrentProfile", "ogni dimensione ha evidence_date vuota", function () {
    eq(root.CPF.blankCurrentProfile().efficacia.evidence_date, "");
  });
  t("calcs", "scales", "matrice di corroborazione: ogni dimensione elenca i tipi di evidenza pertinenti (§3.5)", function () {
    var dims = root.CPF.data.scales.dimensions;
    ["consolidamento", "estensione", "efficacia", "prestazione_osservata"].forEach(function (d) {
      ok(dims[d].evidence && dims[d].evidence.types && dims[d].evidence.types.length >= 2, d + " senza matrice di corroborazione");
    });
  });

  /* ================================================================
     SUITE "review" — controllo di coerenza della funzione (Step 2)
     CPF.reviewFunction: euristiche di aiuto, non validazione giuridica.
     ================================================================ */
  var rv = function (fn, rp) { return root.CPF.reviewFunction({ function: fn, regime_profile: rp || {} }); };
  var hasFinding = function (findings, field, level) {
    return findings.some(function (x) { return x.field === field && (!level || x.level === level); });
  };
  // funzione ben definita, usata come riferimento "pulito"
  var goodFn = {
    name: "Potabilizzazione — linea A",
    service_description: "Erogazione continua di acqua potabile a circa 45.000 abitazioni e a due ospedali del bacino nord.",
    physical_process: "Filtrazione e dosaggio del disinfettante su una linea da 320 l/s; PLC che regola pompe e valvole; stato sicuro = chiusura linea.",
    perimeter: "Impianto, SCADA di stabilimento, telecontrollo dei serbatoi di proprietà. Fuori: rete di distribuzione a valle e media tensione.",
    criticality: 3,
    criticality_rationale: "Ampio numero di utenti dipendenti e utenze sensibili; impatto esteso e prolungato; alternativa parziale attivabile solo in ore.",
    regimes_relevant_to_this_function: ["nis2", "cer"]
  };

  t("review", "reviewFunction", "funzione vuota → 'da fare' su nome, risultato, perimetro, criticità", function () {
    var f = rv({});
    ok(hasFinding(f, "name", "todo"), "name todo");
    ok(hasFinding(f, "service_description", "todo"), "service todo");
    ok(hasFinding(f, "perimeter", "todo"), "perimeter todo");
    ok(hasFinding(f, "criticality", "todo"), "criticality todo");
  });
  t("review", "reviewFunction", "funzione ben definita → nessuna segnalazione", function () {
    eq(rv(goodFn, { nis2: { qualification: "essenziale" } }), []);
  });
  t("review", "reviewFunction", "il nome sembra l'organizzazione → verifica sul nome", function () {
    var f = rv({ name: "AcquaCittà S.p.A." });
    ok(hasFinding(f, "name", "warn"), "warn sul nome");
  });
  t("review", "reviewFunction", "risultato e processo fisico identici → verifica sul processo", function () {
    var f = rv({ name: "X", service_description: "Erogazione di acqua potabile alla città", physical_process: "Erogazione di acqua potabile alla città", perimeter: "y", criticality: 2, criticality_rationale: "z" });
    ok(hasFinding(f, "physical_process", "warn"), "warn processo == risultato");
  });
  t("review", "reviewFunction", "criticità alta con motivazione che non cita i criteri CER → verifica", function () {
    var f = rv({ name: "Dispacciamento", service_description: "Bilanciamento della rete elettrica di distribuzione locale.", physical_process: "Regolazione tensione/frequenza in cabina primaria.", perimeter: "cabina + telecontrollo", criticality: 4, criticality_rationale: "È molto importante per noi.", regimes_relevant_to_this_function: ["nis2"] });
    ok(hasFinding(f, "criticality_rationale", "warn"), "motivazione debole");
  });
  t("review", "reviewFunction", "criticità 4 senza NIS2 né CER tra i regimi rilevanti → verifica", function () {
    var g = JSON.parse(JSON.stringify(goodFn));
    g.criticality = 4; g.regimes_relevant_to_this_function = ["macchine"];
    ok(hasFinding(rv(g), "criticality", "warn"), "incoerenza criticità/resilienza");
  });
  t("review", "reviewFunction", "organizzazione essenziale ma funzione a criticità bassa → verifica", function () {
    var g = JSON.parse(JSON.stringify(goodFn)); g.criticality = 2;
    ok(hasFinding(rv(g, { nis2: { qualification: "essenziale" } }), "criticality", "warn"), "warn coerenza org/funzione");
  });
  t("review", "reviewFunction", "scostamento (override) senza motivazione → 'da fare'", function () {
    var f = rv(goodFn, { nis2: { qualification: "essenziale", overridden_from_org_profile: true, override_reason: "" } });
    ok(hasFinding(f, "regimes", "todo"), "override senza motivo");
  });

  /* ================================================================
     SUITE "report" — CPF.buildReport: sintesi dell'esito (dashboard)
     Funzione pura: regimi + funzione + dipendenze + profilo obiettivo +
     profilo corrente letti insieme, senza aggregati (§3.6-3.7).
     ================================================================ */
  var demo = function () { return JSON.parse(JSON.stringify(root.CPF.data.demoAssessment)); };

  t("report", "buildReport", "demo → regime_profile calcolato da _answers quando manca", function () {
    var R = root.CPF.buildReport(demo());
    eq(R.regime_profile.nis2.qualification, "essenziale");
    eq(R.regime_profile.cer.designation, "soggetto_critico");
  });
  t("report", "buildReport", "demo → 7 regimi, quelli rilevanti marcati", function () {
    var R = root.CPF.buildReport(demo());
    eq(R.regimes.length, 7);
    var rel = R.regimes.filter(function (x) { return x.relevant; }).map(function (x) { return x.key; }).sort();
    eq(rel, ["ai_act", "cer", "macchine", "nis2"]);
  });
  t("report", "buildReport", "demo → dipendenze partizionate + anelli critici", function () {
    var R = root.CPF.buildReport(demo());
    eq(R.dependencies.all.length, 4);
    eq(R.dependencies.upstream.length, 3);
    eq(R.dependencies.downstream.length, 1);
    ok(R.dependencies.critical.length >= 1, "almeno un anello critico (dep-2: tight, no alt, upstream)");
  });
  t("report", "buildReport", "demo → un divario essenziale (conoscenza/estensione) e una verifica su soglia (monitoraggio)", function () {
    var R = root.CPF.buildReport(demo());
    eq(R.essential_shortfalls.map(function (x) { return x.domain_id; }), ["conoscenza"]);
    eq(R.essential_verifications.map(function (x) { return x.domain_id; }), ["monitoraggio"]);
  });
  t("report", "buildReport", "demo → priorità di intervento e di verifica come liste distinte, non fuse", function () {
    var R = root.CPF.buildReport(demo());
    ok(R.priority_intervento.length > 0 && R.priority_verifica.length > 0, "entrambe popolate");
    ok(R.priority_intervento.every(function (r) { return r.priorita_intervento; }), "solo domini con intervento");
    ok(R.priority_verifica.every(function (r) { return r.priorita_verifica; }), "solo domini con verifica");
  });
  t("report", "buildReport", "demo → segnala l'evidenza da rivalutare (§3.5)", function () {
    var R = root.CPF.buildReport(demo());
    ok(R.summary.stale_evidence.some(function (x) { return x.domain_id === "segmentazione" && x.dimension === "prestazione_osservata"; }),
      "segmentazione/prestazione_osservata (2024-03) è da rivalutare");
  });
  t("report", "buildReport", "demo → conta le dimensioni non determinabili", function () {
    var R = root.CPF.buildReport(demo());
    ok(R.summary.undetermined_dimensions >= 3, "il demo ha più livelli non determinabili");
  });
  t("report", "buildReport", "valutazione minima (solo funzione) → nessun errore, liste vuote", function () {
    var R = root.CPF.buildReport({ function: { name: "X", criticality: 2 } });
    eq(R.domains, []); eq(R.essential_shortfalls, []); eq(R.consequences, []);
    eq(R.dependencies.all, []);
  });
  t("report", "buildReport", "nessuna compensazione: l'oggetto non espone alcun punteggio aggregato di capacità", function () {
    var R = root.CPF.buildReport(demo());
    ok(!("score" in R) && !("aggregate" in R) && !("total" in R.summary), "nessun aggregato di sicurezza");
  });
})(typeof window !== "undefined" ? window : this);
