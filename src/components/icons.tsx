import type { JSX } from "solid-js";

// デザインで使っている lucide のアイコンを、依存を足さずに必要な分だけ inline SVG で持つ
function Icon(props: { class: string; children: JSX.Element }) {
  return (
    <svg
      viewBox="0 0 24 24"
      class={`fill-none stroke-current ${props.class}`}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {props.children}
    </svg>
  );
}

export function ChevronLeftIcon(props: { class: string }) {
  return (
    <Icon class={props.class}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  );
}

export function ChevronRightIcon(props: { class: string }) {
  return (
    <Icon class={props.class}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export function CloseIcon(props: { class: string }) {
  return (
    <Icon class={props.class}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}
