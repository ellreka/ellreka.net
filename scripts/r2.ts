// R2 の公開バケット(https://assets.ellreka.net/)へ wrangler でアップロードする。
// ローカルは wrangler のログイン、CI では CLOUDFLARE_API_TOKEN を使う
import { execFileSync } from "node:child_process";

export const BUCKET = "ellreka-net-assets";
export const ASSETS_ORIGIN = "https://assets.ellreka.net";

export function putObject(key: string, file: string, contentType: string, cacheControl: string) {
  execFileSync(
    "pnpm",
    [
      "exec",
      "wrangler",
      "r2",
      "object",
      "put",
      `${BUCKET}/${key}`,
      "--file",
      file,
      "--content-type",
      contentType,
      "--cache-control",
      cacheControl,
      "--remote",
    ],
    { stdio: "inherit" },
  );
}
