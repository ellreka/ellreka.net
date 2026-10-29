import { toBase64 } from "./note-post";

const REPOSITORY = "ellreka/ellreka.net";

export type CommitResult =
  | { ok: true; commitUrl: string }
  | { ok: false; status: number; message: string };

function headers(token: string) {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "ellreka.net-admin",
    "x-github-api-version": "2022-11-28",
  };
}

function contentsUrl(path: string): string {
  return `https://api.github.com/repos/${REPOSITORY}/contents/${encodeURI(path)}`;
}

type ContentsInput = { token: string; branch: string; path: string };

// 指定ブランチの最新を読む。ファイルなら本文、ディレクトリなら中身の一覧が返る
function getContents(input: ContentsInput): Promise<Response> {
  return fetch(`${contentsUrl(input.path)}?ref=${encodeURIComponent(input.branch)}`, {
    headers: headers(input.token),
    cache: "no-store",
  });
}

export async function readGithubFile(input: ContentsInput) {
  const response = await getContents(input);
  if (!response.ok) return { ok: false as const, status: response.status };
  const file = (await response.json()) as { content: string; sha: string };
  const bytes = Uint8Array.from(atob(file.content.replace(/\s/g, "")), (char) =>
    char.charCodeAt(0),
  );
  return { ok: true as const, source: new TextDecoder().decode(bytes), version: file.sha };
}

export async function listGithubFiles(input: ContentsInput) {
  const response = await getContents(input);
  if (!response.ok) return { ok: false as const, status: response.status };
  // ponytail: Contents API の一覧は最大 1000 件。超える場合は Git Trees API に切り替える。
  const files = (await response.json()) as { name: string; type: string }[];
  return {
    ok: true as const,
    files: files
      .filter((file) => file.type === "file" && file.name.endsWith(".md"))
      .map((file) => file.name),
  };
}

// sha なしは新規作成、ありはその版だけを更新する。他で編集されていれば上書きしない。
export async function commitFile(
  input: ContentsInput & {
    content: string;
    message: string;
    sha?: string;
  },
): Promise<CommitResult> {
  const response = await fetch(contentsUrl(input.path), {
    method: "PUT",
    headers: headers(input.token),
    body: JSON.stringify({
      message: input.message,
      content: toBase64(input.content),
      branch: input.branch,
      sha: input.sha,
    }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    return { ok: false, status: response.status, message: body.message ?? response.statusText };
  }
  const body = (await response.json()) as { commit: { html_url: string } };
  return { ok: true, commitUrl: body.commit.html_url };
}
