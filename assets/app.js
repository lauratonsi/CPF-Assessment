/* CPF Assessment — logica applicativa condivisa (stub di scaffold).
   App statica client-side, nessun server. Le valutazioni vivono in
   localStorage e si esportano/importano come JSON.

   Da completare dopo la definizione del flusso UI:
     - rendering dei 4 step
     - motore di inferenza dello Step 1 (regime_profile da risposte)
     - calcoli derivati (gap, divario essenziale, priorità)
     - grafici dashboard (vendor: chart.js, d3-sankey) */
(function (root) {
  "use strict";
  root.CPF = root.CPF || {};
  var CPF = root.CPF;

  /* ---------- tema ---------- */
  CPF.applyStoredTheme = function () {
    try {
      var t = localStorage.getItem("cpf-theme");
      if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  };
  CPF.toggleTheme = function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("cpf-theme", next); } catch (e) {}
  };

  /* ---------- persistenza ---------- */
  var KEY_PREFIX = "cpf-assessment-";
  var KEY_ACTIVE = "cpf-active-id";

  CPF.listAssessments = function () {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(KEY_PREFIX) === 0) {
        try {
          var a = JSON.parse(localStorage.getItem(k));
          out.push({ id: a.assessment_id, name: (a.function && a.function.name) || "(senza nome)", updated_at: a.updated_at });
        } catch (e) {}
      }
    }
    return out.sort(function (a, b) { return (b.updated_at || "").localeCompare(a.updated_at || ""); });
  };

  CPF.loadAssessment = function (id) {
    try { return JSON.parse(localStorage.getItem(KEY_PREFIX + id)); } catch (e) { return null; }
  };

  // Somma approssimativa dei byte usati in localStorage sotto le chiavi CPF.
  CPF.storageBytes = function () {
    var n = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("cpf-") === 0) n += (k.length + (localStorage.getItem(k) || "").length) * 2;
    }
    return n;
  };
  // Soglia di avviso: ~4 MB (il limite reale è ~5-10 MB per dominio).
  CPF.STORAGE_WARN_BYTES = 4 * 1024 * 1024;

  CPF.saveAssessment = function (a) {
    a.updated_at = new Date().toISOString();
    var payload = JSON.stringify(a);
    try {
      localStorage.setItem(KEY_PREFIX + a.assessment_id, payload);
    } catch (e) {
      // quota superata: non perdere il lavoro corrente
      console.error("localStorage pieno", e);
      if (typeof CPF.onStorageFull === "function") CPF.onStorageFull(a);
      else alert("Spazio del browser esaurito. Esporta le valutazioni in JSON e rimuovine qualcuna prima di continuare.");
      throw e;
    }
    if (CPF.storageBytes() > CPF.STORAGE_WARN_BYTES && typeof CPF.onStorageWarn === "function") {
      CPF.onStorageWarn(CPF.storageBytes());
    }
    return a;
  };

  CPF.deleteAssessment = function (id) { localStorage.removeItem(KEY_PREFIX + id); };

  CPF.newAssessment = function () {
    var a = CPF.blankAssessment();
    CPF.saveAssessment(a);
    CPF.setActive(a.assessment_id);
    return a;
  };

  // Crea una valutazione a partire da un profilo organizzazione: clona il
  // regime_profile (con i flag overridden_from_org_profile) — §3.2, Cap. 4.
  CPF.newAssessmentFromOrg = function (org) {
    var a = CPF.blankAssessment();
    if (org) {
      a.organization_id = org.organization_id;
      a.organization_name = org.name || "";
      if (typeof CPF.cloneRegimeProfile === "function") {
        a.regime_profile = CPF.cloneRegimeProfile(org);
      }
    }
    CPF.saveAssessment(a);
    CPF.setActive(a.assessment_id);
    return a;
  };

  CPF.setActive = function (id) { localStorage.setItem(KEY_ACTIVE, id); };
  CPF.getActive = function () {
    var id = localStorage.getItem(KEY_ACTIVE);
    return id ? CPF.loadAssessment(id) : null;
  };

  CPF.exportAssessment = function (id) {
    var a = CPF.loadAssessment(id);
    if (!a) return;
    var blob = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = a.assessment_id + ".json";
    link.click();
    URL.revokeObjectURL(url);
  };

  CPF.importAssessment = function (file, cb) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var a = JSON.parse(r.result);
        CPF.saveAssessment(a);
        CPF.setActive(a.assessment_id);
        cb(null, a);
      } catch (e) { cb(e); }
    };
    r.readAsText(file);
  };

  /* ---------- calcoli derivati (§3.6) — stub ---------- */

  // Gap per dimensione: G = max(0, target - current), sospeso se prova non determinabile.
  CPF.dimensionGap = function (current, target) {
    if (!current || current.evidentiary_strength === "non_determinabile") {
      return { state: "incertezza_probatoria", gap: null };
    }
    if (!target) return { state: "nessun_obiettivo", gap: null };
    return { state: "ok", gap: Math.max(0, target.level - current.level) };
  };

  // Divario essenziale (anello debole): flag non assorbibile in medie.
  CPF.essentialShortfall = function (domainAssessment) {
    var t = domainAssessment.non_compensable_threshold;
    if (!domainAssessment.is_essential || !t) return null;
    var cur = domainAssessment.current_profile[t.dimension];
    if (!cur) return null;
    if (cur.evidentiary_strength === "non_determinabile") {
      return { kind: "verifica", dimension: t.dimension, rationale: t.rationale };
    }
    if (cur.level < t.min_level) {
      return { kind: "divario_essenziale", dimension: t.dimension, have: cur.level, need: t.min_level, rationale: t.rationale };
    }
    return null;
  };

  var DIMS = ["consolidamento", "estensione", "efficacia", "prestazione_osservata"];
  function band(score, hi, mid) { return score >= hi ? "alta" : score >= mid ? "media" : "bassa"; }

  // Priorità di un dominio (§3.6). Due esiti DISTINTI, mai fusi:
  //  - priorita_intervento: per le carenze corroborate. Ordinamento da
  //    f(criticità funzione, essenzialità capacità, natura/ampiezza del divario).
  //  - priorita_verifica:   per le condizioni non determinabili o solo
  //    parzialmente documentate. Non si traduce in intervento diretto.
  // L'ordinamento è ORDINALE, non cardinale (§3.7): è un indicatore descrittivo
  // di priorità, non una misura. Il divario essenziale (anello debole) non è
  // mai assorbito: porta l'intervento ad "alta" a prescindere dal resto.
  CPF.domainPriority = function (da, functionCriticality) {
    if (!da) return null;
    var crit = (typeof functionCriticality === "number") ? functionCriticality : null;
    var essential = !!da.is_essential;
    var cur = da.current_profile || {}, tgt = da.target_profile || {};

    var intervento = [], verifica = [], maxGap = 0;
    DIMS.forEach(function (dim) {
      var c = cur[dim], t = tgt[dim];
      if (!c) return;
      var g = CPF.dimensionGap(c, t);
      if (g.state === "incertezza_probatoria") {
        verifica.push({ dimension: dim, reason: "livello non determinabile" });
      } else if (c.evidentiary_strength === "parziale" && g.state === "ok" && g.gap > 0) {
        verifica.push({ dimension: dim, gap: g.gap, reason: "divario su livello solo parzialmente documentato" });
      } else if (g.state === "ok" && g.gap > 0) {
        intervento.push({ dimension: dim, gap: g.gap });
        if (g.gap > maxGap) maxGap = g.gap;
      }
    });

    var shortfall = CPF.essentialShortfall(da);
    var essShort = shortfall && shortfall.kind === "divario_essenziale" ? shortfall : null;
    var essUncert = shortfall && shortfall.kind === "verifica" ? shortfall : null;

    // composito ordinale: criticità (1-4, default 2) + essenzialità (+1) + ampiezza del divario
    var base = (crit || 2) + (essential ? 1 : 0) + maxGap;

    var out = {
      domain_id: da.domain_id || null,
      priorita_intervento: null,
      priorita_verifica: null,
      _ordinale: true,
      _note: "Ordinamento ordinale, non cardinale (§3.7): indicatore descrittivo di priorità."
    };

    if (essShort) {
      out.priorita_intervento = { band: "alta", reason: "divario essenziale su soglia non compensabile", dimensions: intervento, essential_shortfall: essShort };
    } else if (intervento.length) {
      out.priorita_intervento = { band: band(base, 7, 4), dimensions: intervento };
    }

    if (verifica.length || essUncert) {
      // urgenza di chiarire l'incertezza: più alta se funzione critica o capacità essenziale
      var vbase = (crit || 2) + (essential ? 1 : 0) + (essUncert ? 2 : 0) + verifica.length;
      out.priorita_verifica = { band: band(vbase, 6, 3), items: verifica, essential_uncertainty: essUncert };
    }

    return out;
  };

  // Ordina un elenco di domini per priorità sostanziale (per la dashboard).
  CPF.rankDomains = function (capabilityAssessment, functionCriticality) {
    var order = { alta: 3, media: 2, bassa: 1 };
    return (capabilityAssessment || [])
      .map(function (da) { return CPF.domainPriority(da, functionCriticality); })
      .filter(Boolean)
      .sort(function (a, b) {
        var ai = a.priorita_intervento ? order[a.priorita_intervento.band] : 0;
        var bi = b.priorita_intervento ? order[b.priorita_intervento.band] : 0;
        if (bi !== ai) return bi - ai;
        var av = a.priorita_verifica ? order[a.priorita_verifica.band] : 0;
        var bv = b.priorita_verifica ? order[b.priorita_verifica.band] : 0;
        return bv - av;
      });
  };

  /* ----------------------------------------------------------------------
     Revisione assistita della definizione di funzione (Step 2).
     NON è una validazione giuridica: sono euristiche che aiutano l'utente
     a notare campi sottili, incoerenze interne e scostamenti dal profilo
     dell'organizzazione. Ogni esito ha:
       level: "todo"  -> manca qualcosa di necessario a proseguire con senso
              "warn"  -> possibile incoerenza o motivazione debole
       field:  campo del form a cui l'esito si riferisce
       message: cosa guardare, in una riga
     Funzione pura e testabile (vedi tests/cases.js, gruppo "reviewFunction").
     ---------------------------------------------------------------------- */
  function _norm(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/[\s\W_]+/g, " ").trim();
  }
  function _words(s) {
    return String(s == null ? "" : s).trim().split(/\s+/).filter(Boolean).length;
  }

  CPF.reviewFunction = function (assessment) {
    var a = assessment || {};
    var F = a.function || {};
    var RP = a.regime_profile || {};
    var out = [];
    function add(level, field, message) { out.push({ level: level, field: field, message: message }); }

    // --- nome ---
    if (!F.name) {
      add("todo", "name", "Dai un nome alla funzione: un'attività o un servizio operativo (es. «Potabilizzazione — linea A»), non l'organizzazione.");
    } else if (/\b(s\.?p\.?a|s\.?r\.?l|s\.?c\.?a\.?r\.?l|comune di|az(ienda)?|societ|ente|gruppo|holding|utility|multiutility)\b/i.test(F.name)) {
      add("warn", "name", "«" + F.name + "» sembra il nome dell'organizzazione. La funzione è un'attività (potabilizzazione, dispacciamento, telecontrollo…), non il soggetto.");
    }

    // --- risultato / servizio ---
    if (!F.service_description) {
      add("todo", "service_description", "Descrivi il risultato operativo da preservare: cosa produce o mantiene la funzione, e per chi.");
    } else if (_words(F.service_description) < 6) {
      add("warn", "service_description", "Il risultato è molto sintetico: precisa cosa si ottiene e chi ne dipende.");
    }

    // --- processo fisico ---
    if (!F.physical_process) {
      add("warn", "physical_process", "Nessun processo fisico indicato. Una funzione cyber-fisica ne governa uno; se davvero non c'è, verifica di non stare valutando un servizio puramente IT (§3.2).");
    } else if (F.service_description && _norm(F.physical_process) === _norm(F.service_description)) {
      add("warn", "physical_process", "Risultato e processo fisico coincidono. Il risultato è cosa ottieni; il processo è cosa controlli fisicamente (portata, pressione, tensione, temperatura…).");
    }

    // --- perimetro ---
    if (!F.perimeter) {
      add("todo", "perimeter", "Delimita il perimetro osservabile: ciò che l'organizzazione può conoscere, monitorare, governare o coprire con misure di continuità.");
    }

    // --- criticità ---
    if (!F.criticality) {
      add("todo", "criticality", "Scegli un livello di criticità (1-4). In sua assenza il calcolo delle priorità (§3.6) usa 2 come valore neutro.");
    } else {
      if (!F.criticality_rationale) {
        add("todo", "criticality_rationale", "Hai scelto criticità " + F.criticality + " ma non l'hai motivata: la motivazione è ciò che rende la scelta ripetibile.");
      } else if (F.criticality >= 3 && !/(utent|settor|durat|estensione|geograf|alternativ|propagazion|ambient|sicurezza pubblic|incolumit|dipenden)/i.test(F.criticality_rationale)) {
        add("warn", "criticality_rationale", "Criticità alta ma la motivazione non richiama i criteri CER (utenti e settori dipendenti, durata ed estensione, alternative, propagazione): argomentala meglio.");
      }
    }

    // --- regimi rilevanti ---
    var rel = F.regimes_relevant_to_this_function || [];
    if (!rel.length) {
      add("warn", "regimes", "Nessun regime rilevante per la funzione: possibile, ma raro per una funzione cyber-fisica in un settore regolato.");
    }
    var hasResilience = rel.indexOf("nis2") !== -1 || rel.indexOf("cer") !== -1;
    if (F.criticality === 4 && !hasResilience) {
      add("warn", "criticality", "Criticità «molto alta» ma né NIS2 né CER tra i regimi rilevanti: incoerenza da chiarire.");
    }

    // --- coerenza con il profilo dell'organizzazione ---
    var orgEssential = (RP.nis2 && RP.nis2.qualification === "essenziale") ||
                       (RP.cer && RP.cer.designation === "soggetto_critico");
    if (orgEssential && F.criticality && F.criticality <= 2) {
      add("warn", "criticality", "L'organizzazione è soggetto essenziale/critico ma questa funzione ha criticità " + F.criticality + ": plausibile solo se è marginale rispetto al servizio essenziale.");
    }
    ["nis2", "cer", "dora", "cra", "macchine", "ai_act"].forEach(function (k) {
      var r = RP[k];
      if (r && r.overridden_from_org_profile && !r.override_reason) {
        add("todo", "regimes", "Scostamento su " + k.toUpperCase().replace("_", " ") + " senza motivazione: spiega perché differisce dal profilo dell'organizzazione.");
      }
    });

    return out;
  };

})(window);
