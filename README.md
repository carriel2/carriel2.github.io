# pedro@cluster — portfólio

Portfólio de **Pedro Carriel de Barros**, Cloud Technical Consultant.
O site é um cluster: cada projeto é um pod, as categorias são namespaces e tem um terminal de verdade pra navegar.

HTML, CSS e JavaScript puros. Sem build, sem dependências. Roda direto no GitHub Pages.

## Recursos

- Terminal interativo no hero e flutuante (`⌘K` / `Ctrl+K` ou `/`), com autocomplete, histórico e easter eggs
- Projetos em grade ou em **topologia** (canvas interativo: control plane → namespaces → pods)
- Painel `kubectl describe` de cada projeto
- `stack.yaml` interativo: passe o mouse numa tecnologia para ver em quais projetos ela aparece
- `git log` com a linha do tempo dos projetos
- PT / EN com um botão (lembra a escolha do visitante)
- Datas de push dos repositórios públicos atualizadas pela API do GitHub
- Responsivo e respeita `prefers-reduced-motion`

## Adicionar um projeto

Edite [`js/data/projects.js`](js/data/projects.js) e copie um bloco:

```js
{
  repo: "nome-do-repo",
  private: false,
  featured: false,          // true = card grande
  ns: "infra",              // observability | automation | infra | apis | apps
  created: "2026-10-19",
  pushed: "2026-10-19",
  langs: { Python: 12000, Dockerfile: 300 },
  stack: ["Python", "Docker"],
  desc: { pt: "…", en: "…" },
  highlights: { pt: ["…"], en: ["…"] },
  demo: "https://…"         // opcional
}
```

Pra pegar as linguagens e as datas de um repo:

```bash
gh api repos/carriel2/NOME/languages
gh api repos/carriel2/NOME --jq '{created_at, pushed_at}'
```

Pra criar um namespace novo, adicione em `window.NAMESPACES` no mesmo arquivo.

## Dados pessoais e foto

Em [`js/data/profile.js`](js/data/profile.js): nome, cargo, links, texto do "whoami" e a stack.
Para a foto, salve `assets/photo.jpg` e troque `photo: null` por `photo: "assets/photo.jpg"`.

## Rodar localmente

```bash
python -m http.server 5173
```

Abra http://localhost:5173.
