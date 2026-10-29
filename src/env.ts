import { defineEnv, string } from "void/env";

// notes の投稿画面(/admin)が使うサーバー側の値。本番は `void secret put` で登録する。
// 必須にすると、値の無いビルド環境(CI など)で Worker の起動検証に落ち、全ページの書き出しが失敗する。
// そのため任意にしておき、未設定のときは /admin 側で拒否する(lib/access.ts、routes/admin/api/notes.ts)
export default defineEnv({
  // ellreka/ellreka.net の Contents だけ書き込める fine-grained token
  GITHUB_TOKEN: string().optional(),
  // 本番で notes を commit するブランチ。dev はローカルファイルを使うので参照しない
  GITHUB_BRANCH: string().default("main"),
  // Cloudflare Access のチーム URL(例: https://<team>.cloudflareaccess.com)
  ACCESS_TEAM_DOMAIN: string().optional(),
  // /admin を守る Access アプリケーションの Audience (AUD) タグ
  ACCESS_AUD: string().optional(),
});
