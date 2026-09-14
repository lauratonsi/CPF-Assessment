/* CPF Assessment — logica applicativa condivisa.
   App statica client-side, nessun server. Le valutazioni vivono in
   localStorage e si esportano/importano come JSON.

   Contenuto:
     - persistenza (list/load/save/delete, export/import, profilo attivo)
     - calcoli derivati §3.6: dimensionGap, essentialShortfall,
       domainPriority, rankDomains
     - CPF.reviewFunction() — euristiche di coerenza per lo Step 2
   Il motore dei regimi (Step 1) è in regime-engine.js; i grafici in
   dumbbell.js; lo stepper in nav.js; l'appbar in shell.js. */
(function (root) {
  "use strict";
  root.CPF = root.CPF || {};
  var CPF = root.CPF;

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
    // storageBytes() scorre l'intero localStorage: calcolarlo solo se qualcuno ascolta.
    if (typeof CPF.onStorageWarn === "function") {
      var used = CPF.storageBytes();
      if (used > CPF.STORAGE_WARN_BYTES) CPF.onStorageWarn(used);
    }
    return a;
  };

  CPF.deleteAssessment = function (id) { localStorage.removeItem(KEY_PREFIX + id); };

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

  // Unica implementazione dell'esportazione (la dashboard passa l'oggetto già in
  // memoria e il regime_profile ricalcolato). I campi interni non finiscono nel
  // file: _answers è lo stato del form dello Step 1, _demo marca il fac-simile.
  CPF.exportAssessment = function (idOrAssessment, overrides) {
    var a = (idOrAssessment && typeof idOrAssessment === "object")
      ? idOrAssessment
      : CPF.loadAssessment(idOrAssessment);
    if (!a) return null;

    var payload = JSON.parse(JSON.stringify(a));
    delete payload._answers;
    delete payload._demo;
    if (overrides) {
      Object.keys(overrides).forEach(function (k) { payload[k] = overrides[k]; });
    }

    var base = (payload.function && payload.function.name) || payload.assessment_id || "valutazione";
    var name = "cpf-" + String(base).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    var url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    var link = document.createElement("a");
    link.href = url;
    link.download = name + ".json";
    // l'anchor va agganciato al documento: su alcuni browser il click
    // programmatico su un elemento staccato non avvia il download.
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // revoca differita: revocare subito dopo click() può annullare il download.
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    return payload;
  };

  // Confine del sistema: il file arriva dall'utente e può essere qualunque cosa.
  // Senza questo controllo un JSON valido ma estraneo entra in localStorage come
  // voce fantasma con assessment_id undefined.
  CPF.isAssessmentShape = function (a) {
    return !!a && typeof a === "object" && !Array.isArray(a) &&
           typeof a.assessment_id === "string" && a.assessment_id !== "" &&
           !!a.function && typeof a.function === "object";
  };

  CPF.importAssessment = function (file, cb) {
    var r = new FileReader();
    r.onerror = function () { cb(new Error("File illeggibile")); };
    r.onload = function () {
      var a;
      try { a = JSON.parse(r.result); }
      catch (e) { cb(new Error("Il file non è JSON valido")); return; }
      if (!CPF.isAssessmentShape(a)) {
        cb(new Error("Il file è JSON valido ma non è una valutazione CPF (mancano assessment_id o function)"));
        return;
      }
      try {
        CPF.saveAssessment(a);
        CPF.setActive(a.assessment_id);
        cb(null, a);
      } catch (e) { cb(e); }
    };
    r.readAsText(file);
  };

  /* ---------- calcoli derivati (§3.6) ---------- */

  // Gap per dimensione: G = max(0, target - current), sospeso se prova non
  // determinabile o se il livello corrente non è ancora stato attribuito.
  CPF.dimensionGap = function (current, target) {
    if (!current || current.evidentiary_strength === "non_determinabile" || current.level == null) {
      return { state: "incertezza_probatoria", gap: null };
    }
    if (!target || target.level == null) return { state: "nessun_obiettivo", gap: null };
    return { state: "ok", gap: Math.max(0, target.level - current.level) };
  };

  // Divario essenziale (anello debole): flag non assorbibile in medie.
  // §3.6 tiene separati i due esiti: «una priorità di intervento per le carenze
  // corroborate e una priorità di verifica per le condizioni ancora parzialmente
  // documentate o non determinabili». Quindi un livello solo PARZIALE non produce
  // mai un divario essenziale accertato — né quando è sotto soglia (la carenza non
  // è corroborata) né quando la raggiunge (§3.5: non trasformare una singola
  // evidenza positiva in una certificazione implicita di resilienza).
  CPF.essentialShortfall = function (domainAssessment) {
    var t = domainAssessment && domainAssessment.non_compensable_threshold;
    if (!domainAssessment || !domainAssessment.is_essential || !t) return null;
    var cur = (domainAssessment.current_profile || {})[t.dimension];
    if (!cur) return null;
    if (cur.evidentiary_strength === "non_determinabile" || cur.level == null) {
      return { kind: "verifica", reason: "non_determinabile", dimension: t.dimension, need: t.min_level, rationale: t.rationale };
    }
    if (cur.evidentiary_strength === "parziale") {
      return {
        kind: "verifica", reason: "parziale", dimension: t.dimension,
        have: cur.level, need: t.min_level, below: cur.level < t.min_level,
        rationale: t.rationale
      };
    }
    if (cur.level < t.min_level) {
      return { kind: "divario_essenziale", dimension: t.dimension, have: cur.level, need: t.min_level, rationale: t.rationale };
    }
    return null;
  };

  // Attualità dell'evidenza (§3.5): «un'evidenza valida al momento della raccolta
  // può non rappresentare più lo stato corrente della capacità». La tesi non
  // fissa una soglia: staleMonths è un default dello strumento (rivedibile),
  // non un requisito del modello. Accetta "YYYY", "YYYY-MM" o "YYYY-MM-DD".
  CPF.evidenceCurrency = function (dateStr, staleMonths, now) {
    staleMonths = staleMonths || 24;
    if (!dateStr) return { state: "assente", months: null };
    var m = String(dateStr).match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
    if (!m) return { state: "assente", months: null };
    var d = new Date(Number(m[1]), (m[2] ? Number(m[2]) : 1) - 1, m[3] ? Number(m[3]) : 1);
    var ref = now ? new Date(now) : new Date();
    var months = (ref.getFullYear() - d.getFullYear()) * 12 + (ref.getMonth() - d.getMonth());
    if (months < 0) return { state: "recente", months: months };
    return { state: months >= staleMonths ? "da_rivalutare" : "recente", months: months };
  };

  var DIMS = ["consolidamento", "estensione", "efficacia", "prestazione_osservata"];

  // Priorità come REGOLA ORDINALE, non come somma di punteggi (§3.6-3.7).
  // §3.6: «La criticità della funzione, l'essenzialità della capacità e la natura
  // e l'ampiezza del divario determinano la priorità sostanziale della carenza».
  // §3.7 avverte che le operazioni algebriche di aggregazione hanno ruolo
  // puramente descrittivo: qui non si sommano ordinali, si applica un mapping.
  // maxGap = ampiezza del divario corroborato più ampio; "ampio" = ≥ 2 livelli.
  // crit = criticità della funzione 1-4 (assente → 2, neutra).
  function interventoBand(essential, crit, maxGap) {
    crit = crit || 2;
    var wide = maxGap >= 2;
    if (essential && (wide || crit === 4)) return "alta";
    if (!essential && crit === 4 && maxGap >= 3) return "alta";
    if (essential || crit >= 3 || wide) return "media";
    return "bassa";                                 // non essenziale, criticità ≤2, divario contenuto
  }
  // Urgenza di chiarire l'incertezza probatoria. essUncert = incertezza su una
  // dimensione con soglia non compensabile (capacità essenziale).
  function verificaBand(essential, crit, essUncert, verificaCount) {
    crit = crit || 2;
    if (essUncert && (essential || crit >= 3)) return "alta";
    if (essential && crit === 4) return "alta";
    if (essUncert || essential || crit >= 3 || verificaCount >= 2) return "media";
    return "bassa";
  }

  // Priorità di un dominio (§3.6). Due esiti DISTINTI, mai fusi:
  //  - priorita_intervento: per le carenze corroborate. f(criticità funzione,
  //    essenzialità capacità, natura/ampiezza del divario) resa come regola.
  //  - priorita_verifica:   per le condizioni non determinabili o solo
  //    parzialmente documentate. Non si traduce in intervento diretto.
  // L'ordinamento è ORDINALE, non cardinale (§3.7): indicatore descrittivo di
  // priorità, non una misura. Il divario essenziale (anello debole) non è mai
  // assorbito: porta l'intervento ad "alta" a prescindere dal resto.
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

    var out = {
      domain_id: da.domain_id || null,
      priorita_intervento: null,
      priorita_verifica: null,
      _ordinale: true,
      _note: "Ordinamento ordinale, non cardinale (§3.7): indicatore descrittivo di priorità, ottenuto per regola su criticità, essenzialità e ampiezza del divario."
    };

    if (essShort) {
      out.priorita_intervento = { band: "alta", reason: "divario essenziale su soglia non compensabile (anello debole, §3.6)", dimensions: intervento, essential_shortfall: essShort };
    } else if (intervento.length) {
      out.priorita_intervento = { band: interventoBand(essential, crit, maxGap), dimensions: intervento, basis: { essential: essential, criticality: crit, max_gap: maxGap } };
    }

    if (verifica.length || essUncert) {
      out.priorita_verifica = { band: verificaBand(essential, crit, essUncert, verifica.length), items: verifica, essential_uncertainty: essUncert };
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

  // Compensazione tra capacità accessorie comparabili (§3.5): «soltanto nella
  // rappresentazione aggregata», tra capacità NON essenziali riferite allo
  // stesso comparable_group, quando concorrono al medesimo risultato
  // operativo e la sostituibilità è motivata rispetto allo scenario. Mai per
  // le capacità essenziali; mai tra dimensioni diverse; il valore resta
  // descrittivo e secondario, non tocca gap, priorità o soglie non
  // compensabili (calcolati sempre sui singoli domini da domainPriority).
  CPF.compensatedGroups = function (capabilityAssessment) {
    var byGroup = {};
    (capabilityAssessment || []).forEach(function (da) {
      var g = da && !da.is_essential && da.comparable_group;
      if (!g) return;
      (byGroup[g] = byGroup[g] || []).push(da);
    });
    var out = [];
    Object.keys(byGroup).forEach(function (g) {
      var members = byGroup[g];
      if (members.length < 2) return; // nulla da comparare
      var rationale = members.map(function (m) { return m.comparable_rationale; }).filter(Boolean)[0] || "";
      var dims = {};
      DIMS.forEach(function (dim) {
        var levels = members.map(function (m) {
          var c = (m.current_profile || {})[dim];
          return (c && c.level != null && c.evidentiary_strength !== "non_determinabile") ? c.level : null;
        });
        var known = levels.filter(function (l) { return l != null; });
        dims[dim] = {
          compensated_level: known.length ? Math.max.apply(null, known) : null,
          members_levels: levels,
          uncertain: known.length < members.length
        };
      });
      out.push({
        group: g,
        domain_ids: members.map(function (m) { return m.domain_id; }),
        rationale: rationale,
        dimensions: dims
      });
    });
    return out;
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

    // --- dipendenze a valle vs criticità (§3.2, §3.4): concorrono a
    // determinarla rendendo visibili utenti, servizi e settori esposti.
    var downstreamDeps = (a.dependencies || []).filter(function (d) { return d.position === "downstream"; });
    if (downstreamDeps.length && F.criticality && F.criticality <= 2) {
      add("warn", "criticality", "Sono mappate " + downstreamDeps.length + " dipendenze a valle (utenti, servizi o settori esposti alla degradazione di questa funzione) ma la criticità dichiarata è " + F.criticality + ": le dipendenze a valle concorrono a determinarla secondo i criteri CER (§3.2, §3.4) — verifica che la motivazione ne tenga conto.");
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
