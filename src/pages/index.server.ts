import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { DEFAULT_OG_IMAGE, ogMeta, SITE_DESCRIPTION, SITE_NAME } from "../lib/og";
import { previewTimeline } from "../lib/timeline-preview";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => previewTimeline("all"));

export const head = defineHead<Props>(() => ({
  meta: ogMeta({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
    type: "website",
    image: DEFAULT_OG_IMAGE,
  }),
}));
