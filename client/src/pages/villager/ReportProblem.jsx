import { useState } from "react";

const ReportProblem = () => {
  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    location: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Complaint submitted:", formData);

    alert("Complaint submitted successfully!");

    setFormData({
      problemType: "",
      description: "",
      location: "",
      date: "",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Report a Problem
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Report a water-related issue in your area.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Problem Type *
            </label>

            <select
              name="problemType"
              value={formData.problemType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">Select problem type</option>
              <option value="No Water">No Water</option>
              <option value="Low Water Pressure">Low Water Pressure</option>
              <option value="Water Quality Issue">
                Water Quality Issue
              </option>
              <option value="Pump Issue">Pump Issue</option>
              <option value="Pipeline Leakage">Pipeline Leakage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the problem..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Upload Photo
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            <p className="mt-1 text-xs text-slate-500">
              Optional. Upload a photo showing the issue.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportProblem;