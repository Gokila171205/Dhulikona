import { useState } from "react";

const ReportProblem = () => {
  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    location: "",
    date: "",
  });

  const [customProblem, setCustomProblem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user selects Other, make sure they enter a problem
    if (
      formData.problemType === "Other" &&
      !customProblem.trim()
    ) {
      alert("Please enter your problem type.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // If Other is selected, use the custom problem
            title:
              formData.problemType === "Other"
                ? customProblem
                : formData.problemType,

            description: formData.description,

            location: formData.location,

            date: formData.date,

            // Temporary test IDs
            // We will replace these with logged-in user data later
            village: "6a7d6570eab6d145ea037b28",

            reportedBy: "6a7d6571eab6d145ea037b2a",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to submit complaint"
        );
      }

      console.log("Complaint created:", data);

      alert("Complaint submitted successfully!");

      // Clear form
      setFormData({
        problemType: "",
        description: "",
        location: "",
        date: "",
      });

      setCustomProblem("");
    } catch (error) {
      console.error(
        "Error submitting complaint:",
        error
      );

      alert(
        "Failed to submit complaint: " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Report a Problem
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Report a water-related issue in your area.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">

          {/* Problem Type */}
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
              <option value="">
                Select problem type
              </option>

              <option value="No Water">
                No Water
              </option>

              <option value="Low Water Pressure">
                Low Water Pressure
              </option>

              <option value="Water Quality Issue">
                Water Quality Issue
              </option>

              <option value="Pump Issue">
                Pump Issue
              </option>

              <option value="Pipeline Leakage">
                Pipeline Leakage
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* Custom Problem */}
            {formData.problemType === "Other" && (
              <input
                type="text"
                value={customProblem}
                onChange={(e) =>
                  setCustomProblem(e.target.value)
                }
                placeholder="Type your problem"
                required
                className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            )}
          </div>

          {/* Description */}
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

          {/* Location */}
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

          {/* Date */}
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

          {/* Photo */}
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

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportProblem;