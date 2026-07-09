import { useState } from "react";
import api from "../api/api";
import RoundTable from "./RoundTable";

export default function TablesCanvas({ tables, onRefresh, onEditGuest }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(10);

  const [editingTableId, setEditingTableId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(10);

  const totalGuests = tables.reduce(
    (sum, table) => sum + table.guests.length,
    0,
  );

  async function handleAddTable(event) {
    event.preventDefault();
    if (!name.trim()) return;

    await api.post("/api/tables", {
      name: name.trim(),
      capacity: Number(capacity),
    });

    setName("");
    setCapacity(10);
    await onRefresh();
  }

  function startEditTable(table) {
    setEditingTableId(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity);
  }

  function cancelEditTable() {
    setEditingTableId(null);
    setEditName("");
    setEditCapacity(10);
  }

  async function handleSaveTable(table) {
    if (!editName.trim()) return;

    const newCapacity = Number(editCapacity);

    if (newCapacity < table.guests.length) {
      alert(
        `Nu poți seta doar ${newCapacity} locuri. Masa are deja ${table.guests.length} invitați.`,
      );
      return;
    }

    await api.put(`/api/tables/${table.id}`, {
      name: editName.trim(),
      capacity: newCapacity,
    });

    cancelEditTable();
    await onRefresh();
  }

  async function handleDeleteTable(table) {
    if (table.guests.length > 0) {
      alert("Nu poți șterge o masă care are invitați. Mută întâi invitații.");
      return;
    }

    await api.delete(`/api/tables/${table.id}`);
    await onRefresh();
  }

  return (
    <section className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_28%),linear-gradient(135deg,#fff7ed,#f8fafc_45%,#eef2ff)] p-6">
      <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm">
              ✨ Wedding seating planner
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Plan mese
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Trage invitații pe masă. Scaunele apar elegant în jurul fiecărei
              mese.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
              <p className="text-xs text-white/60">Mese</p>
              <p className="text-2xl font-black">{tables.length}</p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 text-slate-950 shadow-lg ring-1 ring-slate-200/70">
              <p className="text-xs text-slate-400">Invitați așezați</p>
              <p className="text-2xl font-black">{totalGuests}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleAddTable}
          className="mt-5 grid gap-3 rounded-3xl border border-white/80 bg-white/80 p-3 shadow-inner sm:grid-cols-[1fr_120px_auto]"
        >
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="Nume masă"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            type="number"
            min="1"
            max="24"
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
          />

          <button className="rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0">
            + Adaugă masă
          </button>
        </form>
      </div>

      {tables.length === 0 && (
        <div className="rounded-[2rem] border border-dashed border-amber-300/80 bg-white/70 p-14 text-center shadow-xl backdrop-blur">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl shadow-inner">
            🍽️
          </div>

          <h3 className="text-xl font-black text-slate-900">
            Nu există mese încă
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Adaugă prima masă și începe să așezi invitații.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-12 pb-10">
        {tables.map((table) => (
          <div
            key={table.id}
            className="group relative rounded-[2rem] border border-white/80 bg-white/55 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(15,23,42,0.20)]"
          >
            <div className="pointer-events-none absolute inset-x-8 -bottom-4 h-8 rounded-full bg-slate-900/20 blur-2xl transition group-hover:bg-slate-900/30" />

            <div className="relative">
              <RoundTable
                key={table.id}
                table={table}
                onEditGuest={onEditGuest}
              />
            </div>

            <div className="absolute -right-3 -top-3 flex gap-2 opacity-90 transition group-hover:scale-105 group-hover:opacity-100">
              <button
                onClick={() => startEditTable(table)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-amber-100"
                title="Editează masa"
              >
                ✎
              </button>

              <button
                onClick={() => handleDeleteTable(table)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/25 transition hover:-translate-y-0.5 hover:bg-red-600"
                title="Șterge masa"
              >
                ×
              </button>
            </div>

            {editingTableId === table.id && (
              <div className="relative mt-5 rounded-3xl border border-white/80 bg-white/90 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Editare masă
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    type="number"
                    min={table.guests.length || 1}
                    max="24"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSaveTable(table)}
                      className="flex-1 rounded-2xl bg-slate-950 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5"
                    >
                      Salvează
                    </button>

                    <button
                      onClick={cancelEditTable}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
