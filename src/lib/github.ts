import { toBase64 } from "./note-post";

const REPOSITORY = "ellreka/ellreka.net";

export type CommitResult =
  | { ok: true; commitUrl: string }
  | { ok: false; status: number; message: string };

// Contents API で新しいファイルを 1 つ commit する。同じパスが既にあれば 422 になり上書きしない
export async function commitNewFile(input: {
  token: string;
  branch: string;
  path: string;
  content: string;
  message: string;
}): Promise<CommitResult> {
  const response = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/contents/${encodeURI(input.path)}`,
    {
      method: "PUT",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${input.token}`,
        "content-type": "application/json",
        "user-agent": "ellreka.net-admin",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        message: input.message,
        content: toBase64(input.content),
        branch: input.branch,
      }),
    },
  );
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    return { ok: false, status: response.status, message: body.message ?? response.statusText };
  }
  const body = (await response.json()) as { commit: { html_url: string } };
  return { ok: true, commitUrl: body.commit.html_url };
}
