import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { DEFAULT_OG_IMAGE, ogMeta, SITE_DESCRIPTION } from "../../lib/og";
import { previewTimeline } from "../../lib/timeline-preview";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => previewTimeline("notes"));

export const head = defineHead<Props>(() => ({
  title: "notes",
  meta: ogMeta({
    title: "notes",
    description: SITE_DESCRIPTION,
    path: "/notes",
    type: "website",
    image: DEFAULT_OG_IMAGE,
  }),
}));
