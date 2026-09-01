/* Barra di navigazione del wizard, condivisa.
   - attributi di accessibilità sullo stepper (sempre);
   - stato di completamento reale della valutazione attiva + barra di
     avanzamento + prossimo passo;
   - riga di contesto (funzione · organizzazione).
   Attivazione: <nav class="stepper" data-nav> nella pagina. */
(function (root) {
  var CPF = root.CPF;
  if (!CPF) return;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  // ordine e etichette brevi dei passi che concorrono all'avanzamento
  var STEPS = [
    { href: "step1-regimi.html",       label: "Regimi" },
    { href: "step2-funzione.html",     label: "Funzione" },
    { href: "step3-dipendenze.html",   label: "Dipendenze" },
    { href: "step4a-conseguenze.html", label: "Conseguenze" },
    { href: "step4b-capacita.html",    label: "Capacità" }
  ];

  ready(function () {
    var nav = document.querySelector("nav.stepper[data-nav]");
    if (!nav) return;

    // --- accessibilità: sempre ---
    if (!nav.getAttribute("aria-label")) nav.setAttribute("aria-label", "Passi della valutazione");
    var current = nav.querySelector(".is-current");
    if (current && !current.getAttribute("aria-current")) current.setAttribute("aria-current", "step");

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

    var id = a.assessment_id ? encodeURIComponent(a.assessment_id) : "";
    var doneCount = STEPS.reduce(function (n, s) { return n + (done[s.href] ? 1 : 0); }, 0);

    // --- link: stato + contesto preservato ---
    Array.prototype.forEach.call(nav.querySelectorAll("a[href]"), function (link) {
      var href = link.getAttribute("href").split("?")[0];
      // porta l'id della valutazione su tutti i passi tranne lo Step 1 (che vive
      // sul profilo organizzazione, non sulla singola valutazione)
      if (id && href !== "step1-regimi.html" && /\.html$/.test(href)) {
        link.setAttribute("href", href + "?id=" + id);
      }
      if (!(href in done)) return;
      link.classList.toggle("is-done", done[href]);
      link.classList.toggle("is-todo", !done[href] && !link.classList.contains("is-current"));
      if (done[href]) link.setAttribute("aria-label", link.textContent.trim() + " — completato");
      else link.removeAttribute("aria-label");
    });

    // --- barra di avanzamento sotto lo stepper ---
    nav.style.setProperty("--steps-done", doneCount);
    nav.style.setProperty("--steps-total", STEPS.length);
    nav.setAttribute("data-progress", doneCount + "/" + STEPS.length);

    // --- riga di contesto + prossimo passo ---
    if (F.name || doneCount > 0) {
      var next = STEPS.filter(function (s) { return !done[s.href]; })[0];
      var onDash = /dashboard\.html$/.test(location.pathname);
      var idq = id ? "?id=" + id : "";
      var cta;
      if (onDash) cta = '<a class="nc-link" href="step2-funzione.html' + idq + '">modifica la funzione</a>';
      else if (next) cta = '<a class="nc-next" href="' + next.href + (next.href === "step1-regimi.html" ? "" : idq) + '">Prossimo: ' + esc(next.label) + ' →</a>';
      else cta = '<a class="nc-next" href="dashboard.html' + idq + '">Vedi l\'esito →</a>';

      var bar = document.createElement("div");
      bar.className = "nav-context";
      bar.innerHTML =
        (F.name ? '<span class="nc-fn">' + esc(F.name) + '</span>' : '<span class="nc-fn nc-untitled">Valutazione senza nome</span>')
        + (a.organization_name ? '<span class="nc-org"> · ' + esc(a.organization_name) + '</span>' : '')
        + (F.criticality ? '<span class="nc-crit"> · criticità ' + F.criticality + '/4</span>' : '')
        + '<span class="nc-prog" title="' + doneCount + ' di ' + STEPS.length + ' passi completati">' + doneCount + '/' + STEPS.length + '</span>'
        + cta;
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    }
  });
})(window);
