export default function TablesListPage({ tables, guests, unassignedGuests }) {
  const assignedGuestsCount = guests.filter((guest) => guest.tableId).length;

  return (
    <section className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Listă mese</h2>
        <p className="text-sm text-slate-500">
          Vezi toate mesele, numărul de invitați și persoanele de la fiecare
          masă.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Total invitați" value={guests.length} />
        <Stat label="Așezați la mese" value={assignedGuestsCount} />
        <Stat label="Nealocați" value={unassignedGuests.length} />
        <Stat label="Mese" value={tables.length} />
      </div>

      <div className="space-y-5">
        {tables.map((table) => {
          const overCapacity = table.guests.length > table.capacity;

          return (
            <div
              key={table.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg">{table.name}</h3>
                  <p
                    className={[
                      "text-sm",
                      overCapacity
                        ? "text-red-600 font-semibold"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {table.guests.length} / {table.capacity} invitați
                  </p>
                </div>

                {overCapacity && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Peste capacitate
                  </span>
                )}
              </div>

              {table.guests.length === 0 ? (
                <div className="px-5 py-6 text-sm text-slate-400">
                  Masa nu are invitați.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {table.guests.map((guest, index) => (
                    <div
                      key={guest.id}
                      className="grid grid-cols-[60px_1fr_120px_120px_120px] gap-3 px-5 py-3 text-sm items-center"
                    >
                      <div className="text-slate-400">#{index + 1}</div>

                      <div>
                        <div className="font-semibold">{guest.name}</div>
                        <div className="text-xs text-slate-500">
                          {guest.groupName || "Fără tag"}
                        </div>
                      </div>

                      <Badge
                        active={guest.confirmed}
                        trueText="Confirmat"
                        falseText="Neconfirmat"
                      />

                      <Badge
                        active={guest.advancePaid}
                        trueText="Cinste"
                        falseText="Fără cinste"
                      />

                      <div className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-center">
                        {guest.menuType || "normal"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {unassignedGuests.length > 0 && (
        <div className="mt-6 bg-white border border-yellow-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-yellow-100 bg-yellow-50">
            <h3 className="font-bold text-lg">Invitați nealocați</h3>
            <p className="text-sm text-yellow-700">
              {unassignedGuests.length} invitați nu sunt încă puși la masă.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {unassignedGuests.map((guest, index) => (
              <div
                key={guest.id}
                className="grid grid-cols-[60px_1fr_120px_120px_120px] gap-3 px-5 py-3 text-sm items-center"
              >
                <div className="text-slate-400">#{index + 1}</div>

                <div>
                  <div className="font-semibold">{guest.name}</div>
                  <div className="text-xs text-slate-500">
                    {guest.groupName || "Fără tag"}
                  </div>
                </div>

                <Badge
                  active={guest.confirmed}
                  trueText="Confirmat"
                  falseText="Neconfirmat"
                />

                <Badge
                  active={guest.advancePaid}
                  trueText="Cinste"
                  falseText="Fără cinste"
                />

                <div className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-center">
                  {guest.menuType || "normal"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Badge({ active, trueText, falseText }) {
  return (
    <span
      className={[
        "text-xs rounded-full px-3 py-1 text-center",
        active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
      ].join(" ")}
    >
      {active ? trueText : falseText}
    </span>
  );
}
