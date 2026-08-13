const WaterSupply = () => {
  const supplyRecords = [
    {
      date: "13 Aug 2026",
      time: "6:00 AM – 8:00 AM",
      duration: "2 hours",
      status: "Scheduled",
    },
    {
      date: "12 Aug 2026",
      time: "6:00 AM – 8:00 AM",
      duration: "2 hours",
      status: "Completed",
    },
    {
      date: "11 Aug 2026",
      time: "6:00 AM – 7:30 AM",
      duration: "1.5 hours",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Water Supply</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your village water supply schedule and history.
        </p>
      </div>

      <div className="rounded-xl border border-teal-100 bg-teal-50 p-6">
        <p className="text-sm font-medium text-teal-700">
          Today's Water Supply
        </p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              6:00 AM – 8:00 AM
            </h2>
            <p className="mt-1 text-sm text-slate-600">Dhulikona Village</p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Scheduled
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Supply History
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Supply Time
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Duration
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {supplyRecords.map((record, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-slate-900">{record.date}</td>
                  <td className="px-4 py-4 text-slate-600">{record.time}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {record.duration}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        record.status === "Scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaterSupply;