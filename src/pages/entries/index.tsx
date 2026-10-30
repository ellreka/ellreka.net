import { TimelinePage } from "../../components/timeline-page";
import type { Props } from "./index.server";

export default function EntriesPage(props: Props) {
  return <TimelinePage filter="entries" items={props.items} />;
}
