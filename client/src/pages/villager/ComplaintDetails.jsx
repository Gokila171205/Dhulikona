const ComplaintDetails = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Complaint Details
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View the current status and updates of your complaint.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm text-slate-500">Complaint ID</p>
            <h2 className="mt-1 text-xl font-bold text-teal-700">CMP001</h2>
          </div>

          <span className="h-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            In Progress
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Problem Type</p>
            <p className="mt-1 font-medium text-slate-900">
              Low Water Pressure
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Submitted On</p>
            <p className="mt-1 font-medium text-slate-900">
              12 August 2026
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="mt-1 font-medium text-slate-900">
              Main Street, Dhulikona
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Assigned To</p>
            <p className="mt-1 font-medium text-slate-900">
              Village Operator
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-500">Description</p>
          <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Water pressure has been very low in our area since this morning.
            Several households are affected.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Complaint Timeline
        </h2>

        <div className="mt-6 space-y-6">
          <div className="flex gap-4">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green-500" />

            <div>
              <p className="font-medium text-slate-900">Complaint Submitted</p>
              <p className="text-sm text-slate-500">12 Aug 2026 · 9:15 AM</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green-500" />

            <div>
              <p className="font-medium text-slate-900">Complaint Verified</p>
              <p className="text-sm text-slate-500">12 Aug 2026 · 11:30 AM</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-500" />

            <div>
              <p className="font-medium text-slate-900">Maintenance Assigned</p>
              <p className="text-sm text-slate-500">13 Aug 2026 · 8:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;