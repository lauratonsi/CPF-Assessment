/* Grafico gap a manubrio (dumbbell) — sostituisce il radar.
   Una riga per dimensione: livello corrente ● ──▶ obiettivo ○, barra del gap,
   linea verticale della soglia non compensabile, forza probatoria nel marker.

   Motivazione (§3.6-3.7): niente "area" da leggere a colpo d'occhio, quindi
   nessuna aggregazione visiva ingannevole; l'incertezza probatoria è visibile
   nella riga, non in un box separato; il divario essenziale non può passare
   inosservato.

   CPF.renderDumbbell(container, domainAssessment, scales)
     domainAssessment: una voce di capability_assessment[]
     scales:           window.CPF.data.scales (per le etichette delle dimensioni) */
(function (root) {
  "use strict";
  root.CPF = root.CPF || {};

  var DIMS = ["consolidamento", "estensione", "efficacia", "prestazione_osservata"];
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  // stile del marker in funzione della forza probatoria
  function marker(cx, cy, r, strength, fill) {
    if (strength === "non_determinabile") {
      return el("circle", { cx: cx, cy: cy, r: r, fill: "none",
        stroke: "var(--faint)", "stroke-width": 1.5, "stroke-dasharray": "2 2" });
    }
    if (strength === "parziale") {
      var g = el("g", {});
      g.appendChild(el("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: fill, "stroke-width": 1.5 }));
      g.appendChild(el("path", {
        d: "M " + cx + " " + (cy - r) + " A " + r + " " + r + " 0 0 1 " + cx + " " + (cy + r) + " Z",
        fill: fill
      }));
      return g;
    }
    // corroborata (o assente): pieno
    return el("circle", { cx: cx, cy: cy, r: r, fill: fill });
  }

  root.CPF.renderDumbbell = function (container, da, scales) {
    scales = scales || (root.CPF.data && root.CPF.data.scales) || { dimensions: {} };
    container.innerHTML = "";

    var W = container.clientWidth || 520;
    var padL = 148, padR = 56, rowH = 40, padT = 8, padB = 24;
    var H = padT + rowH * DIMS.length + padB;
    var x0 = padL, x1 = W - padR;
    var xFor = function (lvl) { return x0 + (x1 - x0) * (lvl - 1) / 4; };

    var svg = el("svg", { width: "100%", viewBox: "0 0 " + W + " " + H,
      role: "img", "aria-label": "Profilo capacità: corrente vs obiettivo per dimensione" });

    // griglia livelli 1..5
    for (var L = 1; L <= 5; L++) {
      svg.appendChild(el("line", { x1: xFor(L), y1: padT, x2: xFor(L), y2: H - padB,
        stroke: "var(--border)", "stroke-width": 1, opacity: L === 1 || L === 5 ? 0.9 : 0.45 }));
      var t = el("text", { x: xFor(L), y: H - 7, "text-anchor": "middle",
        "font-size": 9.5, "font-family": "var(--mono)", fill: "var(--faint)" });
      t.textContent = L;
      svg.appendChild(t);
    }

    var thr = da.non_compensable_threshold || null;

    DIMS.forEach(function (dim, i) {
      var y = padT + rowH * i + rowH / 2;
      var cur = (da.current_profile || {})[dim] || {};
      var tgt = (da.target_profile || {})[dim] || {};
      var curLvl = cur.level, tgtLvl = tgt.level;
      var strength = cur.evidentiary_strength || "corroborata";
      var undetermined = strength === "non_determinabile";
      var isThrDim = thr && thr.dimension === dim;
      var shortfall = isThrDim && da.is_essential && !undetermined &&
        typeof curLvl === "number" && curLvl < thr.min_level;

      var accent = shortfall ? "var(--danger)" : "var(--accent)";

      // etichetta dimensione
      var dimLabel = (scales.dimensions[dim] && scales.dimensions[dim].label) || dim;
      var lbl = el("text", { x: padL - 14, y: y + 3.5, "text-anchor": "end",
        "font-size": 11.5, "font-family": "var(--sans)", "font-weight": 500,
        fill: shortfall ? "var(--danger)" : "var(--ink)" });
      lbl.textContent = (shortfall ? "⚠ " : "") + dimLabel;
      svg.appendChild(lbl);

      // soglia non compensabile
      if (isThrDim && typeof thr.min_level === "number") {
        svg.appendChild(el("line", { x1: xFor(thr.min_level), y1: y - rowH / 2 + 4,
          x2: xFor(thr.min_level), y2: y + rowH / 2 - 4,
          stroke: "var(--danger)", "stroke-width": 1.5, "stroke-dasharray": "3 2" }));
      }

      if (undetermined) {
        svg.appendChild(marker(xFor(curLvl || 1), y, 5, strength, "var(--faint)"));
        var vt = el("text", { x: xFor(curLvl || 1) + 12, y: y + 3, "font-size": 11,
          fill: "var(--faint)", "font-style": "italic" });
        vt.textContent = "non determinabile → verifica";
        svg.appendChild(vt);
        return;
      }

      // barra del gap corrente -> obiettivo
      if (typeof curLvl === "number" && typeof tgtLvl === "number") {
        var lo = Math.min(curLvl, tgtLvl), hi = Math.max(curLvl, tgtLvl);
        svg.appendChild(el("line", { x1: xFor(lo), y1: y, x2: xFor(hi), y2: y,
          stroke: accent, "stroke-width": 3, "stroke-linecap": "round",
          opacity: hi > lo ? 0.5 : 0 }));
      }
      // obiettivo: anello vuoto
      if (typeof tgtLvl === "number") {
        svg.appendChild(el("circle", { cx: xFor(tgtLvl), cy: y, r: 5.5,
          fill: "var(--surface)", stroke: accent, "stroke-width": 2 }));
      }
      // corrente: marker con stile = forza probatoria
      if (typeof curLvl === "number") {
        svg.appendChild(marker(xFor(curLvl), y, 5.5, strength, accent));
      }

      // gap numerico
      if (typeof curLvl === "number" && typeof tgtLvl === "number" && tgtLvl > curLvl) {
        var gt2 = el("text", { x: x1 + 8, y: y + 3, "font-size": 11, fill: accent });
        gt2.textContent = "gap " + (tgtLvl - curLvl);
        svg.appendChild(gt2);
      }
    });

    container.appendChild(svg);

    // legenda
    var leg = document.createElement("p");
    leg.className = "muted";
    leg.style.fontSize = "0.72rem";
    leg.style.margin = "0.3rem 0 0";
    leg.innerHTML = "● corroborata &nbsp; ◐ parzialmente documentata &nbsp; " +
      "◌ non determinabile &nbsp;|&nbsp; ○ obiettivo &nbsp;|&nbsp; " +
      "<span style=\"color:var(--danger)\">⚠ soglia non compensabile</span>";
    container.appendChild(leg);
  };
})(window);
