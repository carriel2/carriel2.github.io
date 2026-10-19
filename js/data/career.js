/*
 * Experiência e formação (do currículo).
 * A mais recente primeiro. `end: null` = atual.
 */
window.CAREER = [
  {
    role: "Cloud Technical Consultant",
    company: "SaveinCloud",
    start: "2026-01",
    end: null,
    tags: ["IaaS", "PaaS", "Virtuozzo", "HA / DR", "FinOps", "Pré-vendas"],
    bullets: {
      pt: [
        "Apresentações técnicas e provas de conceito de soluções IaaS e PaaS (Virtuozzo) para CTOs, Diretores de TI e Tech Leads, apoiando o time comercial em todas as oportunidades",
        "Desenho de topologias resilientes com alta disponibilidade e disaster recovery para ambientes de missão crítica",
        "Planejamento e execução de migrações com foco em zero downtime (+100 ambientes migrados)",
        "Análises de FinOps e rightsizing, com redução média de 30% nos custos dos clientes",
        "Diagnóstico de gargalos de desempenho em aplicações, containers e bancos de dados"
      ],
      en: [
        "Technical presentations and proofs of concept for IaaS and PaaS solutions (Virtuozzo) to CTOs, IT Directors and Tech Leads, backing the sales team on every opportunity",
        "Design of resilient topologies with high availability and disaster recovery for mission-critical workloads",
        "Planning and execution of zero-downtime migrations (100+ environments migrated)",
        "FinOps and rightsizing analyses, cutting customer costs by 30% on average",
        "Troubleshooting performance bottlenecks in applications, containers and databases"
      ]
    }
  },
  {
    role: "Cloud Support Assistant",
    company: "SaveinCloud",
    start: "2025-04",
    end: "2026-01",
    badge: { pt: "promovido em 9 meses", en: "promoted in 9 months" },
    tags: ["Virtuozzo / Jelastic", "Linux", "Docker", "Kubernetes", "Prometheus", "Grafana"],
    bullets: {
      pt: [
        "Suporte técnico especializado em Virtuozzo/Jelastic, Linux, Docker e Kubernetes para +3000 clientes",
        "Monitoramento de ambientes com Prometheus e Grafana, prevenindo e resolvendo incidentes",
        "Apoio técnico ao time comercial no dimensionamento de soluções de infraestrutura"
      ],
      en: [
        "Specialized technical support on Virtuozzo/Jelastic, Linux, Docker and Kubernetes for 3,000+ customers",
        "Environment monitoring with Prometheus and Grafana, preventing and resolving incidents",
        "Technical support to the sales team on infrastructure sizing"
      ]
    }
  },
  {
    role: { pt: "Técnico de Suporte ao Usuário", en: "IT Support Technician" },
    company: "Canatiba Têxtil",
    start: "2024-02",
    end: "2025-04",
    tags: ["Hardware", "Redes", "Windows"],
    bullets: {
      pt: [
        "Atendimento e resolução de chamados de hardware, software e rede para +1000 usuários internos",
        "Manutenção de equipamentos, configuração de estações e suporte a Windows"
      ],
      en: [
        "Hardware, software and network tickets for 1,000+ internal users",
        "Equipment maintenance, workstation setup and Windows support"
      ]
    }
  },
  {
    role: { pt: "Estagiário em Desenvolvimento de Software", en: "Software Development Intern" },
    company: "GDC Brasil",
    start: "2023-07",
    end: "2024-02",
    tags: ["Python", "APIs REST", "Git"],
    bullets: {
      pt: [
        "Desenvolvimento e manutenção de sistemas internos e automação de processos com Python",
        "Integração de sistemas via APIs REST e versionamento com Git"
      ],
      en: [
        "Built and maintained internal systems and process automation in Python",
        "System integrations through REST APIs, version control with Git"
      ]
    }
  }
];

window.EDUCATION = [
  {
    course: { pt: "Tecnólogo em Jogos Digitais", en: "Associate Degree in Digital Games" },
    school: "FATEC Americana",
    start: "2022",
    end: "2026"
  },
  {
    course: { pt: "Técnico em Desenvolvimento de Sistemas", en: "Systems Development Technician" },
    school: "ETEC Polivalente de Americana",
    start: "2020",
    end: "2022",
    note: { pt: "integrado ao Ensino Médio", en: "integrated with high school" }
  }
];

// Números de impacto mostrados abaixo do whoami
window.IMPACT = [
  { value: 100, prefix: "+", label: { pt: "ambientes migrados com foco em zero downtime", en: "environments migrated with zero-downtime focus" } },
  { value: 30, suffix: "%", label: { pt: "redução média de custos dos clientes (FinOps)", en: "average customer cost reduction (FinOps)" } },
  { value: 3000, prefix: "+", label: { pt: "clientes atendidos em suporte cloud", en: "customers served in cloud support" } },
  { value: "projects", label: { pt: "projetos no cluster", en: "projects in the cluster" } }
];
