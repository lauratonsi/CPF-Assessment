/* Schema di una valutazione salvata (assessments/<id>.json).
   Questo file NON è configurazione: documenta la forma del dato che l'utente
   finale compila attraverso i 4 step e che viene salvato in localStorage
   (chiave: cpf-assessment-<id>) ed esportato come JSON.

   Espone:
     window.CPF.data.assessmentExample  — istanza esemplificativa completa
     window.CPF.blankAssessment(id)     — fabbrica di una valutazione vuota

   Calcoli derivati (da implementare in assets/app.js):
     - Gap per dimensione:  G = max(0, target.level - current.level)
       solo se current.evidentiary_strength !== "non_determinabile",
       altrimenti stato = "incertezza_probatoria".
     - Divario essenziale: se is_essential e
       current[threshold.dimension].level < threshold.min_level
       => flag visibile, MAI assorbito in una media (§3.6, anello debole).
     - Priorità: priorita_sostanziale = f(criticità_funzione, is_essential, gap);
       se evidentiary_strength non corroborata => priorita_verifica
       invece di priorita_intervento.
*/
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.assessmentExample = {
    assessment_id: "esempio-001",
    created_at: "2026-08-28T10:00:00Z",
    updated_at: "2026-08-28T10:00:00Z",

    regime_profile: {
      _comment: "Output dello Step 1, vedi regime_classifier.js#output_schema",
      nis2:     { applicable: true,  qualification: "essenziale", formal_acn_qualification: false },
      cer:      { applicable: false, designation: null, resilience_plan_adopted: false },
      dora:     { applicable: false },
      psnc:     { applicable: false },
      cra:      { applicable: true,  category: "importante_1" },
      macchine: { applicable: true },
      ai_act:   { applicable: false, high_risk: null, channel: null }
    },

    function: {
      name: "",
      service_description: "",
      physical_process: "",
      regimes_relevant_to_this_function: ["nis2", "cra", "macchine"],
      _comment: "Sottoinsieme di regime_profile applicabile a QUESTA funzione, non all'intera organizzazione (§3.2)"
    },

    dependencies: [
      {
        id: "dep_001",
        source: "elemento B (fornitore/asset a monte)",
        target: "elemento A (di norma la funzione stessa o un suo componente)",
        resource_or_condition: "",
        class: "cyber",              // fisica|cyber|logica|geografica
        position: "upstream",         // upstream|internal|downstream
        coupling: "tight",            // tight|loose
        operational_state_relevant: "normal", // normal|stressed|repair_restoration
        failure_type_if_relevant: null,       // cascading|escalating|common_cause|null
        activation_time_tolerable: "",
        alternative_available: false,
        alternative_description: ""
      }
    ],

    intolerable_consequences: [
      {
        id: "cons_001",
        description: "es. 'perdita del controllo del processo con rischio per la sicurezza degli operatori'",
        compromise_paths: [
          {
            id: "path_001",
            description: "",
            required_capabilities: ["segmentazione", "monitoraggio", "risposta"],
            essential_capabilities: ["segmentazione"],
            _comment: "essential_capabilities ⊆ required_capabilities; genera le soglie non compensabili (§3.6)"
          }
        ]
      }
    ],

    capability_assessment: [
      {
        domain_id: "segmentazione",
        current_profile: {
          consolidamento:        { level: 3, evidentiary_strength: "corroborata", evidence_notes: "" },
          estensione:            { level: 2, evidentiary_strength: "parziale",    evidence_notes: "", excluded_essential_components: [] },
          efficacia:             { level: 3, evidentiary_strength: "corroborata", evidence_notes: "" },
          prestazione_osservata: { level: 2, evidentiary_strength: "non_determinabile", evidence_notes: "" }
        },
        target_profile: {
          _comment: "Derivato da intolerable_consequences.compromise_paths.required_capabilities; livello per dimensione motivato manualmente",
          consolidamento:        { level: 4, rationale: "" },
          estensione:            { level: 5, rationale: "es. componente essenziale X deve essere incluso" },
          efficacia:             { level: 4, rationale: "" },
          prestazione_osservata: { level: 3, rationale: "" }
        },
        is_essential: true,
        non_compensable_threshold: {
          dimension: "estensione",
          min_level: 5,
          rationale: "collega conseguenza + percorso + capacità (§3.6)"
        }
      }
    ]
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
