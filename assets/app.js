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

  // Priorità: intervento vs verifica a seconda della forza probatoria.
  CPF.domainPriority = function (domainAssessment, functionCriticality) {
    // TODO: definire f(criticità_funzione, is_essential, gap) dopo il flusso UI.
    return { type: "todo", note: "da implementare" };
  };

})(window);
