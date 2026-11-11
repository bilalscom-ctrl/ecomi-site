/* ==========================================================================
   motion.js — the three things that move.

   A block arrives the first time it is seen, a chart line draws itself, and
   a number counts up to its value. Each happens once. Nothing loops while
   it is being read, and everything is skipped when the reader has asked for
   reduced motion.
   ========================================================================== */
var Motion = (function () {
  "use strict";

  var still = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function each(sel, root, fn) {
    Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn);
  }


  /* ---- Charts: the app's own LineChart, then draw the strokes --------- */
  function charts() {
    each("svg.js-chart", document, function (svg) {
      Screens.drawChart(svg);

      each("path", svg, function (p) {
        if (!p.getAttribute("stroke") || p.getAttribute("stroke") === "none") return;
        var len = typeof p.getTotalLength === "function" ? p.getTotalLength() : 0;
        if (!len) return;
        p.setAttribute("data-draw", "");
        p.style.setProperty("--len", len);
      });
    });

    each(".js-legend", document, function (el) {
      el.innerHTML = Screens.chartLegend();
    });
  }


  function drawIn(root) {
    each("path[data-draw]", root, function (p, i) {
      setTimeout(function () { p.classList.add("is-drawn"); }, 90 * i);
    });
  }


  /* ---- Counters ------------------------------------------------------- */
  function count(el) {
    var target = el.textContent;
    var num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (!isFinite(num)) return;

    var head = target.slice(0, target.search(/[0-9]/));
    var tail = target.slice(target.search(/[0-9]/)).replace(/^[0-9.,]+/, "");
    var dec = (target.split(".")[1] || "").replace(/[^0-9]/g, "").length;
    var t0 = null;

    function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / 900, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      var v = num * eased;
      el.textContent = head +
        (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US")) + tail;
      if (k < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }


  /* ---- Reveal on first sight ----------------------------------------- */
  function reveal() {
    if (still || !("IntersectionObserver" in window)) {
      each("[data-reveal]", document, function (el) { el.classList.add("is-in"); });
      each("path[data-draw]", document, function (p) { p.classList.add("is-drawn"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
        drawIn(e.target);
        each("[data-count]", e.target, count);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    each("[data-reveal]", document, function (el) { io.observe(el); });
  }


  /* ---- The topbar gains its hairline once the page has moved --------- */
  function topbar() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;

    function check() {
      bar.classList.toggle("is-stuck", window.scrollY > 8);
    }

    check();
    window.addEventListener("scroll", check, { passive: true });
  }


  /* ---- Which section the reader is in -------------------------------- */
  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
    var ids = links.map(function (a) { return a.getAttribute("href").slice(1); });
    var secs = ids.map(function (id) { return document.getElementById(id); });
    if (!secs.filter(Boolean).length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id);
          if (a.getAttribute("href") === "#" + e.target.id) a.setAttribute("aria-current", "true");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    secs.forEach(function (s) { if (s) io.observe(s); });
  }


  /* ---- A rail of three, one of them live ------------------------------
     It advances on its own until the reader points at one, and then stays
     where they put it: a thing that keeps moving under the cursor is a
     thing nobody can read. */
  function rail(root, onChange) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".rail__item"));
    if (!items.length) return;

    var at = 0;
    var held = false;
    var timer = null;

    function show(i) {
      at = i;
      items.forEach(function (el, n) { el.classList.toggle("is-live", n === i); });
      if (onChange) onChange(i, items[i]);
    }

    function tick() {
      if (!held) show((at + 1) % items.length);
    }

    items.forEach(function (el, i) {
      el.addEventListener("mouseenter", function () { held = true; show(i); });
      el.addEventListener("focusin", function () { held = true; show(i); });
      el.addEventListener("click", function () { held = true; show(i); });
    });

    show(0);

    if (still) return;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !timer) {
            timer = setInterval(tick, 3600);
          } else if (!e.isIntersecting && timer) {
            clearInterval(timer);
            timer = null;
          }
        });
      }, { threshold: 0.3 }).observe(root);
    } else {
      timer = setInterval(tick, 3600);
    }
  }


  function start() {
    charts();
    reveal();
    topbar();
    spy();
  }


  return { start: start, rail: rail, count: count };
})();
