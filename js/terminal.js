/*
 * Interactive terminal. One class, mounted in the hero and in the ⌘K overlay.
 */
(function () {
  const { esc } = U;
  const L = (o) => I18N.pick(o);
  const P = () => U.projects;
  const pad = (s, n) => String(s).padEnd(n, " ");

  const LOGO = [
    "██████╗  ██████╗",
    "██╔══██╗██╔════╝",
    "██████╔╝██║     ",
    "██╔═══╝ ██║     ",
    "██║     ╚██████╗",
    "╚═╝      ╚═════╝"
  ].join("\n");

  const SECTIONS = ["home", "about", "pods", "stack", "log", "contact"];
  const link = (cmd, label) => `<span class="cmd-link" data-cmd="${esc(cmd)}">${esc(label ?? cmd)}</span>`;

  class Terminal {
    constructor(mount, opts = {}) {
      this.opts = opts;
      this.app = opts.app;
      this.history = [];
      this.hIndex = -1;
      this.busy = false;

      mount.innerHTML = `
        <div class="term" data-mode="${opts.mode || "inline"}">
          <div class="term-bar">
            <span class="lights"><i title="close"></i><i></i><i></i></span>
            <span class="term-title">pedro@cluster: ~</span>
            <span class="term-hint">tab ↹ · ↑↓</span>
          </div>
          <div class="term-body">
            <div class="term-out" aria-live="polite"></div>
            <label class="term-line">
              <span class="prompt"><span class="u">pedro</span><span class="p">@</span><span class="h">cluster</span><span class="p">:~$</span></span>
              <input class="term-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="terminal">
            </label>
          </div>
          <div class="term-chips"></div>
        </div>`;
      this.root = mount.firstElementChild;
      this.body = this.root.querySelector(".term-body");
      this.out = this.root.querySelector(".term-out");
      this.input = this.root.querySelector(".term-input");
      this.chips = this.root.querySelector(".term-chips");

      this.renderChips();
      this.bind();
      this.commands = this.buildCommands();
    }

    bind() {
      this.body.addEventListener("click", (e) => {
        const c = e.target.closest("[data-cmd]");
        if (c) { this.run(c.dataset.cmd); return; }
        if (!window.getSelection().toString() && !e.target.closest("a")) this.focus();
      });
      this.chips.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b) this.run(b.dataset.cmd);
      });
      this.root.querySelector(".lights i").addEventListener("click", () => this.opts.onClose && this.opts.onClose());

      this.input.addEventListener("keydown", (e) => {
        if (this.busy) { e.preventDefault(); return; }
        if (e.key === "Enter") {
          e.preventDefault();
          const v = this.input.value;
          this.input.value = "";
          this.exec(v);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (!this.history.length) return;
          this.hIndex = this.hIndex < 0 ? this.history.length - 1 : Math.max(0, this.hIndex - 1);
          this.input.value = this.history[this.hIndex];
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (this.hIndex < 0) return;
          this.hIndex++;
          if (this.hIndex >= this.history.length) { this.hIndex = -1; this.input.value = ""; }
          else this.input.value = this.history[this.hIndex];
        } else if (e.key === "Tab") {
          e.preventDefault();
          this.complete();
        } else if (e.key === "l" && e.ctrlKey) {
          e.preventDefault();
          this.out.innerHTML = "";
        } else if (e.key === "Escape" && this.opts.onClose) {
          this.opts.onClose();
        }
      });
    }

    renderChips() {
      const chips = ["help", "whoami", "kubectl get pods", "stack", "contact", "sudo hire-me"];
      this.chips.innerHTML = chips.map((c) => `<button type="button" data-cmd="${c}">${c}</button>`).join("");
    }

    focus() { this.input.focus({ preventScroll: true }); }

    print(html = "", cls = "") {
      const d = document.createElement("div");
      if (cls) d.className = cls;
      d.innerHTML = html;
      this.out.appendChild(d);
      this.body.scrollTop = this.body.scrollHeight;
      return d;
    }
    lines(arr) { arr.forEach((l) => this.print(l)); }

    echoPrompt(cmd) {
      this.print(`<span class="prompt"><span class="u">pedro</span><span class="p">@</span><span class="h">cluster</span><span class="p">:~$</span></span> ${esc(cmd)}`);
    }

    async type(text, speed = 42) {
      this.busy = true;
      for (const ch of text) {
        this.input.value += ch;
        await new Promise((r) => setTimeout(r, speed + Math.random() * 40));
      }
      await new Promise((r) => setTimeout(r, 260));
      this.busy = false;
      const v = this.input.value; this.input.value = "";
      this.exec(v);
    }

    run(cmd) {
      if (this.busy) return;
      this.exec(cmd);
      this.focus();
    }

    exec(raw) {
      const line = raw.trim();
      this.echoPrompt(line);
      if (!line) return;
      this.history.push(line);
      this.hIndex = -1;
      const [name, ...args] = line.split(/\s+/);
      const cmd = this.commands[name.toLowerCase()];
      if (cmd) {
        try { cmd.fn(args, line); } catch (err) { this.print(`<span class="c-r">error:</span> ${esc(err.message)}`); }
      } else {
        this.print(`<span class="c-r">zsh: command not found:</span> ${esc(name)}`);
        this.print(`<span class="c-d">${L({ pt: "digite", en: "type" })}</span> ${link("help")} <span class="c-d">${L({ pt: "para ver os comandos", en: "to list commands" })}</span>`);
      }
      this.print("");
    }

    complete() {
      const v = this.input.value;
      const parts = v.split(/\s+/);
      let pool;
      if (parts.length <= 1) pool = Object.keys(this.commands).filter((k) => !this.commands[k].hidden);
      else {
        const prev = parts[parts.length - 2];
        if (prev === "-n") pool = Object.keys(NAMESPACES);
        else if (["cd", "goto"].includes(parts[0])) pool = SECTIONS;
        else if (parts[0] === "lang") pool = ["pt", "en"];
        else if (parts[0] === "kubectl" && parts.length === 2) pool = ["get", "describe", "logs", "top"];
        else if (parts[0] === "kubectl" && parts[1] === "get" && parts.length === 3) pool = ["pods", "ns", "nodes"];
        else if (parts[0] === "kubectl" && parts[1] === "describe" && parts.length === 3) pool = ["pod"];
        else pool = P().map((p) => p.id);
      }
      const cur = parts[parts.length - 1].toLowerCase();
      const hits = pool.filter((x) => x.startsWith(cur));
      if (hits.length === 1) {
        parts[parts.length - 1] = hits[0];
        this.input.value = parts.join(" ") + " ";
      } else if (hits.length > 1) {
        this.echoPrompt(v);
        this.print(hits.map((h) => `<span class="c-m">${esc(h)}</span>`).join("   "));
        // common prefix
        let pre = hits[0];
        for (const h of hits) while (!h.startsWith(pre)) pre = pre.slice(0, -1);
        parts[parts.length - 1] = pre;
        this.input.value = parts.join(" ");
      }
    }

    /* ───────────── commands ───────────── */
    buildCommands() {
      const app = this.app;
      const self = this;
      const notFound = (q) => {
        self.print(`<span class="c-r">Error from server (NotFound):</span> pods "${esc(q || "")}" not found`);
        self.print(`<span class="c-d">${L({ pt: "tente", en: "try" })}</span> ${link("ls")}`);
      };

      const getPods = (args) => {
        const ni = args.indexOf("-n");
        const ns = ni >= 0 ? args[ni + 1] : null;
        if (ns && !NAMESPACES[ns]) { self.print(`<span class="c-r">error:</span> namespace "${esc(ns)}" not found`); return; }
        const list = P().filter((p) => !ns || p.ns === ns);
        const w = Math.max(...list.map((p) => p.title.length)) + 3;
        self.print(`<span class="c-d">${pad("NAME", w)}${ns ? "" : pad("NAMESPACE", 15)}${pad("STATUS", 10)}${pad("REPO", 10)}AGE</span>`);
        list.forEach((p) => {
          self.print(
            `${link(`describe ${p.id}`, p.title)}${" ".repeat(w - p.title.length)}` +
            (ns ? "" : `<span style="color:${NAMESPACES[p.ns].color}">${pad(p.ns, 15)}</span>`) +
            `<span class="c-a">${pad("Running", 10)}</span>` +
            (p.private ? `<span class="c-v">${pad("private", 10)}</span>` : `<span class="c-m">${pad("public", 10)}</span>`) +
            `<span class="c-m">${U.relTime(p.created)}</span>`
          );
        });
        self.print(`<span class="c-d">${L({ pt: "clique num nome ou rode", en: "click a name or run" })}</span> <span class="c-a">describe &lt;nome&gt;</span>`);
        if (app && !ns) app.filterNs(null);
        if (app && ns) app.filterNs(ns);
      };

      const describe = (q) => {
        const p = U.find(q);
        if (!p) return notFound(q);
        const ns = NAMESPACES[p.ns];
        const langs = U.langShare(p.langs).map((l) => `${l.name} ${l.pct.toFixed(0)}%`).join(" · ") || "config";
        self.lines([
          `<span class="c-bold">${esc(p.title)}</span>  <span style="color:${ns.color}">ns/${p.ns}</span>  ${p.private ? '<span class="c-v">🔒 private</span>' : '<span class="c-a">● public</span>'}`,
          `<span class="c-m">${esc(L(p.desc))}</span>`,
          ``,
          ...L(p.highlights).map((h) => `<span style="color:${ns.color}">▸</span> ${esc(h)}`),
          ``,
          `<span class="c-d">stack     </span>${p.stack.map(esc).join(", ")}`,
          `<span class="c-d">langs     </span>${esc(langs)}`,
          `<span class="c-d">created   </span>${U.fmtDate(p.created)}   <span class="c-d">push</span> ${U.fmtDate(p.pushed)}`,
          p.url ? `<span class="c-d">repo      </span><a href="${p.url}" target="_blank" rel="noopener">${p.url.replace("https://", "")}</a>` : `<span class="c-d">repo      </span><span class="c-v">${esc(I18N.t("drawer.privateRepo"))}</span>`,
          `<span class="c-d">→ </span>${link(`open ${p.id}`, L({ pt: "abrir painel completo", en: "open full panel" }))}`
        ]);
      };

      const C = {
        help: {
          d: { pt: "lista os comandos", en: "list commands" },
          fn() {
            const rows = [
              ["whoami", "whoami", { pt: "quem sou eu", en: "who am I" }],
              ["neofetch", "neofetch", { pt: "resumo do sistema", en: "system summary" }],
              ["ls", "ls", { pt: "lista os projetos", en: "list projects" }],
              ["kubectl get pods [-n ns]", "kubectl get pods", { pt: "projetos em formato cluster", en: "projects, cluster style" }],
              ["kubectl get ns", "kubectl get ns", { pt: "namespaces (categorias)", en: "namespaces (categories)" }],
              [L({ pt: "describe <projeto>", en: "describe <project>" }), "describe jcamonitor", { pt: "detalhes de um projeto", en: "project details" }],
              [L({ pt: "open <projeto>", en: "open <project>" }), "open jelastic-demo", { pt: "abre o painel do projeto", en: "open the project panel" }],
              ["stack", "stack", { pt: "tecnologias que uso", en: "technologies I use" }],
              ["contact", "contact", { pt: "como falar comigo", en: "how to reach me" }],
              [L({ pt: "cd <seção>", en: "cd <section>" }), "cd pods", { pt: "rola até uma seção", en: "scroll to a section" }],
              ["lang pt|en", "lang", { pt: "troca o idioma", en: "switch language" }],
              ["history", "history", { pt: "comandos já digitados", en: "previous commands" }],
              ["clear", "clear", { pt: "limpa a tela (ctrl+l)", en: "clear screen (ctrl+l)" }]
            ];
            self.print(`<span class="c-bold">${L({ pt: "Comandos disponíveis", en: "Available commands" })}</span>`);
            rows.forEach(([label, run, d]) => self.print(`  ${link(run, label)}${" ".repeat(Math.max(2, 28 - label.length))}<span class="c-m">${esc(L(d))}</span>`));
            self.print(`<span class="c-d">${L({ pt: "dica: tab completa, ↑↓ navega no histórico. tem easter eggs.", en: "tip: tab completes, ↑↓ browses history. there are easter eggs." })}</span>`);
          }
        },
        whoami: {
          fn() {
            self.lines([
              `<span class="c-bold">${esc(PROFILE.fullName)}</span> <span class="c-d">—</span> <span class="c-a">${esc(PROFILE.role)}</span>`,
              `<span class="c-m">${esc(L(PROFILE.about))}</span>`
            ]);
          }
        },
        neofetch: {
          fn() {
            const years = ((Date.now() - new Date(`${PROFILE.since}-01-01`)) / 31557600000).toFixed(1);
            const langs = [...new Set(P().flatMap((p) => Object.keys(p.langs)))].filter((l) => !["Dockerfile", "HTML", "CSS", "Swift", "Kotlin", "PLpgSQL"].includes(l));
            const info = [
              `<span class="c-a">pedro</span>@<span class="c-b">cluster</span>`,
              `<span class="c-d">────────────────</span>`,
              `<span class="c-a">OS</span>       ${esc(PROFILE.role)}`,
              `<span class="c-a">Host</span>     github.com/${esc(PROFILE.github)}`,
              `<span class="c-a">Uptime</span>   ${years} ${L({ pt: "anos em produção", en: "years in production" })}`,
              `<span class="c-a">Pods</span>     ${P().length} ${L({ pt: "projetos", en: "projects" })} · ${Object.keys(NAMESPACES).length} namespaces`,
              `<span class="c-a">Langs</span>    ${langs.slice(0, 5).join(", ")}`,
              `<span class="c-a">Stack</span>    Docker · FastAPI · Grafana · Actions`,
              `<span class="c-a">Contact</span>  ${esc(PROFILE.email)}`,
              `<span class="palette">${["#ff6b7a", "#ffc861", "#4ff0b4", "#5ad8ff", "#8ea8ff", "#b99bff", "#ff8fc7", "#e7edf3"].map((c) => `<i style="background:${c}"></i>`).join("")}</span>`
            ];
            self.print(`<div class="neo"><pre class="logo">${LOGO}</pre><div>${info.join("<br>")}</div></div>`);
            self.print(`<span class="c-d">${L({ pt: "digite", en: "type" })}</span> ${link("help")} <span class="c-d">${L({ pt: "ou clique nos atalhos abaixo ↓", en: "or click the shortcuts below ↓" })}</span>`);
          }
        },
        ls: {
          fn(args) {
            const ns = args[0] && NAMESPACES[args[0]] ? args[0] : null;
            Object.entries(NAMESPACES).filter(([k]) => !ns || k === ns).forEach(([k, v]) => {
              const items = P().filter((p) => p.ns === k);
              self.print(`<span style="color:${v.color}">${k}/</span> <span class="c-d">— ${esc(L(v.label))}</span>`);
              self.print("  " + items.map((p) => link(`describe ${p.id}`, p.title) + (p.private ? '<span class="c-v">*</span>' : "")).join("   "));
            });
            self.print(`<span class="c-v">*</span><span class="c-d"> ${L({ pt: "repositório privado", en: "private repository" })}</span>`);
          }
        },
        kubectl: {
          fn(args) {
            const [verb, what, ...rest] = args;
            if (verb === "get" && (what === "pods" || what === "po" || what === "pod")) return getPods(rest);
            if (verb === "get" && (what === "ns" || what === "namespaces")) {
              self.print(`<span class="c-d">${pad("NAME", 16)}${pad("PODS", 7)}DESCRIPTION</span>`);
              Object.entries(NAMESPACES).forEach(([k, v]) => self.print(`${link(`kubectl get pods -n ${k}`, k)}${" ".repeat(16 - k.length)}${pad(P().filter((p) => p.ns === k).length, 7)}<span class="c-m">${esc(L(v.label))}</span>`));
              return;
            }
            if (verb === "get" && what === "nodes") {
              self.print(`<span class="c-d">${pad("NAME", 16)}${pad("STATUS", 9)}ROLES</span>`);
              self.print(`${pad("pedro-carriel", 16)}<span class="c-a">${pad("Ready", 9)}</span>control-plane,consultant,builder`);
              return;
            }
            if (verb === "describe") return describe(what === "pod" || what === "po" ? rest[0] : what);
            if (verb === "logs") return C.logs.fn([what]);
            if (verb === "top") return C.stack.fn();
            self.lines([
              `<span class="c-m">kubectl ${L({ pt: "suportado aqui", en: "supported here" })}:</span>`,
              `  ${link("kubectl get pods")}   ${link("kubectl get ns")}   ${link("kubectl get nodes")}`,
              `  kubectl describe pod &lt;name&gt;   kubectl logs &lt;name&gt;`
            ]);
          }
        },
        pods: { hidden: true, fn: (a) => getPods(a) },
        describe: { fn: (a) => describe(a[0]) },
        cat: { hidden: true, fn: (a) => (a[0] && /contact|contato/.test(a[0]) ? C.contact.fn() : a[0] && /stack/.test(a[0]) ? C.stack.fn() : describe(a[0])) },
        logs: {
          hidden: true,
          fn(a) {
            const p = U.find(a[0]);
            if (!p) return notFound(a[0]);
            const base = new Date(p.pushed + "T05:00:00");
            L(p.highlights).forEach((h, i) => {
              const ts = new Date(base.getTime() + i * 61000).toISOString().replace("T", " ").slice(0, 19);
              self.print(`<span class="c-d">${ts}</span> <span class="c-a">INFO</span> <span class="c-m">[${esc(p.id)}]</span> ${esc(h)}`);
            });
          }
        },
        open: {
          fn(a) {
            const p = U.find(a[0]);
            if (!p) return notFound(a[0]);
            self.print(`<span class="c-a">✓</span> ${L({ pt: "abrindo", en: "opening" })} ${esc(p.title)}…`);
            app && app.openProject(p);
          }
        },
        stack: {
          fn() {
            Object.entries(PROFILE.stack).forEach(([k, v]) => {
              self.print(`<span class="c-b">${pad(k + ":", 15)}</span>${v.map(esc).join("<span class=\"c-d\"> · </span>")}`);
            });
          }
        },
        skills: { hidden: true, fn: () => C.stack.fn() },
        contact: {
          fn() {
            self.lines([
              `<span class="c-d">email     </span><a href="mailto:${PROFILE.email}">${esc(PROFILE.email)}</a>`,
              `<span class="c-d">linkedin  </span><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">${esc(PROFILE.linkedin.replace("https://www.", ""))}</a>`,
              `<span class="c-d">github    </span><a href="https://github.com/${PROFILE.github}" target="_blank" rel="noopener">github.com/${esc(PROFILE.github)}</a>`
            ]);
          }
        },
        email: { hidden: true, fn: () => { window.location.href = `mailto:${PROFILE.email}`; self.print(`<span class="c-a">✓</span> mailto:${esc(PROFILE.email)}`); } },
        linkedin: { hidden: true, fn: () => { window.open(PROFILE.linkedin, "_blank", "noopener"); self.print(`<span class="c-a">✓</span> linkedin`); } },
        github: { hidden: true, fn: () => { window.open(`https://github.com/${PROFILE.github}`, "_blank", "noopener"); self.print(`<span class="c-a">✓</span> github.com/${esc(PROFILE.github)}`); } },
        cd: {
          fn(a) {
            const map = { projects: "pods", projetos: "pods", whoami: "about", sobre: "about", contato: "contact", historico: "log", history: "log", "~": "home", "/": "home" };
            const s = map[a[0]] || a[0] || "home";
            if (!SECTIONS.includes(s)) { self.print(`<span class="c-r">cd:</span> no such file or directory: ${esc(a[0])}`); self.print(`<span class="c-d">${SECTIONS.join("  ")}</span>`); return; }
            app && app.scrollTo(s);
            self.print(`<span class="c-a">→</span> ~/${s}`);
          }
        },
        goto: { hidden: true, fn: (a) => C.cd.fn(a) },
        lang: {
          fn(a) {
            const next = a[0] || (I18N.lang === "pt" ? "en" : "pt");
            if (!["pt", "en"].includes(next)) { self.print(`<span class="c-r">lang:</span> pt | en`); return; }
            I18N.set(next);
            self.print(`<span class="c-a">✓</span> ${next === "pt" ? "idioma: português" : "language: english"}`);
          }
        },
        history: { fn() { self.history.forEach((h, i) => self.print(`<span class="c-d">${String(i + 1).padStart(4)}</span>  ${esc(h)}`)); } },
        clear: { fn() { self.out.innerHTML = ""; } },
        date: { fn() { self.print(new Date().toString()); } },
        echo: { fn(a) { self.print(esc(a.join(" "))); } },
        pwd: { hidden: true, fn() { self.print("/home/pedro/portfolio"); } },
        exit: { fn() { if (self.opts.onClose) self.opts.onClose(); else self.print(`<span class="c-d">${L({ pt: "você não sai do cluster tão fácil 😉", en: "you don't leave the cluster that easily 😉" })}</span>`); } },
        sudo: {
          fn(a) {
            if (a[0] === "hire-me" || a.join(" ") === "hire me" || a[0] === "hire") {
              self.lines([
                `<span class="c-d">[sudo] password for recruiter: ********</span>`,
                `<span class="c-a">✓ ${L({ pt: "Permissão concedida. Ótima decisão.", en: "Permission granted. Great call." })}</span>`,
                `<span class="c-m">${L({ pt: "abrindo canal seguro com o Pedro…", en: "opening a secure channel to Pedro…" })}</span>`
              ]);
              C.contact.fn();
              app && setTimeout(() => app.scrollTo("contact"), 700);
              return;
            }
            self.print(`<span class="c-r">${L({ pt: "visitante não está no arquivo sudoers. Este incidente será reportado.", en: "visitor is not in the sudoers file. This incident will be reported." })}</span>`);
            self.print(`<span class="c-d">${L({ pt: "psst… tente", en: "psst… try" })}</span> ${link("sudo hire-me")}`);
          }
        },
        rm: { hidden: true, fn() { self.print(`<span class="c-y">${L({ pt: "boa tentativa 😏 este cluster tem backup.", en: "nice try 😏 this cluster has backups." })}</span>`); } },
        vim: { hidden: true, fn() { self.print(`<span class="c-m">${L({ pt: "entrar é fácil. pra sair: digite", en: "getting in is easy. to get out: type" })}</span> :q! <span class="c-d">(${L({ pt: "brincadeira, continue digitando", en: "kidding, keep typing" })})</span>`); } },
        coffee: { hidden: true, fn() { self.print("☕ " + L({ pt: "deploy de café concluído. latência: 0ms.", en: "coffee deployed. latency: 0ms." })); } },
        matrix: {
          hidden: true,
          fn() {
            const chars = "01アイウエオカキクケコｱｲｳｴｵ";
            for (let i = 0; i < 6; i++) self.print(`<span class="c-a">${Array.from({ length: 48 }, () => chars[(Math.random() * chars.length) | 0]).join("")}</span>`);
            self.print(`<span class="c-d">wake up, recruiter…</span>`);
          }
        }
      };
      C.ajuda = { hidden: true, fn: () => C.help.fn() };
      C.projetos = { hidden: true, fn: () => C.ls.fn([]) };
      C.projects = { hidden: true, fn: () => C.ls.fn([]) };
      C.contato = { hidden: true, fn: () => C.contact.fn() };
      C.k = { hidden: true, fn: (a) => C.kubectl.fn(a) };
      return C;
    }
  }

  window.Terminal = Terminal;
})();
