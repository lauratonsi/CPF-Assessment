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
        what: "Grado di istituzionalizzazione della pratica: cessa di dipendere dall'iniziativa dei singoli e si radica in procedure, risorse, responsabilità, competenze e verifiche (C2M2 — management progression, §3.5).",
        levels: [
          { value: 1, label: "Assente o reattivo",                    descriptor: "La pratica non è implementata, o viene attivata solo dopo un problema, senza responsabilità o risorse definite." },
          { value: 2, label: "Informale / parziale",                  descriptor: "Attività occasionali, non uniformi, dipendenti dalle persone e dalle circostanze." },
          { value: 3, label: "Definito e documentato",                descriptor: "Compiti, responsabilità e procedure sono descritti, ma l'applicazione non è ancora uniforme." },
          { value: 4, label: "Applicato con continuità e verificato", descriptor: "La pratica è eseguita stabilmente nel perimetro pertinente, con evidenze della sua attuazione." },
          { value: 5, label: "Misurato e migliorato",                 descriptor: "Prestazioni e risultati sono monitorati e usati per modificare processi, controlli e risorse." }
        ],
        // Matrice di corroborazione (§3.5): tipi di evidenza pertinenti alla proprietà da dimostrare.
        evidence: {
          supports: "formalizzazione, attuazione e continuità nel tempo della pratica",
          types: [
            "formalizzazione — policy, procedure, attribuzioni di responsabilità, approvazioni organizzative",
            "attuazione — configurazioni, registri, workflow, ticket, inventari tecnici, controlli implementati",
            "continuità nel tempo — log, cronologie, audit periodici, aggiornamenti, registrazioni di manutenzione"
          ]
        }
      },
      estensione: {
        label: "Estensione",
        thesis_ref: "§3.5, §3.6",
        what: "Quota del perimetro operativo pertinente alla quale la capacità è effettivamente applicata. Il perimetro deriva dalla funzione, dallo scenario e dalle dipendenze (§3.4-3.5), non dall'intero inventario. La sola quantità di elementi coperti non basta se restano esclusi componenti, flussi o dipendenze necessari al percorso di compromissione o alla propagazione della conseguenza.",
        levels: [
          { value: 1, label: "Limitata",       descriptor: "La capacità copre solo una minima parte del perimetro pertinente." },
          { value: 2, label: "Parziale",       descriptor: "Copertura significativa ma con esclusioni non motivate." },
          { value: 3, label: "Prevalente",     descriptor: "Copertura ampia; le esclusioni residue sono note e motivate." },
          { value: 4, label: "Quasi completa", descriptor: "Copertura pressoché totale del perimetro pertinente, esclusioni residue documentate come non essenziali." },
          { value: 5, label: "Completa",       descriptor: "L'intero perimetro pertinente, comprese le componenti funzionalmente essenziali, è coperto." }
        ],
        note: "Le esclusioni che interessano componenti funzionalmente essenziali vanno sempre rappresentate separatamente (§3.6): non riassorbire nel punteggio.",
        evidence: {
          supports: "confronto tra il perimetro pertinente e quello effettivamente coperto",
          types: [
            "inventari, mappe di rete, configurazioni distribuite",
            "registri delle identità e degli accessi, elenchi dei flussi monitorati",
            "elenco dei siti inclusi e delle dipendenze sottoposte alle misure considerate"
          ]
        }
      },
      efficacia: {
        label: "Efficacia",
        thesis_ref: "§3.5, §3.6",
        what: "Adeguatezza della capacità rispetto al risultato da preservare e alla conseguenza da evitare, tenuto conto dei tempi di propagazione e dei vincoli operativi e di safety. È la «validità» del controllo (idoneità allo scopo), distinta dalla sua «correttezza» (conformità dell'implementazione) — §3.7.",
        levels: [
          { value: 1, label: "Non dimostrata",              descriptor: "Non vi è motivazione tecnica che la capacità sia idonea rispetto al percorso di compromissione." },
          { value: 2, label: "Plausibile",                  descriptor: "Idoneità argomentata ma non verificata rispetto allo scenario." },
          { value: 3, label: "Verificata nello scenario",   descriptor: "L'idoneità è stata verificata rispetto al percorso di compromissione considerato." },
          { value: 4, label: "Verificata nei vincoli operativi", descriptor: "L'idoneità tiene conto anche dei vincoli operativi e di safety del processo." },
          { value: 5, label: "Verificata end-to-end",       descriptor: "L'idoneità copre l'intero percorso, incluse le condizioni degradate e il raggiungimento dello stato sicuro." }
        ],
        evidence: {
          supports: "idoneità della misura a interrompere, limitare o rendere non praticabile il percorso senza effetti incompatibili con il processo",
          types: [
            "analisi tecniche e di architettura, requisiti prestazionali motivati",
            "test e simulazioni riferiti allo scenario",
            "riscontri di incidenti reali pertinenti"
          ]
        }
      },
      prestazione_osservata: {
        label: "Prestazione osservata",
        thesis_ref: "§3.5, §3.6",
        what: "Comportamento effettivamente rilevato in determinate condizioni. Può corroborare, ridimensionare o contraddire il giudizio di efficacia attesa, ma una singola prova non dimostra la stabilità nel tempo né l'applicazione all'intero perimetro. Il suo valore dipende dalla rappresentatività dello scenario, dalla porzione di perimetro coinvolta, dalle condizioni della prova, dall'attualità e dalla ripetizione dei riscontri.",
        levels: [
          { value: 1, label: "Assente",                  descriptor: "Nessun test, esercitazione o dato operativo disponibile." },
          { value: 2, label: "Osservazione limitata",    descriptor: "Riscontri isolati, non recenti o non rappresentativi dello scenario." },
          { value: 3, label: "Test pertinente",          descriptor: "Almeno un test o esercitazione recente e pertinente allo scenario." },
          { value: 4, label: "Risultati recenti e coerenti", descriptor: "Più riscontri recenti, coerenti tra loro." },
          { value: 5, label: "Risultati ripetuti e aggiornati", descriptor: "Riscontri ripetuti nel tempo, aggiornati, che coprono condizioni operative e degradate." }
        ],
        evidence: {
          supports: "il comportamento realmente osservato, con la sua rappresentatività e attualità",
          types: [
            "test, esercitazioni, simulazioni (con data, scenario e perimetro coinvolto)",
            "incidenti reali, near-miss, dati operativi e metriche",
            "riscontri ripetuti nel tempo che coprano anche condizioni degradate"
          ]
        }
      }
    },

    /* Matrice di corroborazione — regola generale (§3.5).
       Il valore corroborativo di un'evidenza dipende dalla proprietà che deve
       dimostrare: una policy attesta la formalizzazione, non l'attuazione; una
       configurazione l'implementazione, non l'efficacia; un log un comportamento
       osservato, non la sua continuità; un'esercitazione la risposta simulata,
       non la tenuta in un incidente reale. La stessa evidenza può sostenere più
       giudizi solo se pertinente a requisiti differenti, e va verificata
       separatamente per ciascuna proprietà. */
    corroboration_rule: "La pertinenza dell'evidenza dipende dalla sua riferibilità alla capacità, alla funzione cyber-fisica, al perimetro e — quando rilevante — allo scenario e all'intervallo temporale. Una configurazione osservata su un singolo asset non prova la copertura dell'intero perimetro; un test in condizioni ordinarie non prova la prestazione nello scenario ad alta conseguenza. Un'evidenza valida alla raccolta può non rappresentare più lo stato corrente: nei contesti a modifiche frequenti l'attualità della fonte va verificata.",

    /* Criticità della funzione (§3.2, criteri CER artt. 6-7).
       Scala ordinale, non cardinale — stessa disciplina delle quattro dimensioni.
       Si raccoglie nello Step 2 (definizione della funzione), non prima.

       OPERAZIONALIZZAZIONE DELLO STRUMENTO — non della tesi: la tesi non
       definisce una scala 1-4 e precisa che «la criticità orienta il profilo
       obiettivo, ma non ne determina automaticamente i livelli» (§3.2). Qui i
       quattro gradini servono solo come ingresso ordinale alla priorità
       sostanziale (§3.6: f(criticità, essenzialità, natura/ampiezza del divario)),
       resa da CPF.domainPriority come regola, non come somma. La criticità NON
       entra nella derivazione del profilo obiettivo, che resta manuale e motivato. */
    function_criticality: {
      label: "Criticità della funzione",
      thesis_ref: "§3.2, §3.6",
      operationalization: "Scala 1-4 introdotta dallo strumento come indicatore ordinale d'ingresso alla priorità; la tesi elenca i criteri (CER artt. 6-7) senza fissare una scala.",
      note: "Determinata dalle conseguenze della perdita, degradazione o manipolazione della funzione, alla luce dei criteri CER: utenti e settori dipendenti, intensità e durata degli impatti, estensione geografica, disponibilità di alternative. Al livello funzionale vanno integrati i vincoli del processo, le condizioni di safety, le protezioni indipendenti, le dipendenze operative e la rapidità di propagazione (§3.2).",
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
