/* Profilo organizzazione riutilizzabile (organizations/<id>.json).
   Lo Step 1 produce e salva questo. Ogni nuova valutazione ne clona il
   regime_profile; il clone resta modificabile per singola valutazione, con
   un flag overridden_from_org_profile per campo (trasparenza metodologica, Cap. 4).

   Espone:
     window.CPF.blankOrganization(id)
     window.CPF.cloneRegimeProfile(org)   -> regime_profile per un'assessment
*/
(function (root) {
  root.CPF = root.CPF || {};
  root.CPF.data = root.CPF.data || {};

  root.CPF.blankOrganization = function (id) {
    var now = new Date().toISOString();
    return {
      organization_id: id || ("org-" + Date.now().toString(36)),
      created_at: now,
      updated_at: now,
      name: "",

      // risposte grezze allo Step 1 (input di CPF.classifyRegimes)
      answers: {
        sector_annex: null,          // "annex_i" | "annex_ii" | null
        sector_nis2: null,           // id settore
        size: { employees: null, turnover_meur: null, balance_meur: null },
        size_class: null,            // opzionale, se inserito direttamente
        nis2_special_cases: [],
        ms_designation: null,        // "essenziale" | "importante" | null
        acn_platform_registered: false,
        acn_formal_qualification: null, // "essenziale" | "importante" | null
        psnc_assets: false,          // asset già inclusi nel Perimetro di Sicurezza Nazionale Cibernetica

        cer_sector: null,
        cer_formally_designated: false,
        cer_significance: [],
        cer_resilience_plan_adopted: false,

        dora_financial_entity: false,
        dora_ict_tpp_critical: false,

        cra_places_product: false,
        cra_role: null,              // "fabbricante" | "importatore_distributore"
        cra_category: null,

        macchine_roles: [],
        macchine_annex_i_part_a_flags: [],
        macchine_digital_connection: false,

        ai_system: false,
        ai_prohibited: false,           // pratica vietata art. 5
        ai_channel1: false,
        ai_channel1_safety_purpose: false, // finalità di sicurezza (Reg. 2026/1744)
        ai_channel2: false,
        ai_annex_iii_use: null,         // quale uso dell'Allegato III
        ai_exclusion_conditions: [],
        ai_profiling: false,
        ai_oversight_ready: false,      // art. 14 supervisione umana
        ai_robustness_ready: false,     // art. 15 accuratezza/robustezza/cybersecurity
        ai_ot_field_data: false         // sistema in ambiente OT alimentato da sensori di campo
      },

      // output di CPF.classifyRegimes(answers) — ricalcolato a ogni modifica delle answers
      regime_profile: null
    };
  };

  /* Clona il regime_profile dell'organizzazione nella forma usata da un'assessment
     (regime_classifier.js#output_schema), marcando ogni campo come non ancora
     modificato rispetto alla sorgente. */
  root.CPF.cloneRegimeProfile = function (org) {
    var rp = (org && org.regime_profile) || {};
    function wrap(obj) {
      var out = JSON.parse(JSON.stringify(obj || {}));
      out.overridden_from_org_profile = false;
      return out;
    }
    return {
      _source_organization_id: org ? org.organization_id : null,
      _cloned_at: new Date().toISOString(),
      nis2:     wrap(rp.nis2     || { applicable: false, qualification: "fuori_perimetro" }),
      cer:      wrap(rp.cer      || { applicable: false, designation: null }),
      dora:     wrap(rp.dora     || { applicable: false, note: null }),
      psnc:     wrap(rp.psnc     || { applicable: false, trace: [] }),
      cra:      wrap(rp.cra      || { applicable: false, category: null, role: null }),
      macchine: wrap(rp.macchine || { applicable: false, roles: [], notified_body_required: false }),
      ai_act:   wrap(rp.ai_act   || { applicable: false, high_risk: false, channel: null }),
      interactions: rp.interactions || [],
      notes: rp.notes || [],
      verification_flags: rp.verification_flags || []
    };
  };

  /* Persistenza dei profili organizzazione (parallela a quella delle assessment). */
  var ORG_PREFIX = "cpf-org-";

  root.CPF.listOrganizations = function () {
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(ORG_PREFIX) === 0) {
        try {
          var o = JSON.parse(localStorage.getItem(k));
          out.push({ id: o.organization_id, name: o.name || "(senza nome)", updated_at: o.updated_at });
        } catch (e) {}
      }
    }
    return out.sort(function (a, b) { return (b.updated_at || "").localeCompare(a.updated_at || ""); });
  };
  root.CPF.loadOrganization = function (id) {
    try { return JSON.parse(localStorage.getItem(ORG_PREFIX + id)); } catch (e) { return null; }
  };
  root.CPF.saveOrganization = function (o) {
    o.updated_at = new Date().toISOString();
    // ricalcola sempre il profilo dai dati grezzi
    try { o.regime_profile = root.CPF.classifyRegimes(o.answers); } catch (e) {}
    localStorage.setItem(ORG_PREFIX + o.organization_id, JSON.stringify(o));
    return o;
  };
  root.CPF.deleteOrganization = function (id) { localStorage.removeItem(ORG_PREFIX + id); };
})(window);
