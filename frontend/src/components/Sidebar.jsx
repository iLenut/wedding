import { useMemo, useState } from "react";
import api from "../api/api";
import GuestList from "./GuestList";

export default function Sidebar({ guests, unassignedGuests, onRefresh }) {
  const [editingGuest, setEditingGuest] = useState(null);

  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [advancePaid, setAdvancePaid] = useState(false);
  const [menuType, setMenuType] = useState("normal");
  const [notes, setNotes] = useState("");

  const stats = useMemo(
    () => ({
      total: guests.length,
      confirmed: guests.filter((guest) => guest.confirmed).length,
      advancePaid: guests.filter((guest) => guest.advancePaid).length,
      unassigned: guests.filter((guest) => !guest.tableId).length,
    }),
    [guests],
  );

  function startEdit(guest) {
    setEditingGuest(guest);
    setName(guest.name || "");
    setGroupName(guest.groupName || "");
    setConfirmed(Boolean(guest.confirmed));
    setAdvancePaid(Boolean(guest.advancePaid));
    setMenuType(guest.menuType || "normal");
    setNotes(guest.notes || "");
  }

  function resetForm() {
    setEditingGuest(null);
    setName("");
    setGroupName("");
    setConfirmed(true);
    setAdvancePaid(false);
    setMenuType("normal");
    setNotes("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      groupName: groupName.trim() || null,
      confirmed,
      advancePaid,
      menuType,
      notes: notes.trim() || null,
    };

    if (editingGuest) {
      await api.put(`/api/guests/${editingGuest.id}`, payload);
    } else {
      await api.post("/api/guests", payload);
    }

    resetForm();
    await onRefresh();
  }

  async function handleDeleteGuest() {
    if (!editingGuest) return;

    const confirmedDelete = window.confirm(
      `Ștergi invitatul "${editingGuest.name}"?`,
    );
    if (!confirmedDelete) return;

    await api.delete(`/api/guests/${editingGuest.id}`);
    resetForm();
    await onRefresh();
  }

  return (
    <aside className="w-[380px] bg-white border-r border-slate-200 overflow-y-auto p-5">
      <section className="grid grid-cols-2 gap-3 mb-5">
        <Stat label="Total" value={stats.total} />
        <Stat label="Confirmați" value={stats.confirmed} />
        <Stat label="Avans" value={stats.advancePaid} />
        <Stat label="Nealocați" value={stats.unassigned} />
      </section>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
        <h2 className="font-bold mb-3">
          {editingGuest ? "Editează invitat" : "Adaugă invitat"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Nume invitat"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Grup / familie"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            value={menuType}
            onChange={(e) => setMenuType(e.target.value)}
          >
            <option value="normal">Meniu normal</option>
            <option value="vegetarian">Meniu vegetarian</option>
            <option value="copil">Meniu copil</option>
          </select>

          <textarea
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Observații"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmat
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={advancePaid}
              onChange={(e) => setAdvancePaid(e.target.checked)}
            />
            A dat avans
          </label>

          <button className="w-full bg-slate-900 text-white rounded-xl py-2 text-sm font-semibold">
            {editingGuest ? "Salvează modificările" : "Adaugă"}
          </button>

          {editingGuest && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-xl border border-slate-300 py-2 text-sm"
              >
                Anulează
              </button>

              <button
                type="button"
                onClick={handleDeleteGuest}
                className="flex-1 rounded-xl bg-red-600 text-white py-2 text-sm"
              >
                Șterge
              </button>
            </div>
          )}
        </form>
      </section>

      <section>
        <h2 className="font-bold mb-3">Invitați nealocați</h2>
        <GuestList guests={unassignedGuests} onEdit={startEdit} />
      </section>
    </aside>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
