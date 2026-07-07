import { useState } from "react";
import api from "../api/api";
import RoundTable from "./RoundTable";

export default function TablesCanvas({ tables, onRefresh }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(10);

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

  async function handleDeleteTable(table) {
    if (table.guests.length > 0) {
      alert("Nu poți șterge o masă care are invitați. Mută întâi invitații.");
      return;
    }

    await api.delete(`/api/tables/${table.id}`);
    await onRefresh();
  }

  return (
    <section className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Plan mese</h2>

          <p className="text-sm text-slate-500">
            Trage invitații pe masă. Scaunele apar în jurul mesei.
          </p>
        </div>

        <form
          onSubmit={handleAddTable}
          className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm"
        >
          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-36"
            placeholder="Nume masă"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-24"
            type="number"
            min="1"
            max="16"
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
          />

          <button className="bg-slate-900 text-white rounded-xl px-4 text-sm font-semibold">
            Adaugă masă
          </button>
        </form>
      </div>

      {tables.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500">
          Nu există mese. Adaugă prima masă.
        </div>
      )}

      <div className="flex flex-wrap gap-10 items-start">
        {tables.map((table) => (
          <div key={table.id} className="relative">
            <RoundTable table={table} />

            <button
              onClick={() => handleDeleteTable(table)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 text-sm shadow"
              title="Șterge masa"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
