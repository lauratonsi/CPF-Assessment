/* Step 4 — scale ordinali per le quattro dimensioni + forza probatoria.
   Riferimento: §3.5-3.6 di Cap. 3. Popola window.CPF.data.scales */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.scales = {
    dimensions: {
      consolidamento: {
        label: "Consolidamento",
        thesis_ref: "§3.5, §3.6",
        levels: [
          { value: 1, label: "Assente o reattivo",                    descriptor: "La pratica non è implementata, o viene attivata solo dopo un problema, senza responsabilità o risorse definite." },
          { value: 2, label: "Informale / parziale",                  descriptor: "Attività occasionali, non uniformi, dipendenti dalle persone e dalle circostanze." },
          { value: 3, label: "Definito e documentato",                descriptor: "Compiti, responsabilità e procedure sono descritti, ma l'applicazione non è ancora uniforme." },
          { value: 4, label: "Applicato con continuità e verificato", descriptor: "La pratica è eseguita stabilmente nel perimetro pertinente, con evidenze della sua attuazione." },
          { value: 5, label: "Misurato e migliorato",                 descriptor: "Prestazioni e risultati sono monitorati e usati per modificare processi, controlli e risorse." }
        ]
      },
      estensione: {
        label: "Estensione",
        thesis_ref: "§3.6",
        levels: [
          { value: 1, label: "Limitata",       descriptor: "La capacità copre solo una minima parte del perimetro pertinente." },
          { value: 2, label: "Parziale",       descriptor: "Copertura significativa ma con esclusioni non motivate." },
          { value: 3, label: "Prevalente",     descriptor: "Copertura ampia; le esclusioni residue sono note e motivate." },
          { value: 4, label: "Quasi completa", descriptor: "Copertura pressoché totale del perimetro pertinente, esclusioni residue documentate come non essenziali." },
          { value: 5, label: "Completa",       descriptor: "L'intero perimetro pertinente, comprese le componenti funzionalmente essenziali, è coperto." }
        ],
        note: "Le esclusioni che interessano componenti funzionalmente essenziali vanno sempre rappresentate separatamente (§3.6): non riassorbire nel punteggio."
      },
      efficacia: {
        label: "Efficacia",
        thesis_ref: "§3.6",
        levels: [
          { value: 1, label: "Non dimostrata",              descriptor: "Non vi è motivazione tecnica che la capacità sia idonea rispetto al percorso di compromissione." },
          { value: 2, label: "Plausibile",                  descriptor: "Idoneità argomentata ma non verificata rispetto allo scenario." },
          { value: 3, label: "Verificata nello scenario",   descriptor: "L'idoneità è stata verificata rispetto al percorso di compromissione considerato." },
          { value: 4, label: "Verificata nei vincoli operativi", descriptor: "L'idoneità tiene conto anche dei vincoli operativi e di safety del processo." },
          { value: 5, label: "Verificata end-to-end",       descriptor: "L'idoneità copre l'intero percorso, incluse le condizioni degradate e il raggiungimento dello stato sicuro." }
        ]
      },
      prestazione_osservata: {
        label: "Prestazione osservata",
        thesis_ref: "§3.6",
        levels: [
          { value: 1, label: "Assente",                  descriptor: "Nessun test, esercitazione o dato operativo disponibile." },
          { value: 2, label: "Osservazione limitata",    descriptor: "Riscontri isolati, non recenti o non rappresentativi dello scenario." },
          { value: 3, label: "Test pertinente",          descriptor: "Almeno un test o esercitazione recente e pertinente allo scenario." },
          { value: 4, label: "Risultati recenti e coerenti", descriptor: "Più riscontri recenti, coerenti tra loro." },
          { value: 5, label: "Risultati ripetuti e aggiornati", descriptor: "Riscontri ripetuti nel tempo, aggiornati, che coprono condizioni operative e degradate." }
        ]
      }
    },

    /* Criticità della funzione (§3.2, criteri CER artt. 6-7).
       Scala ordinale, non cardinale — stessa disciplina delle quattro dimensioni.
       Si raccoglie nello Step 2 (definizione della funzione), non prima.
       Alimenta la priorità sostanziale in §3.6: f(criticità, essenzialità, gap). */
    function_criticality: {
      label: "Criticità della funzione",
      thesis_ref: "§3.2, §3.6",
      note: "Determinata dalle conseguenze della perdita, degradazione o manipolazione della funzione, alla luce dei criteri CER: utenti e settori dipendenti, intensità e durata degli impatti, estensione geografica, disponibilità di alternative.",
      levels: [
        { value: 1, label: "Bassa",       descriptor: "Pochi utenti dipendenti, nessuna dipendenza intersettoriale rilevante, impatto breve e circoscritto, alternative ampiamente disponibili." },
        { value: 2, label: "Media",       descriptor: "Utenti dipendenti significativi o dipendenze intersettoriali limitate, impatto di durata moderata, alternative parziali." },
        { value: 3, label: "Alta",        descriptor: "Ampio numero di utenti o settori dipendenti, impatto esteso e prolungato, alternative limitate o costose da attivare." },
        { value: 4, label: "Molto alta",  descriptor: "Servizio essenziale senza alternative praticabili nei tempi rilevanti, propagazione intersettoriale ampia, possibili conseguenze su sicurezza pubblica o ambiente." }
      ]
    },

    evidentiary_strength: {
      label: "Forza probatoria",
      thesis_ref: "§3.6",
      values: [
        { id: "corroborata",       label: "Corroborata",              descriptor: "Il livello è sostenuto da evidenze pertinenti, attuali e verificabili." },
        { id: "parziale",          label: "Parzialmente documentata", descriptor: "Evidenze insufficienti a corroborare pienamente il livello dichiarato." },
        { id: "non_determinabile", label: "Non determinabile",        descriptor: "Assenza di evidenze sufficienti; il livello non può essere attribuito con affidabilità." }
      ],
      rule: "L'incertezza NON abbassa automaticamente il livello (§3.6): un livello 'non_determinabile' blocca l'attribuzione del punteggio e genera una priorità di verifica, non una priorità di intervento diretto."
    }
  };
})(window);
