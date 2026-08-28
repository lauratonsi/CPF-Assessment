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

    /* ---------------- DORA ---------------- */
    var dora = { applicable: false, note: null, trace: [] };
    if (a.dora_financial_entity) {
      dora.applicable = true;
      dora.note = R.dora.lex_specialis_note;
      dora.trace.push(step("Applicabile", "Entità finanziaria rientrante nell'art. 2, par. 1, del Reg. 2022/2554."));
      dora.trace.push(step("Lex specialis", "Per gestione del rischio TIC e notifica degli incidenti, DORA si applica in luogo delle corrispondenti disposizioni NIS2 (art. 4 NIS2)."));
    } else if (a.dora_ict_tpp_critical) {
      dora.applicable = true;
      dora.note = R.dora.ict_tpp_note;
      dora.trace.push(step("Applicabile (fornitore TIC)", "Fornitore terzo di servizi TIC del settore finanziario designabile come critico: sorveglianza europea diretta (art. 31)."));
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
      cra.trace.push(step("Categoria: " + catLabel, a.cra_category
        ? "Classificazione in base alla funzionalità principale del prodotto (Allegati III-IV; PLC/SCADA/IIoT valutati caso per caso, §2.4.1)."
        : "Categoria non ancora determinata: assunto 'ordinario' in via prudenziale."));
      if (!a.cra_category) {
        verification.push("CRA: determinare la categoria del prodotto (ordinario / importante Classe I-II / critico) rispetto agli Allegati III e IV.");
      }
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

    /* ---------------- AI Act ---------------- */
    // canale 1 (art. 6.1): NON ammette la clausola di esclusione dell'art. 6.3
    // canale 2 (art. 6.2, Allegato III): esclusione ammessa salvo profilazione di persone fisiche
    var ai = { applicable: false, high_risk: false, channel: null, trace: [] };
    if (a.ai_system) {
      ai.applicable = true;
      if (a.ai_channel1) {
        ai.high_risk = true;
        ai.channel = "art6_1";
        ai.trace.push(step("Alto rischio (canale art. 6.1)", "Componente di sicurezza di (o è) un prodotto coperto dalla normativa di armonizzazione Allegato I, soggetto a valutazione di conformità di terzi. La clausola di esclusione dell'art. 6.3 NON opera per questo canale."));
      } else if (a.ai_channel2) {
        ai.channel = "art6_2";
        if (a.ai_profiling) {
          ai.high_risk = true;
          ai.trace.push(step("Alto rischio (canale art. 6.2)", "Uso elencato nell'Allegato III con profilazione di persone fisiche: la clausola di esclusione dell'art. 6.3 non opera (art. 6, parr. 3-4)."));
        } else if ((a.ai_exclusion_conditions || []).length > 0) {
          ai.high_risk = "escluso";
          ai.trace.push(step("Alto rischio escluso (art. 6.3)", "Uso Allegato III, ma ricorre almeno una condizione di esclusione (compito procedurale ristretto / non influenza materialmente la decisione / rilevamento di schemi / compito preparatorio) e nessuna profilazione. La valutazione va documentata prima dell'immissione sul mercato."));
          verification.push("AI Act: esclusione dall'alto rischio invocata (art. 6.3). Documentare la valutazione prima dell'immissione sul mercato o della messa in servizio.");
        } else {
          ai.high_risk = true;
          ai.trace.push(step("Alto rischio (canale art. 6.2)", "Uso elencato nell'Allegato III (incl. componente di sicurezza nella gestione di infrastrutture digitali critiche, acqua, gas, riscaldamento, elettricità) e nessuna condizione di esclusione."));
        }
      } else {
        ai.trace.push(step("Non ad alto rischio", "Sistema di IA che non ricade in nessuno dei due canali dell'art. 6. Possibili obblighi di trasparenza (art. 50)."));
      }
    } else {
      ai.trace.push(step("Non applicabile", "L'organizzazione non sviluppa né impiega un sistema di IA."));
    }

    /* ---------------- interazioni tra regimi ---------------- */
    var applicableSet = {};
    if (nis2.applicable) applicableSet.nis2 = true;
    if (cer.applicable) applicableSet.cer = true;
    if (dora.applicable) applicableSet.dora = true;
    if (cra.applicable) applicableSet.cra = true;
    if (macchine.applicable) applicableSet.macchine = true;
    if (ai.applicable) applicableSet.ai_act = true;
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
      interactions: interactions,
      notes: notes,
      verification_flags: verification,
      _generated_at: new Date().toISOString(),
      _disclaimer: R.disclaimer || (CPF.data.regimeClassifier && CPF.data.regimeClassifier.disclaimer) || null
    };
  };
})(window);
