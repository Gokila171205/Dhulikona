import { useEffect, useState } from "react";

const WaterSupply = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWaterSupplies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/water-supplies"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Failed to fetch water supply records"
          );
        }

        setSupplies(data);
      } catch (err) {
        console.error("Error fetching water supplies:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterSupplies();
  }, []);

  // Latest water supply record
  const todaySupply = supplies.length > 0 ? supplies[0] : null;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Water Supply
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your village water supply schedule and history.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          Failed to fetch water supply:
          <span className="ml-1">{error}</span>
        </div>
      )}

      {/* Today's / Latest Water Supply */}
      <div className="rounded-xl border border-teal-100 bg-teal-50 p-6">

        <p className="text-sm font-medium text-teal-700">
          Latest Water Supply
        </p>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">
            Loading water supply...
          </p>
        ) : !todaySupply ? (
          <div className="mt-3">
            <h2 className="text-xl font-bold text-slate-900">
              No water supply records
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Water supply schedules will appear here when they are added.
            </p>
          </div>
        ) : (
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {todaySupply.startTime} – {todaySupply.endTime}
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {todaySupply.area}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(todaySupply.date)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                todaySupply.status
              )}`}
            >
              {todaySupply.status}
            </span>

          </div>
        )}
      </div>

      {/* Supply History */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Supply History
        </h2>

        <div className="mt-5 overflow-x-auto">

          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Loading supply history...
            </p>
          ) : supplies.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-700">
                No supply records found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Records will appear here when water supply is scheduled.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[750px] text-left text-sm">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Area
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Supply Time
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Pump
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Remarks
                  </th>

                </tr>
              </thead>

              <tbody>

                {supplies.map((supply) => (
                  <tr
                    key={supply._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-4 py-4 text-slate-900">
                      {formatDate(supply.date)}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-900">
                      {supply.area}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supply.startTime} – {supply.endTime}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supply.pump}
                    </td>

                    <td className="px-4 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          supply.status
                        )}`}
                      >
                        {supply.status}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {supply.remarks || "—"}
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          )}

        </div>
      </div>

    </div>
  );
};

export default WaterSupply;