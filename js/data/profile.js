/*
 * Seus dados pessoais. Edite à vontade.
 * Foto: salve em assets/photo.jpg e troque `photo` para "assets/photo.jpg".
 * Currículo: salve o PDF em assets/ e aponte `resume` para ele (null = sem botão).
 */
window.PROFILE = {
  name: "Pedro Carriel",
  surname: "de Barros",
  fullName: "Pedro Carriel de Barros",
  role: "Cloud Technical Consultant",
  headline: {
    pt: "Pré-vendas técnica · Kubernetes · OpenStack · Linux · Terraform · FinOps",
    en: "Technical pre-sales · Kubernetes · OpenStack · Linux · Terraform · FinOps"
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
    pt: "Sou consultor técnico de cloud e transformo requisitos de negócio em arquiteturas IaaS e PaaS escaláveis, seguras e com custo otimizado. Atuo em pré-vendas técnica para CTOs, Diretores de TI e Tech Leads, e na base de clientes com migrações, alta disponibilidade e FinOps. Vim do desenvolvimento Python, passei por suporte e infraestrutura, e hoje tenho visão ponta a ponta: do código ao usuário.",
    en: "I'm a cloud technical consultant who turns business requirements into scalable, secure and cost-optimized IaaS and PaaS architectures. I do technical pre-sales for CTOs, IT Directors and Tech Leads, and work with existing customers on migrations, high availability and FinOps. I started in Python development, went through support and infrastructure, and now see the whole picture: from code to user."
  },

  // Aparece como stack.yaml. Chave = grupo, valor = lista.
  stack: {
    cloud: ["Virtuozzo / Jelastic", "PaaS", "IaaS", "OpenStack", "KVM", "Multicloud"],
    containers: ["Kubernetes", "Docker", "Docker Compose", "Docker Swarm", "Microservices"],
    iac: ["Terraform", "GitHub Actions", "JPS manifests", "Git"],
    os: ["RHEL", "Debian", "Ubuntu", "CentOS", "AlmaLinux", "Arch Linux", "Windows Server"],
    network: ["Routing", "VPN", "Segmentation", "Firewalls", "HAProxy", "Nginx", "Reverse proxy"],
    observability: ["Prometheus", "Grafana", "Uptime Kuma", "TimescaleDB"],
    development: ["Python", "FastAPI", "Django", "REST APIs", "Streamlit", "Flutter", "Next.js"],
    data: ["PostgreSQL", "Oracle", "SQLAlchemy", "Pandas", "Google Sheets API"],
    business: ["High availability", "Disaster recovery", "Capacity planning", "FinOps", "Pre-sales"]
  }
};
