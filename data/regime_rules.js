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
        "ASIC e FPGA con funzionalità di sicurezza"
      ],
      annex_iii_class_2: [
        "Ipervisori e sistemi di runtime per container che supportano l'esecuzione virtualizzata di sistemi operativi",
        "Firewall, sistemi di rilevamento e prevenzione delle intrusioni (IDS/IPS)",
        "Microprocessori tamper-resistant",
        "Microcontrollori tamper-resistant"
      ],
      annex_iv_critical: [
        "Dispositivi hardware con security box",
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

    /* ---- AI Act ---- (Reg. 2024/1689, art. 6) */
    ai_act: {
      thesis_ref: "§2.6.1, §2.6.3",
      channels: [
        { id: "art6_1", label: "Art. 6(1) — L'IA è componente di sicurezza di (o è essa stessa) un prodotto coperto dalla normativa di armonizzazione dell'Allegato I, soggetto a valutazione di conformità di terzi", exclusion_applies: false },
        { id: "art6_2", label: "Art. 6(2) — L'IA rientra in uno degli usi dell'Allegato III", exclusion_applies: true }
      ],
      annex_iii_uses_relevant: [
        { id: "infra_critiche", label: "Componente di sicurezza nella gestione e nel funzionamento di infrastrutture digitali critiche, traffico stradale, o fornitura di acqua, gas, riscaldamento ed elettricità" },
        { id: "altri_allegato_iii", label: "Altro uso elencato nell'Allegato III (biometria, istruzione, occupazione, servizi essenziali, applicazione della legge, migrazione, giustizia, processi democratici)" }
      ],
      exclusion_conditions_art6_3: [
        { id: "procedurale",    label: "Svolge un compito procedurale ristretto" },
        { id: "migliora",       label: "Migliora il risultato di un'attività umana precedentemente completata" },
        { id: "pattern",        label: "Rileva schemi decisionali o deviazioni senza sostituire/influenzare la valutazione umana" },
        { id: "preparatorio",   label: "Svolge un compito preparatorio rispetto a una valutazione rilevante" }
      ],
      exclusion_override: "L'esclusione NON opera se il sistema effettua profilazione di persone fisiche (art. 6 par. 3-4): in tal caso resta ad alto rischio.",
      transparency_note: "Art. 50 — obblighi di trasparenza per sistemi a rischio limitato (chatbot, contenuti sintetici/deepfake, riconoscimento delle emozioni) anche se non ad alto rischio."
    },

    /* ---- interazioni tra regimi (§2.8.1) — testo per l'esito ---- */
    interactions: [
      { pair: ["nis2", "cer"],       type: "complementarità", text: "NIS2 disciplina la sicurezza delle reti e dei sistemi informativi; CER la resilienza complessiva del soggetto critico. Il soggetto critico CER è qualificato essenziale ai sensi della NIS2." },
      { pair: ["nis2", "dora"],      type: "lex specialis",   text: "DORA prevale sulla NIS2 per gestione del rischio TIC e notifica degli incidenti, nel proprio ambito; resta la cooperazione con il sistema NIS." },
      { pair: ["cra", "macchine"],   type: "cumulativo",      text: "Requisiti da rispettare congiuntamente. Le evidenze del CRA possono facilitare la dimostrazione di conformità ai RESS 1.1.9 e 1.2.1, ma non la sostituiscono." },
      { pair: ["macchine", "ai_act"],type: "cumulativo",      text: "Se l'IA svolge funzioni di sicurezza nella macchina: CRA tutela la cybersecurity del bene, il Regolamento Macchine la sicurezza materiale, l'AI Act i rischi dell'algoritmo. Documentazione tecnica parzialmente condivisibile, valutazioni giuridiche autonome." },
      { pair: ["cra", "ai_act"],     type: "cumulativo",      text: "Oggetto tecnico unico, valutazioni di conformità distinte." }
    ]
  };
})(window);
