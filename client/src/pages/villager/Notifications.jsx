const Notifications = () => {
  const notifications = [
    {
      title: "Water Supply Scheduled",
      message:
        "Water supply is scheduled for tomorrow from 6:00 AM to 8:00 AM.",
      time: "2 hours ago",
      type: "info",
    },
    {
      title: "Complaint Verified",
      message:
        "Your complaint CMP001 has been verified by the village operator.",
      time: "Yesterday",
      type: "success",
    },
    {
      title: "Water Quality Updated",
      message:
        "The latest water quality test has been completed. The water is within the safe range.",
      time: "2 days ago",
      type: "success",
    },
    {
      title: "Payment Reminder",
      message: "Your June 2026 water-service payment is still pending.",
      time: "3 days ago",
      type: "warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Stay updated with important water-service information.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex gap-4">
              <div
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                  notification.type === "success"
                    ? "bg-green-500"
                    : notification.type === "warning"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                }`}
              />

              <div className="flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <h2 className="font-semibold text-slate-900">
                    {notification.title}
                  </h2>

                  <span className="text-xs text-slate-500">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;