import { createRemoteJWKSet, jwtVerify } from "jose";

type AccessConfig = {
  teamDomain?: string;
  audience?: string;
};

const jwksByTeam = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

// /admin は Cloudflare Access で守るが、Access の設定漏れに備えて Worker 側でもトークンを検証する。
// 検証に必要な値が未設定なら拒否する
export async function isAccessAuthorized(request: Request, config: AccessConfig): Promise<boolean> {
  // ローカル開発には Access が無い
  if (import.meta.env.DEV) return true;
  if (!config.teamDomain || !config.audience) return false;

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return false;

  const teamDomain = config.teamDomain.replace(/\/$/, "");
  let jwks = jwksByTeam.get(teamDomain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
    jwksByTeam.set(teamDomain, jwks);
  }
  try {
    await jwtVerify(token, jwks, { issuer: teamDomain, audience: config.audience });
    return true;
  } catch {
    return false;
  }
}
