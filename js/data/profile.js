/*
 * Seus dados pessoais. Edite à vontade.
 * Foto: salve em assets/photo.jpg e troque `photo` para "assets/photo.jpg".
 * Currículo: salve o PDF em assets/ e aponte `resume` para ele (null = sem botão).
 */
window.PROFILE = {
  name: "Pedro Carriel",
  surname: "de Barros",
  fullName: "Pedro Carriel de Barros",
  role: "Cloud & DevOps",
  headline: {
    pt: "Consultor de Sistemas de TI · Kubernetes · Docker · OpenStack · Linux · GitOps · FinOps",
    en: "IT Systems Consultant · Kubernetes · Docker · OpenStack · Linux · GitOps · FinOps"
  },
  location: "Santa Bárbara d'Oeste · SP · Brasil",
  github: "carriel2",
  linkedin: "https://www.linkedin.com/in/pedrocarriel/",
  email: "carriel05@proton.me",
  photo: "assets/photo.jpg",
  resume: "assets/Curriculo-Pedro-Carriel.pdf",
  careerStart: "2023-07-01",

  languages: {
    pt: [["Português", "nativo"], ["Inglês", "intermediário · leitura técnica fluente"]],
    en: [["Portuguese", "native"], ["English", "intermediate · fluent technical reading"]]
  },

  about: {
    pt: "Trabalho com Cloud & DevOps na SaveinCloud: faço consultoria e arquitetura de infraestrutura para uma carteira de 30 a 40 clientes, sobre PaaS e IaaS (OpenStack/KVM). Desenho topologias com alta disponibilidade e disaster recovery, conduzo migrações com foco em zero downtime, cuido de FinOps e apresento soluções para CTOs, diretores de TI e tech leads. Vim do desenvolvimento Python e passei um ano no suporte cloud resolvendo incidentes de produção; por isso automatizo tudo o que se repete, com Terraform, OpenTofu, Ansible, GitHub Actions e GitOps. Visão ponta a ponta: do código ao usuário.",
    en: "I work in Cloud & DevOps at SaveinCloud: I do infrastructure consulting and architecture for a portfolio of 30 to 40 customers, on PaaS and IaaS (OpenStack/KVM). I design topologies with high availability and disaster recovery, run zero-downtime migrations, handle FinOps and present solutions to CTOs, IT directors and tech leads. I started in Python development and spent a year in cloud support fixing production incidents, so I automate everything that repeats, with Terraform, OpenTofu, Ansible, GitHub Actions and GitOps. End-to-end view: from code to user."
  },

  // Aparece como stack.yaml. Chave = grupo, valor = lista.
  stack: {
    cloud: ["Virtuozzo / Jelastic", "PaaS", "IaaS", "OpenStack", "KVM", "Multicloud"],
    containers: ["Kubernetes", "k3s", "Argo Rollouts", "Docker", "Docker Compose", "Docker Swarm", "Microservices"],
    iac: ["Terraform", "OpenTofu", "Ansible", "Argo CD", "Kustomize", "GitHub Actions", "JPS manifests", "Git"],
    security: ["Kyverno", "Sigstore / cosign", "SBOM / SLSA", "Trivy", "cert-manager", "Sealed Secrets"],
    os: ["RHEL", "Debian", "Ubuntu", "CentOS", "AlmaLinux", "Arch Linux", "Windows Server"],
    network: ["Routing", "VPN", "Segmentation", "Firewalls", "HAProxy", "Nginx", "Reverse proxy"],
    observability: ["Prometheus", "Grafana", "Loki", "SLOs / burn rate", "Uptime Kuma", "TimescaleDB"],
    development: ["Python", "FastAPI", "Django", "REST APIs", "Streamlit", "Flutter", "Next.js"],
    data: ["PostgreSQL", "Oracle", "SQLAlchemy", "Pandas", "Google Sheets API"],
    business: ["High availability", "Disaster recovery", "Capacity planning", "FinOps", "Pre-sales"]
  }
};
