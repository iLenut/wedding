import { useDraggable } from "@dnd-kit/core";

export default function GuestCard({ guest, compact = false, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `guest-${guest.id}`,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  function handleEditClick(event) {
    event.stopPropagation();
    if (onEdit) onEdit(guest);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        "bg-white border rounded-xl shadow-sm cursor-grab active:cursor-grabbing",
        compact ? "px-2 py-2 text-center" : "p-3",
        isDragging ? "opacity-50 z-50" : "",
        guest.confirmed ? "border-green-300" : "border-yellow-300",
      ].join(" ")}
    >
      <div
        className={
          compact
            ? "font-semibold text-[11px] truncate"
            : "font-semibold text-sm"
        }
      >
        {guest.name}
      </div>

      <div
        className={
          compact
            ? "text-[10px] text-slate-400 truncate"
            : "text-xs text-slate-500"
        }
      >
        {guest.groupName || "Fără grup"}
      </div>

      {!compact && (
        <>
          <div className="flex gap-2 mt-2 text-[11px]">
            <span
              className={
                guest.confirmed
                  ? "px-2 py-1 rounded-full bg-green-100 text-green-700"
                  : "px-2 py-1 rounded-full bg-yellow-100 text-yellow-700"
              }
            >
              {guest.confirmed ? "Confirmat" : "Neconfirmat"}
            </span>
          </div>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleEditClick}
            className="mt-3 w-full rounded-lg border border-slate-200 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Editează
          </button>
        </>
      )}
    </div>
  );
}
