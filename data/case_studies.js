/* Casi di riferimento — i sette casi del Cap. 5 (§5.4.1-§5.4.7) più la
   sintesi comparativa del §5.5, riletti come esempi del modello del Cap. 3.

   Non è un editor: sono dati statici, consultabili in pages/casi-studio.html.
   Ogni caso porta un breve riassunto (parafrasato dal testo, non copiato) e
   uno o più "model_links" — il punto preciso del modello che il caso
   illustra, con riferimento §. Alcuni casi (Estonia, in parte il Baltico)
   restano fuori dall'unità di analisi del modello: è un'informazione utile
   quanto un esempio positivo, non un'omissione.

   Fonte: TESI_LAURA TONSI, Cap. 5. Se il testo della tesi cambia, questo
   file va riallineato — non è generato automaticamente da essa.

   Popola window.CPF.data.caseStudies */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.caseStudies = [
    {
      id: "estonia-2007",
      title: "Estonia 2007",
      subtitle: "«Web War I»",
      thesis_ref: "§5.4.1",
      year: "2007",
      sector: "Pubblica amministrazione, banche, media",
      taxonomy_note: "Non applicabile alla tassonomia di Assante e Lee (§5.5): indisponibilità di servizi digitali, non di un processo industriale.",
      summary: "Una campagna di DDoS contro siti istituzionali, bancari e mediatici — innescata dalla rimozione di un monumento sovietico da Tallinn — interruppe per settimane servizi digitali, inclusi sportelli bancomat e sistemi di pagamento, senza alcun danno fisico. L'attribuzione allo Stato russo non fu mai accertata; le richieste estoni di attivazione della difesa collettiva NATO (artt. 4 e 5) non ebbero seguito.",
      model_links: [
        {
          ref: "§3.2",
          concept: "Il confine dell'unità di analisi",
          text: "Il modello valuta la funzione cyber-fisica — un'attività in cui software e processo fisico sono accoppiati. Estonia mostra l'altro lato del confine: un evento di rilevanza nazionale senza alcun processo fisico governato. Vi rientra solo nella misura in cui un servizio digitale colpito sostenga, a monte, una funzione cyber-fisica (es. i sistemi di pagamento su cui si appoggia una filiera fisica) — non l'ente colpito in quanto tale."
        }
      ]
    },
    {
      id: "baltico-sottomarino",
      title: "Infrastrutture sottomarine del Baltico",
      subtitle: "Nord Stream, Newnew Polar Bear, Yi Peng 3, Eagle S, Fitburg",
      thesis_ref: "§5.4.2",
      year: "2022–2025",
      sector: "Energia (gasdotti, interconnettori elettrici), telecomunicazioni",
      taxonomy_note: "Non applicabile alla tassonomia di Assante e Lee (§5.5): danneggiamento fisico esterno, non manipolazione di un processo di controllo.",
      summary: "Una serie di danneggiamenti a cavi e gasdotti sottomarini mostra che lo stesso tipo di danno fisico produce esiti opposti secondo la capacità di assorbimento: le reti di telecomunicazione hanno spesso potuto reinstradare il traffico (Fitburg, dic. 2025: servizio mantenuto nonostante il danno accertato), mentre gli interconnettori elettrici, con vincoli tecnici più rigidi, hanno subito interruzioni più lunghe. Origine e attribuzione restano quasi ovunque incerte, salvo il sabotaggio esplosivo di Nord Stream.",
      model_links: [
        {
          ref: "§3.4",
          concept: "Accoppiamento e alternativa realmente disponibile",
          text: "Stesso tipo di evento, esito diverso secondo che un'alternativa fosse davvero attivabile in tempo utile, non solo dichiarata — è il caso già richiamato nella legenda dello Step 3 (campo «alternativa disponibile», accoppiamento tight/loose)."
        }
      ]
    },
    {
      id: "viasat-ka-sat",
      title: "Viasat KA-SAT",
      subtitle: "Una dipendenza digitale condivisa, non un attacco OT",
      thesis_ref: "§5.4.3",
      year: "2022",
      sector: "Telecomunicazioni satellitari (dual-use civile/militare/industriale)",
      taxonomy_note: "Non applicabile alla tassonomia di Assante e Lee (§5.5): perdita del canale esterno di comunicazione/supervisione, senza manipolazione diretta delle turbine.",
      summary: "Poche ore prima dell'invasione russa dell'Ucraina, un attacco alla rete satellitare KA-SAT sovrascrisse i dati di configurazione di migliaia di modem, interrompendo il servizio in Ucraina e in altri Paesi europei — incluso il collegamento usato da circa 5.800 turbine eoliche tedesche per il monitoraggio remoto. Gli impianti continuarono a produrre energia: l'effetto fu la perdita di supervisione, non la manipolazione del processo. Attribuito pubblicamente alla Russia il 10 maggio 2022 da UE, Stati Uniti e Regno Unito.",
      model_links: [
        {
          ref: "§3.4 / §3.2",
          concept: "Dipendenza esterna al processo e al suo sistema di controllo",
          text: "La continuità di una funzione cyber-fisica può dipendere da una componente esterna al processo industriale — qui una dipendenza cyber a monte, condivisa tra settori. Il perimetro della funzione deve includerla anche quando non fa parte dell'OT in senso stretto."
        }
      ]
    },
    {
      id: "erris",
      title: "Erris",
      subtitle: "Vulnerabilità opportunistica, esito deciso dalla capacità compensativa",
      thesis_ref: "§5.4.4",
      year: "2023",
      sector: "Servizio idrico (piccolo schema comunitario)",
      taxonomy_note: "Parziale, rispetto al controllore locale (§5.5): sostituzione della logica e modifica della configurazione documentate, non i singoli comandi impartiti al processo.",
      summary: "Lo stesso attore (CyberAv3ngers, ricondotto all'IRGC iraniano) compromise controllori PLC Unitronics esposti su Internet in una campagna globale indifferente al bersaglio, colpendo sia un piccolo sistema idrico rurale in Irlanda sia la Municipal Water Authority di Aliquippa (Pennsylvania). Ad Aliquippa una procedura manuale di riserva permise di isolare il controllore senza interrompere l'erogazione; a Erris, priva di un'alternativa equivalente, il servizio idrico si fermò per circa 160 nuclei familiari per due giorni.",
      model_links: [
        {
          ref: "§3.6",
          concept: "Capacità essenziale e soglia non compensabile",
          text: "Stessa vulnerabilità, stesso vettore: l'esito dipende dalla disponibilità reale di una capacità alternativa (qui una procedura manuale), non dalla criticità dichiarata dell'impianto. È l'anello debole del §3.6 osservato in pratica, e la ragione per cui una soglia non compensabile non si assorbe in una media."
        }
      ]
    },
    {
      id: "norsk-hydro",
      title: "Norsk Hydro",
      subtitle: "Sabotaggio OT o incidente IT con effetti operativi?",
      thesis_ref: "§5.4.5",
      year: "2019",
      sector: "Metallurgia (alluminio)",
      taxonomy_note: "Non applicabile alla tassonomia di Assante e Lee (§5.5): compromissione dei sistemi IT di supporto, non del processo OT.",
      summary: "Il ransomware LockerGoga cifrò i sistemi IT che supportavano i processi industriali del gruppo, costringendo alcuni impianti a passare a procedure manuali e fermandone altri, con un impatto stimato dall'azienda tra 800 milioni e 1 miliardo di corone norvegesi. I sistemi di controllo industriale non furono mai colpiti direttamente: l'arresto derivò dalla perdita dei servizi IT di supporto, non da una manipolazione OT — nonostante il caso sia stato spesso presentato come un sabotaggio OT (fenomeno di mischaracterization).",
      model_links: [
        {
          ref: "§3.2",
          concept: "Il perimetro deve includere l'IT di supporto",
          text: "Attribuire il divario al dominio sbagliato (OT invece di IT) sposta male le priorità di intervento. Lo stesso avvertimento compare nell'hint sul campo «Perimetro osservabile» dello Step 2."
        }
      ]
    },
    {
      id: "lvivteploenergo",
      title: "Lvivteploenergo",
      subtitle: "Manipolazione diretta e confermata di un processo OT",
      thesis_ref: "§5.4.6",
      year: "2024",
      sector: "Teleriscaldamento",
      taxonomy_note: "Applicabile per intero alla tassonomia di Assante e Lee (§5.5): Loss, Denial, Manipulation of Control e Manipulation of View documentati insieme.",
      summary: "Con FrostyGoop — il primo malware noto progettato per il protocollo Modbus TCP — gli attaccanti alterarono direttamente i registri dei controllori della rete di teleriscaldamento di Leopoli, forzando un downgrade del firmware che eliminò telemetria e monitoraggio e falsificando le misurazioni restituite agli operatori. L'obiettivo non era distruggere l'hardware ma degradare il processo termico: la fornitura di calore per oltre 600 edifici (circa 100.000 persone) si interruppe per quasi due giorni, con temperature sotto lo zero. È il caso con la documentazione forense più dettagliata di manipolazione diretta del processo tra quelli esaminati.",
      model_links: [
        {
          ref: "§3.6",
          concept: "Soglia essenziale effettivamente superata",
          text: "Perdita di monitoraggio, misurazioni falsificate, comandi non autorizzati e interruzione del servizio insieme: con Stuxnet, l'unico caso esaminato in cui tutte queste dimensioni ricorrono simultaneamente — la controparte reale di un divario essenziale non risolto."
        },
        {
          ref: "§3.4",
          concept: "Segmentazione insufficiente come conduit mancato",
          text: "La compromissione risalì mesi prima all'accesso a un router perimetrale esposto, poi estesosi al dominio OT per l'insufficiente segmentazione tra router, server di gestione e controllori — il conduit del §1.3.2 che non ha contenuto la propagazione."
        }
      ]
    },
    {
      id: "sandworm-apt44",
      title: "Sandworm / APT44",
      subtitle: "Un attore persistente, non un evento isolato",
      thesis_ref: "§5.4.7",
      year: "2015–2024",
      sector: "Energia, servizio idrico, teleriscaldamento (~20 operatori, 10 regioni ucraine)",
      taxonomy_note: null,
      summary: "A differenza degli altri casi, qui l'unità di osservazione non è un singolo evento ma l'azione continuativa di un gruppo (unità 74455 del GRU) attivo dall'attacco alla rete elettrica ucraina del 2015 a Industroyer2 (2022) fino a una campagna più recente contro operatori energetici, idrici e termici. L'accesso è passato sistematicamente da compromissioni della supply chain e dai privilegi concessi a fornitori terzi, sfruttando la stessa assenza di segmentazione tra Internet, reti dei fornitori e ambienti ICS osservata a Lvivteploenergo.",
      model_links: [
        {
          ref: "§3.4",
          concept: "La compromissione nasce fuori dal perimetro dell'operatore",
          text: "La funzione cyber-fisica viene raggiunta non per un cedimento diretto, ma attraverso l'ecosistema di dipendenze — fornitori, supply chain — che la sostiene: esattamente le dipendenze a monte che lo Step 3 chiede di mappare, non di escludere perché «esterne»."
        }
      ]
    }
  ];

  /* Sintesi del §5.5, usata come lead della pagina: la tassonomia di Assante
     e Lee classifica l'effetto tecnico sul processo; il modello del Cap. 3
     valuta le capacità necessarie ad assorbirlo e preservare la funzione. */
  root.CPF.data.caseStudiesSynthesis = {
    thesis_ref: "§5.5",
    text: "Assante e Lee classificano ciò che accade al processo; il modello di questo strumento valuta le capacità necessarie ad assorbire l'effetto e preservare la funzione che da quel processo dipende. Per questo alcuni casi — Estonia, il Baltico, KA-SAT, Norsk Hydro — restano fuori dalla tassonomia tecnica pur essendo istruttivi per il modello: la loro assenza di manipolazione diretta del processo è essa stessa un'informazione."
  };
})(window);
