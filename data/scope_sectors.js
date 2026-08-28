/* Settori NIS2 (Allegati I e II) + casi speciali + soglia dimensionale.
   Portato dal vecchio NIS2 Gap Tool (data/scope.json), riusato dallo Step 1
   per la domanda q_sector. Popola window.CPF.data.scopeSectors.
   Fonte: Direttiva (UE) 2022/2555, Allegati I-II, artt. 2-3; D.Lgs. 138/2024. */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.scopeSectors = {
    clusters: {
      ot:      { label: "OT-Heavy",       short: "OT",   description: "Infrastrutture e manifattura: sistemi di controllo industriale (PLC, SCADA, HMI), protocolli legacy, forte vincolo safety." },
      it:      { label: "IT-Heavy",       short: "IT",   description: "Dati e servizi: architetture IT-native e cloud, tecnologie di sicurezza mature e aggiornabili." },
      finance: { label: "Finanza (DORA)", short: "DORA", description: "Banche e mercati finanziari: già iper-regolati da DORA (Reg. UE 2022/2554)." }
    },

    annex_i: [
      { id: "energia", sector: "Energia", cluster: "ot", subsectors: [
        { label: "Elettricità", entities: "Imprese elettriche, gestori di reti di distribuzione e trasmissione, produttori, operatori del mercato elettrico, partecipanti al mercato, operatori di punti di ricarica" },
        { label: "Teleriscaldamento e teleraffrescamento", entities: "Operatori di sistemi di teleriscaldamento o teleraffrescamento" },
        { label: "Petrolio", entities: "Gestori di oleodotti, impianti di produzione/raffinazione/trattamento/stoccaggio/trasmissione, soggetti centrali di stoccaggio" },
        { label: "Gas", entities: "Imprese di fornitura, gestori di reti di distribuzione e trasmissione, gestori di stoccaggio e terminali GNL, impianti di raffinazione" },
        { label: "Idrogeno", entities: "Operatori di impianti di produzione, stoccaggio e trasmissione di idrogeno" }
      ]},
      { id: "trasporti", sector: "Trasporti", cluster: "ot", subsectors: [
        { label: "Aereo", entities: "Vettori aerei commerciali, enti di gestione aeroportuale, aeroporti, operatori del controllo del traffico aereo (ATC)" },
        { label: "Ferroviario", entities: "Gestori dell'infrastruttura, imprese ferroviarie (inclusi operatori di impianti di servizio)" },
        { label: "Per vie d'acqua", entities: "Compagnie di trasporto marittimo/fluviale/costiero, enti di gestione dei porti, operatori dei servizi di traffico navale (VTS)" },
        { label: "Su strada", entities: "Autorità stradali responsabili della gestione del traffico, operatori di sistemi di trasporto intelligenti (ITS)" }
      ]},
      { id: "bancario", sector: "Settore bancario", cluster: "finance", subsectors: [
        { label: "Enti creditizi", entities: "Enti creditizi come definiti dall'art. 4 del regolamento (UE) n. 575/2013 (CRR)" }
      ]},
      { id: "mercati_finanziari", sector: "Infrastrutture dei mercati finanziari", cluster: "finance", subsectors: [
        { label: "Infrastrutture di mercato", entities: "Gestori di sedi di negoziazione (MiFID II), controparti centrali (CCP, EMIR)" }
      ]},
      { id: "salute", sector: "Salute", cluster: "ot", subsectors: [
        { label: "Assistenza sanitaria", entities: "Prestatori di assistenza sanitaria, laboratori di riferimento UE, enti di R&S di medicinali, fabbricanti di prodotti farmaceutici di base, fabbricanti di dispositivi medici critici in emergenza sanitaria" }
      ]},
      { id: "acqua_potabile", sector: "Acqua potabile", cluster: "ot", subsectors: [
        { label: "Acqua potabile", entities: "Fornitori e distributori di acqua destinata al consumo umano (esclusi i distributori per i quali è attività non essenziale)" }
      ]},
      { id: "acque_reflue", sector: "Acque reflue", cluster: "ot", subsectors: [
        { label: "Acque reflue", entities: "Imprese che raccolgono, smaltiscono o trattano acque reflue urbane, domestiche o industriali (salvo se attività non essenziale)" }
      ]},
      { id: "infrastrutture_digitali", sector: "Infrastrutture digitali", cluster: "it", subsectors: [
        { label: "Infrastrutture digitali", entities: "IXP, servizi DNS (esclusi i root name server), registri TLD, cloud computing, data center, CDN, prestatori di servizi fiduciari, reti pubbliche di comunicazione elettronica, servizi di comunicazione elettronica accessibili al pubblico" }
      ]},
      { id: "gestione_tic_b2b", sector: "Gestione di servizi TIC (B2B)", cluster: "it", subsectors: [
        { label: "Servizi gestiti", entities: "Fornitori di servizi gestiti (MSP) e di servizi di sicurezza gestiti (MSSP)" }
      ]},
      { id: "pubblica_amministrazione", sector: "Pubblica amministrazione", cluster: "it", subsectors: [
        { label: "Pubblica amministrazione", entities: "Enti della PA centrale e, se designati dal diritto nazionale, a livello regionale (escluse sicurezza nazionale, difesa, ordine pubblico)" }
      ]},
      { id: "spazio", sector: "Spazio", cluster: "ot", subsectors: [
        { label: "Spazio", entities: "Operatori di infrastrutture terrestri, statali o private, che supportano servizi basati sullo spazio" }
      ]}
    ],

    annex_ii: [
      { id: "postale", sector: "Servizi postali e di corriere", cluster: "it", subsectors: [
        { label: "Servizi postali e di corriere", entities: "Fornitori di servizi postali (dir. 97/67/CE), inclusi i fornitori di servizi di corriere" }
      ]},
      { id: "rifiuti", sector: "Gestione dei rifiuti", cluster: "ot", subsectors: [
        { label: "Gestione dei rifiuti", entities: "Imprese di gestione dei rifiuti (escluse quelle per cui non è l'attività economica principale)" }
      ]},
      { id: "chimica", sector: "Chimica", cluster: "ot", subsectors: [
        { label: "Sostanze chimiche", entities: "Imprese che fabbricano, distribuiscono sostanze o miscele, o producono articoli a partire da sostanze o miscele" }
      ]},
      { id: "alimentare", sector: "Alimentare", cluster: "ot", subsectors: [
        { label: "Produzione e distribuzione alimentare", entities: "Imprese alimentari impegnate nella distribuzione all'ingrosso e nella produzione e trasformazione industriale di alimenti" }
      ]},
      { id: "fabbricazione", sector: "Fabbricazione (manifattura)", cluster: "ot", subsectors: [
        { label: "Dispositivi medici", entities: "Fabbricazione di dispositivi medici e dispositivi medico-diagnostici in vitro (esclusi quelli critici già in Allegato I)" },
        { label: "Computer, elettronica e ottica", entities: "Divisione 26 NACE Rev. 2" },
        { label: "Apparecchiature elettriche", entities: "Divisione 27 NACE Rev. 2" },
        { label: "Macchinari n.c.a.", entities: "Divisione 28 NACE Rev. 2" },
        { label: "Autoveicoli", entities: "Divisione 29 NACE Rev. 2" },
        { label: "Altri mezzi di trasporto", entities: "Divisione 30 NACE Rev. 2" }
      ]},
      { id: "fornitori_digitali", sector: "Fornitori digitali", cluster: "it", subsectors: [
        { label: "Fornitori digitali", entities: "Fornitori di mercati online, di motori di ricerca online, di piattaforme di social network" }
      ]},
      { id: "ricerca", sector: "Ricerca", cluster: "it", subsectors: [
        { label: "Organizzazioni di ricerca", entities: "Istituti focalizzati sulla ricerca applicata o lo sviluppo sperimentale ai fini dello sfruttamento commerciale" }
      ]}
    ],

    special_cases: [
      { id: "trust",   label: "Prestatore di servizi fiduciari qualificato", result: "essenziale_sempre", note: "Essenziale a prescindere dalla dimensione (Art. 3 NIS2)." },
      { id: "dns_tld", label: "Fornitore di servizi DNS o registro TLD",     result: "essenziale_sempre", note: "Essenziale a prescindere dalla dimensione (Art. 3 NIS2)." },
      { id: "telco",   label: "Fornitore di reti pubbliche / servizi di comunicazione elettronica accessibili al pubblico", result: "in_scope_sempre", note: "Nel perimetro a prescindere dalla dimensione (Art. 2 NIS2); essenziale se impresa media o grande." },
      { id: "pa",      label: "Pubblica amministrazione centrale (o regionale, se designata)", result: "essenziale_sempre", note: "Nel perimetro a prescindere dalla dimensione, salvo attività di sicurezza nazionale/difesa/ordine pubblico escluse." },
      { id: "sole",    label: "Unico fornitore nel Paese di un servizio essenziale per la società o l'economia", result: "essenziale_sempre", note: "Nel perimetro a prescindere dalla dimensione (Art. 2 NIS2)." }
    ],

    size_thresholds: {
      _comment: "Raccomandazione 2003/361/CE. 'small' = sotto entrambe le soglie di media impresa.",
      medium: { employees: 250, turnover_meur: 50, balance_meur: 43 },
      small:  { employees: 50,  turnover_meur: 10, balance_meur: 10 }
    },

    sources: [
      "Direttiva (UE) 2022/2555 (NIS2), Allegati I e II; artt. 2-3",
      "D.Lgs. 4 settembre 2024, n. 138 — Allegati I–IV e artt. 3, 6",
      "Raccomandazione 2003/361/CE — definizione di PMI"
    ]
  };
})(window);
