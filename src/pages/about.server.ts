import { defineHead } from "void";
import { DEFAULT_OG_IMAGE, ogMeta, SITE_DESCRIPTION } from "../lib/og";

export const head = defineHead(() => ({
  title: "about",
  meta: ogMeta({
    title: "about",
    description: SITE_DESCRIPTION,
    path: "/about",
    type: "website",
    image: DEFAULT_OG_IMAGE,
  }),
}));
