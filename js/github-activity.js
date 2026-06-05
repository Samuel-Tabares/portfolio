// GitHub Activity — Widget A: year-to-date contribution heatmap.
// Data source: jogruber's public GitHub contributions API.
// Renders an inline SVG grid (Jan 1 → today) styled to match cinematic palette.

(function () {
    const USER = "Samuel-Tabares";
    const YEAR = new Date().getFullYear();
    const API = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(USER)}?y=${YEAR}`;

    const CELL = 12;          // px
    const GAP = 3;            // px between cells
    const LEFT_PAD = 24;      // room for weekday labels
    const TOP_PAD = 18;       // room for month labels

    // Cinematic blue scale, level 0 → 4
    const PALETTE = [
        "rgba(255, 255, 255, 0.05)",
        "rgba(31, 111, 235, 0.35)",
        "rgba(31, 111, 235, 0.6)",
        "rgba(99, 152, 240, 0.85)",
        "#8b9eff",
    ];

    const MONTHS_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    function t(key, fallback) {
        try {
            const lang = (document.documentElement.lang || "es").startsWith("en") ? "en" : "es";
            const d = window.translations && window.translations[key];
            return (d && d[lang]) || fallback;
        } catch { return fallback; }
    }

    function startOfDay(d) {
        const x = new Date(d);
        x.setHours(0, 0, 0, 0);
        return x;
    }

    function fmtDate(d) {
        return d.toISOString().slice(0, 10);
    }

    function buildSvg(days) {
        // Group into columns (weeks). Each column is 7 cells (Sun→Sat).
        // First column starts on the Sunday on/before Jan 1.
        const first = new Date(`${YEAR}-01-01T00:00:00`);
        const firstSunday = new Date(first);
        firstSunday.setDate(first.getDate() - first.getDay()); // Sun..Sat = 0..6

        const today = startOfDay(new Date());
        const byDate = new Map(days.map(d => [d.date, d]));

        const weeks = [];
        let cursor = new Date(firstSunday);
        let weekIdx = 0;
        const monthMarkers = []; // [{ weekIdx, monthIdx }]

        while (cursor <= today) {
            const week = [];
            for (let dow = 0; dow < 7; dow++) {
                const date = new Date(cursor);
                date.setDate(cursor.getDate() + dow);
                const iso = fmtDate(date);
                const inRange = date.getFullYear() === YEAR && date <= today && date >= first;
                const rec = byDate.get(iso);
                week.push({
                    date, iso,
                    inRange,
                    count: inRange && rec ? rec.count : 0,
                    level: inRange && rec ? Math.min(4, Math.max(0, rec.level)) : 0,
                });
                // Month label marker: place over the column where day-1 of a month sits
                if (inRange && date.getDate() === 1) {
                    monthMarkers.push({ weekIdx, monthIdx: date.getMonth() });
                }
            }
            weeks.push(week);
            cursor.setDate(cursor.getDate() + 7);
            weekIdx++;
        }

        const cols = weeks.length;
        const W = LEFT_PAD + cols * (CELL + GAP);
        const H = TOP_PAD + 7 * (CELL + GAP);

        const lang = (document.documentElement.lang || "es").startsWith("en") ? "en" : "es";
        const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_ES;

        // Day labels (Mon/Wed/Fri to avoid crowding)
        const dayLabels = [
            { i: 1, label: lang === "en" ? "Mon" : "Lun" },
            { i: 3, label: lang === "en" ? "Wed" : "Mié" },
            { i: 5, label: lang === "en" ? "Fri" : "Vie" },
        ];

        let svg = `<svg class="gh-heatmap-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t("gh-heatmap-title", "Contribution heatmap"))}">`;

        // Month labels
        const seenMonths = new Set();
        for (const m of monthMarkers) {
            if (seenMonths.has(m.monthIdx)) continue;
            seenMonths.add(m.monthIdx);
            const x = LEFT_PAD + m.weekIdx * (CELL + GAP);
            svg += `<text x="${x}" y="${TOP_PAD - 6}" font-size="10" fill="#a8a8b3" font-family="Geist, system-ui, sans-serif">${MONTHS[m.monthIdx]}</text>`;
        }

        // Day labels
        for (const d of dayLabels) {
            const y = TOP_PAD + d.i * (CELL + GAP) + CELL - 2;
            svg += `<text x="0" y="${y}" font-size="9" fill="#a8a8b3" font-family="Geist, system-ui, sans-serif">${d.label}</text>`;
        }

        // Cells
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < 7; r++) {
                const cell = weeks[c][r];
                if (!cell.inRange) continue;
                const x = LEFT_PAD + c * (CELL + GAP);
                const y = TOP_PAD + r * (CELL + GAP);
                const fill = PALETTE[cell.level];
                const dateLabel = cell.date.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
                    year: "numeric", month: "short", day: "numeric",
                });
                svg += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" ry="2" fill="${fill}"><title>${cell.count} ${cell.count === 1 ? "contribution" : "contributions"} · ${dateLabel}</title></rect>`;
            }
        }

        svg += `</svg>`;
        return svg;
    }

    function esc(s) {
        return String(s ?? "").replace(/[&<>"']/g, c => (
            { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
        ));
    }

    function buildLegend() {
        const lang = (document.documentElement.lang || "es").startsWith("en") ? "en" : "es";
        const less = lang === "en" ? "Less" : "Menos";
        const more = lang === "en" ? "More" : "Más";
        const cells = PALETTE.map(c => `<span class="gh-heatmap-legend-cell" style="background:${c}"></span>`).join("");
        return `<div class="gh-heatmap-legend"><span>${less}</span><span class="gh-heatmap-legend-cells">${cells}</span><span>${more}</span></div>`;
    }

    function buildTotal(ytdSum) {
        const lang = (document.documentElement.lang || "es").startsWith("en") ? "en" : "es";
        const label = lang === "en"
            ? `<strong>${ytdSum}</strong> contributions in ${YEAR}`
            : `<strong>${ytdSum}</strong> contribuciones en ${YEAR}`;
        return `<div class="gh-heatmap-totals">${label}</div>`;
    }

    async function loadHeatmap() {
        const el = document.getElementById("gh-heatmap");
        if (!el) return;
        try {
            const r = await fetch(API);
            if (!r.ok) throw new Error("HTTP " + r.status);
            const data = await r.json();
            const all = Array.isArray(data.contributions) ? data.contributions : [];
            const today = startOfDay(new Date());
            const ytd = all.filter(d => {
                const date = new Date(d.date + "T00:00:00");
                return date <= today && date.getFullYear() === YEAR;
            });
            const sum = ytd.reduce((s, d) => s + (d.count || 0), 0);
            if (!ytd.length) {
                el.innerHTML = `<p class="gh-loading">${esc(t("gh-heatmap-empty", "No contributions yet this year."))}</p>`;
                return;
            }
            el.innerHTML = buildSvg(ytd) + buildLegend() + buildTotal(sum);
        } catch (err) {
            el.innerHTML = `<p class="gh-error">${esc(t("gh-heatmap-error", "Heatmap service unavailable."))}</p>`;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadHeatmap);
    } else {
        loadHeatmap();
    }
})();
