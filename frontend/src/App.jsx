import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import api from "./api/api";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import TablesCanvas from "./components/TablesCanvas";
import TablesListPage from "./components/TablesListPage";

export default function App() {
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("plan");
  const [editingGuest, setEditingGuest] = useState(null);

  async function loadData() {
    setLoading(true);

    const [guestsResponse, tablesResponse] = await Promise.all([
      api.get("/api/guests"),
      api.get("/api/tables"),
    ]);

    setGuests(guestsResponse.data);
    setTables(tablesResponse.data);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const unassignedGuests = useMemo(() => {
    return guests.filter(
      (guest) => guest.attending !== false && !guest.tableId,
    );
  }, [guests]);

  const notAttendingGuests = useMemo(() => {
    return guests.filter((guest) => guest.attending === false);
  }, [guests]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const guestId = Number(String(active.id).replace("guest-", ""));
    const targetId = over.id;

    const movedGuest =
      guests.find((guest) => guest.id === guestId) ||
      tables
        .flatMap((table) => table.guests || [])
        .find((guest) => guest.id === guestId);

    if (!movedGuest || movedGuest.attending === false) return;

    const nextTableId =
      targetId === "unassigned"
        ? null
        : Number(String(targetId).replace("table-", ""));

    const currentTableId = movedGuest.tableId ?? null;

    if (currentTableId === nextTableId) {
      return;
    }

    await api.put(`/api/guests/${guestId}`, {
      tableId: nextTableId,
    });

    setGuests((current) =>
      current.map((guest) =>
        guest.id === guestId ? { ...guest, tableId: nextTableId } : guest,
      ),
    );

    setTables((currentTables) =>
      currentTables.map((table) => {
        const withoutGuest = (table.guests || []).filter(
          (guest) => guest.id !== guestId,
        );

        if (table.id !== nextTableId) {
          return {
            ...table,
            guests: withoutGuest,
          };
        }

        return {
          ...table,
          guests: [
            ...withoutGuest,
            {
              ...movedGuest,
              tableId: nextTableId,
            },
          ],
        };
      }),
    );
  }

  function handleGuestSaved(updatedGuest) {
    setGuests((current) =>
      current.map((guest) =>
        guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest,
      ),
    );

    setTables((currentTables) =>
      currentTables.map((table) => ({
        ...table,
        guests: (table.guests || []).map((guest) =>
          guest.id === updatedGuest.id ? { ...guest, ...updatedGuest } : guest,
        ),
      })),
    );

    setEditingGuest(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Se încarcă aplicația...
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Layout view={view} onViewChange={setView}>
        <Sidebar
          guests={guests}
          unassignedGuests={unassignedGuests}
          notAttendingGuests={notAttendingGuests}
          editingGuest={editingGuest}
          onEditGuest={setEditingGuest}
          onRefresh={loadData}
          onGuestSaved={handleGuestSaved}
        />

        {view === "plan" ? (
          <TablesCanvas
            tables={tables}
            onRefresh={loadData}
            onEditGuest={setEditingGuest}
          />
        ) : (
          <TablesListPage
            tables={tables}
            guests={guests}
            unassignedGuests={unassignedGuests}
          />
        )}
      </Layout>
    </DndContext>
  );
}
