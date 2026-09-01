/* Step 1 — tabelle di riferimento per il motore di inferenza multi-regime.
   Dati fissi. Fonti: Cap. 2 della tesi + testo degli atti citati.
   Popola window.CPF.data.regimeRules

   Le REGOLE (precedenza, condizioni) stanno in assets/regime-engine.js.
   Qui stanno solo le LISTE che le regole interrogano. */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.regimeRules = {

    /* ---- NIS2 ---- */
    nis2: {
      thesis_ref: "§2.1.1",
      italian_implementation: "D.Lgs. 138/2024: l'ACN è autorità nazionale competente e punto di contatto unico; i soggetti nel perimetro si registrano sulla piattaforma ACN e ricevono la qualificazione formalmente notificata.",
      lex_specialis_note: "Per reti e sistemi informativi già inclusi nel Perimetro di Sicurezza Nazionale Cibernetica (PSNC), gli obblighi di gestione del rischio e notifica restano disciplinati dal framework del Perimetro ai sensi dell'art. 33 del D.Lgs. 138/2024.",
      // Racc. 2003/361/CE — categoria = dipendenti E (fatturato O bilancio)
      size_classes: {
        micro:  { max_employees: 10,  max_turnover_meur: 2,  max_balance_meur: 2 },
        piccola:{ max_employees: 50,  max_turnover_meur: 10, max_balance_meur: 10 },
        media:  { max_employees: 250, max_turnover_meur: 50, max_balance_meur: 43 }
        // oltre i massimali di 'media' => 'grande'
      },
      // la size-cap rule porta in perimetro le imprese medie e grandi
      size_in_scope: ["media", "grande"],
      special_cases: [
        { id: "trust_qualified", label: "Prestatore di servizi fiduciari qualificato", result: "essenziale" },
        { id: "dns",             label: "Fornitore di servizi DNS",                    result: "essenziale" },
        { id: "tld",             label: "Registro di nomi di dominio di primo livello (TLD)", result: "essenziale" },
        { id: "pa_centrale",     label: "Pubblica amministrazione centrale",           result: "essenziale" },
        { id: "pa_regionale",    label: "Pubblica amministrazione regionale (se designata dal diritto nazionale)", result: "essenziale" },
        { id: "telco",           label: "Rete pubblica di comunicazione elettronica / servizio di comunicazione elettronica accessibile al pubblico", result: "in_scope_size_dependent" },
        { id: "sole_provider",   label: "Unico fornitore nello Stato di un servizio essenziale per la società o l'economia", result: "essenziale" }
      ]
    },

    /* ---- CER ---- (Dir. 2022/2557, Allegato; D.Lgs. 134/2024 art. 5 c.1 lett. b) */
    cer: {
      thesis_ref: "§2.3",
      italian_implementation: "D.Lgs. 134/2024: la CER è attuata con una governance multilivello; il PCU presso la Presidenza del Consiglio coordina il raccordo nazionale ed europeo, mentre le autorità settoriali identificano e vigilano sui soggetti critici.",
      resilience_definition: "Resilienza è la capacità di prevenire, resistere, assorbire, mitigare, adattarsi e ripristinare le capacità operative dopo perturbazioni fisiche, calamità naturali, sabotaggi o minacce ibride.",
      risk_assessment_note: "La CER combina una valutazione statale dei rischi sistemici e intersettoriali con la valutazione decentrata del soggetto critico, che deve considerare risorse in ingresso, dipendenze e impatti sui settori dipendenti.",
      resilience_plan_note: "Il soggetto critico deve tradurre il risk assessment in un Piano di Resilienza con misure di protezione fisica, sicurezza del personale, diversificazione della filiera e ripristino rapido.",
      governance: ["Presidente del Consiglio dei Ministri", "Comitato Interministeriale per la Resilienza (CIR)", "Punto di Contatto Unico (PCU)", "Autorità settoriali competenti", "ACN per infrastrutture digitali e raccordo tecnico"],
      sectors: [
        { id: "energia",                  label: "Energia" },
        { id: "trasporti",                label: "Trasporti" },
        { id: "bancario",                 label: "Settore bancario" },
        { id: "mercati_finanziari",       label: "Infrastrutture dei mercati finanziari" },
        { id: "salute",                   label: "Salute" },
        { id: "acqua_potabile",           label: "Acqua potabile" },
        { id: "acque_reflue",             label: "Acque reflue" },
        { id: "infrastrutture_digitali",  label: "Infrastrutture digitali" },
        { id: "pubblica_amministrazione", label: "Pubblica amministrazione" },
        { id: "spazio",                   label: "Spazio" },
        { id: "alimentare",               label: "Produzione, trasformazione e distribuzione di alimenti" },
        { id: "acque_irrigue",            label: "Acque irrigue (recepimento italiano, D.Lgs. 134/2024)", national_addition: true }
      ],
      // criteri artt. 6-7 per l'impatto significativo (checklist, nessuno decisivo da solo)
      significance_criteria: [
        { id: "utenti",        label: "Numero di utenti che dipendono dal servizio" },
        { id: "intersett",     label: "Dipendenza di altri settori dal servizio" },
        { id: "durata_est",    label: "Durata e diffusione geografica di un'eventuale interruzione" },
        { id: "socioecon",     label: "Impatto socioeconomico e sulla sicurezza pubblica" },
        { id: "alternative",   label: "Disponibilità di soluzioni alternative" }
      ]
    },

    /* ---- DORA ---- (Reg. 2022/2554, art. 2, par. 1) */
    dora: {
      thesis_ref: "§2.2",
      financial_entity_categories: [
        "Enti creditizi",
        "Istituti di pagamento",
        "Prestatori di servizi di informazione sui conti",
        "Istituti di moneta elettronica",
        "Imprese di investimento",
        "Prestatori di servizi per le cripto-attività (MiCA)",
        "Depositari centrali di titoli",
        "Controparti centrali (CCP)",
        "Sedi di negoziazione",
        "Repertori di dati sulle negoziazioni",
        "Gestori di fondi di investimento alternativi (GEFIA)",
        "Società di gestione (OICVM)",
        "Prestatori di servizi di comunicazione dati",
        "Imprese di assicurazione e di riassicurazione",
        "Intermediari assicurativi, riassicurativi e assicurativi a titolo accessorio",
        "Enti pensionistici aziendali o professionali (EPAP)",
        "Agenzie di rating del credito",
        "Amministratori di indici di riferimento critici",
        "Fornitori di servizi di crowdfunding",
        "Repertori di dati sulle cartolarizzazioni"
      ],
      lex_specialis_note: "Per gestione del rischio TIC e notifica degli incidenti, DORA si applica in luogo delle corrispondenti disposizioni NIS2 (art. 4 NIS2; art. 1 par. 2 DORA), fermo restando il coordinamento con CSIRT e autorità NIS.",
      ict_tpp_note: "I fornitori terzi di servizi TIC non sono 'entità finanziarie', ma se designati critici (art. 31) sono sottoposti a sorveglianza europea diretta (Lead Overseer)."
    },

    /* ---- PSNC ---- (D.L. 105/2019; D.Lgs. 138/2024, art. 33) */
    psnc: {
      thesis_ref: "§2.7",
      label: "Perimetro di Sicurezza Nazionale Cibernetica",
      note: "Per gli asset già inseriti nel PSNC, il framework nazionale disciplina in via esclusiva gli obblighi di gestione del rischio e notifica connessi a tali asset; il raccordo va verificato caso per caso."
    },

    /* ---- CRA ---- (Reg. 2024/2847, artt. 7-8; Allegati III-IV) */
    cra: {
      thesis_ref: "§2.4.1",
      categories: [
        { id: "ordinario",           label: "Prodotto ordinario", note: "Obblighi generali del regolamento; autovalutazione della conformità." },
        { id: "importante_classe_1", label: "Importante — Classe I (Allegato III)", note: "Norme armonizzate/valutazione interna rafforzata." },
        { id: "importante_classe_2", label: "Importante — Classe II (Allegato III)", note: "Coinvolgimento di organismo notificato." },
        { id: "critico",             label: "Critico (Allegato IV)", note: "Regime più stringente; certificazione europea di cibersicurezza obbligatoria." }
      ],
      annex_iii_class_1: [
        "Sistemi di gestione delle identità e software di gestione degli accessi privilegiati",
        "Browser",
        "Gestori di password",
        "Software antimalware",
        "Prodotti VPN",
        "Sistemi di gestione delle reti",
        "Sistemi SIEM (Security Information and Event Management)",
        "Boot manager",
        "Software per infrastrutture a chiave pubblica (PKI)",
        "Interfacce di rete fisiche e virtuali",
        "Sistemi operativi",
        "Router, modem destinati alla connessione a Internet e switch",
        "Microprocessori con funzionalità di sicurezza",
        "Microcontrollori con funzionalità di sicurezza",
        "ASIC e FPGA con funzionalità di sicurezza",
        "Assistenti virtuali general purpose per smart home",
        "Prodotti smart home con funzionalità di sicurezza, inclusi serrature intelligenti, telecamere di sicurezza, sistemi di baby monitoring e allarmi",
        "Giocattoli connessi disciplinati dalla Direttiva 2009/48/CE con funzioni sociali interattive (ad es. parlare o filmare) o funzioni di localizzazione",
        "Prodotti personali indossabili per uso sul corpo umano con finalità di monitoraggio della salute e non disciplinati dal Regolamento (UE) 2017/745 o (UE) 2017/746, nonché prodotti personali indossabili destinati all'uso da parte di bambini"
      ],
      annex_iii_class_2: [
        "Ipervisori e sistemi di runtime per container che supportano l'esecuzione virtualizzata di sistemi operativi",
        "Firewall, sistemi di rilevamento e prevenzione delle intrusioni (IDS/IPS)",
        "Microprocessori tamper-resistant",
        "Microcontrollori tamper-resistant"
      ],
      annex_iv_critical: [
        "Dispositivi hardware con security box",
        "Altri dispositivi per finalità di sicurezza avanzata, inclusi dispositivi per crittografia sicura",
        "Gateway per contatori intelligenti nei sistemi di misurazione intelligenti",
        "Smartcard o elementi sicuri simili, compresi elementi sicuri di tipo embedded"
      ],
      ics_note: "PLC, DCS, CNC, SCADA e IIoT non sono più voci autonome dell'Allegato III (a differenza della proposta 2022): la qualificazione va valutata caso per caso in base alla funzionalità principale del prodotto (§2.4.1)."
    },

    /* ---- Regolamento Macchine ---- (Reg. 2023/1230) */
    macchine: {
      thesis_ref: "§2.5",
      roles: [
        { id: "fabbricante",           label: "Fabbrica / immette sul mercato una macchina" },
        { id: "assemblatore",          label: "Integra macchine in un insieme di macchine" },
        { id: "modifica_sostanziale",  label: "Modifica sostanzialmente una macchina già immessa sul mercato (art. 3 p. 16, art. 18)", note: "Retrofit, aggiornamento software, riconfigurazione di rete o connessione remota che altera il profilo di rischio: equiparazione al fabbricante, nuova valutazione di conformità." }
      ],
      annex_i_part_a_flags: [
        { id: "safety_software",   label: "Software che garantisce funzioni di sicurezza (incluso software di sicurezza commercializzato separatamente)" },
        { id: "self_evolving_ml",  label: "Componente di sicurezza con comportamento integralmente o parzialmente auto-evolutivo basato su machine learning" }
      ],
      annex_i_part_a_consequence: "Esclusione del solo controllo interno della produzione: coinvolgimento obbligatorio di un organismo notificato (art. 25 par. 2).",
      ress: [
        { id: "1.1.9", label: "RESS 1.1.9 — Protezione dall'alterazione (corruption)" },
        { id: "1.2.1", label: "RESS 1.2.1 — Sicurezza e affidabilità dei sistemi di comando; limiti delle regole auto-generate" }
      ]
    },

    /* ---- AI Act ---- (Reg. 2024/1689, art. 6; §2.6 della tesi)
       Modificato dal Digital Omnibus on AI — Regolamento (UE) 2026/1744,
       in vigore dal 27 luglio 2026 (vedi ai_act.digital_omnibus). */
    ai_act: {
      thesis_ref: "§2.6.1-2.6.3",
      channels: [
        { id: "art6_1", label: "Art. 6(1) — L'IA è componente di sicurezza di (o è essa stessa) un prodotto coperto dalla normativa di armonizzazione dell'Allegato I (incl. Regolamento Macchine), soggetto a valutazione di conformità di terzi", exclusion_applies: false },
        { id: "art6_2", label: "Art. 6(2) — L'IA rientra in uno degli usi dell'Allegato III", exclusion_applies: true }
      ],
      annex_iii_uses: [
        { id: "infra_critiche", label: "Componente di sicurezza nella gestione di infrastrutture digitali critiche, traffico stradale, o fornitura di acqua, gas, riscaldamento, elettricità", ot_relevant: true },
        { id: "biometria",      label: "Identificazione/categorizzazione biometrica" },
        { id: "istruzione",     label: "Istruzione e formazione professionale" },
        { id: "occupazione",    label: "Occupazione, gestione dei lavoratori, accesso al lavoro autonomo" },
        { id: "servizi_essenziali", label: "Accesso a servizi essenziali pubblici e privati (credito, welfare, emergenze)" },
        { id: "law_enforcement", label: "Attività di contrasto (law enforcement)" },
        { id: "migrazione",     label: "Migrazione, asilo, gestione delle frontiere" },
        { id: "giustizia",      label: "Amministrazione della giustizia e processi democratici" }
      ],
      exclusion_conditions_art6_3: [
        { id: "procedurale",    label: "Svolge un compito procedurale ristretto" },
        { id: "migliora",       label: "Migliora il risultato di un'attività umana precedentemente completata" },
        { id: "pattern",        label: "Rileva schemi decisionali o deviazioni senza sostituire/influenzare la valutazione umana" },
        { id: "preparatorio",   label: "Svolge un compito preparatorio rispetto a una valutazione rilevante" }
      ],
      exclusion_override: "L'esclusione NON opera se il sistema effettua profilazione di persone fisiche (art. 6, parr. 3-4): in tal caso resta ad alto rischio. La valutazione di esclusione va documentata prima dell'immissione sul mercato o della messa in servizio.",
      // Requisiti dei sistemi ad alto rischio rilevanti per la convergenza cyber-fisica (§2.6.2)
      high_risk_requirements: [
        { id: "oversight", article: "Art. 14", label: "Supervisione umana: monitoraggio dell'operato dell'algoritmo, comprensione dei limiti, rilevamento delle anomalie, possibilità di ignorare/annullare/interrompere l'esecuzione, arresto in stato sicuro (si salda col principio fail-safe d'impianto)." },
        { id: "robustness", article: "Art. 15", label: "Accuratezza, robustezza e cybersecurity lungo il ciclo di vita, incluse le vulnerabilità proprie dell'IA (art. 15, par. 5): data poisoning, model poisoning/evasion, adversarial examples." }
      ],
      ot_epistemic_note: "L'AI Act è software-centric e concepito 'a monte': un modello formalmente conforme può essere alimentato da una catena di sensori industriali legacy non protetti (protocolli senza crittografia come Modbus o OPC Classic). Un attaccante che manipola i dati di campo via man-in-the-middle può generare un adversarial example che induce l'IA di supervisione a classificare uno stato d'emergenza fisica come condizione operativa normale, ritardando l'allarme.",
      art_437bis_note: "Schema di D.Lgs. approvato in via definitiva il 4 agosto 2026 (in attuazione della L. 132/2025): introduce l'art. 437-bis c.p. — sanziona penalmente l'omessa adozione delle misure di sicurezza o di sorveglianza umana, e l'alterazione illecita, dei sistemi di IA ad alto rischio, quando ne derivi un pericolo concreto per la vita, l'incolumità pubblica o individuale o la sicurezza dello Stato. Salda la responsabilità penale d'impianto alla cybersecurity dei sistemi intelligenti.",
      prohibited_note: "Art. 5 — le pratiche di IA a rischio inaccettabile sono vietate: il sistema non può essere immesso sul mercato né messo in servizio (§2.6, Reg. (UE) 2024/1689, artt. 5, 6 e 50).",
      transparency_note: "Art. 50 — obblighi di trasparenza per i sistemi a rischio limitato (chatbot, contenuti sintetici/deepfake, riconoscimento delle emozioni) anche se non ad alto rischio (Reg. (UE) 2024/1689, art. 50; §2.6).",

      /* ---- Digital Omnibus on AI — Regolamento (UE) 2026/1744 ---- */
      digital_omnibus: {
        regulation: "Regolamento (UE) 2026/1744 (Digital Omnibus on AI)",
        // Riscontrato dal testo (§2.6.1, §2.8.3): presentato dalla Commissione il
        // 19 novembre 2025; pubblicato in GUUE il 24 luglio 2026; in vigore dal
        // 27 luglio 2026. Da NON confondere con il Digital Omnibus procedurale
        // (COM(2025) 837 final, Single Entry Point), tuttora una proposta.
        timeline: "Presentato dalla Commissione il 19 novembre 2025; pubblicato in GUUE il 24 luglio 2026; in vigore dal 27 luglio 2026 (§2.8.3).",
        // safety_component_narrowing è l'unico effetto del Reg. 2026/1744 che il
        // motore usa (canale art. 6.1). Il calendario differenziato di
        // applicabilità dei sistemi ad alto rischio non è riscontrato dal testo
        // della tesi e quindi non è codificato qui: se serve nel Cap. 4, va
        // aggiunto con riferimento alla fonte primaria (art. 113 Reg. 2024/1689
        // come modificato). Cfr. §2.4.1 e §2.5.3 sul fenomeno degli standard in
        // transizione.
        safety_component_narrowing: "Canale art. 6.1: un sistema di IA integrato in un prodotto già regolamentato è ad alto rischio solo se ha la finalità specifica di prevenire o attenuare rischi per la salute e la sicurezza, oppure se il suo malfunzionamento li metterebbe in pericolo. Sono esclusi i sistemi destinati unicamente ad assistenza all'utente, ottimizzazione delle prestazioni, efficienza del servizio o automazione di comodità. Il criterio sposta la valutazione dalla presenza dell'IA nel prodotto alla sua funzione di sicurezza — coerente con il RESS 1.2.1 del Regolamento Macchine (§2.6.1, Allegato I come modificato dal Reg. 2026/1744).",
        commission_limitation_power: "Dove la normativa dell'Allegato I impone obblighi equivalenti, la Commissione può limitare l'applicazione di specifici requisiti dell'AI Act, evitando duplicazioni (si collega alla legal interoperability, §2.7)."
      }
    },

    /* ---- interazioni tra regimi (§2.8.1) — testo per l'esito ---- */
    interactions: [
      { pair: ["nis2", "cer"],       type: "complementarità", text: "NIS2 disciplina la sicurezza delle reti e dei sistemi informativi; CER la resilienza complessiva del soggetto critico. Il soggetto critico CER è qualificato essenziale ai sensi della NIS2." },
      { pair: ["nis2", "dora"],      type: "lex specialis",   text: "DORA prevale sulla NIS2 per gestione del rischio TIC e notifica degli incidenti, nel proprio ambito; resta la cooperazione con il sistema NIS." },
      { pair: ["nis2", "psnc"],      type: "lex specialis nazionale", text: "Per reti e sistemi informativi già inclusi nel PSNC, gli obblighi di gestione del rischio e notifica sono disciplinati in via esclusiva dal framework del Perimetro (art. 33 D.Lgs. 138/2024); verificare l'ambito dell'asset e il coordinamento istituzionale." },
      { pair: ["cra", "macchine"],   type: "cumulativo",      text: "Requisiti da rispettare congiuntamente. Le evidenze del CRA possono facilitare la dimostrazione di conformità ai RESS 1.1.9 e 1.2.1, ma non la sostituiscono." },
      { pair: ["macchine", "ai_act"],type: "cumulativo",      text: "Se l'IA svolge funzioni di sicurezza nella macchina: CRA tutela la cybersecurity del bene, il Regolamento Macchine la sicurezza materiale, l'AI Act i rischi dell'algoritmo. Documentazione tecnica parzialmente condivisibile, valutazioni giuridiche autonome." },
      { pair: ["cra", "ai_act"],     type: "cumulativo",      text: "Oggetto tecnico unico, valutazioni di conformità distinte." }
    ]
  };
})(window);
