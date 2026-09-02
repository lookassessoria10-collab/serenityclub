# Serenity

Site editorial da Serenity para apresentar musas digitais, perfis e galerias de
fotos gratuitas e premium.

## Stack

- Next.js
- React
- CSS global em `app/globals.css`
- Dados locais em `app/data.ts`
- Imagens em `public/assets`

O projeto nao usa banco de dados na versao atual.

## Rodar Localmente

```bash
npm install
npm run dev
```

O preview local abre em `http://127.0.0.1:4173`.

## Build

```bash
npm run build
```

O build gera a pasta `out/`, configurada no `vercel.json` como diretorio de
saida para deploy estatico no Vercel.
