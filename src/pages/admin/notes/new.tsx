import { NoteEditor } from "../../../components/note-editor";
import type { Props } from "./new.server";

export default function NewNotePage(props: Props) {
  return <NoteEditor entries={props.entries} />;
}
