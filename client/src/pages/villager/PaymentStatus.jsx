const PaymentStatus = () => {
  const payments = [
    {
      month: "August 2026",
      amount: "₹50",
      date: "05 Aug 2026",
      status: "Paid",
    },
    {
      month: "July 2026",
      amount: "₹50",
      date: "05 Jul 2026",
      status: "Paid",
    },
    {
      month: "June 2026",
      amount: "₹50",
      date: "-",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Payment Status
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your household water-service payment information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Month</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">₹50</h2>
          <p className="mt-1 text-sm text-green-600">Paid</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Amount</p>
          <h2 className="mt-2 text-2xl font-bold text-orange-600">₹50</h2>
          <p className="mt-1 text-sm text-slate-500">June 2026</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Household</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            HH-DH-1024
          </h2>
          <p className="mt-1 text-sm text-slate-500">Dhulikona</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Payment History
        </h2>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Month
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Payment Date
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.month}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 text-slate-900">
                    {payment.month}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {payment.amount}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {payment.date}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {payment.status}
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

export default PaymentStatus;