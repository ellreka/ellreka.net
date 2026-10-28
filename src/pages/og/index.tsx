import { OgCard } from "../../components/og-card";
import type { Props } from "./index.server";

export default function DefaultOgPage(props: Props) {
  return (
    <OgCard>
      <div class="flex flex-col items-center gap-6">
        <p class="font-sans text-6xl leading-snug font-semibold text-text">{props.title}</p>
        <p class="font-sans text-3xl leading-normal text-text-2">{props.lead}</p>
      </div>
    </OgCard>
  );
}
