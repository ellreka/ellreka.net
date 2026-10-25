import { TimelinePage } from "../components/timeline-page";
import type { Props } from "./index.server";

export default function HomePage(props: Props) {
  return <TimelinePage filter="all" items={props.items} counts={props.counts} />;
}
