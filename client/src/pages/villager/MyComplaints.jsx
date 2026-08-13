import { useNavigate } from "react-router-dom";

const MyComplaints = () => {
  const navigate = useNavigate();

  const complaints = [
    {
      id: "CMP001",
      problem: "Low Water Pressure",
      date: "12 Aug 2026",
      status: "In Progress",
    },
    {
      id: "CMP002",
      problem: "Pipeline Leakage",
      date: "10 Aug 2026",
      status: "Resolved",
    },
    {
      id: "CMP003",
      problem: "No Water",
      date: "05 Aug 2026",
      status: "Pending",
    },
  ];

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
                  key={complaint.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-medium text-teal-700">
                    {complaint.id}
                  </td>

                  <td className="px-4 py-4 text-slate-900">
                    {complaint.problem}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {complaint.date}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700"
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
                        navigate(`/villager/complaints/${complaint.id}`)
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
      </div>
    </div>
  );
};

export default MyComplaints;