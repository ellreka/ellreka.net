import { Show } from "solid-js";
import { NoteEditor } from "../../../components/note-editor";
import type { Props } from "./[id].server";

export default function EditNotePage(props: Props) {
  return (
    <Show when={props.note} keyed>
      {(note) => <NoteEditor entries={props.entries} note={note} />}
    </Show>
  );
}
