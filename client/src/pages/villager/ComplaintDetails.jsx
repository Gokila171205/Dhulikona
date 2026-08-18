import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/complaints/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to fetch complaint"
          );
        }

        setComplaint(data);
      } catch (err) {
        console.error("Error fetching complaint:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading complaint details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">
          Failed to fetch complaint: {error}
        </p>

        <button
          onClick={() => navigate("/villager/complaints")}
          className="rounded-lg bg-teal-700 px-4 py-2 text-white"
        >
          Back to My Complaints
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-6 text-slate-600">
        Complaint not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/villager/complaints")}
          className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          ← Back to My Complaints
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Complaint Details
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View the current status and details of your complaint.
        </p>
      </div>

      {/* Complaint Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm text-slate-500">
              Complaint ID
            </p>

            <h2 className="mt-1 text-xl font-bold text-teal-700">
              {complaint._id}
            </h2>
          </div>

          <span
            className={`h-fit rounded-full px-4 py-2 text-sm font-medium ${
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

        {/* Details */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">
              Problem Type
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.title}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Submitted On
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {new Date(complaint.date || complaint.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Location
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.location || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Village
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.village?.name || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Reported By
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.reportedBy?.name || "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Assigned To
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.assignedTo?.name || "Not assigned"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            Description
          </p>

          <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {complaint.description}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Complaint Timeline
        </h2>

        <div className="mt-6">
          <div className="flex gap-4">
            <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-green-500" />

            <div>
              <p className="font-medium text-slate-900">
                Complaint Submitted
              </p>

              <p className="text-sm text-slate-500">
                {new Date(
                  complaint.createdAt
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {complaint.status !== "Pending" && (
            <div className="mt-6 flex gap-4">
              <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-500" />

              <div>
                <p className="font-medium text-slate-900">
                  Status: {complaint.status}
                </p>

                <p className="text-sm text-slate-500">
                  Last updated{" "}
                  {new Date(
                    complaint.updatedAt
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;