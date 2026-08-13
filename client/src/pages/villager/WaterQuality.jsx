const WaterQuality = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Water Quality</h1>
        <p className="mt-1 text-sm text-slate-500">
          View the latest water quality information for your village.
        </p>
      </div>

      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm font-medium text-green-700">
          Overall Water Quality
        </p>

        <div className="mt-2 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-green-700">Safe</h2>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Within Safe Range
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Last tested on 12 August 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">pH Level</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">7.2</h2>
          <p className="mt-1 text-xs text-green-600">Normal</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">TDS</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            320 mg/L
          </h2>
          <p className="mt-1 text-xs text-green-600">Normal</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Turbidity</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            1.8 NTU
          </h2>
          <p className="mt-1 text-xs text-green-600">Normal</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Test Status</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">Passed</h2>
          <p className="mt-1 text-xs text-slate-500">Latest test</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Latest Test Information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Tested On</p>
            <p className="mt-1 font-medium text-slate-900">
              12 August 2026
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="mt-1 font-medium text-slate-900">
              Village Water Source
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Result</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Safe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;