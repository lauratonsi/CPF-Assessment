/* Runner condiviso per la batteria CPF_TEST_CASES.
   Uso:
     CPF.runTests({ suites: ["engine"], mount: el, summary: el });
   `suites` omesso  → tutte le suite.
   Ritorna { total, pass, fail }.

   Markup prodotto (stile in assets/theme.css, namespace .tr-*):
     <section class="tr-grp ok|ko">
       <h3><span class="tr-dot"></span> Gruppo <span class="tr-count">n/m</span></h3>
       <ul class="tr-list">
         <li class="ok"><span class="tr-badge">PASS</span> <span class="tr-name">…</span></li>
         <li class="ko"><span class="tr-badge">FAIL</span> <span class="tr-name">…</span><span class="tr-msg">…</span></li>
       </ul>
     </section>
*/
(function (root) {
  root.CPF = root.CPF || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function runOne(tc) {
    try { tc.fn(); return { ok: true }; }
    catch (e) { return { ok: false, msg: e && e.message ? e.message : String(e) }; }
  }

  root.CPF.runTests = function (opts) {
    opts = opts || {};
    var cases = (root.CPF_TEST_CASES || []).filter(function (tc) {
      return !opts.suites || opts.suites.indexOf(tc.suite) !== -1;
    });

    var order = [], groups = {};
    cases.forEach(function (tc) {
      if (!groups[tc.group]) { groups[tc.group] = []; order.push(tc.group); }
      groups[tc.group].push(tc);
    });

    var total = 0, pass = 0, n = 0, html = "";

    order.forEach(function (g) {
      var g0 = 0, items = "";
      groups[g].forEach(function (tc) {
        var r = runOne(tc);
        total++; n++;
        if (r.ok) { pass++; g0++; }
        items += '<li class="' + (r.ok ? "ok" : "ko") + '">'
          + '<span class="tr-badge">' + (r.ok ? "PASS" : "FAIL") + '</span>'
          + '<span class="tr-name">' + esc(tc.name) + '</span>'
          + (r.ok ? "" : '<span class="tr-msg">' + esc(r.msg) + '</span>')
          + '</li>';
      });
      var clean = g0 === groups[g].length;
      html += '<section class="tr-grp ' + (clean ? "ok" : "ko") + '">'
        + '<h3><span class="tr-dot"></span>' + esc(g)
        + '<span class="tr-count">' + g0 + '/' + groups[g].length + '</span></h3>'
        + '<ul class="tr-list">' + items + '</ul></section>';
    });

    if (opts.mount) opts.mount.innerHTML = html;

    var fail = total - pass;
    if (opts.summary) {
      var pct = total ? Math.round((pass / total) * 100) : 0;
      opts.summary.className = "tr-sum " + (fail ? "ko" : "ok");
      opts.summary.innerHTML =
        '<div class="tr-sum-line"><b>' + pass + ' / ' + total + '</b> test superati'
        + (fail ? ' &nbsp;·&nbsp; <span class="tr-sum-fail">' + fail + ' falliti</span>' : ' &nbsp;·&nbsp; tutto verde')
        + '</div><div class="tr-progress"><span style="width:' + pct + '%"></span></div>';
    }
    return { total: total, pass: pass, fail: fail };
  };
})(typeof window !== "undefined" ? window : this);
