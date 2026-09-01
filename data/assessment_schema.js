/* Forma del dato di una valutazione + fabbriche degli oggetti vuoti.
   Questo file NON è configurazione: documenta e costruisce la struttura che
   l'utente compila attraverso i sei step, salvata in localStorage
   (chiave: cpf-assessment-<id>) ed esportata come JSON.

   Espone:
     CPF.blankAssessment(id)              valutazione vuota
     CPF.blankDependency(targetDefault)   riga dell'editor dipendenze (§3.4)
     CPF.blankConsequence() / blankPath() conseguenza e percorso (§3.1)
     CPF.blankCapabilityTarget(id, ess)   voce del profilo obiettivo (§3.6)
     CPF.blankCurrentProfile()            profilo corrente di un dominio (§3.6)

   Un esempio compilato per intero è in data/demo_assessment.js.
   I calcoli derivati (gap, divario essenziale, priorità) sono in assets/app.js. */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  /* Fabbrica di una dipendenza vuota (riga dell'editor dello Step 3, §3.4).
     Relazione orientata B -> A: `source` = B (origine/asset a monte),
     `target` = A (di norma la funzione stessa o un suo componente). */
  root.CPF.blankDependency = function (targetDefault) {
    return {
      id: "dep-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      source: "",
      target: targetDefault || "",
      resource_or_condition: "",
      class: "cyber",                        // fisica|cyber|logica|geografica
      position: "upstream",                  // upstream|internal|downstream
      coupling: "tight",                     // tight|loose
      operational_state_relevant: "normal",  // normal|stressed|repair_restoration
      failure_type_if_relevant: null,        // cascading|escalating|common_cause|null
      activation_time_tolerable: "",
      alternative_available: false,
      alternative_description: ""
    };
  };

  function rid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* Conseguenza intollerabile e percorso di compromissione (Step 4a, logica CCE, §3.1/§3.6). */
  root.CPF.blankConsequence = function () {
    return { id: rid("cons-"), description: "", compromise_paths: [] };
  };
  root.CPF.blankPath = function () {
    // essential_capabilities ⊆ required_capabilities
    return { id: rid("path-"), description: "", required_capabilities: [], essential_capabilities: [] };
  };

  /* Profilo corrente di un dominio (Step 4b): quattro dimensioni indipendenti,
     ciascuna con livello 1-5, forza probatoria e note di evidenza. Il default
     è livello non attribuito (null) + forza "non determinabile": in assenza di
     evidenze il livello non si assegna, nemmeno un valore medio di comodo
     (§3.6 — assenza di prova ≠ prova dell'assenza). */
  root.CPF.blankCurrentProfile = function () {
    var cp = {};
    ["consolidamento", "estensione", "efficacia", "prestazione_osservata"].forEach(function (d) {
      // evidence_date: data (o periodo) dell'evidenza più recente a sostegno del
      // livello. §3.5: l'attualità della fonte va verificata nei contesti a
      // modifiche frequenti — un'evidenza valida alla raccolta può non
      // rappresentare più lo stato corrente.
      cp[d] = { level: null, evidentiary_strength: "non_determinabile", evidence_notes: "", evidence_date: "" };
    });
    cp.estensione.excluded_essential_components = [];
    return cp;
  };

  /* Voce del profilo obiettivo per un dominio di capacità (Step 4a → Step 4b).
     target_profile.<dimensione> = { level 1-5, rationale } — motivato a priori (§3.6). */
  root.CPF.blankCapabilityTarget = function (domainId, isEssential) {
    var tp = {};
    ["consolidamento", "estensione", "efficacia", "prestazione_osservata"].forEach(function (d) {
      tp[d] = { level: 3, rationale: "" };
    });
    return {
      domain_id: domainId,
      target_profile: tp,
      is_essential: !!isEssential,
      non_compensable_threshold: isEssential
        ? { dimension: "estensione", min_level: 4, rationale: "" }
        : null
    };
  };

  root.CPF.blankAssessment = function (id) {
    var now = new Date().toISOString();
    return {
      assessment_id: id || ("cpf-" + Date.now().toString(36)),
      created_at: now,
      updated_at: now,
      organization_id: null,
      organization_name: "",
      // Clonato da un profilo organizzazione nello Step 1 (CPF.cloneRegimeProfile).
      // Fino ad allora resta il profilo neutro qui sotto.
      regime_profile: {
        nis2:     { applicable: false, qualification: "fuori_perimetro", formal_acn_qualification: false },
        cer:      { applicable: false, designation: null, resilience_plan_adopted: false },
        dora:     { applicable: false },
        psnc:     { applicable: false },
        cra:      { applicable: false, category: null },
        macchine: { applicable: false },
        ai_act:   { applicable: false, high_risk: null, channel: null }
      },
      function: {
        name: "",
        service_description: "",        // il risultato operativo / servizio da preservare
        physical_process: "",           // il processo fisico governato
        perimeter: "",                  // ciò che l'organizzazione può ragionevolmente conoscere/monitorare/governare (§3.2)
        criticality: null,              // scala 1-4 (§3.2), raccolta nello Step 2
        criticality_rationale: "",
        regimes_relevant_to_this_function: []
      },
      dependencies: [],
      intolerable_consequences: [],
      capability_assessment: []
    };
  };
})(window);
