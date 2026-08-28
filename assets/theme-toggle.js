/* Tasto chiaro/scuro, condiviso da tutte le pagine.
   La preferenza è persistita in localStorage ("cpf-theme") e riletta
   in <head> da uno snippet inline per evitare il flash al caricamento.
   Senza scelta esplicita si segue prefers-color-scheme del sistema. */
(function () {
  var KEY = "cpf-theme";

  function systemDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function current() {
    var explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return systemDark() ? "dark" : "light";
  }

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";

  function render(mode) {
    btn.textContent = mode === "dark" ? "☀ Chiaro" : "☾ Scuro";
    btn.setAttribute("aria-label", mode === "dark" ? "Passa al tema chiaro" : "Passa al tema scuro");
  }
  function apply(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    render(mode);
  }

  btn.addEventListener("click", function () {
    apply(current() === "dark" ? "light" : "dark");
  });

  function mount() {
    document.body.appendChild(btn);
    render(current());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
