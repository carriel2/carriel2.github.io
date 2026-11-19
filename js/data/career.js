/*
 * Experiência, formação e certificações (fonte: LinkedIn).
 * A mais recente primeiro. `end: null` = atual.
 */
window.CAREER = [
  {
    role: { pt: "Consultor de Sistemas de TI", en: "IT Systems Consultant" },
    company: "SaveinCloud",
    start: "2026-04",
    end: null,
    tags: ["IaaS", "PaaS", "OpenStack / KVM", "HA / DR", "OpenTofu", "Ansible", "FinOps", "Pré-vendas"],
    bullets: {
      pt: [
        "Consultoria técnica e arquitetura de infraestrutura cloud para uma carteira de 30 a 40 clientes, sobre Virtuozzo PaaS e IaaS (OpenStack/KVM)",
        "Topologias resilientes para ambientes de missão crítica, com alta disponibilidade e disaster recovery",
        "Projeto de destaque: arquitetura híbrida com SQL Server em VM no IaaS e microsserviços no PaaS, ligados por rede privada, com dois balanceadores NGINX em alta disponibilidade e failover automático",
        "Migrações de infraestrutura planejadas e executadas com foco em zero downtime",
        "Ferramenta interna para o time de Customer Success que centraliza dados de clientes e reduziu em cerca de 75% o tempo de cruzamento das informações",
        "FinOps: análise de consumo, dimensionamento de recursos e otimização contínua de custos",
        "Automação de infraestrutura com Terraform, OpenTofu, Ansible e GitHub Actions",
        "Apresentações técnicas de IaaS e PaaS para CTOs, diretores de TI e tech leads"
      ],
      en: [
        "Technical consulting and cloud infrastructure architecture for a portfolio of 30 to 40 customers, on Virtuozzo PaaS and IaaS (OpenStack/KVM)",
        "Resilient topologies for mission-critical workloads, with high availability and disaster recovery",
        "Highlight project: hybrid architecture with SQL Server on an IaaS VM and microservices on PaaS, joined by a private network, with two highly available NGINX load balancers and automatic failover",
        "Infrastructure migrations planned and executed with a zero-downtime focus",
        "Internal tool for the Customer Success team that centralizes customer data and cut the time to cross-reference it by about 75%",
        "FinOps: usage analysis, resource sizing and continuous cost optimization",
        "Infrastructure automation with Terraform, OpenTofu, Ansible and GitHub Actions",
        "Technical IaaS and PaaS presentations for CTOs, IT directors and tech leads"
      ]
    }
  },
  {
    role: "Cloud Support Assistant",
    company: "SaveinCloud",
    start: "2025-04",
    end: "2026-04",
    badge: { pt: "promovido após 1 ano", en: "promoted after 1 year" },
    tags: ["Virtuozzo / Jelastic", "Linux", "Docker", "Kubernetes", "Redes", "Troubleshooting"],
    bullets: {
      pt: [
        "Suporte técnico a clientes de cloud PaaS e IaaS, com 80 a 100 chamados por semana",
        "Troubleshooting de containers, aplicações e bancos de dados em produção",
        "Diagnóstico de rede: conectividade, roteamento, firewall e balanceamento de carga",
        "Incidentes de acesso SSH, permissões e configuração de ambientes Linux",
        "Análise de logs e investigação de causa raiz em incidentes de desempenho e disponibilidade",
        "Certificações Virtuozzo VAP Cloud e Virtuozzo Support Associate obtidas no período"
      ],
      en: [
        "Technical support for PaaS and IaaS cloud customers, handling 80 to 100 tickets a week",
        "Troubleshooting containers, applications and databases in production",
        "Network diagnosis: connectivity, routing, firewalls and load balancing",
        "SSH access incidents, permissions and Linux environment configuration",
        "Log analysis and root-cause investigation of performance and availability incidents",
        "Earned the Virtuozzo VAP Cloud and Virtuozzo Support Associate certifications"
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
    role: { pt: "Estagiário em Desenvolvimento de Software e Banco de Dados", en: "Software Development & Database Intern" },
    company: "GDC Brasil",
    start: "2023-07",
    end: "2024-02",
    tags: ["Python", "APIs REST", "Bancos de dados", "Git"],
    bullets: {
      pt: [
        "Desenvolvimento e manutenção de sistemas internos e automação de processos com Python",
        "Integração de sistemas via APIs REST, manutenção de bancos de dados e versionamento com Git"
      ],
      en: [
        "Built and maintained internal systems and process automation in Python",
        "System integrations through REST APIs, database maintenance and version control with Git"
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

// Certificações (LinkedIn → Licenças e certificações). `date` = AAAA-MM.
window.CERTS = [
  { name: "Virtuozzo Support Associate", issuer: "Virtuozzo", date: "2026-01" },
  { name: "Virtuozzo VAP Cloud", issuer: "Virtuozzo", date: "2025-07" },
  { name: "Virtuozzo Instructor Signed", issuer: "Virtuozzo", date: "2025-07" },
  { name: { pt: "Docker do Básico ao Avançado", en: "Docker from Basics to Advanced" }, issuer: "Udemy", date: "2026-07" },
  { name: { pt: "Gestão de Vendas e Gestão Comercial", en: "Sales and Commercial Management" }, issuer: "Udemy", date: "2026-04" }
];

// Números de impacto mostrados abaixo do whoami
window.IMPACT = [
  { value: "30–40", label: { pt: "clientes na carteira de consultoria cloud", en: "customers in my cloud consulting portfolio" } },
  { value: 75, prefix: "~", suffix: "%", label: { pt: "menos tempo para cruzar dados de clientes (ferramenta interna)", en: "less time cross-referencing customer data (internal tool)" } },
  { value: "80–100", label: { pt: "chamados por semana no suporte cloud", en: "tickets a week in cloud support" } },
  { value: "projects", label: { pt: "projetos no cluster", en: "projects in the cluster" } }
];
