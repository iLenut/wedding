import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/api";
import GuestList from "./GuestList";

export default function Sidebar({
  guests,
  unassignedGuests,
  notAttendingGuests,
  editingGuest,
  onEditGuest,
  onGuestSaved,
  onRefresh,
}) {
  const editFormRef = useRef(null);

  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [advancePaid, setAdvancePaid] = useState(false);
  const [menuType, setMenuType] = useState("normal");
  const [notes, setNotes] = useState("");
  const [attending, setAttending] = useState(true);

  const [search, setSearch] = useState("");
  const [filterInvitedBy, setFilterInvitedBy] = useState("all");
  const [filterConfirmed, setFilterConfirmed] = useState("all");
  const [filterAdvance, setFilterAdvance] = useState("all");
  const [filterMenu, setFilterMenu] = useState("all");
  const [showAssignedGuests, setShowAssignedGuests] = useState(false);

  const stats = useMemo(
    () => ({
      total: guests.length,
      confirmed: guests.filter((guest) => guest.confirmed).length,
      advancePaid: guests.filter((guest) => guest.advancePaid).length,
      unassigned: guests.filter(
        (guest) => guest.attending !== false && !guest.tableId,
      ).length,
    }),
    [guests],
  );

  const filteredUnassignedGuests = useMemo(() => {
    return unassignedGuests.filter((guest) => {
      const text =
        `${guest.name || ""} ${guest.groupName || ""} ${guest.notes || ""}`.toLowerCase();

      if (search.trim() && !text.includes(search.trim().toLowerCase())) {
        return false;
      }

      if (filterInvitedBy !== "all" && guest.groupName !== filterInvitedBy) {
        return false;
      }

      if (filterConfirmed === "confirmed" && !guest.confirmed) {
        return false;
      }

      if (filterConfirmed === "unconfirmed" && guest.confirmed) {
        return false;
      }

      if (filterAdvance === "paid" && !guest.advancePaid) {
        return false;
      }

      if (filterAdvance === "unpaid" && guest.advancePaid) {
        return false;
      }

      if (filterMenu !== "all" && guest.menuType !== filterMenu) {
        return false;
      }

      return true;
    });
  }, [
    unassignedGuests,
    search,
    filterInvitedBy,
    filterConfirmed,
    filterAdvance,
    filterMenu,
  ]);

  const assignedGuests = useMemo(() => {
    return guests
      .filter((guest) => guest.attending !== false && guest.tableId)
      .sort((a, b) => {
        if (a.tableId !== b.tableId) {
          return Number(a.tableId) - Number(b.tableId);
        }

        return (a.name || "").localeCompare(b.name || "");
      });
  }, [guests]);

  function resetForm() {
    onEditGuest(null);
    setName("");
    setGroupName("");
    setConfirmed(true);
    setAdvancePaid(false);
    setMenuType("normal");
    setNotes("");
    setAttending(true);
  }

  function startEdit(guest) {
    onEditGuest(guest);

    setName(guest.name || "");
    setGroupName(guest.groupName || "");
    setConfirmed(Boolean(guest.confirmed));
    setAdvancePaid(Boolean(guest.advancePaid));
    setMenuType(guest.menuType || "normal");
    setNotes(guest.notes || "");
    setAttending(guest.attending !== false);

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function clearFilters() {
    setSearch("");
    setFilterInvitedBy("all");
    setFilterConfirmed("all");
    setFilterAdvance("all");
    setFilterMenu("all");
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
      attending,
      tableId: attending ? (editingGuest?.tableId ?? null) : null,
    };

    if (editingGuest) {
      const response = await api.put(`/api/guests/${editingGuest.id}`, payload);

      if (onGuestSaved) {
        onGuestSaved(response.data);
      } else {
        await onRefresh();
      }
    } else {
      await api.post("/api/guests", payload);
      await onRefresh();
    }

    resetForm();
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

  useEffect(() => {
    if (!editingGuest) return;

    setName(editingGuest.name || "");
    setGroupName(editingGuest.groupName || "");
    setConfirmed(Boolean(editingGuest.confirmed));
    setAdvancePaid(Boolean(editingGuest.advancePaid));
    setMenuType(editingGuest.menuType || "normal");
    setNotes(editingGuest.notes || "");
    setAttending(editingGuest.attending !== false);

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }, [editingGuest]);

  return (
    <aside className="w-[420px] bg-white border-r border-slate-200 overflow-y-auto p-5">
      <section className="grid grid-cols-2 gap-3 mb-5">
        <Stat label="Total" value={stats.total} />
        <Stat label="Confirmați" value={stats.confirmed} />
        <Stat label="Cinste" value={stats.advancePaid} />
        <Stat label="Nealocați" value={stats.unassigned} />
      </section>

      <section
        ref={editFormRef}
        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5"
      >
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
            placeholder="Tag / Mire / Mireasă / familie"
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
            <option value="fara meniu">Fără meniu</option>
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
            A dat cinste
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={attending}
              onChange={(e) => setAttending(e.target.checked)}
            />
            Participă la nuntă
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

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Caută / filtrează</h2>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            Resetează
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Caută după nume, tag, observații..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filterInvitedBy}
              onChange={(e) => setFilterInvitedBy(e.target.value)}
            >
              <option value="all">Toți</option>
              <option value="Mire">Mire</option>
              <option value="Mireasă">Mireasă</option>
            </select>

            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filterConfirmed}
              onChange={(e) => setFilterConfirmed(e.target.value)}
            >
              <option value="all">Confirmare</option>
              <option value="confirmed">Confirmați</option>
              <option value="unconfirmed">Neconfirmați</option>
            </select>

            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filterAdvance}
              onChange={(e) => setFilterAdvance(e.target.value)}
            >
              <option value="all">Cinste</option>
              <option value="paid">Cu cinste</option>
              <option value="unpaid">Fără cinste</option>
            </select>

            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filterMenu}
              onChange={(e) => setFilterMenu(e.target.value)}
            >
              <option value="all">Meniu</option>
              <option value="normal">Normal</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="copil">Copil</option>
              <option value="fara meniu">Fără meniu</option>
            </select>
          </div>

          <p className="text-xs text-slate-500">
            Afișați: {filteredUnassignedGuests.length} din{" "}
            {unassignedGuests.length} nealocați
          </p>
        </div>
      </section>

      <div className="space-y-4">
        <section>
          <h2 className="font-bold mb-3">Invitați nealocați</h2>
          <GuestList guests={filteredUnassignedGuests} onEdit={startEdit} />
        </section>

        <section className="mt-5">
          <h2 className="font-bold mb-3">Nu participă</h2>
          <GuestList guests={notAttendingGuests} onEdit={startEdit} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setShowAssignedGuests((value) => !value)}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
          >
            <span className="font-bold">Invitați puși la mese</span>

            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              {assignedGuests.length}
              <span
                className={[
                  "transition-transform duration-200",
                  showAssignedGuests ? "rotate-180" : "",
                ].join(" ")}
              >
                ▼
              </span>
            </span>
          </button>

          {showAssignedGuests && (
            <div className="border-t border-slate-100 p-3">
              {assignedGuests.length > 0 ? (
                <GuestList guests={assignedGuests} onEdit={startEdit} />
              ) : (
                <p className="px-2 py-3 text-sm text-slate-400">
                  Nu există invitați puși la mese încă.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
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
