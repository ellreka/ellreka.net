# AGENTS.md

Void(Vite+ / Solid / `@void/md`)で構築し、Cloudflare にデプロイする個人技術ブログ。

## 構成

- ソースは `src/` 配下(`void.config.ts` の `sourceDir`)。`src/pages/` が UI ルート。記事は `src/pages/entries/*.md`(URL は `/entries/:id`。ファイル名が id)(`@void/md` で GFM・Shiki・frontmatter を処理)
- `void.config.ts` は `output: "static"`。全ページを build 時に prerender する
- レイアウトは `src/pages/layout.tsx`(共通)と `src/pages/entries/layout.tsx`(記事。ディレクトリ単位で入れ子になる)。`_layouts/` の名前付きレイアウトは直近のレイアウトを置き換えるので注意
- Solid コンポーネントでは props を分割代入しない(リアクティビティが切れるため `props.children` のように参照する)

## 依存関係

- `package.json` / `pnpm-workspace.yaml` の依存関係は `^` や `~` などの範囲指定を使わず、完全固定する。追加・更新時は lockfile も更新する

## 検証

- `pnpm check`(format + lint)/ `pnpm typecheck` / `pnpm build`
- 表示確認は `pnpm dev`(http://localhost:4444)

## デプロイ

- `pnpm run deploy`(= `void deploy`。`pnpm deploy` は pnpm 組み込みコマンドなので `run` が必要)。Cloudflare アカウントは `void.lock.json` に記録済み
- カスタムドメインは `void domain add <hostname>`

<!--injected-by-void-v1.1.12-->

## Void

- This project uses [Void](https://void.cloud), a full-stack Vite framework for Cloudflare Workers with file-based API routing, server-rendered pages, and typed backend services.
- Use Void's CLI and typed APIs. Before working with Void, read the relevant Markdown docs in `node_modules/void/docs/`; start with `guide/quickstart.md` for setup and `reference/cli.md` for commands.

<!--/injected-by-void-->
