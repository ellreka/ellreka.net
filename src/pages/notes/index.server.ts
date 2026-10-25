import { defineHandler, defineHead } from "void";
import type { InferProps } from "void";
import { previewTimeline } from "../../lib/timeline-preview";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => previewTimeline("notes"));

export const head = defineHead<Props>(() => ({ title: "notes" }));
