export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold">Wedding Seating Planner</h1>
          <p className="text-xs text-slate-500">
            Organizare invitați și mese pentru nuntă
          </p>
        </div>

        <div className="text-sm text-slate-500">MVP local</div>
      </header>

      <main className="flex h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
