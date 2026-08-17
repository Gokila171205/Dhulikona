import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyComplaints = () => {
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

  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading complaints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to fetch complaints: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Complaints
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track the problems you have reported.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {complaints.length === 0 ? (
          <p className="text-center text-slate-500">
            You have not submitted any complaints yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Complaint ID
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Problem
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Date
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-teal-700">
                      {complaint._id}
                    </td>

                    <td className="px-4 py-4 text-slate-900">
                      {complaint.title}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {new Date(
                        complaint.date || complaint.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : complaint.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : complaint.status === "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/villager/complaints/${complaint._id}`
                          )
                        }
                        className="font-medium text-teal-700 hover:text-teal-900"
                      >
                        View Details
                      </button>
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

export default MyComplaints;