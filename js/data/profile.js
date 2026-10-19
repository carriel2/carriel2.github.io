/*
 * Seus dados pessoais. Edite à vontade.
 * Foto: salve em assets/photo.jpg e troque `photo` para "assets/photo.jpg".
 */
window.PROFILE = {
  name: "Pedro Carriel",
  surname: "de Barros",
  fullName: "Pedro Carriel de Barros",
  role: "Cloud Technical Consultant",
  github: "carriel2",
  linkedin: "https://www.linkedin.com/in/pedrocarriel/",
  email: "carriel05@proton.me",
  photo: null,
  since: 2024,

  about: {
    pt: "Sou Cloud Technical Consultant e trabalho onde a infraestrutura encontra o negócio: ajudo empresas a colocar aplicações na nuvem e construo as ferramentas que deixam a operação mais rápida — monitores, coletores de billing, pipelines de deploy e automações comerciais. Gosto de Python, de containers e de transformar processo manual em algo que roda sozinho às 5 da manhã.",
    en: "I'm a Cloud Technical Consultant working where infrastructure meets business: I help companies run their applications in the cloud and build the tools that make operations faster — monitors, billing collectors, deploy pipelines and sales automations. I like Python, containers, and turning manual processes into something that runs by itself at 5 a.m."
  },

  // Aparece como stack.yaml. Chave = grupo, valor = lista.
  stack: {
    cloud: ["Jelastic / Virtuozzo PaaS", "SaveInCloud", "Linux", "Arch Linux (archiso)"],
    containers: ["Docker", "Docker Compose", "Docker Swarm", "Multi-stage builds"],
    cicd: ["GitHub Actions", "IaC (JPS manifests)", "Zero-touch deploy"],
    observability: ["Grafana", "Prometheus", "TimescaleDB"],
    languages: ["Python", "JavaScript", "TypeScript", "Dart", "Java", "SQL"],
    frameworks: ["FastAPI", "Django / DRF", "Streamlit", "Flutter", "Next.js", "SQLAlchemy"],
    data: ["PostgreSQL", "Oracle", "Pandas", "Plotly", "Google Sheets API"],
    automation: ["Cron / schedulers", "SMTP reports", "REST integrations", "Google Maps API"]
  }
};
