import { useDroppable } from "@dnd-kit/core";
import GuestCard from "./GuestCard";

export default function GuestList({ guests, onEdit }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "unassigned",
  });

  return (
    <div
      ref={setNodeRef}
      className={[
        "space-y-3 rounded-2xl border-2 border-dashed p-3 min-h-40",
        isOver ? "border-indigo-400 bg-indigo-50" : "border-slate-200",
      ].join(" ")}
    >
      {guests.length === 0 && (
        <div className="text-sm text-slate-400 text-center py-8">
          Nu există invitați nealocați.
        </div>
      )}

      {guests.map((guest) => (
        <GuestCard key={guest.id} guest={guest} onEdit={onEdit} />
      ))}
    </div>
  );
}
