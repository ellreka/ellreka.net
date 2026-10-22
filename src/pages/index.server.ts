import { defineHandler } from "void";
import type { InferProps } from "void";
import { visibleEntries } from "../lib/entries";
import { notes } from "../lib/notes";
import { buildTimeline } from "../lib/timeline";

export type Props = InferProps<typeof loader>;

// 記事の一覧(と本文から作る description)はサーバー側で組み立て、ブラウザに本文を送らない
export const loader = defineHandler(() => {
  return { items: buildTimeline(visibleEntries, notes) };
});
