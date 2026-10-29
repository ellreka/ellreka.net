import { OgCard, OgText } from "../../../components/og-card";
import type { Props } from "./[id].server";

export default function EntryOgPage(props: Props) {
  return (
    <OgCard>
      <OgText text={props.entry.title} bold />
    </OgCard>
  );
}
