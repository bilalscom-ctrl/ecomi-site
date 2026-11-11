/* ==========================================================================
   parts.js — the demos, composed once and used by all five pages.

   Every demo below is the product's own markup, taken from screens.js. What
   this file adds is framing: how much of the screen is shown, at what scale,
   and at what height, so a demo sits beside its paragraph instead of
   towering over it.
   ========================================================================== */
var Parts = (function () {
  "use strict";

  function attr(o) {
    var s = [];
    if (o.scale) { s.push("--shot-scale:" + o.scale); }
    if (o.h) { s.push("--shot-h:" + o.h); }
    return s.length ? ' style="' + s.join(";") + '"' : "";
  }


  /* A framed screen: optional chrome bar, a clipped stage, an optional
     caption that lives inside the frame. */
  function shot(o) {
    var cls = "shot" + (o.flat ? " shot--flat" : "") + (o.cls ? " " + o.cls : "");
    var html = '<div class="' + cls + '"' + (o.h || o.scale ? attr(o) : "") + ">";

    if (o.path) {
      html += '<div class="shot__bar"><span class="shot__dots"><i></i><i></i><i></i></span>' +
        '<span class="shot__path">app.ecomi.app' + o.path + "</span></div>";
    }

    html += '<div class="shot__stage"' + (o.fade === false ? "" : ' data-fade="true"') +
      (o.fadeX ? ' data-fade-x="true"' : "") + ">" +
      '<div class="shot__canvas' + (o.tight ? " shot__canvas--tight" : "") + '">' +
      o.body + "</div></div>";

    if (o.note) {
      html += '<div class="shot__note">' + o.note + "</div>";
    }

    return html + "</div>";
  }


  /* ---- The four screens, at the sizes the page uses ------------------- */

  function chartCard() {
    return '<section class="card">' +
      '<div class="card__head"><div><h2 class="card__title">Revenue, ad spend, ' +
      'cost of goods and profit</h2><p class="card__sub">Per day</p></div></div>' +
      '<div class="card__body"><svg class="chart js-chart"></svg>' +
      '<div class="js-legend"></div></div></section>';
  }


  /* The dashboard in two widths. A narrow column gets the chart alone: four
     KPI cards folded into two rows beside a paragraph is not a dashboard,
     it is a pile. */
  function dash(o) {
    o = o || {};

    if (o.chartOnly) {
      return shot({
        path: o.path === false ? null : "/dashboard",
        scale: o.scale || "1",
        h: o.h || "17rem",
        cls: o.cls,
        body: '<div class="screen-head"><h3 class="d4">Emma Lovett</h3>' +
          '<p class="muted-note">Last 30 days &middot; EUR</p></div>' + chartCard(),
        note: o.note
      });
    }

    return shot({
      path: o.path === false ? null : "/dashboard",
      scale: o.scale || ".92",
      h: o.h || "24rem",
      cls: o.cls,
      body:
        '<div class="screen-head"><h3 class="d4">Emma Lovett</h3>' +
        '<p class="muted-note">Last 30 days &middot; EUR</p></div>' +
        Screens.kpiRow() +
        '<section class="card" style="margin-top:var(--space-3)">' +
        '<div class="card__head"><div><h2 class="card__title">Revenue, ad spend, cost of goods and profit</h2>' +
        '<p class="card__sub">Per day</p></div></div>' +
        '<div class="card__body"><svg class="chart js-chart"></svg>' +
        '<div class="js-legend"></div></div></section>',
      note: o.note
    });
  }


  function products(o) {
    o = o || {};
    return shot({
      path: o.path === false ? null : "/products",
      scale: o.scale || ".58",
      h: o.h || "21rem",
      cls: o.cls,
      fadeX: o.fadeX,
      tight: true,
      body: '<section class="card"><div class="card__body card__body--flush">' +
        Screens.productsTable(o.rows) + "</div></section>",
      note: o.note
    });
  }


  function insights(o) {
    o = o || {};
    return shot({
      path: o.path === false ? null : "/insights",
      scale: o.scale || ".66",
      h: o.h || "23rem",
      cls: o.cls,
      tight: true,
      body: '<div class="prod-panels">' +
        Screens.panelAt(0) + Screens.panelAt(1) + Screens.panelAt(2) +
        Screens.panelAt(4) + "</div>",
      note: o.note
    });
  }


  function radar(o) {
    o = o || {};
    return shot({
      path: o.path === false ? null : "/market-radar",
      scale: o.scale || ".64",
      h: o.h || "22rem",
      cls: o.cls,
      tight: true,
      body: Screens.radarTabs() +
        '<div style="margin-top:var(--space-4)">' + Screens.moversGrid(o.movers || 8) + "</div>",
      note: o.note
    });
  }


  /* ---- Pieces: one part of a screen, at or near its true size --------- */

  function piece(body, o) {
    o = o || {};
    return '<div class="piece"' + attr(o) + ">" +
      (o.scale || o.h
        ? '<div class="shot__stage"' + (o.fade === false ? "" : ' data-fade="true"') +
          '><div class="shot__canvas shot__canvas--tight">' + body + "</div></div>"
        : body) + "</div>";
  }


  function rowsPiece(n, o) {
    o = o || {};
    return piece('<div class="card__body card__body--flush">' + Screens.productsTable(n || 4) + "</div>",
      { scale: o.scale || ".52", h: o.h || "9.5rem" });
  }


  function panelPiece(i, o) {
    o = o || {};
    return piece(Screens.panelAt(i), o);
  }


  function moversPiece(n, o) {
    o = o || {};
    return piece(Screens.moversGrid(n || 4),
      { scale: o.scale || ".78", h: o.h || "11rem" });
  }


  function digestPiece(o) {
    o = o || {};
    return piece(Screens.digest(), { scale: o.scale || ".82", h: o.h || "10rem" });
  }


  function winnersPiece(o) {
    o = o || {};
    return piece(Screens.winners(Screens.DRESSES),
      { scale: o.scale || ".82", h: o.h || "10rem" });
  }


  function chartPiece(o) {
    o = o || {};
    return '<div class="piece"><div style="padding:var(--space-4)">' +
      '<svg class="chart js-chart"></svg><div class="js-legend"></div></div></div>' +
      (o.note ? "" : "");
  }


  /* ---- Small shared blocks -------------------------------------------- */

  function mark() {
    return '<span class="brand__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 17l6-6 4 4 8-8"/></svg></span>';
  }


  function tick() {
    return '<span class="ticks__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M20 6L9 17l-5-5"/></svg></span>';
  }


  function arrow() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }


  function topbar(active) {
    var items = [
      ["#products", "Products"],
      ["#insights", "Insights"],
      ["#radar", "Market radar"],
      ["#start", "Getting started"]
    ];
    return '<header class="topbar"><div class="wrap topbar__in">' +
      '<a class="brand" href="#top">' + mark() + '<span>Ecomi</span></a>' +
      '<nav class="nav">' + items.map(function (i) {
        return '<a href="' + i[0] + '"' + (i[0] === active ? ' aria-current="true"' : "") +
          ">" + i[1] + "</a>";
      }).join("") + "</nav>" +
      '<a class="btn btn--primary btn--round" href="#">Sign in</a>' +
      "</div></header>";
  }


  function footer() {
    return '<footer class="foot"><div class="wrap foot__in">' +
      "<span>&copy; 2026 Ecomi &middot; Registered in the Netherlands</span>" +
      '<span class="foot__links"><a href="#">Privacy</a><a href="#">Terms</a>' +
      '<a href="#">support@ecomi.app</a></span></div></footer>';
  }


  function strip() {
    return '<div class="wrap"><div class="strip">' +
      "<span>Connects to <b>Shopify</b></span>" +
      "<span><b>Google Ads</b>, read-only</span>" +
      "<span><b>Merchant Center</b> feed status</span>" +
      "<span>Multi-store, <b>one reporting currency</b></span>" +
      "</div></div>";
  }


  return {
    shot: shot,
    dash: dash,
    products: products,
    insights: insights,
    radar: radar,
    piece: piece,
    rowsPiece: rowsPiece,
    panelPiece: panelPiece,
    moversPiece: moversPiece,
    digestPiece: digestPiece,
    winnersPiece: winnersPiece,
    chartPiece: chartPiece,
    mark: mark,
    tick: tick,
    arrow: arrow,
    topbar: topbar,
    footer: footer,
    strip: strip
  };
})();
