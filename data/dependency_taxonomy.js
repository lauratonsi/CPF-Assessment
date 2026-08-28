/* Step 3 — tassonomia di riferimento per la mappatura delle dipendenze.
   Riferimento: §3.4 di Cap. 3 (Rinaldi/Peerenboom/Kelly 2001; Argonne 2015).
   Popola window.CPF.data.dependencyTaxonomy */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.dependencyTaxonomy = {
    classes: [
      { id: "fisica",     label: "Fisica",     thesis_ref: "§3.4", description: "Trasferimento di beni materiali, energia o servizi necessari al funzionamento." },
      { id: "cyber",      label: "Cyber",      thesis_ref: "§3.4", description: "Trasmissione di dati, informazioni e segnali mediante collegamenti elettronici." },
      { id: "logica",     label: "Logica",     thesis_ref: "§3.4", description: "Vincoli normativi, decisionali, organizzativi o finanziari." },
      { id: "geografica", label: "Geografica", thesis_ref: "§3.4", description: "Esposizione simultanea di asset distinti a un medesimo evento locale (notazione E → {A, B})." }
    ],
    positions: [
      { id: "upstream",   label: "A monte",   description: "Beni, servizi, informazioni forniti alla funzione da elementi esterni." },
      { id: "internal",   label: "Interna",   description: "Relazioni tra operazioni, funzioni e asset nel perimetro organizzativo." },
      { id: "downstream", label: "A valle",   description: "Conseguenze della degradazione dell'output su utenti, servizi, settori dipendenti." }
    ],
    coupling: [
      { id: "tight", label: "Stretto (tight coupling)", description: "Effetti rapidi, margini temporali/funzionali ridotti." },
      { id: "loose", label: "Debole (loose coupling)",  description: "Maggiore flessibilità/intervallo prima che la perturbazione comprometta il risultato." }
    ],
    failure_types: [
      { id: "cascading",    label: "A cascata (cascading failure)",      notation: "A → B → C" },
      { id: "escalating",   label: "Per aggravamento (escalating failure)" },
      { id: "common_cause", label: "Da causa comune (common cause failure)", notation: "E → {A, B}" }
    ]
  };
})(window);
