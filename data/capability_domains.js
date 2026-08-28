/* Step 4 — i domini di capacità fissi. Derivati da §2.9 di Cap. 2.
   Popola window.CPF.data.capabilityDomains */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.capabilityDomains = {
    domains: [
      {
        id: "conoscenza",
        label: "Conoscenza di asset, funzioni e dipendenze",
        thesis_ref: "§2.9.2, §3.4",
        description: "Mappatura di asset IT/OT, funzioni, componenti software, flussi e dipendenze (upstream/internal/downstream) rilevanti per la funzione cyber-fisica."
      },
      {
        id: "segmentazione",
        label: "Segmentazione e controllo degli accessi",
        thesis_ref: "§2.9.3",
        description: "Purdue Model, zone e conduit, DMZ industriale, gestione accessi remoti e privilegiati."
      },
      {
        id: "vulnerabilita",
        label: "Gestione delle vulnerabilità e delle modifiche",
        thesis_ref: "§2.9.3",
        description: "Patch management, change management, misure compensative per sistemi legacy, SBOM."
      },
      {
        id: "monitoraggio",
        label: "Monitoraggio e rilevamento",
        thesis_ref: "§2.9.4",
        description: "Logging, correlazione, rilevamento anomalie IT/OT, telemetria di processo."
      },
      {
        id: "risposta",
        label: "Risposta agli incidenti",
        thesis_ref: "§2.9.4",
        description: "Rilevamento, contenimento, coordinamento IT/OT/safety, notifica alle autorità."
      },
      {
        id: "continuita",
        label: "Continuità operativa e ripristino",
        thesis_ref: "§2.9.4, §3.4",
        description: "Modalità degradate, backup, ripristino verso lo stato sicuro, gestione delle alternative e dei tempi di attivazione."
      },
      {
        id: "filiera",
        label: "Sicurezza della filiera e dei fornitori",
        thesis_ref: "§2.8, §3.4",
        description: "Qualificazione fornitori, contrattualizzazione requisiti, monitoraggio dipendenze upstream esterne.",
        optional: true
      }
    ]
  };
})(window);
