import { useDroppable } from "@dnd-kit/core";
import GuestCard from "./GuestCard";

export default function RoundTable({ table, onEditGuest }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `table-${table.id}`,
  });

  const guests = table.guests || [];
  const capacity = table.capacity || 10;
  const overCapacity = guests.length > capacity;

  const seats = Array.from({ length: capacity }, (_, index) => {
    return guests[index] || null;
  });

  const size = 460;
  const center = size / 2;
  const radius = 178;

  return (
    <div
      ref={setNodeRef}
      className={[
        "relative isolate rounded-[2rem] p-6 transition-all duration-300",
        "bg-gradient-to-br from-stone-50 via-white to-stone-100",
        isOver ? "ring-4 ring-indigo-300 scale-[1.015]" : "",
        overCapacity ? "ring-4 ring-red-300" : "",
      ].join(" ")}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-5 rounded-[1.7rem] border border-white/80 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 rounded-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b88955] via-[#8b5e34] to-[#5f3b1f] shadow-[0_22px_45px_rgba(92,55,24,0.28)]" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#d6a56f] via-[#9a6739] to-[#6f421f]" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#f2d2aa] via-[#c48a52] to-[#8a552c] shadow-inner" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.45),transparent_32%)]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
              {table.name}
            </h3>

            <p
              className={[
                "mt-1 text-sm font-semibold",
                overCapacity ? "text-red-100" : "text-amber-50/90",
              ].join(" ")}
            >
              {guests.length} / {capacity}
            </p>

            {overCapacity && (
              <span className="mt-2 rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                Prea mulți
              </span>
            )}
          </div>
        </div>
      </div>

      {seats.map((guest, index) => {
        const angle = (2 * Math.PI * index) / capacity - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        return (
          <div
            key={index}
            className="absolute transition-transform duration-300 hover:z-20 hover:scale-105"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
          >
            <Seat
              index={index}
              guest={guest}
              angle={angle}
              onEditGuest={onEditGuest}
            />
          </div>
        );
      })}
    </div>
  );
}

function Seat({ index, guest, angle, onEditGuest }) {
  const rotate = (angle * 180) / Math.PI + 90;

  if (!guest) {
    return (
      <div
        className="relative h-[58px] w-[82px]"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2 rounded-t-2xl bg-gradient-to-b from-stone-200 to-stone-300 border border-stone-300 shadow-sm" />
        <div className="absolute bottom-0 left-1/2 h-9 w-20 -translate-x-1/2 rounded-2xl bg-gradient-to-b from-white to-stone-100 border border-stone-300 shadow-[0_8px_18px_rgba(15,23,42,0.10)] flex items-center justify-center">
          <span
            className="text-[10px] font-semibold text-stone-400"
            style={{ transform: `rotate(${-rotate}deg)` }}
          >
            {index + 1}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-28" style={{ transform: `rotate(${rotate}deg)` }}>
      <div style={{ transform: `rotate(${-rotate}deg)` }}>
        <GuestCard guest={guest} compact onEdit={onEditGuest} />
      </div>
    </div>
  );
}
