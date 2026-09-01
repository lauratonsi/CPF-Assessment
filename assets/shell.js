/* Barra applicativa condivisa. Si inietta in cima a <body> su ogni pagina
   e assorbe il tasto tema (creato da theme-toggle.js) portandolo nella barra.
   Aggiunge anche lo skip-link e il landmark <main> per l'accessibilità.
   Nessuna dipendenza; degrada senza effetti se assente. */
(function () {
  function a11y() {
    // landmark principale: la prima .wrap o .content della pagina
    var main = document.querySelector("main") || document.querySelector(".wrap, .content");
    if (main && main.tagName !== "MAIN") {
      main.setAttribute("role", "main");
      if (!main.id) main.id = "contenuto";
      main.setAttribute("tabindex", "-1");
    }
    var target = main ? "#" + (main.id || "contenuto") : "#contenuto";
    if (!document.querySelector(".skip-link")) {
      var skip = document.createElement("a");
      skip.className = "skip-link";
      skip.setAttribute("href", target);
      skip.textContent = "Vai al contenuto";
      document.body.insertBefore(skip, document.body.firstChild);
    }
  }

  function build() {
    if (document.querySelector(".appbar")) { a11y(); return; }

    var bar = document.createElement("header");
    bar.className = "appbar";

    var here = location.pathname.split("/").pop() || "";
    var home = /\/pages\//.test(location.pathname) || here === "" ? "../index.html" : "index.html";
    if (here === "index.html" || here === "") home = "#";

    bar.innerHTML =
      '<a class="brand" href="' + home + '">'
      + '<svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/>'
      + '<rect x="7.5" y="7.5" width="9" height="9" rx="2.6" fill="var(--accent)"/>'
      + '</svg>'
      + '<span class="wm">CPF <span>Assessment</span></span>'
      + '</a>'
      + '<span class="ab-sub">Valutazione delle capacità cyber-fisiche</span>'
      + '<span class="spacer"></span>'
      + '<span class="ab-slot"></span>';

    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add("has-appbar");
    a11y(); // skip-link prima della barra (diventa il primo elemento focalizzabile)

    // assorbe il tasto tema fluttuante, se già montato
    absorbToggle();
    // ...o attende che theme-toggle.js lo monti
    var tries = 0;
    var iv = setInterval(function () {
      if (absorbToggle() || ++tries > 20) clearInterval(iv);
    }, 50);
  }

  function absorbToggle() {
    var slot = document.querySelector(".appbar .ab-slot");
    var btn = document.querySelector("body > .theme-toggle");
    if (!slot || !btn) return false;
    btn.classList.add("in-appbar");
    slot.appendChild(btn);
    return true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
