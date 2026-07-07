import { useDroppable } from "@dnd-kit/core";
import GuestCard from "./GuestCard";

export default function RoundTable({ table }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `table-${table.id}`,
  });

  const guests = table.guests || [];
  const capacity = table.capacity || 10;
  const overCapacity = guests.length > capacity;

  const seats = Array.from({ length: capacity }, (_, index) => {
    return guests[index] || null;
  });

  const size = 420;
  const center = size / 2;
  const radius = 165;

  return (
    <div
      ref={setNodeRef}
      className={[
        "relative rounded-3xl bg-white border shadow-sm p-6",
        isOver ? "ring-4 ring-indigo-300" : "border-slate-200",
        overCapacity ? "ring-4 ring-red-300" : "",
      ].join(" ")}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-44 h-44 rounded-full bg-slate-100 border-4 border-white shadow-inner flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-slate-900">{table.name}</h3>

          <p
            className={[
              "text-sm mt-1",
              overCapacity ? "text-red-600 font-bold" : "text-slate-500",
            ].join(" ")}
          >
            {guests.length} / {capacity}
          </p>

          {overCapacity && (
            <p className="text-xs text-red-600 font-semibold mt-1">
              Prea mulți
            </p>
          )}
        </div>
      </div>

      {seats.map((guest, index) => {
        const angle = (2 * Math.PI * index) / capacity - Math.PI / 2;

        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Seat index={index} guest={guest} />
          </div>
        );
      })}

      {guests.length > capacity && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 rounded-xl p-2 text-xs text-red-700">
          {guests.length - capacity} invitați peste capacitate.
        </div>
      )}
    </div>
  );
}

function Seat({ index, guest }) {
  if (!guest) {
    return (
      <div className="w-24 h-14 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loc {index + 1}
      </div>
    );
  }

  return (
    <div className="w-28">
      <GuestCard guest={guest} compact />
    </div>
  );
}
