/*
 * ─────────────────────────────────────────────────────────────
 *  PROJETOS DO PORTFÓLIO
 *  Para adicionar um projeto, copie um bloco abaixo e edite.
 *
 *  repo       nome do repositório em github.com/carriel2/<repo>
 *  private    true = mostra cadeado e não linka o código
 *  featured   true = card grande em destaque
 *  ns         namespace: observability | automation | infra | apis | apps
 *  created    data de criação (AAAA-MM-DD)
 *  pushed     último push (atualizado sozinho pela API do GitHub nos públicos)
 *  langs      bytes por linguagem (gh api repos/carriel2/<repo>/languages)
 *  stack      tecnologias principais
 *  desc       resumo curto, PT e EN
 *  highlights destaques, PT e EN
 *  demo       (opcional) URL de demo ao vivo
 * ─────────────────────────────────────────────────────────────
 */
window.NAMESPACES = {
  observability: { color: "#4ff0b4", label: { pt: "monitoramento e dados", en: "monitoring & data" } },
  automation:    { color: "#ffc861", label: { pt: "automações de negócio", en: "business automation" } },
  infra:         { color: "#5ad8ff", label: { pt: "infra, deploy e devops", en: "infra, deploy & devops" } },
  apis:          { color: "#8ea8ff", label: { pt: "APIs e backends", en: "APIs & backends" } },
  apps:          { color: "#ff8fc7", label: { pt: "apps web e mobile", en: "web & mobile apps" } }
};

window.PROJECTS = [
  {
    repo: "gitops-platform",
    private: false,
    featured: true,
    ns: "infra",
    created: "2026-11-09",
    pushed: "2026-11-19",
    // gitops-platform (infra e manifests) + platform-app (app e pipeline de imagem)
    langs: { Python: 3772, HCL: 19126, Shell: 8965, Dockerfile: 1089 }, // ordem das chaves define o "Langs" do neofetch
    stack: ["OpenTofu", "OpenStack", "k3s", "Argo CD", "Argo Rollouts", "Kyverno", "Prometheus", "Grafana", "Loki", "cert-manager", "Sigstore / cosign", "Kustomize", "GitHub Actions"],
    desc: {
      pt: "Plataforma GitOps de ponta a ponta em OpenStack: infra como código, Kubernetes em alta disponibilidade, supply chain assinada, SLOs e canary com rollback automático. O Git é a única fonte da verdade.",
      en: "End-to-end GitOps platform on OpenStack: infrastructure as code, highly available Kubernetes, signed supply chain, SLOs and canary releases with automatic rollback. Git is the single source of truth."
    },
    highlights: {
      pt: [
        "Destruída e recriada do zero a partir do Git em 25 min 45 s, com cronômetro em cada etapa",
        "Canary com Argo Rollouts abortou sozinho uma versão com 30% de erro em ~2 min, medindo só os pods novos",
        "Só roda imagem assinada pelo CI: SBOM, SLSA, Trivy e cosign keyless, verificados pelo Kyverno na admissão",
        "SLOs de disponibilidade e latência com alertas por burn rate em múltiplas janelas, testados com promtool no CI",
        "k3s HA com OpenTofu, Argo CD que gerencia a si mesmo e TLS automático com cert-manager e Let's Encrypt",
        "Incidente real com postmortem: nó sem memória, causa provada nas métricas e health check do LB corrigido"
      ],
      en: [
        "Destroyed and rebuilt from Git in 25 min 45 s, with every step timed",
        "Argo Rollouts canary aborted a release with 30% errors on its own in ~2 min, measuring only the new pods",
        "Only CI-signed images run: SBOM, SLSA, Trivy and keyless cosign, verified by Kyverno at admission",
        "Availability and latency SLOs with multi-window burn-rate alerts, unit-tested with promtool in CI",
        "HA k3s with OpenTofu, a self-managing Argo CD and automatic TLS with cert-manager and Let's Encrypt",
        "Real incident with a postmortem: out-of-memory node, root cause proven in metrics, LB health check fixed"
      ]
    }
  },
  {
    repo: "JCAMonitor",
    private: true,
    featured: true,
    ns: "observability",
    created: "2026-09-29",
    pushed: "2026-10-19",
    langs: { Python: 467989, HTML: 199089, Dockerfile: 924 },
    stack: ["Python", "Jelastic API", "PostgreSQL", "Docker", "SMTP"],
    desc: {
      pt: "Monitor diário da plataforma JCA (Virtuozzo/Jelastic): registra ambientes criados e excluídos, separa contas reais de internas e entrega painel, API e relatório por e-mail.",
      en: "Daily monitor for the JCA platform (Virtuozzo/Jelastic): tracks created and deleted environments, separates real from internal accounts and ships a dashboard, API and e-mail report."
    },
    highlights: {
      pt: [
        "Coleta automática às 05:00 do dia anterior fechado, com retroativo",
        "Duas plataformas isoladas (Cloudlets e Nuvion) + visão unificada por cliente",
        "Painel com filtros, ranking, comparação, permanência e export CSV",
        "Ficha do cliente e oportunidades cruzando recargas com ambientes",
        "Área admin com consulta ao vivo, pesquisa por UID e auditoria"
      ],
      en: [
        "Automatic collection at 05:00 for the previous closed day, with backfill",
        "Two isolated platforms (Cloudlets and Nuvion) + unified per-customer view",
        "Dashboard with filters, ranking, comparison, retention and CSV export",
        "Customer profile and opportunities crossing top-ups with environments",
        "Admin area with live queries, UID lookup and audit log"
      ]
    }
  },
  {
    repo: "gitops-k8s-lab",
    private: false,
    featured: true,
    ns: "infra",
    created: "2026-11-16",
    pushed: "2026-11-16",
    langs: { Python: 1414, Dockerfile: 609 },
    stack: ["Kubernetes", "Argo CD", "Kustomize", "GitHub Actions", "Sealed Secrets", "GHCR"],
    desc: {
      pt: "Laboratório de GitOps em Kubernetes: uma API construída pelo GitHub Actions, entregue pelo Argo CD e executada com hardening de produção. O app é trivial de propósito; o foco é como ele é entregue e operado.",
      en: "GitOps lab on Kubernetes: an API built by GitHub Actions, shipped by Argo CD and run with production-style hardening. The app is deliberately trivial; the point is how it is delivered and operated."
    },
    highlights: {
      pt: [
        "Promoção de versão por commit no Git e rollback por git revert",
        "Segredos cifrados no Git com Sealed Secrets e backup semanal das chaves para S3, com RBAC mínimo",
        "Pod Security restricted, contêiner sem root, filesystem somente leitura, probes e limites",
        "LoadBalancer restrito ao IP do WAF, com X-Forwarded-For confiável só a partir dos nós"
      ],
      en: [
        "Version promotion by Git commit and rollback by git revert",
        "Secrets encrypted in Git with Sealed Secrets and weekly key backup to S3, with least-privilege RBAC",
        "Pod Security restricted, non-root container, read-only filesystem, probes and limits",
        "LoadBalancer restricted to the WAF IP, trusting X-Forwarded-For only from cluster nodes"
      ]
    }
  },
  {
    repo: "jelastic-demo",
    private: false,
    featured: true,
    ns: "infra",
    created: "2026-02-05",
    pushed: "2026-02-10",
    langs: { Dockerfile: 1257, Python: 1192 },
    stack: ["GitHub Actions", "Docker", "FastAPI", "PostgreSQL", "Prometheus", "Grafana", "JPS"],
    desc: {
      pt: "Laboratório de observabilidade e automação full stack: arquitetura DevOps de referência no PaaS SaveInCloud com deploy zero-touch via GitHub Actions.",
      en: "Full stack observability & automation lab: a reference DevOps architecture on the SaveInCloud PaaS with zero-touch deploys through GitHub Actions."
    },
    highlights: {
      pt: [
        "Topologia híbrida: app FastAPI em Docker Engine + PostgreSQL gerenciado",
        "Provisionamento como código: o manifest.jps cria a infra do zero se não existir",
        "Deploy contínuo com comando remoto e Docker Compose a cada push",
        "Prometheus + Grafana pré-configurados para métricas em tempo real"
      ],
      en: [
        "Hybrid topology: FastAPI on Docker Engine nodes + managed PostgreSQL",
        "Infrastructure as code: manifest.jps creates everything from scratch if missing",
        "Continuous deploy with remote exec and Docker Compose on every push",
        "Prometheus + Grafana pre-configured for real-time metrics"
      ]
    }
  },
  {
    repo: "jelastic-billing-monitor",
    private: false,
    featured: true,
    ns: "observability",
    created: "2026-09-09",
    pushed: "2026-09-09",
    langs: { Python: 26046, PLpgSQL: 9353, Dockerfile: 417 },
    stack: ["Python", "TimescaleDB", "PostgreSQL", "Grafana", "Docker Compose"],
    desc: {
      pt: "Coletor diário da API Jelastic que grava billing em PostgreSQL/TimescaleDB e alimenta dashboards no Grafana provisionados automaticamente.",
      en: "Daily Jelastic API collector that stores billing in PostgreSQL/TimescaleDB and feeds auto-provisioned Grafana dashboards."
    },
    highlights: {
      pt: [
        "Pipeline API → TimescaleDB → Grafana em um docker compose up",
        "Backfill de histórico por período com um único comando",
        "Scheduler em container rodando todo dia às 00:20 (America/Sao_Paulo)",
        "Datasource e dashboard do Grafana provisionados como código"
      ],
      en: [
        "API → TimescaleDB → Grafana pipeline in a single docker compose up",
        "One-command historical backfill for any period",
        "Containerized scheduler running daily at 00:20 (America/Sao_Paulo)",
        "Grafana datasource and dashboard provisioned as code"
      ]
    }
  },
  {
    repo: "calculadoraSaveinCloud",
    private: false,
    featured: true,
    ns: "apps",
    created: "2026-08-05",
    pushed: "2026-10-08",
    langs: { JavaScript: 87485, CSS: 65295, HTML: 25201, Dockerfile: 68 },
    stack: ["JavaScript", "HTML", "CSS", "Docker"],
    desc: {
      pt: "Gerador de propostas comerciais com calculadora de estimativa embutida, que monta um documento editável no navegador em folhas A4 e exporta em PDF.",
      en: "Sales proposal generator with a built-in pricing calculator that builds an in-browser editable A4 document and exports it as PDF."
    },
    highlights: {
      pt: [
        "100% client-side: sem banco, backend, API ou IA",
        "Blocos de produto (Nuvion, Cloudlets, Storin) com subtotal, duplicar e remover",
        "Paginação automática no papel timbrado sem invadir cabeçalho e rodapé",
        "Resumo com total mensal e prazo de contrato ajustável"
      ],
      en: [
        "100% client-side: no database, backend, API or AI",
        "Product blocks (Nuvion, Cloudlets, Storin) with subtotal, duplicate and remove",
        "Automatic pagination on letterhead without overlapping header and footer",
        "Summary with monthly total and adjustable contract length"
      ]
    }
  },
  {
    repo: "comercialAutomation",
    private: false,
    ns: "automation",
    created: "2026-05-22",
    pushed: "2026-06-03",
    langs: { Python: 38527, Dockerfile: 405 },
    stack: ["Python", "Docker Compose", "Google Sheets API", "SMTP"],
    desc: {
      pt: "Ecossistema de automações de billing e Customer Success: espelha o consumo faturado no Google Sheets e dispara relatórios executivos para o time comercial.",
      en: "Billing & Customer Success automation ecosystem: mirrors billed usage into Google Sheets and sends executive reports to the sales team."
    },
    highlights: {
      pt: [
        "Dois microsserviços independentes em containers na mesma rede",
        "Relatórios semanais automáticos e alertas de performance",
        "Integração entre API da plataforma, Google Sheets e SMTP"
      ],
      en: [
        "Two independent containerized microservices on a shared network",
        "Automatic weekly reports and performance alerts",
        "Integration between the platform API, Google Sheets and SMTP"
      ]
    }
  },
  {
    repo: "hobbOS",
    private: false,
    ns: "infra",
    created: "2026-05-20",
    pushed: "2026-11-26",
    // sem os ~320 KB de CSS do tema GTK de terceiros (B00merang, GPL-3.0); só o CSS do próprio projeto
    langs: { Shell: 18827, HCL: 6070, Python: 2156, CSS: 1122 },
    stack: ["Arch Linux", "archiso", "XFCE", "systemd", "QEMU", "OpenTofu", "OpenStack", "Bash", "Python"],
    desc: {
      pt: "Distribuição Linux (respin) baseada no Arch e montada com archiso: roda do pendrive com XFCE em português, visual retrô dos anos 2000 e kit de resgate de disco. Cada ISO é testada automaticamente no QEMU, em BIOS e UEFI.",
      en: "Arch-based Linux distribution (respin) built with archiso: boots from a USB stick into XFCE in Brazilian Portuguese, with a retro 2000s look and a disk rescue toolkit. Every ISO is tested automatically in QEMU, on BIOS and UEFI."
    },
    highlights: {
      pt: [
        "Perfil archiso a partir do releng oficial: a ISO dá boot em BIOS e UEFI direto no desktop, com login automático",
        "Smoke test automatizado: sobe a ISO no QEMU e confere 23 itens por dentro do sistema via QEMU Guest Agent",
        "Visual anos 2000 com arte própria em SVG e tema de janelas de licença livre (GPL-3.0), sem material da Microsoft",
        "Kit de resgate no menu Iniciar: GParted, TestDisk, PhotoRec, Clonezilla e ddrescue, com admin sem senha via polkit",
        "VM de build no OpenStack com OpenTofu e KVM aninhado: ISO em ~15 min e teste de boot em ~3 min"
      ],
      en: [
        "archiso profile based on the official releng: the ISO boots on BIOS and UEFI straight into the desktop with autologin",
        "Automated smoke test: boots the ISO in QEMU and checks 23 items inside the system through the QEMU Guest Agent",
        "2000s look with original SVG artwork and a freely licensed (GPL-3.0) window theme, with no Microsoft assets",
        "Rescue toolkit in the Start menu: GParted, TestDisk, PhotoRec, Clonezilla and ddrescue, with password-less admin via polkit",
        "Build VM on OpenStack with OpenTofu and nested KVM: ISO in ~15 min, boot test in ~3 min"
      ]
    }
  },
  {
    repo: "dashboardIncentivo",
    private: false,
    ns: "observability",
    created: "2026-02-28",
    pushed: "2026-06-18",
    langs: { Python: 23834, Dockerfile: 453 },
    stack: ["Python", "Streamlit", "Plotly", "PostgreSQL", "Docker"],
    desc: {
      pt: "Dashboard em Streamlit com gráficos Plotly, coleta agendada e dados em PostgreSQL, empacotado com Docker Compose.",
      en: "Streamlit dashboard with Plotly charts, scheduled data collection and PostgreSQL storage, packaged with Docker Compose."
    },
    highlights: {
      pt: ["Scheduler separado do app para coleta periódica", "Deploy com um docker compose up"],
      en: ["Scheduler decoupled from the app for periodic collection", "Deploys with a single docker compose up"]
    }
  },
  {
    repo: "integrators_users.API",
    private: true,
    ns: "apis",
    created: "2025-02-10",
    pushed: "2025-03-26",
    langs: { Python: 5856 },
    stack: ["FastAPI", "Oracle", "PostgreSQL"],
    desc: {
      pt: "API em FastAPI para operações em Oracle e PostgreSQL dos monitores de usuários, integradores e logs de erro dos integradores.",
      en: "FastAPI service running Oracle and PostgreSQL operations for user monitors, integrators and integrator error logs."
    },
    highlights: {
      pt: ["Acesso a dois bancos (Oracle e Postgres) na mesma API", "Base para os painéis de monitoramento"],
      en: ["Two databases (Oracle and Postgres) behind one API", "Backbone for the monitoring dashboards"]
    }
  },
  {
    repo: "marketingAutomation",
    private: false,
    ns: "automation",
    created: "2026-05-21",
    pushed: "2026-05-21",
    langs: { Python: 9170, Dockerfile: 446 },
    stack: ["Python", "Docker", "SMTP", "schedule"],
    desc: {
      pt: "Automação que simplifica e agenda os disparos de e-mails de marketing da SaveInCloud.",
      en: "Automation that simplifies and schedules SaveInCloud's marketing e-mail campaigns."
    },
    highlights: {
      pt: ["Disparos agendados rodando em container"],
      en: ["Scheduled sends running in a container"]
    }
  },
  {
    repo: "consultaPlanilhaCusto",
    private: false,
    ns: "automation",
    created: "2026-04-06",
    pushed: "2026-04-07",
    langs: { Python: 9937, Dockerfile: 274 },
    stack: ["Python", "Google Sheets API", "PostgreSQL", "Grafana"],
    desc: {
      pt: "Jelastic Billing Sync: lê o consumo da API da plataforma via Google Sheets e popula um dashboard no Grafana.",
      en: "Jelastic Billing Sync: reads platform usage through Google Sheets and populates a Grafana dashboard."
    },
    highlights: {
      pt: ["Service Account do Google para leitura segura", "Sobe com docker-compose up --build"],
      en: ["Google Service Account for secure reads", "Runs with docker-compose up --build"]
    }
  },
  {
    repo: "cursoDocker-Python",
    private: false,
    ns: "infra",
    created: "2026-04-20",
    pushed: "2026-05-05",
    langs: { Python: 1202, Dockerfile: 554, JavaScript: 475 },
    stack: ["Docker", "Docker Swarm", "HAProxy", "GitHub Actions", "Node.js", "Python"],
    desc: {
      pt: "Laboratórios do treinamento Docker do básico ao avançado: namespaces e cgroups, multi-stage build, Swarm, rootless e CI/CD.",
      en: "Labs from a basic-to-advanced Docker training: namespaces and cgroups, multi-stage builds, Swarm, rootless and CI/CD."
    },
    highlights: {
      pt: ["Balanceamento L7 sobre L4: HAProxy na frente de containers NGINX no Swarm, com descoberta por DNS round robin", "Troubleshooting de kernel e rede com tcpdump e nftables para liberar o tráfego do Swarm sem quebrar o NAT", "Imagens Alpine otimizadas com multi-stage", "Python integrado à API do Docker", "Pipeline de deploy no GitHub Actions"],
      en: ["L7 over L4 load balancing: HAProxy in front of NGINX containers on Swarm, discovered through DNS round robin", "Kernel and network troubleshooting with tcpdump and nftables to let Swarm traffic through without breaking NAT", "Optimized Alpine images with multi-stage builds", "Python talking to the Docker API", "Deploy pipeline on GitHub Actions"]
    }
  },
  {
    repo: "BananaBudget",
    private: true,
    ns: "apps",
    created: "2026-02-18",
    pushed: "2026-02-22",
    langs: { Python: 26098, Dockerfile: 529 },
    stack: ["Python", "Streamlit", "Plotly", "Pandas", "bcrypt", "Docker"],
    desc: {
      pt: "App de finanças pessoais em Streamlit, com gráficos interativos e login protegido por bcrypt.",
      en: "Personal finance app built with Streamlit, interactive charts and bcrypt-protected login."
    },
    highlights: {
      pt: ["Gráficos com Plotly e navegação por menu", "Containerizado para rodar em qualquer lugar"],
      en: ["Plotly charts and menu navigation", "Containerized to run anywhere"]
    }
  },
  {
    repo: "GoogleRoutes.api",
    private: false,
    ns: "apis",
    created: "2025-01-31",
    pushed: "2025-02-03",
    langs: { Python: 8931 },
    stack: ["Django REST Framework", "Google Directions API"],
    desc: {
      pt: "API Django REST que recebe endereços e a localização atual e devolve a melhor ordem de rota usando a Directions API do Google Maps.",
      en: "Django REST API that takes addresses plus the current location and returns the optimal route order using the Google Maps Directions API."
    },
    highlights: {
      pt: ["Waypoints com otimização ativada e destino fixo", "Serializer validando a lista de endereços"],
      en: ["Optimized waypoints with a fixed destination", "Serializer validating the address list"]
    }
  },
  {
    repo: "GoogleRoutes.app",
    private: false,
    ns: "apps",
    created: "2025-01-31",
    pushed: "2025-02-03",
    langs: { Dart: 10729, Swift: 2034, HTML: 1228, Kotlin: 128 },
    stack: ["Flutter", "Dart", "geolocator", "Google Maps"],
    desc: {
      pt: "App Flutter de rotas otimizadas: usa o GPS como origem, envia os endereços para a API e abre o Google Maps com a melhor sequência.",
      en: "Flutter app for optimized routes: uses GPS as the origin, sends addresses to the API and opens Google Maps with the best sequence."
    },
    highlights: {
      pt: ["Campos de endereço dinâmicos", "Geolocalização e geocoding no dispositivo"],
      en: ["Dynamic address fields", "On-device geolocation and geocoding"]
    }
  },
  {
    repo: "Hospital.CRUD.API",
    private: false,
    ns: "apis",
    created: "2025-02-26",
    pushed: "2025-02-27",
    langs: { Python: 11984 },
    stack: ["FastAPI", "PostgreSQL", "SQLAlchemy (async)", "Swagger"],
    desc: {
      pt: "Backend de sistema hospitalar com CRUD de pacientes, médicos, agendamentos e tratamentos.",
      en: "Hospital system backend with CRUD for patients, doctors, appointments and treatments."
    },
    highlights: {
      pt: ["SQLAlchemy assíncrono", "Documentação automática com Swagger e Redoc"],
      en: ["Async SQLAlchemy", "Automatic docs with Swagger and Redoc"]
    }
  },
  {
    repo: "Hospital.CRUD.APP",
    private: true,
    ns: "apps",
    created: "2025-03-07",
    pushed: "2025-03-07",
    langs: { Dart: 17069, Swift: 1933, HTML: 1222, Kotlin: 125 },
    stack: ["Flutter", "Dart", "REST"],
    desc: {
      pt: "Front-end Flutter do sistema hospitalar, com login, landing page e consumo da Hospital.CRUD.API.",
      en: "Flutter front-end for the hospital system, with login, landing page and Hospital.CRUD.API integration."
    },
    highlights: {
      pt: ["Camada de serviço separada para a API", "Paleta e componentes próprios"],
      en: ["Dedicated API service layer", "Custom palette and components"]
    }
  },
  {
    repo: "django-deploy-SiC",
    private: false,
    ns: "infra",
    created: "2025-05-13",
    pushed: "2025-05-15",
    langs: { Python: 2948, HTML: 508 },
    stack: ["Django", "SaveInCloud"],
    desc: {
      pt: "Projeto de referência para deploy de aplicações Django na plataforma SaveInCloud.",
      en: "Reference project for deploying Django applications on the SaveInCloud platform."
    },
    highlights: {
      pt: ["Usado como exemplo em atendimentos a clientes"],
      en: ["Used as a sample in customer engagements"]
    }
  },
  {
    repo: "deploy-tomcat-maven",
    private: false,
    ns: "infra",
    created: "2025-06-09",
    pushed: "2025-06-09",
    langs: { Java: 631 },
    stack: ["Java", "Maven", "Tomcat"],
    desc: {
      pt: "Projeto Tomcat com build Maven para testar deploys Java na SaveInCloud.",
      en: "Tomcat project with a Maven build to test Java deploys on SaveInCloud."
    },
    highlights: {
      pt: ["Fluxo de build e deploy Maven → Tomcat"],
      en: ["Maven → Tomcat build and deploy flow"]
    }
  },
  {
    repo: "cardapio",
    private: true,
    ns: "apps",
    created: "2024-09-10",
    pushed: "2024-11-12",
    langs: { HTML: 48161, Python: 25035, CSS: 13945 },
    stack: ["Django", "HTML", "CSS"],
    desc: {
      pt: "Cardápio digital feito em Django.",
      en: "Digital menu built with Django."
    },
    highlights: { pt: ["Templates Django e estilos próprios"], en: ["Django templates and custom styling"] }
  },
  {
    repo: "NextJS",
    title: "CadastroAPP",
    private: true,
    ns: "apps",
    created: "2024-07-22",
    pushed: "2024-07-23",
    langs: { TypeScript: 67890, CSS: 489, JavaScript: 232 },
    stack: ["Next.js", "TypeScript", "React"],
    desc: {
      pt: "App de cadastro em Next.js com TypeScript, meu primeiro mergulho no ecossistema React.",
      en: "Registration app in Next.js and TypeScript, my first dive into the React ecosystem."
    },
    highlights: { pt: ["Rotas e componentes tipados"], en: ["Typed routes and components"] }
  }
];
