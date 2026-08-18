import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VillagerDashboard = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to fetch complaints"
          );
        }

        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Complaints which are not resolved/rejected
  const openComplaints = complaints.filter(
    (complaint) =>
      complaint.status !== "Resolved" &&
      complaint.status !== "Rejected"
  );

  // Show latest 2 complaints
  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 2);

  return (
    <div className="space-y-6">

      {/* Page Header */}
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

        {/* Water Supply */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Water Supply
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Scheduled
          </h2>

          <p className="mt-1 text-sm text-teal-600">
            6:00 AM – 8:00 AM
          </p>
        </div>

        {/* Water Quality */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Water Quality
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            Safe
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Last tested: Today
          </p>
        </div>

        {/* Open Complaints - NOW DYNAMIC */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Complaints
          </p>

          <h2 className="mt-2 text-2xl font-bold text-orange-600">
            {loading ? "..." : openComplaints.length}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Need attention
          </p>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Payment Status
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            Paid
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            August 2026
          </p>
        </div>
      </div>

      {/* Water Supply */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Today's Water Supply
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div>
            <p className="text-sm text-slate-500">
              Village
            </p>

            <p className="mt-1 font-medium text-slate-900">
              Dhulikona
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Supply Time
            </p>

            <p className="mt-1 font-medium text-slate-900">
              6:00 AM – 8:00 AM
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Scheduled
            </span>
          </div>

        </div>
      </div>

      {/* Recent Complaints - NOW DYNAMIC */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-semibold text-slate-900">
            Recent Complaints
          </h2>

          <button
            onClick={() => navigate("/villager/complaints")}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View All
          </button>

        </div>

        <div className="mt-4 space-y-3">

          {loading && (
            <p className="text-sm text-slate-500">
              Loading complaints...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600">
              Failed to load complaints: {error}
            </p>
          )}

          {!loading && !error && recentComplaints.length === 0 && (
            <div className="rounded-lg bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-700">
                No complaints yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your submitted complaints will appear here.
              </p>
            </div>
          )}

          {!loading &&
            recentComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
              >

                <div>
                  <p className="font-medium text-slate-900">
                    {complaint.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    {complaint._id} ·{" "}
                    {new Date(
                      complaint.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    complaint.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : complaint.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : complaint.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {complaint.status}
                </span>

              </div>
            ))}

        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Recent Notifications
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 p-5 text-center">
          <p className="font-medium text-slate-700">
            No notifications yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Notifications will appear here when there are updates.
          </p>
        </div>

      </div>

    </div>
  );
};

export default VillagerDashboard;