/* Valutazione dimostrativa completa — mostra cosa restituisce la piattaforma
   a fine percorso. La dashboard la usa quando non c'è nessuna valutazione
   attiva. Il regime_profile NON è incluso: la dashboard lo calcola con
   CPF.classifyRegimes(_answers) così resta coerente con il motore.
   Popola window.CPF.data.demoAssessment */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  function cur(level, strength, notes, date, excl) {
    var o = { level: level, evidentiary_strength: strength, evidence_notes: notes || "", evidence_date: date || "" };
    if (excl) o.excluded_essential_components = excl;
    return o;
  }
  function tgt(level, rationale) { return { level: level, rationale: rationale || "" }; }
  function profile(fn) { // fn(dim) -> {level,...}
    return {
      consolidamento: fn("consolidamento"),
      estensione: fn("estensione"),
      efficacia: fn("efficacia"),
      prestazione_osservata: fn("prestazione_osservata")
    };
  }

  root.CPF.data.demoAssessment = {
    assessment_id: "demo",
    _demo: true,
    created_at: "2026-08-20T09:00:00Z",
    updated_at: "2026-08-29T16:30:00Z",
    organization_id: "demo-org",
    organization_name: "AcquaCittà S.p.A.",

    _answers: {
      sector_annex: "annex_i", sector_nis2: "acqua_potabile",
      size: { employees: 600, turnover_meur: 120, balance_meur: 90 },
      cer_sector: "acqua_potabile", cer_formally_designated: true, cer_resilience_plan_adopted: true,
      macchine_roles: ["fabbricante"], macchine_digital_connection: true,
      ai_system: true, ai_channel2: true, ai_annex_iii_use: "infra_critiche", ai_ot_field_data: true
    },

    function: {
      name: "Potabilizzazione — linea A",
      service_description: "Erogazione continua di acqua potabile conforme ai parametri di legge a circa 45.000 abitazioni e a due strutture ospedaliere del bacino nord. La linea A copre da sola il 60% della portata cittadina nelle ore di punta.",
      physical_process: "Filtrazione, dosaggio del disinfettante e controllo di torbidità e cloro residuo su una linea da 320 l/s; il PLC di linea regola pompe di dosaggio e valvole di sezionamento. Stato sicuro = chiusura della linea e commutazione sul serbatoio di compenso.",
      perimeter: "Impianto di trattamento, SCADA di stabilimento, rete di telecontrollo dei serbatoi e delle stazioni di rilancio di proprietà. Fuori perimetro: rete di distribuzione a valle del serbatoio cittadino e fornitura elettrica di media tensione.",
      criticality: 3,
      criticality_rationale: "Ampio numero di utenti dipendenti e utenze sensibili (ospedali); l'interruzione avrebbe impatto esteso e prolungato sul bacino nord. Alternativa parziale (linea B + autobotti) attivabile solo in alcune ore e non nella punta.",
      regimes_relevant_to_this_function: ["nis2", "cer", "macchine", "ai_act"]
    },

    dependencies: [
      {
        id: "dep-1", source: "Fornitura elettrica di media tensione (DSO)", target: "Potabilizzazione — linea A",
        resource_or_condition: "Alimentazione delle pompe di dosaggio e del sistema di filtrazione",
        class: "fisica", position: "upstream", coupling: "tight",
        operational_state_relevant: "normal", failure_type_if_relevant: "cascading",
        activation_time_tolerable: "15 min (UPS di quadro, non le pompe)",
        alternative_available: true, alternative_description: "Gruppo elettrogeno di stabilimento, avvio in 2 min, autonomia 12 h"
      },
      {
        id: "dep-2", source: "Rete di telecontrollo (link radio verso i serbatoi)", target: "Potabilizzazione — linea A",
        resource_or_condition: "Segnali di livello dei serbatoi e comandi alle stazioni di rilancio",
        class: "cyber", position: "upstream", coupling: "tight",
        operational_state_relevant: "stressed", failure_type_if_relevant: "escalating",
        activation_time_tolerable: "", alternative_available: false, alternative_description: ""
      },
      {
        id: "dep-3", source: "Fornitore del sistema di visione ML (accesso di manutenzione remota)", target: "SCADA di stabilimento",
        resource_or_condition: "Aggiornamenti del modello e diagnostica da remoto",
        class: "cyber", position: "upstream", coupling: "loose",
        operational_state_relevant: "repair_restoration", failure_type_if_relevant: "common_cause",
        activation_time_tolerable: "giorni", alternative_available: false, alternative_description: ""
      },
      {
        id: "dep-4", source: "Potabilizzazione — linea A", target: "Serbatoio cittadino e rete di distribuzione (altro gestore)",
        resource_or_condition: "Portata e qualità dell'acqua immessa in rete",
        class: "fisica", position: "downstream", coupling: "tight",
        operational_state_relevant: "normal", failure_type_if_relevant: null,
        activation_time_tolerable: "4 h di riserva nel serbatoio", alternative_available: true,
        alternative_description: "Linea B (60% della portata) + autobotti per le utenze sensibili"
      }
    ],

    intolerable_consequences: [
      {
        id: "cons-1",
        description: "Immissione in rete di acqua non conforme (disinfezione insufficiente) con rischio sanitario per la popolazione servita.",
        compromise_paths: [
          {
            id: "path-1",
            description: "Accesso alla rete OT via manutenzione remota del fornitore → manipolazione dei setpoint di dosaggio sul PLC di linea → il dosaggio scende sotto soglia mentre il monitoraggio riporta valori normali (dati di campo alterati).",
            required_capabilities: ["conoscenza", "segmentazione", "monitoraggio", "risposta"],
            essential_capabilities: ["conoscenza", "segmentazione", "monitoraggio"]
          }
        ]
      },
      {
        id: "cons-2",
        description: "Interruzione prolungata dell'erogazione (oltre la riserva del serbatoio) al bacino nord, incluse le utenze ospedaliere.",
        compromise_paths: [
          {
            id: "path-2",
            description: "Guasto in cascata dall'alimentazione elettrica + indisponibilità del telecontrollo → impossibile commutare sul serbatoio di compenso in tempo → svuotamento della riserva.",
            required_capabilities: ["conoscenza", "continuita", "risposta"],
            essential_capabilities: ["conoscenza", "continuita"]
          }
        ]
      }
    ],

    capability_assessment: [
      {
        domain_id: "conoscenza", is_essential: true,
        non_compensable_threshold: { dimension: "estensione", min_level: 4, rationale: "La mappa di asset e dipendenze deve coprire l'intera catena OT della linea A, compresi gli accessi di manutenzione dei fornitori: è la condizione per riconoscere entrambi i percorsi." },
        target_profile: profile(function (d) { return d === "estensione" ? tgt(5, "copertura completa della catena OT + accessi fornitori") : tgt(4, "definito e verificato"); }),
        current_profile: profile(function (d) {
          if (d === "estensione") return cur(3, "corroborata", "Inventario OT aggiornato 2026, ma gli accessi di manutenzione remota dei fornitori non sono mappati.", "2026-03", ["Accesso VPN fornitore visione ML", "Storico di processo"]);
          if (d === "consolidamento") return cur(4, "corroborata", "Procedura di aggiornamento inventario semestrale, con evidenze.", "2026-06");
          if (d === "efficacia") return cur(3, "parziale", "Verificata sullo scenario di dosaggio, non su quello elettrico/telecontrollo.", "2025-11");
          return cur(2, "non_determinabile", "Nessun test recente della completezza della mappa.");
        })
      },
      {
        domain_id: "segmentazione", is_essential: true,
        non_compensable_threshold: { dimension: "consolidamento", min_level: 4, rationale: "La separazione tra rete IT, DMZ industriale e rete OT di linea deve essere applicata stabilmente e verificata: è ciò che impedisce il pivot dall'accesso del fornitore al PLC di dosaggio." },
        target_profile: profile(function (d) { return d === "consolidamento" ? tgt(5, "misurata e migliorata") : d === "efficacia" ? tgt(5, "verificata end-to-end sul percorso di dosaggio") : tgt(4, ""); }),
        current_profile: profile(function (d) {
          if (d === "consolidamento") return cur(4, "corroborata", "Zone e conduit secondo Purdue, verificati nell'ultimo audit OT.", "2026-02");
          if (d === "efficacia") return cur(2, "corroborata", "L'accesso di manutenzione remota bypassa la DMZ industriale: testato in tabletop, il pivot riesce.", "2025-09");
          if (d === "estensione") return cur(4, "corroborata", "Tutta la linea A; la linea B è fuori dal perimetro di questa valutazione.", "2026-02");
          return cur(3, "parziale", "Un solo test di intrusione, 2024 — da ripetere.", "2024-03");
        })
      },
      {
        domain_id: "monitoraggio", is_essential: true,
        non_compensable_threshold: { dimension: "efficacia", min_level: 4, rationale: "Il rilevamento deve funzionare anche quando i dati di campo sono manipolati (incoerenze tra telemetria di processo e stato fisico): senza questo, il percorso 1 resta invisibile." },
        target_profile: profile(function (d) { return d === "efficacia" ? tgt(5, "correlazione processo↔fisico, rilevamento di dati incoerenti") : tgt(4, ""); }),
        current_profile: profile(function (d) {
          if (d === "efficacia") return cur(2, "non_determinabile", "Non è mai stato verificato se il SOC rileverebbe una manipolazione coordinata dei dati di campo.");
          if (d === "consolidamento") return cur(3, "corroborata", "Logging centralizzato IT+OT, casi d'uso definiti.", "2026-01");
          if (d === "estensione") return cur(3, "parziale", "Copertura OT parziale: il PLC di linea invia log, le RTU di serbatoio no.", "2025-10");
          return cur(2, "non_determinabile", "Nessuna esercitazione di rilevamento su scenario OT.");
        })
      },
      {
        domain_id: "continuita", is_essential: true,
        non_compensable_threshold: { dimension: "efficacia", min_level: 4, rationale: "La commutazione verso lo stato sicuro (chiusura linea + serbatoio di compenso) deve essere verificata nei vincoli operativi reali: è l'unica barriera al percorso 2." },
        target_profile: profile(function (d) { return tgt(4, "modalità degradata verificata nei vincoli di safety"); }),
        current_profile: profile(function (d) {
          if (d === "efficacia") return cur(4, "corroborata", "Prova di commutazione su serbatoio di compenso eseguita e documentata, 2026.", "2026-05");
          if (d === "consolidamento") return cur(4, "corroborata", "Procedura di modalità degradata parte del Piano di Resilienza CER.", "2026-05");
          if (d === "estensione") return cur(4, "corroborata", "Copre alimentazione, telecontrollo e dosaggio.", "2026-05");
          return cur(4, "corroborata", "Due esercitazioni recenti, esiti coerenti.", "2026-04");
        })
      },
      {
        domain_id: "risposta", is_essential: false,
        non_compensable_threshold: null,
        target_profile: profile(function (d) { return tgt(4, "coordinamento IT/OT/safety e notifica alle autorità"); }),
        current_profile: profile(function (d) {
          if (d === "consolidamento") return cur(3, "parziale", "Piano di risposta esiste; il raccordo con la safety di impianto è informale.", "2025-12");
          if (d === "efficacia") return cur(3, "corroborata", "Verificato sullo scenario di dosaggio in tabletop.", "2025-09");
          if (d === "estensione") return cur(3, "corroborata", "Copre IT e OT di linea A.", "2025-12");
          return cur(3, "parziale", "Un'esercitazione congiunta, 2025.", "2025-05");
        })
      }
    ]
  };
})(window);
