# AGENTS.md

Void(Vite+ / Solid / `@void/md`)で構築し、Cloudflare にデプロイする個人技術ブログ。

## 構成

- ソースは `src/` 配下(`void.config.ts` の `sourceDir`)。`src/pages/` が UI ルート
- 記事は `src/content/entries/*.md`(ファイル名が id、URL は `/entries/:id`)。`@void/md` で GFM・Shiki・frontmatter を処理し、`src/pages/entries/[id].tsx` + `getPrerenderPaths()` で書き出す。一覧・検索・本文の読み込みはサーバー専用の `src/lib/entries.ts` に集め、ページのコンポーネントからは import しない(全記事の本文がブラウザ用 JS に入るため)
- 記事の frontmatter は `title`・`date`・任意の `description`・`tags`・`draft`。`draft: true` は本番では書き出さず一覧にも出さず、直接アクセスも 404(dev では表示して確認できる)
- `description` が無い記事は本文の先頭(見出し・コード・画像・HTML を除いた地の文)から作り、一覧の抜粋と `<meta name="description">` に使う(`src/lib/excerpt.ts`)
- 気軽な投稿は `src/content/notes/*.md`(ファイル名 `YYYY-MM-DD-slug` が id。frontmatter は `date` と任意の `entry`(関連 entry の id))。`/notes/:id` は動的ルート `src/pages/notes/[id].tsx` + `getPrerenderPaths()` で書き出す
- 記事内の画像・動画は R2 の公開バケット `ellreka-net-assets`(`https://assets.ellreka.net/`)に置き、記事からは絶対 URL で参照する。元ファイルは git 管理外の `assets/` に置き、`pnpm assets:upload [ファイル...]` でアップロードする(`scripts/upload-assets.ts`)
- 単独の URL は `<https://...>`(v2 のリンクカード `[](URL)` から変換)、動画は `<video src="https://assets.ellreka.net/..." controls></video>` で書く
- トップ(`src/pages/index.tsx`)は notes と entries を日付順のタイムラインで表示する。notes は見出し・リストなどをパースした HTML 本文を最大 4 行で省略し、画像は順序を保ってすべて末尾の横スクロールカルーセル(`src/components/image-carousel.tsx`)にまとめる。entries も本文中の画像を同じカルーセルで説明の下に出す。本文・画像の抽出はサーバー専用の `src/lib/note-preview.ts` で行い、root のコンポーネントには Markdown 本文を import しない
- notes の画像拡大は `src/components/note-content.tsx` の `NoteContent` と native `<dialog>` で共通化する。詳細・投稿プレビューは本文中の配置を保ち、連続した画像だけの段落は 2 列にまとめ、1 枚なら本文幅にする。詳細の前後の note は画像の高さを制限する。拡大表示では同じ note の画像を前後に送れる。アイコンは lucide の形を `src/components/icons.tsx` に inline SVG で持つ
- ヘッダー・フッターは `src/components/site-frame.tsx` の `SiteFrame` を各ページで使い、全ページの幅は `max-w-3xl` に統一する。現在位置(`current`)を props で渡す。prerender 時は `useRouter().path` が常に `/` になるため、パスで分岐しない
- `void.config.ts` は `output: "static"`。投稿画面以外の全ページを build 時に prerender する
- レイアウトは `src/pages/layout.tsx`(共通。CSS の読み込みのみ)。ヘッダー・フッターは各ページの `SiteFrame` で描画する
- Solid コンポーネントでは props を分割代入しない(リアクティビティが切れるため `props.children` のように参照する)

## notes の投稿画面

- `/admin/notes/new`(`src/pages/admin/notes/new.tsx`、`prerender = false`)から投稿し、`POST /admin/api/notes`(`src/routes/admin/api/notes.ts`)が画像を R2 に置いてから Markdown を GitHub に commit する。サイトへの反映は main への push 後のデプロイによる
- id は投稿時刻(日本時間)の `YYYY-MM-DD-HHMMSS`、画像は中身のハッシュで `notes/<年>/<hash>.<拡張子>` に置く(`src/lib/note-post.ts`)。本文中では投稿までの画像を仮の参照 `![](upload:<n>)` で表す
- R2 は `void.config.ts` の `cloudflare.r2_buckets` で既存バケットを `MEDIA` としてバインドする(`ASSETS` は Void の静的ファイル配信用なので使わない。型は `src/bindings.d.ts`)
- `/admin` 配下は Cloudflare Access で保護し、Worker 側でも `Cf-Access-Jwt-Assertion` を検証する(`src/lib/access.ts`)。API は同一オリジンからの送信だけ受け付ける
- サーバー側の値は `src/env.ts`(`GITHUB_TOKEN`・`GITHUB_BRANCH`・`ACCESS_TEAM_DOMAIN`・`ACCESS_AUD`)。値の無いビルド環境で全ページの prerender が失敗しないよう任意にしており、未設定なら /admin 側で拒否する。本番は `void secret put` で登録する
- ローカルでは Access の検証を省く。root の `.env` に `GITHUB_TOKEN` と検証用の `GITHUB_BRANCH`(main 以外)を書く。dev で main を指定すると投稿を拒否する
- Worker を使う構成になったため、Void の設定で全リクエストが Worker を経由する(`run_worker_first: ["/**"]`)

## スタイリング

- Tailwind CSS 4。装飾は JSX の utility を優先し、`src/app.css` の `@theme` トークン(`bg`/`surface`/`border`/`text`/`text-2`/`text-3`/`line`/`accent`)を使う。トークンは pen.dev のデザイン(`ellreka-net.pen`)の変数に合わせている。フォントは M PLUS 1p(sans。600 が無いので semibold は 700 で表示)と JetBrains Mono(mono)
- `app.css` は Tailwind import・`@theme`・全体の base・Markdown 本文(`.void-md`)の共通スタイルが基本。Markdown の見出し・リスト・コードなどはトップ・詳細・投稿プレビューで `.void-md` のスタイルを共有し、ページ側では文字サイズ・行間・色・`--md-gap`(ブロック間の余白)・`--md-code-padding-x/y`(コードブロックの内側の余白)だけを utility で決める。リストの記号はデザインどおり等幅の薄い「—」(番号付きは番号)。`@void/md` のテーマは base 層に入れて上書きしている。通常のコンポーネント装飾のために独自 CSS や `@apply` クラスを増やさない
- utility で表せない場合のみ最小の CSS にし、理由をコメントで残す
- 文字サイズ・余白・幅などはデザインの px に厳密に合わせず、Tailwind の標準スケール(`text-sm`・`gap-4`・`max-w-3xl` など)の近い値を使う。`text-[13px]` のような任意値や、境界線 1px 分の補正はしない
- ダーク固定。`void.config.ts` の `head.htmlAttrs` で `data-theme="dark"` を付け、`@void/md` の本文・Shiki もダーク配色にしている

## 依存関係

- `package.json` / `pnpm-workspace.yaml` の依存関係は `^` や `~` などの範囲指定を使わず、完全固定する。追加・更新時は lockfile も更新する

## 検証

- `pnpm check`(format + lint)/ `pnpm typecheck` / `pnpm test`(`vitest.config.ts`。Void のプラグインを読まない) / `pnpm build`
- `pnpm test:browser` はブラウザを開き、画像のグリッド・拡大表示・高さ制限を検証する(`vitest.browser.config.ts`。追加のブラウザ用依存は不要)
- `pnpm build` は prerender に失敗したページがあっても exit 0 で終わるので、出力の `[void] prerender ... failed` を確認する
- 表示確認は `pnpm dev`(<http://localhost:4444>)

## デプロイ

- `pnpm run deploy`(= `void deploy`。`pnpm deploy` は pnpm 組み込みコマンドなので `run` が必要)。Cloudflare アカウントは `void.lock.json` に記録済み
- カスタムドメインは `void domain add <hostname>`

<!--injected-by-void-v1.1.12-->

## Void

- This project uses [Void](https://void.cloud), a full-stack Vite framework for Cloudflare Workers with file-based API routing, server-rendered pages, and typed backend services.
- Use Void's CLI and typed APIs. Before working with Void, read the relevant Markdown docs in `node_modules/void/docs/`; start with `guide/quickstart.md` for setup and `reference/cli.md` for commands.

<!--/injected-by-void-->
