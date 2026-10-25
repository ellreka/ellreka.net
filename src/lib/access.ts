import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "void/env";

const jwksByTeam = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

// /admin は Cloudflare Access で守るが、Access の設定漏れに備えて Worker 側でもトークンを検証する。
// 検証に必要な値が未設定なら拒否する
export async function isAccessAuthorized(request: Request): Promise<boolean> {
  // ローカル開発には Access が無い
  if (import.meta.env.DEV) return true;
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return false;

  const teamDomain = env.ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  let jwks = jwksByTeam.get(teamDomain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
    jwksByTeam.set(teamDomain, jwks);
  }
  try {
    await jwtVerify(token, jwks, { issuer: teamDomain, audience: env.ACCESS_AUD });
    return true;
  } catch {
    return false;
  }
}
