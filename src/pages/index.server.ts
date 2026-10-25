import { defineHandler } from "void";
import type { InferProps } from "void";
import { previewTimeline } from "../lib/timeline-preview";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => previewTimeline("all"));
