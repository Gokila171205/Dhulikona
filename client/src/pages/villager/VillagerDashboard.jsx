const VillagerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Villager Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome to JalTrack. Stay updated with your village water services.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Water Supply</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Scheduled</h2>
          <p className="mt-1 text-sm text-teal-600">6:00 AM – 8:00 AM</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Water Quality</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">Safe</h2>
          <p className="mt-1 text-sm text-slate-500">Last tested: Today</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Open Complaints</p>
          <h2 className="mt-2 text-2xl font-bold text-orange-600">2</h2>
          <p className="mt-1 text-sm text-slate-500">Need attention</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Payment Status</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">Paid</h2>
          <p className="mt-1 text-sm text-slate-500">August 2026</p>
        </div>
      </div>

      {/* Water Supply */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Today's Water Supply
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Village</p>
            <p className="mt-1 font-medium text-slate-900">Dhulikona</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Supply Time</p>
            <p className="mt-1 font-medium text-slate-900">
              6:00 AM – 8:00 AM
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Complaints
          </h2>

          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View All
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">
                Low Water Pressure
              </p>
              <p className="text-xs text-slate-500">CMP001 · 12 Aug 2026</p>
            </div>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
              In Progress
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">Pipeline Leakage</p>
              <p className="text-xs text-slate-500">CMP002 · 10 Aug 2026</p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Notifications
        </h2>

        <div className="mt-4 space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <p className="text-sm font-medium text-slate-900">
              Water supply is scheduled for tomorrow.
            </p>
            <p className="mt-1 text-xs text-slate-500">2 hours ago</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">
              Complaint CMP001 has been verified.
            </p>
            <p className="mt-1 text-xs text-slate-500">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillagerDashboard;