import { OgCard, OgText } from "../../../components/og-card";
import type { Props } from "./[id].server";

export default function NoteOgPage(props: Props) {
  return (
    <OgCard>
      <OgText text={props.excerpt} />
    </OgCard>
  );
}
