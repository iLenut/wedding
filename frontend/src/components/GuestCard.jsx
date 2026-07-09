import { useDraggable } from "@dnd-kit/core";

export default function GuestCard({ guest, compact = false, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `guest-${guest.id}`,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  function handleClick(event) {
    event.stopPropagation();
    if (onEdit) onEdit(guest);
  }

  const isConfirmed = guest.confirmed;
  const initials = getInitials(guest.name);

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={handleClick}
        className={[
          "group relative flex w-[86px] cursor-grab select-none flex-col items-center active:cursor-grabbing",
          "transition-all duration-200 hover:scale-105",
          isDragging ? "z-50 scale-110 opacity-70" : "",
        ].join(" ")}
        title="Click pentru editare / drag pentru mutare"
      >
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full bg-slate-300 shadow-[0_8px_18px_rgba(15,23,42,0.22)]" />

          <div className="absolute inset-[3px] overflow-hidden rounded-full bg-gradient-to-b from-slate-100 to-slate-300 ring-2 ring-white">
            <div className="absolute left-1/2 top-[6px] h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-200 to-orange-300" />
            <div className="absolute left-1/2 top-[18px] h-7 w-8 -translate-x-1/2 rounded-t-full bg-slate-700" />
            <div
              className={[
                "absolute bottom-0 left-1/2 h-4 w-9 -translate-x-1/2 rounded-t-full",
                isConfirmed ? "bg-sky-500" : "bg-stone-400",
              ].join(" ")}
            />
          </div>

          <span
            className={[
              "absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
              isConfirmed ? "bg-emerald-500" : "bg-amber-400",
            ].join(" ")}
          />
        </div>

        <div className="mt-1 max-w-[86px] text-center leading-[0.9]">
          <div className="truncate text-[10px] font-bold text-slate-800">
            {guest.name}
          </div>

          {guest.groupName && (
            <div className="mt-0.5 truncate text-[8px] font-semibold text-slate-400">
              {guest.groupName}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={[
        "group relative overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300",
        "border bg-gradient-to-br from-white via-white to-slate-50",
        "shadow-[0_14px_35px_rgba(15,23,42,0.12)]",
        "hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]",
        "rounded-3xl p-4",
        isDragging ? "z-50 scale-105 opacity-70 rotate-2" : "",
        isConfirmed
          ? "border-emerald-200 ring-1 ring-emerald-100"
          : "border-amber-200 ring-1 ring-amber-100",
      ].join(" ")}
    >
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-950 text-xs font-black text-white shadow-md ring-2 ring-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-black tracking-tight text-slate-950">
            {guest.name}
          </div>

          <div className="mt-1 text-xs font-medium text-slate-500">
            {guest.groupName || "Fără grup"}
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
