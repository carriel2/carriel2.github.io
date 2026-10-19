(function () {
  const LANG_COLORS = {
    Python: "#5b9bd5", JavaScript: "#f1e05a", TypeScript: "#4d8fe0", HTML: "#f0743e", CSS: "#a782ff",
    Dockerfile: "#5fb8d6", Dart: "#18c6bb", Java: "#d18b3a", PLpgSQL: "#7aa6e0", Swift: "#f2704a",
    Kotlin: "#b98cff", Shell: "#89e051", C: "#8f9bab", "C++": "#f34b7d", Go: "#00add8", Rust: "#dea584"
  };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // stable 7-char pseudo-hash for the git log
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
  };

  const langShare = (langs) => {
    const entries = Object.entries(langs || {});
    const total = entries.reduce((a, [, v]) => a + v, 0);
    if (!total) return [];
    return entries
      .map(([name, v]) => ({ name, pct: (v / total) * 100, color: LANG_COLORS[name] || "#8b98a8" }))
      .sort((a, b) => b.pct - a.pct);
  };

  const relTime = (iso) => {
    const t = I18N.t.bind(I18N);
    const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return t("time.today");
    if (days === 1) return t("time.yesterday");
    const pt = I18N.lang === "pt";
    if (days < 45) return `${days}d`;
    if (days < 365) {
      const m = Math.round(days / 30);
      return pt ? `${m} ${m === 1 ? "mês" : "meses"}` : `${m}mo`;
    }
    const y = days / 365;
    const n = y < 2 ? y.toFixed(1).replace(".0", "") : String(Math.floor(y));
    return pt ? `${n.replace(".", ",")} ${n === "1" ? "ano" : "anos"}` : `${n}y`;
  };

  const fmtDate = (iso) => {
    const d = new Date(iso.slice(0, 10) + "T12:00:00");
    return d.toLocaleDateString(I18N.lang === "pt" ? "pt-BR" : "en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  // decorate projects with derived fields
  const projects = window.PROJECTS.map((p) => ({
    ...p,
    id: slug(p.repo),
    title: p.title || p.repo,
    url: p.private ? null : `https://github.com/${PROFILE.github}/${p.repo}`
  }));

  const find = (q) => {
    if (!q) return null;
    const s = slug(q);
    return projects.find((p) => p.id === s || slug(p.title) === s)
      || projects.find((p) => p.id.startsWith(s) || slug(p.title).startsWith(s));
  };

  // which projects use a given stack item (fuzzy, by keyword)
  const usedBy = (item) => {
    const words = item.toLowerCase().split(/[\s/()]+/).filter((w) => w.length > 2 && !["api", "and", "the"].includes(w));
    return projects.filter((p) => {
      const hay = [...p.stack, ...Object.keys(p.langs), p.desc.pt, p.desc.en].join(" ").toLowerCase();
      return words.some((w) => hay.includes(w));
    });
  };

  window.U = { esc, slug, hash, langShare, relTime, fmtDate, projects, find, usedBy, LANG_COLORS };
})();
