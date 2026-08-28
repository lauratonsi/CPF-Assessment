/* Barra di navigazione del wizard, condivisa.
   Aggiorna lo stepper con lo stato di completamento reale della valutazione
   attiva e mostra una riga di contesto (funzione · organizzazione).
   Attivazione: <nav class="stepper" data-nav> nella pagina.
   Nessun effetto se non c'è una valutazione attiva. */
(function (root) {
  var CPF = root.CPF;
  if (!CPF) return;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var nav = document.querySelector("nav.stepper[data-nav]");
    if (!nav) return;

    var params = new URLSearchParams(location.search);
    var a = params.get("id") ? CPF.loadAssessment(params.get("id")) : (CPF.getActive && CPF.getActive());
    if (!a) return;

    var F = a.function || {};
    var deps = a.dependencies || [];
    var cons = a.intolerable_consequences || [];
    var caps = a.capability_assessment || [];
    var capsStarted = caps.some(function (e) {
      var cp = e.current_profile || {};
      return Object.keys(cp).some(function (d) { return cp[d] && cp[d].evidentiary_strength && cp[d].evidentiary_strength !== "non_determinabile"; });
    });

    var done = {
      "step1-regimi.html": !!(a.regime_profile && (a.regime_profile.nis2 || a.organization_id)),
      "step2-funzione.html": !!F.name,
      "step3-dipendenze.html": deps.length > 0,
      "step4a-conseguenze.html": cons.length > 0,
      "step4b-capacita.html": capsStarted
    };

    Array.prototype.forEach.call(nav.querySelectorAll("a[href]"), function (link) {
      var href = link.getAttribute("href");
      if (!(href in done)) return;
      link.classList.toggle("is-done", done[href]);
      link.classList.toggle("is-todo", !done[href] && !link.classList.contains("is-current"));
    });

    // riga di contesto
    if (F.name) {
      var bar = document.createElement("div");
      bar.className = "nav-context";
      var id = a.assessment_id ? "?id=" + encodeURIComponent(a.assessment_id) : "";
      bar.innerHTML = '<span class="nc-fn">' + escape(F.name) + '</span>'
        + (a.organization_name ? '<span class="nc-org"> · ' + escape(a.organization_name) + '</span>' : '')
        + (F.criticality ? '<span class="nc-crit"> · criticità ' + F.criticality + '/4</span>' : '')
        + '<a class="nc-link" href="step2-funzione.html' + id + '">modifica</a>';
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    }

    function escape(s) {
      return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
      });
    }
  });
})(window);
