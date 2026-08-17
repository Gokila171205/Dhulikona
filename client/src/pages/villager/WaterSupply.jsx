import { useEffect, useState } from "react";

const WaterSupply = () => {
  const [supplyRecords, setSupplyRecords] = useState([]);
  const [todaySupply, setTodaySupply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWaterSupply = async () => {
      try {
        // Fetch supply history
        const historyResponse = await fetch(
          "http://localhost:5000/api/water-supply"
        );

        const historyData = await historyResponse.json();

        if (!historyResponse.ok) {
          throw new Error(
            historyData.error || "Failed to fetch water supply"
          );
        }

        setSupplyRecords(historyData);

        // Fetch today's supply
        const todayResponse = await fetch(
          "http://localhost:5000/api/water-supply/today"
        );

        const todayData = await todayResponse.json();

        if (!todayResponse.ok) {
          throw new Error(
            todayData.error || "Failed to fetch today's supply"
          );
        }

        setTodaySupply(todayData);
      } catch (err) {
        console.error("Error fetching water supply:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterSupply();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading water supply information...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to fetch water supply: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Water Supply
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your village water supply schedule and history.
        </p>
      </div>

      {/* Today's Water Supply */}
      <div className="rounded-xl border border-teal-100 bg-teal-50 p-6">
        <p className="text-sm font-medium text-teal-700">
          Today's Water Supply
        </p>

        {todaySupply ? (
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {todaySupply.startTime} – {todaySupply.endTime}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {todaySupply.village?.name || "Village not available"}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
                todaySupply.status === "Scheduled"
                  ? "bg-blue-100 text-blue-700"
                  : todaySupply.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {todaySupply.status}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            No water supply scheduled for today.
          </p>
        )}
      </div>

      {/* Supply History */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Supply History
        </h2>

        {supplyRecords.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No water supply records available.
          </p>
        ) : (
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
                {supplyRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-slate-900">
                      {new Date(record.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {record.startTime} – {record.endTime}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {record.duration}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          record.status === "Scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : record.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
        )}
      </div>
    </div>
  );
};

export default WaterSupply;