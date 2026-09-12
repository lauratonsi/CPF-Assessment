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
    // Proprietà distinta dall'accoppiamento (§3.4): "le due proprietà rimangono
    // distinte. L'accoppiamento indica quanto rapidamente il funzionamento di un
    // elemento risenta della variazione dell'altro, mentre la capacità di
    // risposta esprime la possibilità di assorbirne, ritardarne o compensarne
    // gli effetti." Un accoppiamento stretto può essere sostenibile con
    // capacità di risposta adattiva; uno debole può diventare critico se rigida.
    response_capacity: [
      { id: "adattiva", label: "Adattiva", description: "Dispone di scorte, ridondanze, alternative o procedure sostitutive." },
      { id: "rigida",   label: "Rigida",   description: "Vincoli tecnici, organizzativi o regolatori ne limitano la riconfigurazione." }
    ],
    // Dominio nel quale la dipendenza si manifesta inizialmente, distinto dalla
    // posizione (Setola e Theocharidou 2016, richiamato in §3.4): la posizione
    // indica DOVE la relazione si colloca rispetto alla funzione, il livello
    // indica IN QUALE dominio agisce e attraverso quali passaggi produce
    // conseguenze ulteriori (es. una dipendenza cyber a monte che, perdendo i
    // segnali di supervisione, compromette il livello fisico e richiede
    // procedure organizzative sostitutive).
    levels: [
      { id: "fisico",        label: "Fisico" },
      { id: "cyber",         label: "Cyber" },
      { id: "organizzativo", label: "Organizzativo" }
    ],
    failure_types: [
      { id: "cascading",    label: "A cascata (cascading failure)",      notation: "A → B → C" },
      { id: "escalating",   label: "Per aggravamento (escalating failure)" },
      { id: "common_cause", label: "Da causa comune (common cause failure)", notation: "E → {A, B}" }
    ]
  };
})(window);
