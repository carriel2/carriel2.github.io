(function () {
  const STRINGS = {
    pt: {
      "nav.exp": "carreira",
      "exp.kicker": "02 · rollout",
      "exp.title": "Carreira",
      "exp.title.em": "em deploy contínuo",
      "exp.lead": "Cada cargo é uma revisão do mesmo deployment: do código Python ao suporte, e do suporte à arquitetura e pré-vendas.",
      "exp.resume": "baixar currículo",
      "exp.edu": "formação",
      "nav.home": "home",
      "nav.pods": "projetos",
      "nav.stack": "stack",
      "nav.log": "histórico",
      "nav.contact": "contato",
      "nav.terminal": "terminal",

      "boot.skip": "pressione qualquer tecla para pular",

      "hero.context": "contexto atual",
      "hero.pitch": "Transformo requisitos de negócio em arquiteturas IaaS e PaaS escaláveis, seguras e com custo otimizado. E construo as ferramentas que deixam a operação rodando sozinha: monitores, pipelines, APIs e automações.",
      "hero.cta.pods": "ver projetos",
      "hero.cta.term": "abrir terminal",
      "hero.status": "disponível para novos projetos",
      "hero.scroll": "role para inspecionar o cluster",

      "stats.pods": "projetos rodando",
      "stats.ns": "namespaces",
      "stats.langs": "linguagens",
      "stats.since": "commitando desde",

      "pods.kicker": "03 · workloads",
      "pods.title": "Projetos",
      "pods.title.em": "em produção",
      "pods.lead": "Cada projeto é um pod no meu cluster. Filtre por namespace, alterne para a topologia e clique em qualquer um para ver o describe completo.",
      "pods.all": "todos",
      "pods.view.grid": "grade",
      "pods.view.topo": "topologia",
      "pods.topo.hint": "arraste o mouse pelos nós · clique para inspecionar",
      "pods.running": "Running",
      "pods.private": "privado",
      "pods.public": "público",
      "pods.updated": "push",
      "pods.inspect": "inspecionar",

      "stack.kicker": "04 · capacidade",
      "stack.title": "Stack",
      "stack.title.em": "instalada",
      "stack.lead": "O que eu uso no dia a dia, declarado como manifesto. Passe o mouse num item para ver em quais projetos ele roda.",
      "stack.used": "usado em",
      "stack.nouse": "uso geral",

      "about.kicker": "01 · whoami",

      "log.kicker": "05 · git log",
      "log.title": "Histórico",
      "log.title.em": "de commits",
      "log.lead": "A linha do tempo dos projetos, do mais recente ao primeiro.",

      "contact.kicker": "06 · ssh",
      "contact.title": "Vamos",
      "contact.title.em": "conversar?",
      "contact.lead": "Consultoria em nuvem, automação, um projeto novo ou só trocar ideia sobre infraestrutura. Minha caixa de entrada está sempre aberta.",
      "contact.copy": "copiar",
      "contact.copied": "copiado ✓",

      "drawer.close": "fechar",
      "drawer.repo": "Repositório",
      "drawer.privateRepo": "repositório privado · código sob consulta",
      "drawer.open": "abrir no GitHub",
      "drawer.demo": "ver demo",
      "drawer.highlights": "Destaques",
      "drawer.stack": "Stack",
      "drawer.languages": "Linguagens",
      "drawer.created": "Criado",
      "drawer.pushed": "Último push",
      "drawer.ns": "Namespace",
      "drawer.status": "Status",

      "footer.made": "feito à mão, sem framework, servido pelo GitHub Pages",
      "footer.hint": "dica: aperte",
      "footer.hint2": "em qualquer lugar",

      "time.today": "hoje",
      "time.yesterday": "ontem",
      "time.days": "d",
      "time.months": "m",
      "time.years": "a",
      "time.ago": "atrás"
    },

    en: {
      "nav.exp": "career",
      "exp.kicker": "02 · rollout",
      "exp.title": "Career",
      "exp.title.em": "on continuous deploy",
      "exp.lead": "Each role is a revision of the same deployment: from Python code to support, and from support to architecture and pre-sales.",
      "exp.resume": "download résumé",
      "exp.edu": "education",
      "nav.home": "home",
      "nav.pods": "projects",
      "nav.stack": "stack",
      "nav.log": "history",
      "nav.contact": "contact",
      "nav.terminal": "terminal",

      "boot.skip": "press any key to skip",

      "hero.context": "current context",
      "hero.pitch": "I turn business requirements into scalable, secure, cost-optimized IaaS and PaaS architectures. And I build the tools that keep operations running on their own: monitors, pipelines, APIs and automations.",
      "hero.cta.pods": "see projects",
      "hero.cta.term": "open terminal",
      "hero.status": "available for new projects",
      "hero.scroll": "scroll to inspect the cluster",

      "stats.pods": "running projects",
      "stats.ns": "namespaces",
      "stats.langs": "languages",
      "stats.since": "committing since",

      "pods.kicker": "03 · workloads",
      "pods.title": "Projects",
      "pods.title.em": "in production",
      "pods.lead": "Every project is a pod in my cluster. Filter by namespace, switch to the topology view and click any of them for the full describe.",
      "pods.all": "all",
      "pods.view.grid": "grid",
      "pods.view.topo": "topology",
      "pods.topo.hint": "move across the nodes · click to inspect",
      "pods.running": "Running",
      "pods.private": "private",
      "pods.public": "public",
      "pods.updated": "push",
      "pods.inspect": "inspect",

      "stack.kicker": "04 · capacity",
      "stack.title": "Installed",
      "stack.title.em": "stack",
      "stack.lead": "What I use day to day, declared as a manifest. Hover an item to see which projects it runs in.",
      "stack.used": "used in",
      "stack.nouse": "general use",

      "about.kicker": "01 · whoami",

      "log.kicker": "05 · git log",
      "log.title": "Commit",
      "log.title.em": "history",
      "log.lead": "The project timeline, from the latest to the very first.",

      "contact.kicker": "06 · ssh",
      "contact.title": "Let's",
      "contact.title.em": "talk.",
      "contact.lead": "Cloud consulting, automation, a new project or just a chat about infrastructure. My inbox is always open.",
      "contact.copy": "copy",
      "contact.copied": "copied ✓",

      "drawer.close": "close",
      "drawer.repo": "Repository",
      "drawer.privateRepo": "private repository · code on request",
      "drawer.open": "open on GitHub",
      "drawer.demo": "live demo",
      "drawer.highlights": "Highlights",
      "drawer.stack": "Stack",
      "drawer.languages": "Languages",
      "drawer.created": "Created",
      "drawer.pushed": "Last push",
      "drawer.ns": "Namespace",
      "drawer.status": "Status",

      "footer.made": "handmade, no framework, served by GitHub Pages",
      "footer.hint": "tip: press",
      "footer.hint2": "anywhere",

      "time.today": "today",
      "time.yesterday": "yesterday",
      "time.days": "d",
      "time.months": "mo",
      "time.years": "y",
      "time.ago": "ago"
    }
  };

  const KEY = "pc.lang";
  let lang = "pt";
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "pt" || saved === "en") lang = saved;
    else if (!/^pt/i.test(navigator.language || "")) lang = "en";
  } catch (e) {}

  const listeners = [];

  window.I18N = {
    get lang() { return lang; },
    t(key) { return (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.pt[key] ?? key; },
    pick(obj) { return obj ? (obj[lang] ?? obj.pt) : ""; },
    set(next) {
      if (next !== "pt" && next !== "en") return;
      lang = next;
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      this.apply();
      listeners.forEach((fn) => fn(lang));
    },
    toggle() { this.set(lang === "pt" ? "en" : "pt"); },
    onChange(fn) { listeners.push(fn); },
    apply(root = document) {
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
      root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = this.t(el.dataset.i18n); });
      root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", this.t(el.dataset.i18nAria)); });
    }
  };
})();
