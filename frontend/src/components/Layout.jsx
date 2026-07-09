export default function Layout({ children, view, onViewChange }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold">Wedding Seating Planner</h1>
          <p className="text-xs text-slate-500">
            Organizare invitați și mese pentru nuntă
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => onViewChange("plan")}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold",
              view === "plan"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500",
            ].join(" ")}
          >
            Plan vizual
          </button>

          <button
            onClick={() => onViewChange("list")}
            className={[
              "px-4 py-2 rounded-lg text-sm font-semibold",
              view === "list"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500",
            ].join(" ")}
          >
            Listă mese
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
