/* Legenda propedeutica allo Step 3 (editor dipendenze).
   Fonte: tesi §3.4 "Unità di analisi e criticità delle dipendenze".
   NON è un editor: è il testo che spiega la tassonomia prima che l'utente compili.
   La tassonomia macchina-leggibile (id, enum) resta in data/dependency_taxonomy.js.

   Popola window.CPF.data.dependencyReference */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.dependencyReference = {

    intro: {
      title: "La notazione B → A",
      text: "Assumendo A come elemento dipendente e B come elemento che fornisce una risorsa, un'informazione o una condizione, la notazione B → A indica che A dipende da una risorsa o funzione fornita da B. La direzione della freccia rappresenta la direzione dell'influenza sulla funzione dipendente e dell'eventuale propagazione della perturbazione, ossia il verso nel quale la perdita, la degradazione o la manipolazione della risorsa può incidere sull'elemento dipendente.",
      thesis_ref: "§3.4",
      source: "Rinaldi, Peerenboom e Kelly (2001); Argonne National Laboratory (2015)"
    },

    classes: {
      title: "Le quattro classi di dipendenza",
      subtitle: "Non mutuamente esclusive: una relazione può appartenere a più classi contemporaneamente.",
      items: [
        {
          id: "fisica",
          label: "Fisica",
          definition: "Trasferimento di beni materiali, energia o servizi necessari al funzionamento.",
          example: "Alimentazione elettrica per un impianto industriale; carburante per un generatore di emergenza."
        },
        {
          id: "cyber",
          label: "Cyber",
          definition: "Trasmissione di dati, informazioni e segnali mediante collegamenti elettronici.",
          example: "Segnali di supervisione da un fornitore di servizi di telecomunicazione verso un sistema di controllo."
        },
        {
          id: "logica",
          label: "Logica",
          definition: "Vincoli normativi, decisionali, organizzativi o finanziari.",
          example: "Un obbligo contrattuale o regolatorio che condiziona la disponibilità di una risorsa o il comportamento di un operatore."
        },
        {
          id: "geografica",
          label: "Geografica",
          definition: "Struttura differente dalle altre tre: descrive l'esposizione simultanea di asset distinti a un medesimo evento locale. Non presuppone una relazione reciproca tra gli elementi.",
          notation: "E → {A, B}",
          notation_explanation: "E indica la causa comune che incide su A e B contemporaneamente.",
          example: "Un evento ambientale locale (alluvione, incendio) che colpisce contemporaneamente due infrastrutture collocate nella stessa area, senza che l'una dipenda dall'altra."
        }
      ],
      closing_note: "Le quattro classi devono essere riferite allo specifico meccanismo attraverso il quale la risorsa, l'informazione o la perturbazione incide sulla funzione, evitando di attribuire un'unica etichetta all'intero rapporto tra due organizzazioni o infrastrutture."
    },

    coupling: {
      title: "Il grado di accoppiamento",
      subtitle: "L'appartenenza a una classe identifica la natura della relazione, ma non ne determina automaticamente la rilevanza per la funzione: questa dipende anche dal grado di accoppiamento.",
      items: [
        {
          id: "tight",
          label: "Stretto (tight coupling)",
          definition: "Il funzionamento di A è vincolato alla prestazione di B: la perdita o degradazione di B può produrre effetti rapidi, con margini temporali o funzionali ridotti.",
          implication: "Una relazione strettamente accoppiata può risultare sostenibile solo in presenza di alternative efficaci."
        },
        {
          id: "loose",
          label: "Debole (loose coupling)",
          definition: "La relazione consente un intervallo o una flessibilità maggiore prima che la perturbazione comprometta il risultato operativo.",
          implication: "Può comunque diventare critica quando i margini disponibili si esauriscono o le misure sostitutive non sono attivabili."
        }
      ],
      dynamic_note: "La rilevanza della dipendenza varia inoltre con lo stato operativo: una risorsa non determinante durante il funzionamento ordinario può diventare essenziale in condizioni di stress, durante un'emergenza o nella fase di riparazione e ripristino.",
      complexity_note: {
        title: "Accoppiamento e complessità (Normal Accident Theory)",
        text: "Nei sistemi SCADA, dove reti di comunicazione, sensori, attuatori, operatori e processi fisici concorrono al controllo della funzione, la combinazione tra interazioni complesse e accoppiamento stretto può consentire a guasti tecnici, errori software o azioni operative circoscritte di concatenarsi e propagarsi oltre il componente d'origine. L'accoppiamento descrive la rapidità e la rigidità con cui la perturbazione attraversa la catena di controllo; la complessità riguarda le retroazioni e le interazioni non immediatamente visibili che rendono difficile anticiparne la sequenza.",
        example: "Il blackout nordamericano del 2003: il malfunzionamento del sistema di allarme e la perdita di consapevolezza operativa interagirono con errori nella stima dello stato della rete, distacchi delle linee e sovraccarichi, in una finestra temporale troppo breve per riconoscere e contenere la perturbazione prima che raggiungesse la funzione controllata.",
        thesis_ref: "§3.4, Lewis (2020)"
      }
    },

    positions: {
      title: "La posizione nella catena funzionale",
      subtitle: "Assumendo A come funzione centrale, la sequenza B → A → C distingue tre posizioni.",
      items: [
        {
          id: "upstream",
          label: "A monte (upstream)",
          definition: "Beni, servizi e informazioni forniti alla funzione da elementi esterni e necessari al suo funzionamento.",
          model_role: "Il modello non attribuisce all'organizzazione la resilienza dell'infrastruttura esterna, ma valuta le capacità interne di identificare, monitorare, contrattualizzare e prepararsi all'indisponibilità della dipendenza."
        },
        {
          id: "internal",
          label: "Interna (internal)",
          definition: "Relazioni tra operazioni, funzioni e asset ricadenti nel perimetro organizzativo.",
          model_role: "Rientra direttamente nella valutazione delle capacità dell'organizzazione."
        },
        {
          id: "downstream",
          label: "A valle (downstream)",
          definition: "Conseguenze che la degradazione delle risorse o dei servizi prodotti dalla funzione può determinare su consumatori e soggetti dipendenti.",
          model_role: "Concorre a determinare la criticità della funzione e l'ampiezza delle conseguenze, rendendo visibili utenti, servizi e settori esposti."
        }
      ],
      important_distinction: "La posizione non va confusa con il livello sul quale la dipendenza agisce: la posizione indica dove la relazione si colloca rispetto alla funzione, il livello individua il dominio (fisico, cyber, organizzativo) nel quale si manifesta inizialmente e gli eventuali passaggi attraverso cui produce conseguenze ulteriori (Setola e Theocharidou 2016)."
    },

    failure_types: {
      title: "Come si propaga una perturbazione",
      items: [
        {
          id: "cascading",
          label: "A cascata (cascading failure)",
          notation: "A → B → C",
          definition: "Il malfunzionamento o l'interruzione si trasferisce a una seconda infrastruttura e può propagarsi ulteriormente attraverso dipendenze successive.",
          caveat: "La sequenza può includere ramificazioni, dipendenze indirette e circuiti di retroazione, non una mera trasmissione lineare."
        },
        {
          id: "escalating",
          label: "Per aggravamento (escalating failure)",
          definition: "Il problema originatosi in A aumenta la gravità o la durata di un'interruzione già presente in B, oppure ne ostacola il ripristino, senza esserne la causa iniziale."
        },
        {
          id: "common_cause",
          label: "Da causa comune (common cause failure)",
          notation: "E → {A, B}",
          definition: "Il medesimo evento colpisce contemporaneamente componenti appartenenti a infrastrutture diverse, senza che esista una propagazione diretta dall'una all'altra."
        }
      ]
    },

    temporal_dimension: {
      title: "La dimensione temporale: dependency curves",
      text: "Le curve rappresentano come la capacità operativa dell'elemento dipendente varia dopo la perdita della risorsa, mostrando sia il tempo che precede il primo impatto sia il contributo temporaneo delle misure di mitigazione.",
      model_extension: "Il modello caratterizza, per ogni alternativa di mitigazione: il tempo che intercorre tra la perdita della risorsa e il primo effetto sulla funzione; il tempo necessario per attivare le misure alternative; la durata per la quale queste possono sostenere il processo; il livello di servizio mantenuto in condizioni degradate; il tempo disponibile per condurre il processo verso uno stato sicuro (safe state) e quello necessario per completare il ripristino.",
      key_point: "La disponibilità nominale di un generatore di emergenza, di un collegamento ridondante o di una procedura manuale non è sufficiente a dimostrare l'adeguatezza della mitigazione: l'alternativa deve attivarsi entro il tempo tollerabile, mantenere un livello di servizio coerente con i vincoli operativi e di safety, e sostenere il processo per una durata compatibile con il ripristino — deve inoltre essere valutata rispetto alle proprie dipendenze (es. un generatore richiede carburante e manutenzione).",
      thesis_ref: "§3.4, Argonne National Laboratory (2015)"
    },

    empirical_grounding: {
      title: "Perché questa tassonomia, e non solo l'intuizione",
      text: "L'indagine di Rydén Sonesson, Johansson e Cedergren sui settori svedesi di energia, trasporti e telecomunicazioni mostra che le interdipendenze sono raramente affrontate con metodi e protocolli espliciti: il 95% delle menzioni esplicite di interdipendenza nei documenti analizzati riguardava dipendenze fisiche, mentre quelle geografiche, logiche ed economiche risultavano molto meno rappresentate. Le dipendenze meno familiari o più distanti dal core business rischiano di rimanere sottorappresentate, non perché meno rilevanti.",
      example: "La tempesta Gudrun (2005) ha causato blackout e interruzioni delle telecomunicazioni protratte per settimane, evidenziando come la governance delle interdipendenze resti prevalentemente reattiva.",
      tool_implication: "Per questo motivo il modello combina un orientamento top-down (dalla conseguenza intollerabile a ritroso) con una verifica bottom-up (dagli asset effettivi): l'esperienza passata da sola non basta a mappare tutte le dipendenze rilevanti.",
      thesis_ref: "§3.4, Rydén Sonesson, Johansson e Cedergren (2021)"
    }
  };
})(window);
