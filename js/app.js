(function () {
  const { esc } = U;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const L = (o) => I18N.pick(o);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = { ns: null, view: "grid", open: null };

  /* ───────────── boot ───────────── */
  function boot() {
    const el = $("#boot");
    let seen = false;
    try { seen = sessionStorage.getItem("pc.booted") === "1"; } catch (e) {}
    if (seen || reduced) { el.remove(); return Promise.resolve(); }

    const log = $("#boot-log");
    const nsList = Object.keys(NAMESPACES);
    const lines = [
      `[    0.000000] <span class="hi">pedro-carriel</span> kernel 6.9.0-cloud #1 SMP PREEMPT`,
      `[    0.004211] Initializing cgroup subsys cpuset, memory, ambition`,
      `[    0.019873] containerd: loading ${U.projects.length} images`,
      ...nsList.map((ns, i) => `[    0.0${41 + i * 7}112] kube-scheduler: namespace/${ns} <span class="ok">created</span>`),
      `[    0.112309] kubelet: ${U.projects.length}/${U.projects.length} pods <span class="ok">Running</span>`,
      `[    0.131772] grafana: dashboards provisioned`,
      `[    0.150000] <span class="ok">[  OK  ]</span> Reached target <span class="hi">Portfolio</span>.`
    ];
    return new Promise((resolve) => {
      let i = 0, done = false;
      const finish = () => {
        if (done) return; done = true;
        try { sessionStorage.setItem("pc.booted", "1"); } catch (e) {}
        el.classList.add("done");
        setTimeout(() => el.remove(), 700);
        window.removeEventListener("keydown", finish);
        el.removeEventListener("click", finish);
        resolve();
      };
      window.addEventListener("keydown", finish);
      el.addEventListener("click", finish);
      const tick = () => {
        if (done) return;
        if (i < lines.length) { log.innerHTML += lines[i++] + "\n"; setTimeout(tick, 70 + Math.random() * 90); }
        else setTimeout(finish, 380);
      };
      tick();
    });
  }

  /* ───────────── about + stats ───────────── */
  function renderAbout() {
    // highlight a few keywords with the serif accent
    const marks = { pt: ["infraestrutura", "nuvem", "5 da manhã"], en: ["infrastructure", "cloud", "5 a.m."] };
    let html = esc(L(PROFILE.about));
    marks[I18N.lang].forEach((m) => { html = html.replace(m, `<mark>${m}</mark>`); });
    $("#about-text").innerHTML = html;

    if (PROFILE.photo) $("#avatar .avatar-inner").innerHTML = `<img src="${esc(PROFILE.photo)}" alt="${esc(PROFILE.fullName)}">`;

    const langs = new Set(U.projects.flatMap((p) => Object.keys(p.langs)).filter((l) => l !== "Dockerfile"));
    const stats = [
      [U.projects.length, "stats.pods"],
      [Object.keys(NAMESPACES).length, "stats.ns"],
      [langs.size, "stats.langs"],
      [PROFILE.since, "stats.since"]
    ];
    $("#stats").innerHTML = stats.map(([n, k]) => `<div class="stat"><b data-count="${n}">${n}</b><span>${esc(I18N.t(k))}</span></div>`).join("");
  }

  function countUp() {
    $$("#stats b[data-count]").forEach((b) => {
      const target = +b.dataset.count;
      if (reduced) return;
      const from = target > 1000 ? target - 12 : 0;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1200);
        b.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ───────────── pods ───────────── */
  function renderFilters() {
    const all = [{ key: null, label: I18N.t("pods.all"), n: U.projects.length, c: "#e7edf3" }]
      .concat(Object.entries(NAMESPACES).map(([k, v]) => ({ key: k, label: k, n: U.projects.filter((p) => p.ns === k).length, c: v.color })));
    $("#ns-filters").innerHTML = all.map((f) =>
      `<button type="button" role="tab" data-ns="${f.key ?? ""}" style="--c:${f.c}" class="${state.ns === f.key ? "active" : ""}" title="${f.key ? esc(L(NAMESPACES[f.key].label)) : ""}">
        <i></i>${esc(f.label)}<small>${f.n}</small></button>`).join("");
  }

  function podCard(p) {
    const ns = NAMESPACES[p.ns];
    const share = U.langShare(p.langs);
    const langs = share.slice(0, 3).map((l) => l.name).join(" · ") || "config";
    const hl = p.featured ? `<ul class="hl">${L(p.highlights).slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : "";
    return `
      <article class="pod ${p.featured ? "featured" : ""}" data-id="${p.id}" data-ns="${p.ns}" style="--ns:${ns.color}" tabindex="0" role="button" aria-label="${esc(p.title)}">
        <div class="pod-head">
          <span class="st"><i></i>${I18N.t("pods.running")}</span>
          ${p.private ? `<span class="lock">🔒 ${I18N.t("pods.private")}</span>` : ""}
          <span class="ns">ns/${p.ns}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(L(p.desc))}</p>
        ${hl}
        <div class="pod-foot">
          <div class="tags">${p.stack.slice(0, p.featured ? 6 : 3).map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
          <div class="langbar">${share.map((l) => `<i style="width:${l.pct}%;background:${l.color}"></i>`).join("")}</div>
          <div class="pod-meta"><span>${esc(langs)}</span><span class="inspect">${I18N.t("pods.inspect")} →</span><span>${I18N.t("pods.updated")} ${U.relTime(p.pushed)}</span></div>
        </div>
      </article>`;
  }

  function renderPods(animate) {
    const grid = $("#pods-grid");
    grid.innerHTML = U.projects.map(podCard).join("");
    applyFilter(animate);
  }

  function applyFilter(animate) {
    $$(".pod").forEach((el, i) => {
      const show = !state.ns || el.dataset.ns === state.ns;
      el.classList.toggle("hide", !show);
      if (show && animate) { el.classList.remove("enter"); void el.offsetWidth; el.style.animationDelay = `${Math.min(i, 12) * 35}ms`; el.classList.add("enter"); }
    });
    $("#ns-flag").textContent = state.ns ? `-n ${state.ns}` : "-A";
    $$("#ns-filters button").forEach((b) => b.classList.toggle("active", (b.dataset.ns || null) === state.ns));
    topo && topo.setFilter(state.ns);
  }

  function filterNs(ns) { state.ns = ns; applyFilter(true); }

  let topo = null;
  function setView(v) {
    state.view = v;
    $$(".view-toggle button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    $("#pods-grid").hidden = v !== "grid";
    $("#topo").hidden = v !== "topo";
    if (v === "topo") {
      if (!topo) topo = new Cluster($("#topo-canvas"), { mode: "topology", onSelect: openProject });
      else topo.resize();
      topo.setFilter(state.ns);
      topo.start();
    }
  }

  /* ───────────── drawer ───────────── */
  let lastFocus = null;
  function openProject(p) {
    closeOverlay();
    state.open = p;
    lastFocus = document.activeElement;
    renderDrawer();
    $("#scrim").hidden = false;
    const d = $("#drawer");
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#drawer-close").focus(), 50);
  }
  function renderDrawer() {
    const p = state.open;
    if (!p) return;
    const ns = NAMESPACES[p.ns];
    const share = U.langShare(p.langs);
    $("#drawer-cmd").textContent = p.id;
    $("#drawer").style.setProperty("--ns", ns.color);
    $("#drawer-body").innerHTML = `
      <span class="dw-ns"><i></i>ns/${p.ns} · ${esc(L(ns.label))}</span>
      <h2 id="drawer-title">${esc(p.title)}</h2>
      <p class="dw-desc">${esc(L(p.desc))}</p>
      <dl class="kv">
        <dt>Name</dt><dd>${esc(p.repo)}</dd>
        <dt>${I18N.t("drawer.ns")}</dt><dd style="color:${ns.color}">${p.ns}</dd>
        <dt>${I18N.t("drawer.status")}</dt><dd><span class="ok">● Running</span> ${p.private ? `<span class="priv">· 🔒 ${I18N.t("pods.private")}</span>` : `<span class="dim">· ${I18N.t("pods.public")}</span>`}</dd>
        <dt>${I18N.t("drawer.created")}</dt><dd>${U.fmtDate(p.created)} <span class="dim">(${U.relTime(p.created)})</span></dd>
        <dt>${I18N.t("drawer.pushed")}</dt><dd>${U.fmtDate(p.pushed)} <span class="dim">(${U.relTime(p.pushed)})</span></dd>
        <dt>${I18N.t("drawer.repo")}</dt><dd>${p.url ? `<a class="accent" href="${p.url}" target="_blank" rel="noopener">github.com/${PROFILE.github}/${esc(p.repo)}</a>` : `<span class="priv">${I18N.t("drawer.privateRepo")}</span>`}</dd>
      </dl>
      <h4 class="dw-h"># ${I18N.t("drawer.highlights")}</h4>
      <ul class="dw-hl">${L(p.highlights).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
      <h4 class="dw-h"># ${I18N.t("drawer.stack")}</h4>
      <div class="tags" style="display:flex;flex-wrap:wrap;gap:6px">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      ${share.length ? `<h4 class="dw-h"># ${I18N.t("drawer.languages")}</h4>
      <div class="dw-langs">${share.map((l) => `<div class="dw-lang"><span>${esc(l.name)}</span><span class="bar"><i style="width:${l.pct}%;background:${l.color}"></i></span><b>${l.pct < 1 ? "<1" : l.pct.toFixed(0)}%</b></div>`).join("")}</div>` : ""}
      ${p.url || p.demo ? `<div class="dw-actions">
        ${p.demo ? `<a class="btn btn-primary" href="${esc(p.demo)}" target="_blank" rel="noopener">${I18N.t("drawer.demo")} ↗</a>` : ""}
        ${p.url ? `<a class="btn ${p.demo ? "btn-ghost" : "btn-primary"}" href="${p.url}" target="_blank" rel="noopener">${I18N.t("drawer.open")} ↗</a>` : ""}
      </div>` : `<div class="dw-private">🔒 ${I18N.t("drawer.privateRepo")} — <a class="accent" href="mailto:${PROFILE.email}?subject=${encodeURIComponent(p.title)}">${PROFILE.email}</a></div>`}
    `;
  }
  function closeDrawer() {
    if (!state.open) return;
    state.open = null;
    const d = $("#drawer");
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
    $("#scrim").hidden = true;
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }

  /* ───────────── stack ───────────── */
  function renderYaml() {
    const lines = [
      `<span class="ln"><span class="cm"># ${esc(PROFILE.fullName)} · ${esc(PROFILE.role)}</span></span>`,
      `<span class="ln"><span class="k">apiVersion</span>: pedro.dev/v1</span>`,
      `<span class="ln"><span class="k">kind</span>: Stack</span>`,
      `<span class="ln"><span class="k">spec</span>:</span>`
    ];
    Object.entries(PROFILE.stack).forEach(([k, items]) => {
      lines.push(`<span class="ln">  <span class="k">${esc(k)}</span>:</span>`);
      items.forEach((it) => lines.push(`<span class="ln">    <span class="dash">- </span><span class="it" data-item="${esc(it)}" data-group="${esc(k)}" tabindex="0">${esc(it)}</span></span>`));
    });
    $("#yaml").innerHTML = lines.join("");
  }
  function peek(item, group) {
    $$(".yaml .it").forEach((el) => el.classList.toggle("on", el.dataset.item === item));
    const used = U.usedBy(item);
    $("#peek-label").textContent = `// spec.${group}`;
    $("#peek-title").textContent = item;
    $("#peek-list").innerHTML = used.length
      ? `<li class="mono dim" style="font-size:12px">${I18N.t("stack.used")} ${used.length}:</li>` +
        used.slice(0, 8).map((p) => `<li><button type="button" data-open="${p.id}" style="border-left:2px solid ${NAMESPACES[p.ns].color}">${esc(p.title)}<span>ns/${p.ns}</span></button></li>`).join("")
      : `<li class="empty">${I18N.t("stack.nouse")}</li>`;
  }

  /* ───────────── git log ───────────── */
  function renderLog() {
    const sorted = [...U.projects].sort((a, b) => b.created.localeCompare(a.created));
    $("#gitlog").innerHTML = sorted.map((p, i) => {
      const c = NAMESPACES[p.ns].color;
      const ref = i === 0 ? "(HEAD → main)" : p.private ? "(private)" : "";
      return `<li><button type="button" data-open="${p.id}" style="--c:${c}">
        <span class="node"></span>
        <span class="hash">${U.hash(p.repo)}</span>
        <span class="date">${p.created}</span>
        <span class="msg"><span class="type">feat(${p.ns}):</span> ${esc(p.title)} <span class="d">— ${esc(L(p.desc))}</span></span>
        <span class="ref">${ref}</span>
      </button></li>`;
    }).join("");
  }

  /* ───────────── contact ───────────── */
  function renderContact() {
    const cards = [
      { proto: "mailto://", val: PROFILE.email, href: `mailto:${PROFILE.email}`, copy: PROFILE.email },
      { proto: "https://linkedin", val: "in/pedrocarriel", href: PROFILE.linkedin },
      { proto: "https://github", val: `@${PROFILE.github}`, href: `https://github.com/${PROFILE.github}` }
    ];
    $("#contact-grid").innerHTML = cards.map((c) => `
      <a class="contact-card" href="${c.href}" ${c.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
        <span class="proto">${c.proto}</span>
        <span class="val">${esc(c.val)}</span>
        <span class="row">
          ${c.copy ? `<button type="button" class="copy-btn" data-copy="${esc(c.copy)}">${I18N.t("contact.copy")}</button>` : `<span class="go">${I18N.lang === "pt" ? "abrir" : "open"}</span>`}
          <span class="arrow">↗</span>
        </span>
      </a>`).join("");
  }

  /* ───────────── terminal overlay ───────────── */
  let overlayTerm = null;
  function openOverlay() {
    closeDrawer();
    const o = $("#term-overlay");
    if (!overlayTerm) {
      overlayTerm = new Terminal($("#overlay-term"), { mode: "overlay", app: api, onClose: closeOverlay });
      overlayTerm.print(`<span class="c-d">${L({ pt: "terminal flutuante · esc fecha · digite", en: "floating terminal · esc closes · type" })}</span> <span class="cmd-link" data-cmd="help">help</span>`);
    }
    o.hidden = false;
    setTimeout(() => overlayTerm.focus(), 30);
  }
  function closeOverlay() {
    const o = $("#term-overlay");
    if (o.hidden) return;
    o.hidden = true;
  }

  /* ───────────── misc ───────────── */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function scrollTo(id) {
    closeOverlay();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function clock() {
    const tick = () => { $("#clock").textContent = new Date().toLocaleTimeString(I18N.lang === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" }); };
    tick(); setInterval(tick, 15000);
  }

  function observeSections() {
    const links = $$(".sb-windows a");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.dataset.win === e.target.dataset.section));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("[data-section]").forEach((s) => io.observe(s));

    const rv = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$(".section-head, .about-grid, .stats, .pods-toolbar, .code-window, .gitlog, .contact-grid").forEach((el) => { el.classList.add("reveal"); rv.observe(el); });

    const st = new IntersectionObserver(([e]) => { if (e.isIntersecting) { countUp(); st.disconnect(); } }, { threshold: 0.5 });
    st.observe($("#stats"));
  }

  // refresh push dates of public repos from the GitHub API (best effort)
  async function liveSync() {
    try {
      const res = await fetch(`https://api.github.com/users/${PROFILE.github}/repos?per_page=100&sort=pushed`);
      if (!res.ok) return;
      const repos = await res.json();
      let changed = false;
      repos.forEach((r) => {
        const p = U.projects.find((x) => x.repo.toLowerCase() === r.name.toLowerCase());
        if (p && r.pushed_at && r.pushed_at.slice(0, 10) > p.pushed) { p.pushed = r.pushed_at.slice(0, 10); changed = true; }
      });
      if (changed) renderPods(false);
    } catch (e) {}
  }

  function rerenderAll() {
    I18N.apply();
    renderAbout();
    renderFilters();
    renderPods(false);
    renderLog();
    renderContact();
    renderDrawer();
    const cur = $(".yaml .it.on");
    if (cur) peek(cur.dataset.item, cur.dataset.group);
  }

  const api = { openProject, scrollTo, filterNs };

  /* ───────────── events ───────────── */
  function bind() {
    $("#lang-toggle").addEventListener("click", () => I18N.toggle());
    I18N.onChange(rerenderAll);

    $("#open-term").addEventListener("click", openOverlay);
    $$('[data-action="focus-term"]').forEach((b) => b.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 960px)").matches || window.scrollY > 200) openOverlay();
      else heroTerm.focus();
    }));
    $("#term-overlay").addEventListener("click", (e) => { if (e.target.id === "term-overlay") closeOverlay(); });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        $("#term-overlay").hidden ? openOverlay() : closeOverlay();
      } else if (e.key === "Escape") {
        closeDrawer(); closeOverlay();
      } else if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); openOverlay();
      }
    });

    $("#ns-filters").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (b) filterNs(b.dataset.ns || null);
    });
    $$(".view-toggle button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

    const grid = $("#pods-grid");
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".pod");
      if (card) openProject(U.find(card.dataset.id));
    });
    grid.addEventListener("keydown", (e) => {
      const card = e.target.closest(".pod");
      if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProject(U.find(card.dataset.id)); }
    });
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".pod");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    $("#scrim").addEventListener("click", closeDrawer);
    $("#drawer-close").addEventListener("click", closeDrawer);

    const yaml = $("#yaml");
    const onItem = (e) => { const it = e.target.closest(".it"); if (it) peek(it.dataset.item, it.dataset.group); };
    yaml.addEventListener("pointerover", onItem);
    yaml.addEventListener("focusin", onItem);
    yaml.addEventListener("click", onItem);

    document.addEventListener("click", (e) => {
      const o = e.target.closest("[data-open]");
      if (o) { openProject(U.find(o.dataset.open)); return; }
      const c = e.target.closest("[data-copy]");
      if (c) {
        e.preventDefault(); e.stopPropagation();
        const v = c.dataset.copy;
        (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(
          () => { c.textContent = I18N.t("contact.copied"); toast(`${v} ✓`); setTimeout(() => (c.textContent = I18N.t("contact.copy")), 1600); },
          () => toast(v)
        );
      }
    });
  }

  /* ───────────── init ───────────── */
  let heroTerm;
  async function init() {
    $("#year").textContent = new Date().getFullYear();
    I18N.apply();
    renderAbout();
    renderFilters();
    renderPods(false);
    renderYaml();
    peek(PROFILE.stack.containers[0], "containers");
    renderLog();
    renderContact();
    clock();

    heroTerm = new Terminal($("#hero-term"), { mode: "inline", app: api });
    bind();
    observeSections();

    new Cluster($("#ambient"), { mode: "ambient" }).start();

    await boot();
    $$(".hero .reveal").forEach((el, i) => setTimeout(() => el.classList.add("in"), 80 + i * 90));
    setTimeout(() => (reduced ? heroTerm.exec("neofetch") : heroTerm.type("neofetch")), reduced ? 0 : 700);
    liveSync();
  }

  init();
})();
