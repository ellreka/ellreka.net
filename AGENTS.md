# AGENTS.md

Void(Vite+ / Solid / `@void/md`)で構築し、Cloudflare にデプロイする個人技術ブログ。

## 構成

- ソースは `src/` 配下(`void.config.ts` の `sourceDir`)。`src/pages/` が UI ルート
- 記事は `src/content/entries/*.md`(ファイル名が id、URL は `/entries/:id`)。`@void/md` で GFM・Shiki・frontmatter を処理し、`src/pages/entries/[id].tsx` + `getPrerenderPaths()` で書き出す。一覧・検索・本文の読み込みはサーバー専用の `src/lib/entries.ts` に集め、ページのコンポーネントからは import しない(全記事の本文がブラウザ用 JS に入るため)
- 記事の frontmatter は `title`・`date`・任意の `description`・`tags`・`draft`。`draft: true` は本番では書き出さず一覧にも出さず、直接アクセスも 404(dev では表示して確認できる)
- entry 詳細は本文の右に目次(`src/components/table-of-contents.tsx`)を置く。見出し(h2・h3)は @void/md が Markdown モジュールから出す `headings` をサーバー側(`entryToc`)で読んで渡す。目次は列(`max-w-3xl`)の外の右の余白に置き、本文は列の全幅を使う。余白に収まらない `xl` 未満では目次を出さない
- `description` が無い記事は本文の先頭(見出し・コード・画像・HTML を除いた地の文)から作り、一覧の抜粋と `<meta name="description">` に使う(`src/lib/excerpt.ts`)
- 気軽な投稿は `src/content/notes/*.md`(ファイル名 `YYYY-MM-DD-slug` が id。frontmatter は `date` と任意の `entry`(関連 entry の id)・`draft`)。`draft: true` は entry と同じく本番の一覧・前後の note・prerender から除外し、直接アクセスも 404。dev と管理一覧では表示する。`/notes/:id` は動的ルート `src/pages/notes/[id].tsx` + `getPrerenderPaths()` で書き出す
- notes も entries と同じ構成にする。サーバー専用の `src/lib/notes.ts` で frontmatter・公開対象の一覧・検索を扱い、ページのコンポーネントからは import しない。本文は `src/pages/notes/[id].tsx` で表示する note ごとに lazy import する。`visibleNotes` は dev だけ draft を含め、`publishedNotes` だけを prerender する。draft 専用のビルドプラグインは使わない
- 記事内の画像・動画は R2 の公開バケット `ellreka-net-assets`(`https://assets.ellreka.net/`)に置き、記事からは絶対 URL で参照する。元ファイルは git 管理外の `assets/` に置き、`pnpm assets:upload [ファイル...]` でアップロードする(`scripts/upload-assets.ts`。wrangler の呼び出しは `scripts/r2.ts` で共有)
- 単独の URL は `<https://...>`(v2 のリンクカード `[](URL)` から変換)、動画は `<video src="https://assets.ellreka.net/..." controls></video>` で書く
- トップ(`src/pages/index.tsx`)は notes と entries を日付順のタイムラインで表示する。`/notes`・`/entries` は同じタイムライン(`src/components/timeline-page.tsx` の `TimelinePage`)を種類で絞って書き出したページで、トップの all / notes / entries の切り替えはこの 3 ページへのリンク(static 出力なのでクエリでは絞らない)。一覧のデータはサーバー専用の `src/lib/timeline-preview.ts` で組み立てる。notes は見出し・リストなどをパースした HTML 本文を最大 4 行で省略し、画像は順序を保ってすべて末尾の横スクロールカルーセル(`src/components/image-carousel.tsx`)にまとめる。entries も本文中の画像を同じカルーセルで説明の下に出す。本文・画像の抽出はサーバー専用の `src/lib/note-preview.ts` で行い、root のコンポーネントには Markdown 本文を import しない
- 一覧向けの note の表示(4 行で省略・Read more・画像のカルーセル)は `src/components/note-summary.tsx` の `NoteSummary` で、トップ・`/notes` と note 詳細の前後の note で共有する。前後の note のプレビューも loader(`previewNote`)で渡し、全文の Markdown コンポーネントは使わない
- notes の画像拡大は `src/components/note-content.tsx` の `NoteContent` と native `<dialog>` で共通化する。詳細・投稿プレビューは本文中の配置を保ち、連続した画像だけの段落は 2 列にまとめ、1 枚なら本文幅にする。拡大表示では同じ本文の画像を前後に送れる。entry 詳細も `NoteContent` の `gallery={false}` で本文の並びを変えずに拡大表示だけを使う。アイコンは lucide の形を `src/components/icons.tsx` に inline SVG で持つ
- 公開ページ(トップ・`/notes`・`/entries`・`/about`・entry・note の詳細)の head には `src/lib/og.ts` の `ogMeta` で description と OGP(`og:*`・`twitter:card`)を出す。`og:url` は本番のオリジン(`SITE_ORIGIN`)の絶対 URL。`/admin` と `/og` 配下には出さない
- `og:image` は R2 の `https://assets.ellreka.net/og/<entries|notes>/<id>-<hash>.png`(サイト共通は `og/default-<hash>.png`)。`<hash>` はカードの文章と `OG_IMAGE_VERSION` から作る(`ogImageUrl`)。画像は `pnpm build && pnpm og:generate`(`scripts/og-generate.ts`)で作る。ビルドした公開ページの `og:image` を集め、R2 に無いものだけ `/og` 配下のページを Playwright(`playwright-core` + インストール済みの Google Chrome)で撮影してアップロードする(`--force` で全部、`--dry-run` は `dist/og-images/` に書き出すだけ)。カードのデザインや共通カードの文章(`DEFAULT_OG_CARD`)を変えたら `OG_IMAGE_VERSION` を上げる。OGP 専用 CI の `.github/workflows/og-images.yml` が main への push・main を選んだ手動実行で同じコマンドを実行する(手動実行で `force` も選べる)。この CI は画像の生成・アップロードだけで、サイトのデプロイはしない。ローカルからデプロイするときは、デプロイ前に手元でも実行する
- RSS は `/rss.xml`(`src/routes/rss.xml.ts`。Worker のルート)。公開している entries のみを新しい順に最大 50 件出す(draft は dev でも出さない)。notes は含めない。XML の生成は `feed` に任せ、`src/lib/rss.ts` で frontmatter の日時を日本時間の `Date` にして渡す(`lastBuildDate` は生成時刻ではなく最新の項目の日時)。`feed` が依存する `xml-js` → `sax` が Node の `stream` を読み込むため、`void.config.ts` の `worker.compatibility_flags` に `nodejs_compat` を入れている(無いと dev・本番の Worker で 500 になる。prerender は Node で動くので build では気付けない)。全ページの head に `rel="alternate"` のリンクを置く(`void.config.ts`)
- OGP 画像として撮影する 1200×630 のカードのページを `/og`(サイト共通)・`/og/entries/:id`・`/og/notes/:id` に置く(`src/pages/og/`。枠は `src/components/og-card.tsx` の `OgCard`。`SiteFrame` は使わない)。文章は枠線で囲んで中央に置き、サイト名は枠線の下辺に重ねる。entry はタイトル、note は本文(`noteExcerpt`。200 文字を超える分だけ省略)を省略せずに出し(日付・タグは出さない)、長さに応じて文字サイズを下げる(`src/lib/og-fit.ts`)。draft は書き出さず、`robots: noindex` を付ける
- ヘッダー・フッターは `src/components/site-frame.tsx` の `SiteFrame` を各ページで使い、全ページの幅は `max-w-3xl` に統一する。現在位置(`current`)を props で渡す。prerender 時は `useRouter().path` が常に `/` になるため、パスで分岐しない
- `void.config.ts` は `output: "static"`。投稿画面以外の全ページを build 時に prerender する
- レイアウトは `src/pages/layout.tsx`(共通。CSS の読み込みのみ)。ヘッダー・フッターは各ページの `SiteFrame` で描画する
- Solid コンポーネントでは props を分割代入しない(リアクティビティが切れるため `props.children` のように参照する)

## notes の投稿画面

- 管理の入口は `/admin`(`src/pages/admin/index.tsx`、`prerender = false`)。Access 認証後に note の日時・本文の抜粋を新しい順に表示し、`new note` と各 note の `edit` から投稿・編集へ進む。投稿・編集画面からは `/admin` に戻れる
- 管理一覧は `listNotes()` で保存先の最新ファイルを読み、dev はローカル、本番は GitHub の指定ブランチから取得する。ビルド済みの一覧は使わないので、投稿・更新後はデプロイを待たずに一覧に反映される。管理一覧はキャッシュしない
- `/admin/notes/new` から投稿し、`/admin` の一覧の `edit` から `/admin/notes/:id` で編集する(どちらも `prerender = false`)。フォームは `src/components/note-editor.tsx` で共有する。`POST /admin/api/notes` が新規作成、`PUT` が編集。保存先の切り替えはサーバー専用の `src/lib/note-store.ts` に集める
- 投稿・編集フォームの「下書き」で `draft: true` を切り替える。未指定は公開扱いで、既存 note の公開状態は編集時に読み戻す。管理一覧には draft のラベルを出す。下書きの保存後は本番の詳細リンクを出さない
- 管理画面への経路は `/admin` 配下だけに置く。公開ページには `edit` などの管理用リンクを出さない
- 本番は画像を R2 に置いてから Markdown を GitHub に commit する。サイトへの反映は main への push 後のデプロイによる。編集画面はビルド時の本文ではなく指定ブランチの最新ファイルを取得し、元の日時・その他の frontmatter を保つ。読み込み時の SHA が変わっていたら更新を拒否する
- id は投稿時刻(日本時間)の `YYYY-MM-DD-HHMMSS`、画像は中身のハッシュで `notes/<年>/<hash>.<拡張子>` に置く(`src/lib/note-post.ts`)。本文中では投稿までの画像を仮の参照 `![](upload:<n>)` で表す
- R2 は `void.config.ts` の `cloudflare.r2_buckets` で既存バケットを `MEDIA` としてバインドする(`ASSETS` は Void の静的ファイル配信用なので使わない。型は `src/bindings.d.ts`)
- `/admin` 配下は Cloudflare Access で保護し、Worker 側でも `Cf-Access-Jwt-Assertion` を検証する(`src/lib/access.ts`)。API は同一オリジンからの送信だけ受け付ける
- サーバー側の値は `src/env.ts`(`GITHUB_TOKEN`・`GITHUB_BRANCH`・`ACCESS_TEAM_DOMAIN`・`ACCESS_AUD`)。値の無いビルド環境で全ページの prerender が失敗しないよう任意にしており、未設定なら /admin 側で拒否する。本番は `void secret put` で登録する
- ローカルでは Access の検証を省き、GitHub や R2 へは送らず `src/content/notes/:id.md` を直接作成・更新する(開発用 Worker から `src/lib/note-dev.ts` 経由で Vite プラグイン `scripts/local-notes.ts` を呼ぶ。ホストのファイル操作は `src/lib/note-local.ts` に集め、本番 Worker には含めない)。`GITHUB_TOKEN`・`GITHUB_BRANCH` は不要。新規作成は同名ファイルを上書きせず、編集は読み込み時のハッシュが一致する場合だけ更新する
- dev で追加した画像は例外的に `public/note-assets/notes/<年>/<hash>.<拡張子>` に保存し、本文では `/note-assets/...` を参照する。Vite の public 配信でプレビュー・詳細の両方に表示する。本番の投稿画像は従来どおり R2 の絶対 URL を使う
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

- `pnpm run deploy`(= `void deploy --platform cloudflare`。`pnpm deploy` は pnpm 組み込みコマンドなので `run` が必要)。Cloudflare アカウントは `void.lock.json` に記録済み。デプロイ先の選択(`.void/project.json`)は git 管理外で Workers Builds には無いため、`--platform` で明示する(無いと非対話の環境で既存 Worker のリンクを求めて失敗する)。アカウントは `void.lock.json` から生成される `.void-wrangler.jsonc` の `account_id` を使い、認証は Workers Builds のビルド用 API トークンで行う
- テスト CI は `.github/workflows/ci.yml`。全ブランチへの push・PR で check・typecheck・test・build を実行し、デプロイ用の secrets は渡さない
- デプロイは Cloudflare Workers Builds の GitHub 連携に任せ、GitHub Actions にはデプロイ処理を置かない。リポジトリの接続・デプロイコマンド・ブランチのプレビューは Cloudflare 側で設定する。このリポジトリの変更だけでは連携は有効にならない
- OGP CI は `.github/workflows/og-images.yml`。main への push・main の手動実行で build 後に画像を生成して R2 へアップロードする。prerender の失敗もログで検出し、画像生成の同時実行は避ける。Cloudflare のデプロイとは独立して動くため、公開と OGP 画像のアップロードの完了順は保証しない
- OGP CI 用に GitHub Actions の secrets に `CLOUDFLARE_API_TOKEN`(Workers R2 Storage: Edit)・`CLOUDFLARE_ACCOUNT_ID` を設定する。サイトのデプロイ権限は不要。ローカルの `void deploy` は Worker を再ビルドするので `--skip-build` は使わない
- カスタムドメインは `void domain add <hostname>`
- 公開先(`routes` の custom domain `ellreka.net`・`workers_dev`・`preview_urls`)は `void.config.ts` の `cloudflare` に明示する。未指定だと Void は直前の version の値を引き継ごうとするが、`void secret put` でできた version には引き継ぐ値が無く、CI ではデプロイが止まる。ダッシュボードで変えたら `void.config.ts` も合わせる

<!--injected-by-void-v1.1.12-->

## Void

- This project uses [Void](https://void.cloud), a full-stack Vite framework for Cloudflare Workers with file-based API routing, server-rendered pages, and typed backend services.
- Use Void's CLI and typed APIs. Before working with Void, read the relevant Markdown docs in `node_modules/void/docs/`; start with `guide/quickstart.md` for setup and `reference/cli.md` for commands.

<!--/injected-by-void-->
