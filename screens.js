/* ==========================================================================
   screens.js — the three screens, built with the application's own markup.

   Every class name below is one the app already renders: .prod-verdict,
   .badge--metric, .prod-panels, .prod-mini, .prod-best, .prod-rule,
   .prod-dist, .product-grid, .product-card, .move, .digest, .winners. The
   column order in the products table is the COLUMNS array from
   page-products.js, in that order. The insight panels are the six functions
   in page-insights.js, with their real titles and subtitles.

   The five homepage versions differ in how these are framed and sequenced.
   They do not differ in what the screens look like, because the screens are
   not ours to restyle.
   ========================================================================== */
window.Screens = (function () {
  "use strict";

  function money(n) {
    var v = Math.round(n);
    return (v < 0 ? "−€" : "€") + Math.abs(v).toLocaleString("en-GB");
  }

  /* roasTone from page-products.js, unchanged: 3 and 2 are the lines. */
  function roasTone(v) { return v >= 3 ? "positive" : v >= 2 ? "warning" : "negative"; }

  function roasBadge(v, spend) {
    if (!spend) return '<span class="muted">0.00</span>';
    return '<span class="badge badge--metric" data-tone="' + roasTone(v) + '">' + v.toFixed(2) + "</span>";
  }

  /* The insights panels use a lower bar: TESTED = 15 of spend, and the tones
     are 2 and 1 rather than 3 and 2. Two scales, because the two pages are
     asking different questions. Kept separate on purpose. */
  function panelRoas(v, spend) {
    if (!spend) return '<span class="muted">—</span>';
    if (spend < 15) return '<span class="muted">' + v.toFixed(2) + "</span>";
    var tone = v >= 2 ? "positive" : v >= 1 ? "warning" : "negative";
    return '<span class="badge" data-tone="' + tone + '">' + v.toFixed(2) + "</span>";
  }

  var VERDICTS = {
    stop:    { tone: "negative", label: "Stop" },
    stalled: { tone: "warning",  label: "Never shown" },
    testing: { tone: "neutral",  label: "Too early" },
    waiting: { tone: "neutral",  label: "No spend yet" },
    selling: { tone: "positive", label: "Selling" }
  };

  function verdict(key) {
    var v = VERDICTS[key] || VERDICTS.waiting;
    return '<span class="prod-verdict" data-tone="' + v.tone + '">' + v.label + "</span>";
  }

  /* A stand-in for a product photograph. Inventing photography for a
     competitor's catalogue would be dishonest, and a flat tile with the
     product's initial carries the layout just as well. */
  function thumb(cls, seed, letter) {
    var hues = [258, 222, 32, 4, 160, 280];
    return '<span class="' + cls + '" style="background:hsl(' + hues[seed % hues.length] +
      ' 42% 92%);display:grid;place-items:center;font-size:.6875rem;font-weight:600;' +
      'color:hsl(' + hues[seed % hues.length] + ' 38% 38%)">' + letter + "</span>";
  }

  /* ---------------------------------------------------------------------
     PRODUCTS — the real table, real columns, real verdict chips
     --------------------------------------------------------------------- */
  var PRODUCTS = [
    { t: "Linen Wrap Dress",        v: "selling", roas: 4.77, rev: 14820, cost: 3110, r7: 5.10, r14: 4.92, r30: 4.81, u: 198, imp: 184200, ctr: 1.84, cpc: 0.41, first: "3d",  pub: "12 Jun" },
    { t: "Ribbed Knit Cardigan",    v: "selling", roas: 4.18, rev: 11460, cost: 2740, r7: 3.88, r14: 4.02, r30: 4.14, u: 163, imp: 151800, ctr: 1.62, cpc: 0.44, first: "5d",  pub: "2 Jul" },
    { t: "Pleated Midi Skirt",      v: "selling", roas: 4.22, rev:  9205, cost: 2180, r7: 4.44, r14: 4.31, r30: 4.26, u: 121, imp: 118400, ctr: 1.57, cpc: 0.46, first: "4d",  pub: "19 Jul" },
    { t: "Cotton Poplin Shirt",     v: "selling", roas: 4.19, rev:  6118, cost: 1460, r7: 3.21, r14: 3.76, r30: 4.02, u:  97, imp:  86300, ctr: 1.49, cpc: 0.47, first: "8d",  pub: "1 Aug" },
    { t: "Oversized Denim Jacket",  v: "stop",    roas: 0.94, rev: 16340, cost: 9870, r7: 0.61, r14: 0.78, r30: 0.88, u: 142, imp: 402100, ctr: 1.12, cpc: 0.52, first: "2d",  pub: "4 May" },
    { t: "Faux Fur Gilet",          v: "stop",    roas: 0.61, rev:   496, cost:  812, r7: 0.40, r14: 0.55, r30: 0.61, u:   6, imp:  38700, ctr: 0.94, cpc: 0.49, first: "11d", pub: "22 Aug" },
    { t: "Metallic Clutch",         v: "stalled", roas: 0.00, rev:     0, cost:  304, r7: 0.00, r14: 0.00, r30: 0.00, u:   0, imp:  21400, ctr: 0.71, cpc: 0.44, first: "—", pub: "9 Sep" },
    { t: "Wide Leg Trouser",        v: "testing", roas: 1.31, rev:   246, cost:  188, r7: 1.31, r14: 0.00, r30: 1.31, u:   3, imp:  12900, ctr: 1.21, cpc: 0.41, first: "6d",  pub: "28 Sep" },
    { t: "Cropped Wool Blazer",     v: "waiting", roas: 0.00, rev:     0, cost:    0, r7: 0.00, r14: 0.00, r30: 0.00, u:   0, imp:      0, ctr: 0.00, cpc: 0.00, first: "4d live", pub: "6 Nov" }
  ];

  function productsTable(limit) {
    var rows = PRODUCTS.slice(0, limit || PRODUCTS.length).map(function (p, i) {
      return "<tr>" +
        '<td><div class="cell-media">' + thumb("cell-media__thumb", i, p.t[0]) +
        '<div class="cell-stack"><strong>' + p.t + "</strong>" +
        '<span class="cell-stack__sub">' + (p.v === "waiting" ? "Draft" : "Live") + "</span></div></div></td>" +
        "<td>" + verdict(p.v) + "</td>" +
        '<td class="num">' + roasBadge(p.roas, p.cost) + "</td>" +
        '<td class="num">' + (p.rev ? money(p.rev) : '<span class="muted">' + money(0) + "</span>") + "</td>" +
        '<td class="num">' + (p.cost ? money(p.cost) : '<span class="muted">' + money(0) + "</span>") + "</td>" +
        '<td class="num">' + roasBadge(p.r7, p.cost && p.r7) + "</td>" +
        '<td class="num">' + roasBadge(p.r14, p.cost && p.r14) + "</td>" +
        '<td class="num">' + roasBadge(p.r30, p.cost && p.r30) + "</td>" +
        '<td class="num">' + (p.u ? p.u : '<span class="muted">0</span>') + "</td>" +
        '<td class="num muted">' + p.imp.toLocaleString("en-GB") + "</td>" +
        '<td class="num muted">' + p.ctr.toFixed(2) + "%</td>" +
        '<td class="num muted">' + money(p.cpc).replace("€", "€") + "</td>" +
        '<td class="num muted">' + p.first + "</td>" +
        '<td class="num muted">' + p.pub + "</td>" +
        "</tr>";
    }).join("");

    return '<div class="table-wrap"><table class="table" style="min-width:64rem">' +
      "<thead><tr>" +
      '<th class="prod-head">Product</th><th class="prod-head"></th>' +
      '<th class="prod-head num">Total ROAS</th>' +
      '<th class="prod-head num">Total revenue</th>' +
      '<th class="prod-head num">Total ad spend</th>' +
      '<th class="prod-head num">ROAS 7D</th>' +
      '<th class="prod-head num">ROAS 14D</th>' +
      '<th class="prod-head num">ROAS 30D</th>' +
      '<th class="prod-head num">Units sold</th>' +
      '<th class="prod-head num">Impr.</th>' +
      '<th class="prod-head num">CTR</th>' +
      '<th class="prod-head num">CPC</th>' +
      '<th class="prod-head num">To 1st spend</th>' +
      '<th class="prod-head num">Published</th>' +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>";
  }

  /* ---------------------------------------------------------------------
     INSIGHTS — the six panels from page-insights.js
     --------------------------------------------------------------------- */
  function panel(title, sub, inner, flush) {
    return '<section class="card prod-panel"><div class="card__head"><div>' +
      '<h2 class="card__title">' + title + "</h2>" +
      '<p class="card__sub">' + sub + "</p></div></div>" +
      '<div class="card__body' + (flush === false ? "" : " card__body--flush") + '">' + inner + "</div></section>";
  }

  function miniTable(head, rows) {
    return '<table class="table prod-mini"><thead><tr>' + head +
      "</tr></thead><tbody>" + rows + "</tbody></table>";
  }

  function panelList() {
    var cats = [
      { n: "Dresses",    live: 38, stop: 2, cost: 4820, u: 198, roas: 4.12, best: true },
      { n: "Knitwear",   live: 29, stop: 1, cost: 3140, u: 163, roas: 3.48 },
      { n: "Skirts",     live: 21, stop: 0, cost: 2180, u: 121, roas: 3.26 },
      { n: "Shirts",     live: 17, stop: 0, cost: 1460, u:  97, roas: 2.94 },
      { n: "Outerwear",  live: 24, stop: 4, cost: 9870, u: 142, roas: 0.94 },
      { n: "Accessories",live: 11, stop: 3, cost:  412, u:   4, roas: 0.42 }
    ];
    var catRows = cats.map(function (c) {
      return "<tr" + (c.best ? ' class="prod-best"' : "") + ">" +
        "<td><strong>" + c.n + "</strong><span class=\"prod-sub\">" + c.live + " live" +
        (c.stop ? ", " + c.stop + " to stop" : "") + "</span></td>" +
        '<td class="num">' + money(c.cost) + "</td>" +
        '<td class="num">' + (c.u || "—") + "</td>" +
        '<td class="num">' + panelRoas(c.roas, c.cost) + "</td></tr>";
    }).join("");

    var bands = [
      { f: 30,  p: 14, cost:  380, u:  28, roas: 1.84 },
      { f: 40,  p: 22, cost:  910, u:  61, roas: 2.61 },
      { f: 50,  p: 31, cost: 1740, u: 112, roas: 3.11 },
      { f: 60,  p: 44, cost: 3260, u: 164, roas: 4.36, best: true },
      { f: 70,  p: 36, cost: 2480, u:  98, roas: 3.42 },
      { f: 90,  p: 19, cost: 1120, u:  47, roas: 2.18 },
      { f: 120, p:  9, cost:  640, u:  18, roas: 1.42 }
    ];
    var bandRows = bands.map(function (b) {
      return "<tr" + (b.best ? ' class="prod-best"' : "") + ">" +
        "<td><strong>" + money(b.f) + "–" + money(b.f + 9) + "</strong>" +
        '<span class="prod-sub">' + b.p + " products</span></td>" +
        '<td class="num">' + money(b.cost) + "</td>" +
        '<td class="num">' + b.u + "</td>" +
        '<td class="num">' + panelRoas(b.roas, b.cost) + "</td></tr>";
    }).join("");

    var words = [
      { w: "linen",     p: 24, cost: 3840, u: 211, roas: 4.41, best: true },
      { w: "wrap",      p: 11, cost: 1920, u:  96, roas: 3.88 },
      { w: "midi",      p: 18, cost: 2310, u: 118, roas: 3.42 },
      { w: "ribbed",    p:  9, cost: 1240, u:  57, roas: 2.96 },
      { w: "oversized", p: 14, cost: 4180, u:  61, roas: 1.14 },
      { w: "essential", p:  7, cost:  520, u:   6, roas: 0.68 }
    ];
    var wordRows = words.map(function (w) {
      return "<tr" + (w.best ? ' class="prod-best"' : "") + ">" +
        "<td><strong>" + w.w + "</strong><span class=\"prod-sub\">in " + w.p + " titles</span></td>" +
        '<td class="num">' + money(w.cost) + "</td>" +
        '<td class="num">' + w.u + "</td>" +
        '<td class="num">' + panelRoas(w.roas, w.cost) + "</td></tr>";
    }).join("");

    var buckets = [3, 19, 26, 14, 8, 4, 2, 1];
    var peak = Math.max.apply(null, buckets);
    var bars = buckets.map(function (n, i) {
      var on = i === 1;  /* the median falls in the 4-7 day bucket */
      return '<span class="prod-dist__bar" data-on="' + on + '" style="height:' +
        Math.max(Math.round(n / peak * 100), n ? 8 : 2) + '%"></span>';
    }).join("");

    var halo = [
      { t: "Oversized Denim Jacket", own: 0,    halo: 2840, silent: true },
      { t: "Linen Wrap Dress",       own: 14820, halo: 1120 },
      { t: "Cotton Poplin Shirt",    own: 6118,  halo: 640 }
    ];
    var haloRows = halo.map(function (h, i) {
      return "<tr" + (h.silent ? ' class="prod-best"' : "") + ">" +
        '<td><div class="cell-media">' + thumb("prod-mini__thumb", i + 2, h.t[0]) +
        '<div class="cell-stack"><strong class="prod-mini__name">' + h.t + "</strong></div></div></td>" +
        '<td class="num">' + (h.own ? money(h.own) : '<span class="muted">—</span>') + "</td>" +
        '<td class="num">' + money(h.halo) + "</td></tr>";
    }).join("");

    var head4 = '<th>Category</th><th class="num">Spend</th><th class="num">Sold</th><th class="num">ROAS</th>';

    return [
      panel("By category", "What to import more of",
        miniTable(head4, catRows)),

      panel("By price", "Which price point sells, at shelf price",
        miniTable('<th>Price</th><th class="num">Spend</th><th class="num">Sold</th><th class="num">ROAS</th>', bandRows)),

      panel("Your stop rule", "Whether " + money(450) + " is the right line",
        '<div class="prod-rule">' +
        '<p class="prod-rule__lead">No seller needed more than ' + money(450) + "</p>" +
        '<dl class="prod-rule__grid">' +
        "<div><dt>Typical spend before first sale</dt><dd>" + money(118) + "</dd></div>" +
        "<div><dt>Slowest to sell</dt><dd>" + money(392) + "</dd></div>" +
        "<div><dt>Passed the line</dt><dd>7</dd></div>" +
        "<div><dt>Of those, sold anyway</dt><dd>0 · 0%</dd></div>" +
        "</dl>" +
        '<p class="prod-rule__note">The line is sitting above every winner so far, ' +
        "so it is not cutting anything short.</p></div>", false),

      panel("Words that sell", "Which words in your titles earn their clicks",
        miniTable('<th>Word</th><th class="num">Spend</th><th class="num">Sold</th><th class="num">ROAS</th>', wordRows)),

      panel("Time to first sale", "How long a winner takes to show itself",
        '<div class="prod-dist">' +
        '<p class="prod-dist__lead">Half sold within 6 days</p>' +
        '<div class="prod-dist__bars">' + bars + "</div>" +
        '<div class="prod-dist__axis"><span>day 0</span><span>14</span><span>28+</span></div>' +
        '<p class="prod-dist__note">The slowest took 11 days. A product younger than that ' +
        "has not finished its test, whatever it has spent.</p></div>", false),

      panel("Pulled in a sale", "Clicked, then something else was bought",
        miniTable('<th>Product</th><th class="num">Own</th><th class="num">Pulled in</th>', haloRows) +
        '<p class="prod-panel__note" style="padding:var(--space-3) var(--space-4) var(--space-4);' +
        'margin:0;font-size:var(--text-xs);color:var(--text-tertiary)">' +
        "Oversized Denim Jacket sold nothing of its own but brought in " + money(2840) +
        ". Stopping it would cost that too.</p>")
    ];
  }


  function insightPanels() {
    return panelList().join("");
  }


  function panelAt(i) {
    return panelList()[i];
  }

  /* ---------------------------------------------------------------------
     MARKET RADAR — the real split: movers grid, digest, two winners lists
     --------------------------------------------------------------------- */
  var MOVERS = [
    { t: "Satin Slip Dress",       s: "competitor A", p: "€89",  rank: 1,  move: "new",   label: "New" },
    { t: "Wool Blend Coat",        s: "competitor C", p: "€189", rank: 2,  move: "surge", label: "↑ 14" },
    { t: "Quilted Liner Jacket",   s: "competitor E", p: "€119", rank: 3,  move: "up",    label: "↑ 6" },
    { t: "Cropped Puffer",         s: "competitor A", p: "€99",  rank: 4,  move: "up",    label: "↑ 4" },
    { t: "Knit Co-ord Set",        s: "competitor A", p: "€95",  rank: 5,  move: "new",   label: "New" },
    { t: "Bouclé Jacket",     s: "competitor C", p: "€149", rank: 6,  move: "down",  label: "↓ 2" },
    { t: "Midi Shirt Dress",       s: "competitor B", p: "€59",  rank: 7,  move: "up",    label: "↑ 9" },
    { t: "Cashmere Scarf",         s: "competitor D", p: "€59",  rank: 8,  move: "none",  label: "—" }
  ];

  function moversGrid(limit) {
    return '<div class="product-grid">' + MOVERS.slice(0, limit || MOVERS.length).map(function (m, i) {
      var hues = [258, 222, 32, 4, 160, 280];
      var h = hues[i % hues.length];
      return '<article class="product-card">' +
        '<div class="product-card__media" style="background:hsl(' + h + ' 42% 94%)">' +
        '<span style="font-size:1.5rem;font-weight:600;color:hsl(' + h + ' 38% 58%)">' + m.t[0] + "</span>" +
        '<span class="product-card__rank">' + m.rank + "</span></div>" +
        '<div class="product-card__body">' +
        '<span class="product-card__name">' + m.t + "</span>" +
        '<span class="move" data-tone="' + m.move + '">' + m.label + "</span></div>" +
        '<div class="product-card__source">' + m.s + " · " + m.p + "</div>" +
        "</article>";
    }).join("") + "</div>";
  }

  var DIGEST = [
    { n: "Outerwear",   c: 23 },
    { n: "Dresses",     c: 17 },
    { n: "Knitwear",    c: 14 },
    { n: "Trousers",    c:  8 },
    { n: "Accessories", c:  6 }
  ];

  function digest() {
    var max = DIGEST[0].c;
    return '<div class="digest">' + DIGEST.map(function (d) {
      return '<div class="digest__row">' +
        '<span class="digest__name">' + d.n + "</span>" +
        '<span class="digest__count">' + d.c + " new</span>" +
        '<span class="digest__bar"><span class="digest__fill" style="width:' +
        Math.round(d.c / max * 100) + '%"></span></span></div>';
    }).join("") + "</div>";
  }

  var WINNERS = [
    { t: "Satin Slip Dress",     s: "competitor A", move: "new",   label: "New" },
    { t: "Wool Blend Coat",      s: "competitor C", move: "surge", label: "↑ 14" },
    { t: "Midi Shirt Dress",     s: "competitor B", move: "up",    label: "↑ 9" },
    { t: "Quilted Liner Jacket", s: "competitor E", move: "up",    label: "↑ 6" },
    { t: "Cropped Puffer",       s: "competitor A", move: "up",    label: "↑ 4" }
  ];

  var DRESSES = [
    { t: "Satin Slip Dress",     s: "competitor A", move: "new",   label: "New" },
    { t: "Midi Shirt Dress",     s: "competitor B", move: "up",    label: "↑ 9" },
    { t: "Linen Tiered Dress",   s: "competitor C", move: "up",    label: "↑ 5" },
    { t: "Knit Column Dress",    s: "competitor E", move: "up",    label: "↑ 3" }
  ];

  function winners(list) {
    return '<div class="winners">' + list.map(function (w, i) {
      return '<div class="winner"><span class="winner__place">' + (i + 1) + "</span>" +
        thumb("winner__media", i + 1, w.t[0]) +
        '<span class="winner__body"><span class="winner__name">' + w.t + "</span>" +
        '<span class="winner__meta">' + w.s + "</span></span>" +
        '<span class="move winner__move" data-tone="' + w.move + '">' + w.label + "</span></div>";
    }).join("") + "</div>";
  }

  function radarTabs() {
    var names = ["All stores", "Competitor A", "Competitor B", "Competitor C", "Competitor D"];
    return '<div class="competitor-tabs">' + names.map(function (n, i) {
      return '<span class="competitor-tab"' + (i === 0 ? ' aria-pressed="true"' : "") + ">" + n + "</span>";
    }).join("") + "</div>";
  }

  function radarScreen() {
    return radarTabs() +
      '<section class="split" style="margin-top:var(--space-4)">' +
      '<div class="card"><div class="card__head"><div>' +
      '<h2 class="card__title">Biggest movers</h2>' +
      '<p class="card__sub">Across every tracked store</p></div>' +
      '<div class="card__actions"><div class="segmented">' +
      '<button data-value="7" aria-pressed="true">7D</button>' +
      '<button data-value="14" aria-pressed="false">14D</button>' +
      '<button data-value="30" aria-pressed="false">30D</button>' +
      "</div></div></div>" +
      '<div class="card__body">' + moversGrid(8) + "</div></div>" +
      '<div class="split__stack" style="display:grid;gap:var(--space-4)">' +
      '<div class="card"><div class="card__head"><div>' +
      '<h2 class="card__title">What they are adding</h2>' +
      '<p class="card__sub">New products by category, last 14 days</p></div></div>' +
      '<div class="card__body">' + digest() + "</div></div>" +
      '<div class="card"><div class="card__head"><div>' +
      '<h2 class="card__title">Rising fast</h2>' +
      '<p class="card__sub">Across every store, this week</p></div></div>' +
      winners(WINNERS) + "</div>" +
      '<div class="card"><div class="card__head"><div>' +
      '<h2 class="card__title">Rising fast: dresses</h2>' +
      '<p class="card__sub">The same week, dresses only</p></div></div>' +
      winners(DRESSES) + "</div>" +
      "</div></section>";
  }

  /* ---------------------------------------------------------------------
     DASHBOARD — KPI row plus the app's own line chart
     --------------------------------------------------------------------- */
  var SERIES = (function () {
    var rev = [3180,3420,2980,3760,4120,3890,4410,4080,3520,4620,4880,5120,4760,4310,
               3980,4460,4920,5240,4880,4520,4190,4730,5080,5460,5190,4870,4530,5010,5380,4812];
    var ads = [1120,1240,1080,1380,1460,1390,1580,1470,1250,1660,1740,1820,1690,1540,
               1410,1590,1760,1870,1740,1610,1490,1680,1810,1950,1850,1740,1620,1790,1920,1643];
    var cogs = rev.map(function (r) { return Math.round(r * 0.387); });
    var profit = rev.map(function (r, i) { return r - ads[i] - cogs[i] - Math.round(r * 0.069); });
    var labels = rev.map(function (_, i) {
      var d = new Date(2026, 9, 6 + i);
      return d.getDate() + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    });
    return { rev: rev, ads: ads, cogs: cogs, profit: profit, labels: labels };
  })();

  function kpiRow() {
    return '<div class="kpi-grid">' +
      kpi("Revenue", money(62409), '<span class="delta" data-tone="up">+11.4%</span> vs previous 30 days') +
      kpi("Ad spend", money(21884), "35.1% of revenue") +
      kpi("Cost of goods", money(24146), "38.7% of revenue") +
      kpi("Net profit", money(12073), '<span class="delta" data-tone="up">19.3% margin</span>', "var(--positive)") +
      "</div>";
  }

  function kpi(label, value, foot, colour) {
    return '<div class="kpi"><span class="kpi__label">' + label + "</span>" +
      '<span class="kpi__value"' + (colour ? ' style="color:' + colour + '"' : "") + ">" + value + "</span>" +
      '<span class="kpi__foot">' + foot + "</span></div>";
  }

  /* The app's own LineChart, given the app's own series colours. */
  function drawChart(svg) {
    if (!window.LineChart || !svg) return;
    LineChart.render(svg, {
      labels: SERIES.labels,
      series: [
        { key: "revenue", name: "Revenue",    color: "var(--series-revenue)", values: SERIES.rev },
        { key: "ads",     name: "Ad spend",   color: "var(--series-adspend)", values: SERIES.ads },
        { key: "cogs",    name: "Cost of goods", color: "var(--series-cogs)", values: SERIES.cogs },
        { key: "profit",  name: "Net profit", color: "var(--series-profit)",  values: SERIES.profit }
      ],
      tickFormat: function (v) { return "€" + Math.round(v / 1000) + "k"; }
    });
  }

  function chartLegend() {
    var items = [
      ["Revenue", "var(--series-revenue)"],
      ["Ad spend", "var(--series-adspend)"],
      ["Cost of goods", "var(--series-cogs)"],
      ["Net profit", "var(--series-profit)"]
    ];
    return '<div class="legend" style="display:flex;flex-wrap:wrap;gap:var(--space-2) var(--space-4);' +
      'margin-top:var(--space-4)">' + items.map(function (i) {
        return '<span style="display:inline-flex;align-items:center;gap:var(--space-2);' +
          'font-size:var(--text-xs);color:var(--text-secondary)">' +
          '<i style="width:.5rem;height:.5rem;border-radius:.125rem;background:' + i[1] + '"></i>' +
          i[0] + "</span>";
      }).join("") + "</div>";
  }

  return {
    money: money,
    productsTable: productsTable,
    insightPanels: insightPanels,
    panelAt: panelAt,
    radarTabs: radarTabs,
    MOVERS: MOVERS,
    radarScreen: radarScreen,
    moversGrid: moversGrid,
    digest: digest,
    winners: winners,
    WINNERS: WINNERS,
    DRESSES: DRESSES,
    kpiRow: kpiRow,
    drawChart: drawChart,
    chartLegend: chartLegend,
    series: SERIES
  };
})();
