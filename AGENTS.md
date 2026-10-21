# AGENTS.md

Void(Vite+ / Solid / `@void/md`)で構築し、Cloudflare にデプロイする個人技術ブログ。

## 構成

- ソースは `src/` 配下(`void.config.ts` の `sourceDir`)。`src/pages/` が UI ルート。記事は `src/pages/entries/*.md`(URL は `/entries/:id`。ファイル名が id)(`@void/md` で GFM・Shiki・frontmatter を処理)
- 気軽な投稿は `src/content/notes/*.md`(ファイル名 `YYYY-MM-DD-slug` が id。frontmatter は `date` と任意の `entry`(関連 entry の id))。`/notes/:id` は動的ルート `src/pages/notes/[id].tsx` + `getPrerenderPaths()` で書き出す
- 記事内の画像・動画は R2 の公開バケット `ellreka-net-assets`(`https://assets.ellreka.net/`)に置き、記事からは絶対 URL で参照する。元ファイルは git 管理外の `assets/` に置き、`pnpm assets:upload [ファイル...]` でアップロードする(`scripts/upload-assets.ts`)
- 単独の URL は `<https://...>`(v2 のリンクカード `[](URL)` から変換)、動画は `<video src="https://assets.ellreka.net/..." controls></video>` で書く
- トップ(`src/pages/index.tsx`)は notes と entries を日付順のタイムラインで表示し、notes は本文をそのまま出す
- ヘッダー・フッターは `src/components/site-frame.tsx` の `SiteFrame` を各ページで使い、幅(`wide`)と現在位置(`current`)を props で渡す。prerender 時は `useRouter().path` が常に `/` になるため、パスで分岐しない
- `void.config.ts` は `output: "static"`。全ページを build 時に prerender する
- レイアウトは `src/pages/layout.tsx`(共通。CSS の読み込みのみ)と `src/pages/entries/layout.tsx`(記事。ディレクトリ単位で入れ子になる)。`_layouts/` の名前付きレイアウトは直近のレイアウトを置き換えるので注意
- Solid コンポーネントでは props を分割代入しない(リアクティビティが切れるため `props.children` のように参照する)

## スタイリング

- Tailwind CSS 4。装飾は JSX の utility を優先し、`src/app.css` の `@theme` トークン(`bg`/`surface`/`border`/`text`/`text-2`/`text-3`/`line`/`accent`)を使う。トークンは pen.dev のデザイン(`ellreka-net.pen`)の変数に合わせている。フォントは M PLUS 1p(sans。600 が無いので semibold は 700 で表示)と JetBrains Mono(mono)
- `app.css` は Tailwind import・`@theme`・全体の base・`@void/md` テーマの `--vmd-*` 上書きが基本。通常のコンポーネント装飾のために独自 CSS や `@apply` クラスを増やさない
- utility で表せない場合のみ最小の CSS にし、理由をコメントで残す
- ダーク固定。`void.config.ts` の `head.htmlAttrs` で `data-theme="dark"` を付け、`@void/md` の本文・Shiki もダーク配色にしている

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
