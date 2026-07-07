import { useEffect, useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";

import api from "./api/api";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import TablesCanvas from "./components/TablesCanvas";

export default function App() {
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [guestsResponse, tablesResponse] = await Promise.all([
        api.get("/api/guests"),
        api.get("/api/tables"),
      ]);

      setGuests(guestsResponse.data);
      setTables(tablesResponse.data);
    } catch (err) {
      console.error(err);
      setError("Backend-ul nu răspunde sau baza de date nu este inițializată.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const unassignedGuests = useMemo(() => {
    return guests.filter((guest) => !guest.tableId);
  }, [guests]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const guestId = Number(active.id.replace("guest-", ""));
    const targetId = over.id;

    const nextTableId =
      targetId === "unassigned"
        ? null
        : Number(String(targetId).replace("table-", ""));

    await api.put(`/api/guests/${guestId}`, {
      tableId: nextTableId,
    });

    await loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Se încarcă aplicația...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
          <h1 className="text-xl font-bold mb-2">
            Aplicația nu poate încărca datele
          </h1>

          <p className="text-slate-600 mb-4">{error}</p>

          <pre className="bg-slate-900 text-white rounded-xl p-4 text-sm overflow-auto">
            {`Rulează:

docker compose logs backend

apoi:

docker compose exec backend sh
npx prisma migrate dev --name init
npm run prisma:seed
exit`}
          </pre>

          <button
            onClick={loadData}
            className="mt-4 bg-slate-900 text-white rounded-xl px-4 py-2"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Layout>
        <Sidebar
          guests={guests}
          unassignedGuests={unassignedGuests}
          onRefresh={loadData}
        />

        <TablesCanvas tables={tables} onRefresh={loadData} />
      </Layout>
    </DndContext>
  );
}
