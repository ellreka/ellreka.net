import { TimelinePage } from "../../components/timeline-page";
import type { Props } from "./index.server";

export default function NotesPage(props: Props) {
  return <TimelinePage filter="notes" items={props.items} />;
}
