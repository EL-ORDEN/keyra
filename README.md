# Keyra — Gerenciador de senhas (protótipo)

Este repositório contém a UI do Keyra — um gerenciador de senhas com foco em privacidade (protótipo). O frontend foi construído com React + TypeScript e empacotado com Vite. Há scaffold básico para empacotamento desktop via Tauri.

Sumário rápido

- Layout desktop-first com dashboard, onboarding, painel de segurança e gerador de senhas.
- Persistência local via `localStorage` (apenas para protótipo).

Observação de segurança

Os dados são armazenados em `localStorage` sem criptografia. Para uso real em produção é obrigatório adicionar criptografia (ex.: derivação de chave com Argon2/PBKDF2, AES-GCM ou libs de criptografia modernas) e considerar um modelo Zero-Knowledge ou backend seguro.

Requisitos

- Node.js (v18+)
- npm
- Para empacotar com Tauri: Rust toolchain (rustup + cargo) e dependências do sistema (veja https://tauri.app)

Instalação e execução (desenvolvimento)

1. Instale dependências JS

```bash
npm install
```

2. Rode o servidor de desenvolvimento do Vite

```bash
npm run dev
# abra http://localhost:4173
```

Build web e preview

```bash
npm run build
npm run preview
```

Empacotar com Tauri (desktop)

1. Instale Rust (se necessário)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Instale dependências e (opcional) CLI do Tauri

```bash
npm install
npm install -g @tauri-apps/cli
```

3. Rodar em modo dev (Vite + Tauri window)

```bash
npm run dev      # starta o Vite
npm run tauri:dev
```

4. Gerar build para distribuição

```bash
npm run build
npm run tauri:build
```

Estrutura do projeto

- `src/` — código React (ex.: `src/App.tsx`, `src/index.css`)
- `public/` — assets públicos (logo, ícones)
- `dist/` — saída do build web
- `src-tauri/` — configuração e código Rust/Tauri

Notas adicionais e próximos passos

- Responsividade mobile: priorizar melhorias de layout e espaçamentos.
- Criptografia: planejar derivação de chave e encriptação antes de persistir dados sensíveis.
- Tauri: personalize ícones em `src-tauri/icons/` e atualize `tauri.conf.json` quando for empacotar.

Se quiser, posso:

- adicionar instruções específicas para Windows (dependências Tauri/Visual C++). 
- adicionar ícones e metadados de release.
- começar a implementação de armazenamento encriptado local.

