/* Step 1 — motore di inferenza multi-regime.
   Funzione pura: nessun DOM, nessuno stato. Testabile in isolamento
   (vedi tests/engine.html).

   CPF.classifyRegimes(answers) -> regime_profile
   CPF.sizeClass({employees, turnover_meur, balance_meur}) -> "micro"|"piccola"|"media"|"grande"

   Ogni regime nel profilo porta un array `trace`: coppie { esito, base } che
   spiegano PERCHÉ quell'esito (§3.6-3.7: ogni classificazione va motivata,
   non solo mostrata). Il trace è pensato per essere reso a schermo e citato
   nel Cap. 4 come esempio di trasparenza metodologica.

   Riferimento: data/regime_rules.js + Cap. 2 della tesi. */
(function (root) {
  "use strict";
  root.CPF = root.CPF || {};
  var CPF = root.CPF;

  function rules() {
    if (!CPF.data || !CPF.data.regimeRules) throw new Error("regime_rules.js non caricato");
    return CPF.data.regimeRules;
  }

  /* Racc. 2003/361/CE: si rientra in una categoria se
     dipendenti < soglia  E  (fatturato <= soglia  OPPURE  bilancio <= soglia). */
  CPF.sizeClass = function (m) {
    if (!m) return null;
    var e = m.employees, t = m.turnover_meur, b = m.balance_meur;
    if (e == null && t == null && b == null) return null;
    var sc = rules().nis2.size_classes;
    function fits(c) {
      return (e == null || e < c.max_employees) &&
             ((t != null && t <= c.max_turnover_meur) ||
              (b != null && b <= c.max_balance_meur) ||
              (t == null && b == null));
    }
    if (fits(sc.micro)) return "micro";
    if (fits(sc.piccola)) return "piccola";
    if (fits(sc.media)) return "media";
    return "grande";
  };

  function step(esito, base) { return { esito: esito, base: base }; }

  CPF.classifyRegimes = function (a) {
    a = a || {};
    var R = rules();
    var verification = [];
    var notes = [];

    /* ---------------- CER (per primo: alimenta NIS2) ---------------- */
    var cer = { applicable: false, designation: null, trace: [] };
    if (a.cer_sector) {
      cer.applicable = true;
      var cerSectorLabel = (R.cer.sectors.filter(function (s) { return s.id === a.cer_sector; })[0] || {}).label || a.cer_sector;
      if (a.cer_formally_designated) {
        cer.designation = "soggetto_critico";
        cer.trace.push(step("Soggetto critico", "Designazione formale dell'autorità competente (D.Lgs. 134/2024), settore: " + cerSectorLabel + "."));
      } else if ((a.cer_significance || []).length > 0) {
        cer.designation = "potenziale_soggetto_critico";
        cer.trace.push(step("Potenziale soggetto critico", "Servizio essenziale nel settore CER '" + cerSectorLabel + "' con " + a.cer_significance.length + " criteri di impatto significativo selezionati (artt. 6-7 Dir. 2022/2557), ma nessuna designazione formale."));
        verification.push("CER: profilo di potenziale soggetto critico. Verificare presso l'autorità competente se sia prevista una designazione (D.Lgs. 134/2024).");
      } else {
        cer.designation = "non_designato";
        cer.trace.push(step("Non designato", "Settore CER '" + cerSectorLabel + "' ma nessun criterio di impatto significativo selezionato."));
      }
      cer.trace.push(step("Valutazione qualitativa e sistemica", R.cer.risk_assessment_note));
      if (a.cer_resilience_plan_adopted) {
        cer.trace.push(step("Piano di Resilienza indicato", R.cer.resilience_plan_note));
      } else {
        verification.push("CER: verificare l'adozione e l'aggiornamento del Piano di Resilienza, includendo protezione fisica, personale, filiera e ripristino.");
      }
      notes.push("CER: la resilienza riguarda la capacità di prevenire, resistere, assorbire, mitigare, adattarsi e ripristinare le capacità operative; la continuità va valutata anche rispetto a minacce ibride e interdipendenze.");
    } else {
      cer.trace.push(step("Non applicabile", "L'organizzazione non eroga un servizio essenziale in un settore dell'Allegato CER."));
    }

    /* ---------------- NIS2 ---------------- */
    // Precedenza (§2.1.1; art. 2 parr. 1-2, art. 3 parr. 1-2, cons. 7):
    //  1. designazione CER come soggetto critico   -> essenziale (art. 3 par. 1 lett. f)
    //  2. caso speciale con esito 'essenziale' (fiduciari qualificati, DNS, TLD, PA, unico fornitore)
    //  3. rete pubblica / servizio e-comm accessibile al pubblico -> in perimetro; essenziale se media/grande
    //  4. Allegato I + impresa grande (oltre i massimali per le medie) -> essenziale
    //  5. Allegato I + impresa media                -> importante
    //  6. Allegato II + impresa media/grande        -> importante
    //  7. designazione discrezionale dello Stato membro (override)
    //  8. altrimenti                                -> fuori perimetro
    var nis2 = { applicable: false, qualification: "fuori_perimetro", trace: [] };
    var size = a.size_class || (a.size ? CPF.sizeClass(a.size) : null);
    var sizeInScope = R.nis2.size_in_scope.indexOf(size) !== -1;
    var special = a.nis2_special_cases || [];
    var essentialSpecialIds = R.nis2.special_cases.filter(function (s) {
      return s.result === "essenziale" && special.indexOf(s.id) !== -1;
    }).map(function (s) { return s.label; });
    var isTelco = special.indexOf("telco") !== -1;
    var inAnnexI = a.sector_annex === "annex_i";
    var inAnnexII = a.sector_annex === "annex_ii";
    var sizeTxt = size ? ("impresa " + size) : "dimensione non indicata";

    if (cer.designation === "soggetto_critico") {
      nis2 = { applicable: true, qualification: "essenziale", trace: [
        step("Essenziale", "I soggetti identificati come critici ai sensi della CER sono qualificati essenziali ai sensi della NIS2 (art. 3, par. 1, lett. f, Dir. 2022/2555).")
      ] };
    } else if (essentialSpecialIds.length > 0) {
      nis2 = { applicable: true, qualification: "essenziale", trace: [
        step("Essenziale", "Categoria individuata come essenziale indipendentemente dalla dimensione (art. 2, par. 2, e cons. 7): " + essentialSpecialIds.join("; ") + ".")
      ] };
    } else if (isTelco) {
      nis2 = { applicable: true, qualification: sizeInScope ? "essenziale" : "importante", trace: [
        step("In perimetro", "Rete pubblica / servizio di comunicazione elettronica accessibile al pubblico: nel perimetro NIS2 a prescindere dalla dimensione (art. 2, par. 2)."),
        step(sizeInScope ? "Essenziale" : "Importante", sizeInScope ? "Impresa media o grande." : (sizeTxt + ": sotto la soglia dimensionale per la qualifica di essenziale."))
      ] };
    } else if (inAnnexI && size === "grande") {
      nis2 = { applicable: true, qualification: "essenziale", trace: [
        step("Essenziale", "Settore dell'Allegato I e impresa che supera i massimali previsti per le medie imprese (art. 3, par. 1).")
      ] };
    } else if (inAnnexI && size === "media") {
      nis2 = { applicable: true, qualification: "importante", trace: [
        step("Importante", "Settore dell'Allegato I e impresa media: non soddisfa le condizioni per la qualifica di essenziale (art. 3, par. 2).")
      ] };
    } else if (inAnnexII && sizeInScope) {
      nis2 = { applicable: true, qualification: "importante", trace: [
        step("Importante", "Settore dell'Allegato II e impresa media o grande (art. 3, par. 2).")
      ] };
    } else if (a.ms_designation === "essenziale" || a.ms_designation === "importante") {
      nis2 = { applicable: true, qualification: a.ms_designation, trace: [
        step(a.ms_designation === "essenziale" ? "Essenziale" : "Importante", "Designazione discrezionale dello Stato membro (art. 2, parr. 2-3).")
      ] };
    } else {
      var why = "Nessun criterio soddisfatto.";
      if ((inAnnexI || inAnnexII) && !sizeInScope) {
        why = "Settore in Allegato " + (inAnnexI ? "I" : "II") + " ma " + sizeTxt + ": la size-cap rule esclude le micro e piccole imprese (salvo designazione dello Stato membro o casi speciali).";
      } else if (!inAnnexI && !inAnnexII) {
        why = "L'organizzazione non opera in un settore degli Allegati I o II e non rientra in una categoria speciale.";
      }
      nis2.trace.push(step("Fuori perimetro", why));
    }

    if (a.acn_formal_qualification === "essenziale" || a.acn_formal_qualification === "importante") {
      nis2.applicable = true;
      nis2.qualification = a.acn_formal_qualification;
      nis2.formal_acn_qualification = true;
      nis2.trace.push(step("Qualificazione formalmente notificata dall'ACN", "Il D.Lgs. 138/2024 centralizza presso l'ACN l'identificazione dei soggetti NIS2 e la notifica della qualifica di soggetto essenziale o importante; questo dato prevale sul calcolo orientativo dei criteri di settore e dimensione."));
    } else if (a.acn_platform_registered) {
      nis2.trace.push(step("Registrazione ACN indicata", "Registrazione sulla piattaforma digitale ACN dichiarata, ma nessuna qualificazione formale essenziale/importante è stata selezionata."));
      verification.push("NIS2/ACN: verificare la qualificazione formalmente notificata dall'ACN; la registrazione sulla piattaforma non equivale da sola alla qualifica.");
    }

    /* Il PSNC opera come eccezione di ambito sugli asset, non come
       classificazione alternativa dell'organizzazione. */
    var psnc = { applicable: !!a.psnc_assets, trace: [] };
    if (psnc.applicable) {
      psnc.trace.push(step("Applicabile agli asset indicati", R.psnc.note));
      nis2.psnc_exclusion = true;
      nis2.trace.push(step("PSNC: prevalenza nazionale per ambito", R.nis2.lex_specialis_note));
      notes.push("PSNC: per le reti e i sistemi informativi già inclusi nel Perimetro, applicare il framework nazionale in via esclusiva per gli obblighi relativi a tali asset; la verifica è distinta dalla qualificazione NIS2 dell'organizzazione.");
      verification.push("PSNC: verificare quali reti e sistemi informativi siano effettivamente inclusi nel Perimetro e il raccordo con autorità competenti, CSIRT e obblighi NIS2.");
    } else {
      psnc.trace.push(step("Non indicato", "Nessuna rete o sistema informativo è stato indicato come già incluso nel PSNC."));
    }

    /* ---------------- DORA ---------------- */
    var dora = { applicable: false, note: null, trace: [] };
    if (a.dora_financial_entity) {
      dora.applicable = true;
      dora.note = R.dora.lex_specialis_note;
      dora.trace.push(step("Applicabile", "Entità finanziaria rientrante nell'art. 2, par. 1, del Reg. 2022/2554."));
      dora.trace.push(step("Lex specialis", "Per gestione del rischio TIC e notifica degli incidenti, DORA si applica in luogo delle corrispondenti disposizioni NIS2 (art. 4 NIS2)."));
      verification.push("DORA: verificare le dipendenze da fornitori TIC critici e il rischio di concentrazione tecnologica sul modello di servizio finanziario.");
    } else if (a.dora_ict_tpp_critical) {
      dora.applicable = true;
      dora.note = R.dora.ict_tpp_note;
      dora.trace.push(step("Applicabile (fornitore TIC)", "Fornitore terzo di servizi TIC del settore finanziario designabile come critico: sorveglianza europea diretta (art. 31)."));
      verification.push("DORA: verificare la vigilanza diretta sui provider critici e la profondità delle dipendenze tecnologiche della filiera finanziaria.");
    } else {
      dora.trace.push(step("Non applicabile", "Non è un'entità finanziaria né un fornitore terzo TIC critico del settore finanziario."));
    }

    /* ---------------- CRA ---------------- */
    var cra = { applicable: false, category: null, role: a.cra_role || null, trace: [] };
    if (a.cra_places_product) {
      cra.applicable = true;
      cra.category = a.cra_category || "ordinario";
      var catLabel = (R.cra.categories.filter(function (c) { return c.id === cra.category; })[0] || {}).label || cra.category;
      cra.trace.push(step("Applicabile", "Immette sul mercato UE un prodotto con elementi digitali (connessione dati logica o fisica) — Reg. 2024/2847, artt. 2-3."));
      cra.trace.push(step("Security by design", "Il prodotto deve rispettare i requisiti essenziali del CRA: sicurezza per progettazione, configurazione sicura, SBOM e separazione delle patch di sicurezza da quelle funzionali."));
      cra.trace.push(step("Categoria: " + catLabel, a.cra_category
        ? "Classificazione in base alla funzionalità principale del prodotto (Allegati III-IV; PLC/SCADA/IIoT valutati caso per caso, §2.4.1)."
        : "Categoria non ancora determinata: assunto 'ordinario' in via prudenziale."));
      if (!a.cra_category) {
        verification.push("CRA: determinare la categoria del prodotto (ordinario / importante Classe I-II / critico) rispetto agli Allegati III e IV.");
      }
      verification.push("CRA: documentare la SBOM del prodotto, separare patch di sicurezza da patch funzionali e valutare caso per caso asset OT/industriali (PLC, DCS, CNC, SCADA, IIoT). ");
      if (a.cra_role === "importatore_distributore") {
        cra.trace.push(step("Ruolo: importatore/distributore", "Obblighi ridotti rispetto al fabbricante."));
      }
    } else {
      cra.trace.push(step("Non applicabile", "Non immette sul mercato UE prodotti con elementi digitali come operatore economico."));
    }

    /* ---------------- Regolamento Macchine ---------------- */
    var macchine = { applicable: false, roles: a.macchine_roles || [], notified_body_required: false, part_a_flags: a.macchine_annex_i_part_a_flags || [], trace: [] };
    if (macchine.roles.length > 0) {
      macchine.applicable = true;
      var roleLabels = R.macchine.roles.filter(function (r) { return macchine.roles.indexOf(r.id) !== -1; }).map(function (r) { return r.label; });
      macchine.trace.push(step("Applicabile", roleLabels.join("; ") + " (Reg. 2023/1230)."));
      macchine.trace.push(step("Cybersecurity rilevante per la safety", "I requisiti RESS 1.1.9 (protezione dall'alterazione) e 1.2.1 (sicurezza e affidabilità dei sistemi di comando) richiedono di valutare connessioni esterne, accesso remoto, software e configurazioni nella misura in cui possono introdurre o aumentare un rischio per persone, macchina, ambiente o processo (Allegato III)."));
      if (a.macchine_digital_connection) {
        verification.push("Regolamento Macchine: documentare la valutazione avversariale delle connessioni, dell'accesso remoto e delle modifiche software/configurative rispetto ai RESS 1.1.9 e 1.2.1.");
      }
      if (macchine.roles.indexOf("modifica_sostanziale") !== -1) {
        macchine.trace.push(step("Modifica sostanziale", "Equiparazione al fabbricante e nuova valutazione di conformità (art. 3 p. 16, art. 18)."));
        notes.push("Regolamento Macchine: la modifica sostanziale (retrofit, aggiornamento software, connessione remota che altera il profilo di rischio) impone una nuova valutazione di conformità.");
      }
      if (macchine.part_a_flags.length > 0) {
        macchine.notified_body_required = true;
        var flagLabels = R.macchine.annex_i_part_a_flags.filter(function (f) { return macchine.part_a_flags.indexOf(f.id) !== -1; }).map(function (f) { return f.label; });
        macchine.trace.push(step("Organismo notificato obbligatorio", flagLabels.join("; ") + " -> Allegato I Parte A: escluso il solo controllo interno della produzione (art. 25 par. 2)."));
      }
    } else {
      macchine.trace.push(step("Non applicabile", "Non fabbrica, integra o modifica sostanzialmente una macchina ai sensi del Reg. 2023/1230."));
    }

    /* ---------------- AI Act ---------------- (§2.6)
       canale 1 (art. 6.1): NON ammette la clausola di esclusione dell'art. 6.3
       canale 2 (art. 6.2, Allegato III): esclusione ammessa salvo profilazione di persone fisiche */
    var AIR = R.ai_act;
    var DO = AIR.digital_omnibus || {};
    var ai = { applicable: false, status: null, high_risk: false, channel: null, annex_iii_use: null, open_requirements: [], compliance_deadline: null, trace: [] };
    if (!a.ai_system) {
      ai.trace.push(step("Non applicabile", "L'organizzazione non sviluppa né impiega un sistema di IA. La disciplina resta un riferimento per la governance dell'automazione intelligente in ambito OT."));
    } else if (a.ai_prohibited) {
      ai.applicable = true;
      ai.status = "vietato";
      ai.trace.push(step("Pratica vietata (art. 5)", AIR.prohibited_note));
      notes.push("AI Act: il sistema rientra tra le pratiche vietate (art. 5) e non può essere immesso sul mercato né messo in servizio.");
    } else {
      ai.applicable = true;
      ai.status = "in_ambito";
      var useLabel = null;
      if (a.ai_annex_iii_use) {
        ai.annex_iii_use = a.ai_annex_iii_use;
        useLabel = (AIR.annex_iii_uses.filter(function (u) { return u.id === a.ai_annex_iii_use; })[0] || {}).label || a.ai_annex_iii_use;
      }

      if (a.ai_channel1) {
        ai.channel = "art6_1";
        // Reg. (UE) 2026/1744: componente di sicurezza solo se la finalità è
        // prevenire/attenuare rischi per salute e sicurezza (o se il
        // malfunzionamento li metterebbe in pericolo).
        if (a.ai_channel1_safety_purpose) {
          ai.high_risk = true;
          ai.trace.push(step("Alto rischio — canale art. 6.1", "Componente di sicurezza di un prodotto coperto dalla normativa di armonizzazione dell'Allegato I (incl. Regolamento Macchine), soggetto a valutazione di conformità di terzi, con finalità di sicurezza. La clausola di esclusione dell'art. 6.3 non è invocabile per questo canale."));
        } else {
          ai.high_risk = false;
          ai.status = "canale_6_1_non_attivato";
          ai.trace.push(step("Canale art. 6.1 non attivato", "Dopo il Reg. (UE) 2026/1744 l'IA integrata in un prodotto regolato è ad alto rischio solo se ha finalità di sicurezza (prevenire/attenuare rischi per salute e sicurezza) o se il suo malfunzionamento li metterebbe in pericolo. Usi di sola assistenza, ottimizzazione, efficienza o comodità sono esclusi."));
          verification.push("AI Act (art. 6.1, come modificato dal Reg. 2026/1744): confermare caso per caso se la finalità del sistema sia di sicurezza; se sì, resta ad alto rischio.");
        }
      } else if (a.ai_channel2) {
        ai.channel = "art6_2";
        if (useLabel) ai.trace.push(step("Uso dell'Allegato III", useLabel));
        if (a.ai_profiling) {
          ai.high_risk = true;
          ai.trace.push(step("Alto rischio — canale art. 6.2", "Uso dell'Allegato III con profilazione di persone fisiche: l'esclusione dell'art. 6.3 non opera (art. 6, parr. 3-4)."));
        } else if ((a.ai_exclusion_conditions || []).length > 0) {
          ai.high_risk = "escluso";
          var exLabels = AIR.exclusion_conditions_art6_3.filter(function (c) { return a.ai_exclusion_conditions.indexOf(c.id) !== -1; }).map(function (c) { return c.label; });
          ai.trace.push(step("Alto rischio escludibile (art. 6.3)", "Ricorre: " + exLabels.join("; ") + ". Nessuna profilazione. " + AIR.exclusion_override));
          verification.push("AI Act: esclusione dall'alto rischio invocata (art. 6.3). Formalizzare e documentare la valutazione prima dell'immissione sul mercato o della messa in servizio.");
        } else {
          ai.high_risk = true;
          ai.trace.push(step("Alto rischio — canale art. 6.2", "Uso dell'Allegato III, nessuna condizione di esclusione dell'art. 6.3."));
        }
      } else {
        ai.trace.push(step("Non ad alto rischio", "Il sistema non ricade in nessuno dei due canali dell'art. 6."));
        notes.push("AI Act: " + AIR.transparency_note);
      }

      // Requisiti dei sistemi ad alto rischio (§2.6.2) — rilevanti per la convergenza cyber-fisica
      if (ai.high_risk === true) {
        // Calendario differito dal Digital Omnibus (Reg. 2026/1744), date fisse.
        var dl = DO.deadlines || {};
        if (ai.channel === "art6_1" && dl.annex_i_embedded) {
          ai.compliance_deadline = dl.annex_i_embedded.date;
          ai.trace.push(step("Applicabilità differita", dl.annex_i_embedded.label + " (Reg. 2026/1744, data fissa)."));
        } else if (ai.channel === "art6_2" && dl.annex_iii_standalone) {
          ai.compliance_deadline = dl.annex_iii_standalone.date;
          ai.trace.push(step("Applicabilità differita", dl.annex_iii_standalone.label + " (Reg. 2026/1744, data fissa)."));
        }
        if (!a.ai_oversight_ready) {
          ai.open_requirements.push("oversight");
          verification.push("AI Act (art. 14): predisporre la supervisione umana — monitoraggio, comprensione dei limiti, rilevamento anomalie, override e arresto in stato sicuro (si salda col fail-safe d'impianto).");
        }
        if (!a.ai_robustness_ready) {
          ai.open_requirements.push("robustness");
          verification.push("AI Act (art. 15): predisporre le misure di accuratezza, robustezza e cybersecurity, incluse quelle contro le vulnerabilità proprie dell'IA — data/model poisoning, adversarial examples (art. 15, par. 5).");
        }
        if (a.ai_ot_field_data) {
          notes.push("AI Act: " + AIR.art_437bis_note);
          ai.trace.push(step("Contesto OT — limite epistemico", AIR.ot_epistemic_note));
          verification.push("AI Act / OT: valutare la protezione della catena di sensori e telemetria di campo (protocolli come Modbus/OPC): un adversarial example iniettato via man-in-the-middle può vanificare la conformità formale del modello.");
        }
      }
    }

    /* ---------------- interazioni tra regimi ---------------- */
    var applicableSet = {};
    if (nis2.applicable) applicableSet.nis2 = true;
    if (cer.applicable) applicableSet.cer = true;
    if (dora.applicable) applicableSet.dora = true;
    if (cra.applicable) applicableSet.cra = true;
    if (macchine.applicable) applicableSet.macchine = true;
    if (ai.applicable) applicableSet.ai_act = true;
    if (psnc.applicable) applicableSet.psnc = true;
    var interactions = R.interactions.filter(function (it) {
      return applicableSet[it.pair[0]] && applicableSet[it.pair[1]];
    });

    return {
      nis2: nis2,
      cer: cer,
      dora: dora,
      cra: cra,
      macchine: macchine,
      ai_act: ai,
      psnc: psnc,
      interactions: interactions,
      notes: notes,
      verification_flags: verification,
      _generated_at: new Date().toISOString(),
      _disclaimer: R.disclaimer || (CPF.data.regimeClassifier && CPF.data.regimeClassifier.disclaimer) || null
    };
  };
})(window);
