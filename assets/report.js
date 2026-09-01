/* CPF.buildReport(assessment) — sintesi dell'esito, funzione PURA.

   È il punto in cui regimi, funzione, dipendenze, profilo obiettivo e profilo
   corrente vengono letti insieme per la prima volta (gli step del wizard non si
   parlano tra loro, per costruzione: nessuna compensazione a monte). La
   dashboard si limita a RENDERIZZARE questo oggetto — così la logica di sintesi
   è verificabile da test.html come già lo è il motore dei regimi.

   Dipende da: assets/app.js (dimensionGap, essentialShortfall, domainPriority,
   rankDomains, evidenceCurrency) e assets/regime-engine.js (classifyRegimes).

   Ritorna un modello descrittivo (§3.6-3.7): nessun punteggio aggregato, i
   divari essenziali restano separati, priorità di intervento e di verifica
   distinte. */
(function (root) {
  "use strict";
  root.CPF = root.CPF || {};
  var CPF = root.CPF;

  var DIMS = ["consolidamento", "estensione", "efficacia", "prestazione_osservata"];
  var REGIME_KEYS = ["nis2", "cer", "dora", "psnc", "cra", "macchine", "ai_act"];

  function depCritical(d) {
    return d.coupling === "tight" && !d.alternative_available && d.position !== "downstream";
  }

  CPF.buildReport = function (assessment) {
    var a = assessment || {};
    var F = a.function || {};

    // profilo dei regimi: dal dato salvato, o calcolato dal motore se manca/incompleto
    var RP = a.regime_profile;
    if ((!RP || !RP.nis2) && a._answers && typeof CPF.classifyRegimes === "function") {
      try { RP = CPF.classifyRegimes(a._answers); } catch (e) { RP = null; }
    }
    RP = RP || {};

    var crit = (typeof F.criticality === "number") ? F.criticality : null;
    var CA = Array.isArray(a.capability_assessment) ? a.capability_assessment : [];

    /* ---- regimi ---- */
    var relevant = F.regimes_relevant_to_this_function || [];
    var regimes = REGIME_KEYS.map(function (k) {
      var r = RP[k] || {};
      var tr = r.trace || [];
      return {
        key: k,
        applicable: !!r.applicable,
        relevant: relevant.indexOf(k) !== -1,
        profile: r,
        last_trace: tr.length ? tr[tr.length - 1] : null
      };
    });

    /* ---- dipendenze ---- */
    var deps = Array.isArray(a.dependencies) ? a.dependencies : [];
    var dependencies = {
      all: deps,
      upstream: deps.filter(function (d) { return d.position === "upstream"; }),
      internal: deps.filter(function (d) { return d.position === "internal"; }),
      downstream: deps.filter(function (d) { return d.position === "downstream"; }),
      critical: deps.filter(depCritical),
      is_critical: depCritical
    };

    /* ---- capacità: gap per dimensione + attualità dell'evidenza (§3.5) ---- */
    var domains = CA.map(function (e) {
      var cp = e.current_profile || {};
      var thr = e.non_compensable_threshold || null;
      var dims = DIMS.map(function (d) {
        var c = cp[d] || {}, t = (e.target_profile || {})[d] || {};
        var currency = null;
        if (c.level != null && c.evidentiary_strength !== "non_determinabile" && typeof CPF.evidenceCurrency === "function") {
          currency = CPF.evidenceCurrency(c.evidence_date);
        }
        return {
          dimension: d,
          current: c,
          target: t,
          gap: CPF.dimensionGap(c, t),
          is_threshold: !!(thr && thr.dimension === d),
          currency: currency
        };
      });
      return {
        domain_id: e.domain_id,
        is_essential: !!e.is_essential,
        non_compensable_threshold: thr,
        dimensions: dims,
        shortfall: CPF.essentialShortfall(e),
        priority: CPF.domainPriority(e, crit),
        assessment: e
      };
    });

    var essShort = domains.filter(function (x) { return x.shortfall && x.shortfall.kind === "divario_essenziale"; });
    var essVer = domains.filter(function (x) { return x.shortfall && x.shortfall.kind === "verifica"; });
    var ranked = CPF.rankDomains(CA, crit);

    /* ---- segnali di sintesi (descrittivi, §3.7) ---- */
    var undetermined = 0, stale = [];
    domains.forEach(function (x) {
      x.dimensions.forEach(function (dd) {
        if (dd.gap.state === "incertezza_probatoria") undetermined++;
        if (dd.currency && dd.currency.state === "da_rivalutare") stale.push({ domain_id: x.domain_id, dimension: dd.dimension });
      });
    });

    return {
      function: F,
      organization_name: a.organization_name || "",
      updated_at: a.updated_at || null,
      criticality: crit,

      regime_profile: RP,
      regimes: regimes,
      interactions: RP.interactions || [],
      verification_flags: RP.verification_flags || [],

      dependencies: dependencies,

      domains: domains,
      essential_shortfalls: essShort,
      essential_verifications: essVer,
      ranked: ranked,
      priority_intervento: ranked.filter(function (r) { return r.priorita_intervento; }),
      priority_verifica: ranked.filter(function (r) { return r.priorita_verifica; }),

      consequences: Array.isArray(a.intolerable_consequences) ? a.intolerable_consequences : [],

      summary: {
        domain_count: domains.length,
        essential_count: domains.filter(function (x) { return x.is_essential; }).length,
        essential_shortfall_count: essShort.length,
        essential_verification_count: essVer.length,
        undetermined_dimensions: undetermined,
        stale_evidence: stale,
        critical_dependencies: dependencies.critical.length,
        top_intervention_band: ranked.length && ranked[0].priorita_intervento ? ranked[0].priorita_intervento.band : null
      }
    };
  };
})(window);
