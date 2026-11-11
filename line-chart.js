/* ==========================================================================
   line-chart.js — a small dependency-free multi-series line chart.
   Renders SVG so it stays sharp at any zoom and inherits the design tokens.

   Usage:
     LineChart.render(document.querySelector('#trends'), {
       labels: ['1 Aug', ...],
       series: [{ key:'revenue', name:'Revenue', color:'var(--series-revenue)', values:[...] }],
       format: (v) => '$' + v.toLocaleString()
     });
   ========================================================================== */

window.LineChart = (function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const PAD = { top: 12, right: 8, bottom: 24, left: 48 };

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    for (const key in attrs) node.setAttribute(key, attrs[key]);
    return node;
  }

  function niceCeil(value) {
    if (value <= 0) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const scaled = value / magnitude;
    const step = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
    return step * magnitude;
  }

  function render(svg, options) {
    const width = svg.clientWidth || 720;
    const height = svg.clientHeight || 280;
    const active = options.series.filter((s) => s.hidden !== true);

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.replaceChildren();

    const allValues = active.flatMap((s) => s.values);
    const rawMax = Math.max(...allValues, 0);
    const rawMin = Math.min(...allValues, 0);
    const max = niceCeil(rawMax);
    const min = rawMin < 0 ? -niceCeil(Math.abs(rawMin)) : 0;

    const plotW = width - PAD.left - PAD.right;
    const plotH = height - PAD.top - PAD.bottom;
    const count = options.labels.length;

    const x = (i) => PAD.left + (count === 1 ? plotW / 2 : (i / (count - 1)) * plotW);
    const y = (v) => PAD.top + plotH - ((v - min) / (max - min || 1)) * plotH;

    /* Grid and value axis */
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const value = min + ((max - min) / ticks) * t;
      const gy = y(value);
      svg.appendChild(
        el("line", {
          x1: PAD.left, x2: width - PAD.right, y1: gy, y2: gy,
          stroke: value === 0 && min < 0 ? "var(--gray-300)" : "var(--gray-100)",
          "stroke-width": 1,
        })
      );
      const label = el("text", {
        x: PAD.left - 10, y: gy + 3.5,
        "text-anchor": "end",
        fill: "var(--text-tertiary)",
        "font-size": "10.5",
      });
      label.textContent = options.tickFormat ? options.tickFormat(value) : value;
      svg.appendChild(label);
    }

    const MIN_LABEL_GAP = 64;
    const stepPx = count > 1 ? plotW / (count - 1) : plotW;
    const every = Math.max(1, Math.ceil(MIN_LABEL_GAP / stepPx));

    const last = count - 1;
    const positions = [];
    for (let i = last; i >= 0; i -= every) positions.unshift(i);

    positions.forEach((i) => {
      const label = el("text", {
        x: x(i), y: height - 6,
        // The outer two anchor inward so they cannot hang off the plot.
        "text-anchor": i === last ? "end" : i === 0 ? "start" : "middle",
        fill: "var(--text-tertiary)",
        "font-size": "10.5",
      });
      label.textContent = options.labels[i];
      svg.appendChild(label);
    });

    /* Series */
    active.forEach((serie) => {
      const d = serie.values
        .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`)
        .join(" ");
      svg.appendChild(
        el("path", {
          d,
          fill: "none",
          stroke: serie.color,
          "stroke-width": 1.75,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        })
      );
    });

    /* Crosshair + hover markers */
    const crosshair = el("line", {
      y1: PAD.top, y2: PAD.top + plotH,
      stroke: "var(--gray-300)",
      "stroke-width": 1,
      opacity: 0,
    });
    svg.appendChild(crosshair);

    const markers = active.map((serie) => {
      const dot = el("circle", {
        r: 3.5,
        fill: "var(--surface)",
        stroke: serie.color,
        "stroke-width": 2,
        opacity: 0,
      });
      svg.appendChild(dot);
      return dot;
    });

    const tip = options.tooltip;

    function moveTo(index) {
      const cx = x(index);
      crosshair.setAttribute("x1", cx);
      crosshair.setAttribute("x2", cx);
      crosshair.setAttribute("opacity", 1);

      markers.forEach((dot, s) => {
        dot.setAttribute("cx", cx);
        dot.setAttribute("cy", y(active[s].values[index]));
        dot.setAttribute("opacity", 1);
      });

      if (!tip) return;
      tip.dataset.open = "true";
      tip.innerHTML =
        `<div class="chart-tip__date">${options.labels[index]}</div>` +
        active
          .map(
            (s) =>
              `<div class="chart-tip__row"><span class="dot" style="color:${s.color}"></span>` +
              `<span>${s.name}</span><span>${options.format(s.values[index])}</span></div>`
          )
          .join("");

      const box = svg.getBoundingClientRect();
      const host = tip.offsetParent.getBoundingClientRect();
      const left = box.left - host.left + cx + 12;
      const maxLeft = box.width - tip.offsetWidth - 8;
      tip.style.left = Math.min(left, maxLeft) + "px";
      tip.style.top = box.top - host.top + PAD.top + "px";
    }

    function clear() {
      crosshair.setAttribute("opacity", 0);
      markers.forEach((d) => d.setAttribute("opacity", 0));
      if (tip) tip.dataset.open = "false";
    }

    svg.onpointermove = (event) => {
      const box = svg.getBoundingClientRect();
      const rel = ((event.clientX - box.left) / box.width) * width;
      const index = Math.max(0, Math.min(count - 1, Math.round(((rel - PAD.left) / plotW) * (count - 1))));
      moveTo(index);
    };
    svg.onpointerleave = clear;
  }

  function bind(svg, options) {
    const draw = () => render(svg, options);
    draw();
    let frame;
    new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }).observe(svg);
    return draw;
  }

  return { render, bind };
})();
