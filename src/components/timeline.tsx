// タイムラインの幹が上下に続いていることを示す、だんだん薄くなる点線
export function Dashes(props: { fade: "in" | "out" }) {
  return (
    <div
      class={
        props.fade === "in"
          ? "flex w-5 shrink-0 flex-col-reverse items-center gap-[5px]"
          : "flex w-5 shrink-0 flex-col items-center gap-[5px]"
      }
      aria-hidden="true"
    >
      <div class="h-1.5 w-[1.5px] bg-line" />
      <div class="h-1.5 w-[1.5px] bg-line/60" />
      <div class="h-1.5 w-[1.5px] bg-line/27" />
    </div>
  );
}
