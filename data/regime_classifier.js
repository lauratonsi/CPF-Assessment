/* Step 1 — classificatore multi-regime.
   Dati di configurazione fissi. Riferimento: Cap. 2 della tesi.
   Caricato come <script>: popola window.CPF.data.regimeClassifier */
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.data.regimeClassifier = {
    regimes: {
      nis2:     { label: "NIS2",                full_name: "Direttiva (UE) 2022/2555",              thesis_ref: "§2.1" },
      cer:      { label: "CER",                 full_name: "Direttiva (UE) 2022/2557 / D.Lgs. 134/2024", thesis_ref: "§2.3" },
      dora:     { label: "DORA",                full_name: "Regolamento (UE) 2022/2554",            thesis_ref: "§2.2" },
      cra:      { label: "CRA",                 full_name: "Regolamento (UE) 2024/2847",            thesis_ref: "§2.4" },
      macchine: { label: "Regolamento Macchine", full_name: "Regolamento (UE) 2023/1230",           thesis_ref: "§2.5" },
      ai_act:   { label: "AI Act",              full_name: "Regolamento (UE) 2024/1689",            thesis_ref: "§2.6" }
    },

    questions: [
      {
        id: "q_sector",
        text: "In quale settore opera l'organizzazione?",
        type: "single_select",
        options: "ref:CPF.data.scopeSectors#annex_i+annex_ii",
        feeds: ["nis2", "cer"]
      },
      {
        id: "q_size",
        text: "Dimensione dell'organizzazione (dipendenti / fatturato o bilancio annuo)",
        type: "size_input",
        thresholds: { small: { employees: 50, turnover_meur: 10 } },
        feeds: ["nis2"]
      },
      {
        id: "q_special_case_nis2",
        text: "L'organizzazione rientra in una delle categorie speciali NIS2 (servizi fiduciari qualificati, DNS/TLD, PA)?",
        type: "boolean_with_subtype",
        thesis_ref: "§2.1.1",
        feeds: ["nis2"]
      },
      {
        id: "q_acn_registration",
        text: "Il soggetto è registrato sulla piattaforma ACN e ha ricevuto una qualificazione NIS2 formalmente notificata?",
        type: "boolean_with_subtype",
        thesis_ref: "§2.1.2",
        feeds: ["nis2"]
      },
      {
        id: "q_cer_critical",
        text: "L'organizzazione è stata designata come soggetto critico ai sensi del D.Lgs. 134/2024, o eroga un servizio essenziale la cui interruzione avrebbe impatti significativi (utenti dipendenti, dipendenze intersettoriali, durata/estensione impatto)?",
        type: "boolean_with_criteria",
        criteria_ref: "Direttiva (UE) 2022/2557, artt. 6-7",
        thesis_ref: "§2.3.1",
        feeds: ["cer"]
      },
      {
        id: "q_financial_entity",
        text: "L'organizzazione è un'entità finanziaria rientrante nell'ambito DORA (art. 2 Reg. 2022/2554)?",
        type: "boolean",
        thesis_ref: "§2.2",
        feeds: ["dora"]
      },
      {
        id: "q_digital_product",
        text: "L'organizzazione immette sul mercato UE un prodotto con elementi digitali (hardware o software con connessione dati logica/fisica)?",
        type: "boolean_with_category",
        categories: ["ordinario", "importante_classe_1", "importante_classe_2", "critico"],
        thesis_ref: "§2.4.1",
        feeds: ["cra"]
      },
      {
        id: "q_machine",
        text: "L'organizzazione produce, integra o modifica sostanzialmente una macchina ai sensi del Reg. (UE) 2023/1230?",
        type: "boolean",
        thesis_ref: "§2.5",
        feeds: ["macchine"]
      },
      {
        id: "q_ai_system",
        text: "L'organizzazione sviluppa o impiega un sistema di IA?",
        type: "boolean",
        feeds: ["ai_act"]
      },
      {
        id: "q_ai_high_risk_channel1",
        text: "Il sistema di IA è un componente di sicurezza di un prodotto già soggetto a valutazione di conformità di terzi (es. la macchina o il prodotto digitale sopra indicati)?",
        type: "boolean",
        depends_on: "q_ai_system",
        thesis_ref: "§2.6.1, art. 6 par. 1",
        feeds: ["ai_act"]
      },
      {
        id: "q_ai_high_risk_channel2",
        text: "Il sistema di IA rientra in uno degli usi elencati nell'Allegato III (incl. gestione infrastrutture digitali critiche, acqua, gas, riscaldamento, elettricità)?",
        type: "boolean",
        depends_on: "q_ai_system",
        thesis_ref: "§2.6.1, art. 6 par. 2",
        feeds: ["ai_act"]
      },
      {
        id: "q_ai_exclusion",
        text: "Se sì a una delle due condizioni sopra: il sistema svolge un compito procedurale ristretto, non influenza materialmente l'esito decisionale, e NON effettua profilazione di persone fisiche?",
        type: "boolean",
        depends_on: ["q_ai_high_risk_channel1", "q_ai_high_risk_channel2"],
        note: "Se true, il fornitore può escludere la qualificazione come alto rischio (art. 6 par. 3), salvo profilazione.",
        thesis_ref: "§2.6.3",
        feeds: ["ai_act"]
      }
    ],

    output_schema: {
      nis2:     { applicable: "boolean", qualification: "essenziale|importante|fuori_perimetro", formal_acn_qualification: "boolean" },
      cer:      { applicable: "boolean", designation: "soggetto_critico|non_designato" },
      dora:     { applicable: "boolean" },
      psnc:     { applicable: "boolean" },
      cra:      { applicable: "boolean", category: "ordinario|importante_1|importante_2|critico|null" },
      macchine: { applicable: "boolean" },
      ai_act:   { applicable: "boolean", high_risk: "boolean|escluso", channel: "art6_1|art6_2|null" }
    },

    disclaimer: "Strumento orientativo, non parere legale. Non codifica designazioni caso per caso di CER, esclusioni per sicurezza nazionale/difesa, né la valutazione integrale di conformità AI Act."
  };
})(window);
