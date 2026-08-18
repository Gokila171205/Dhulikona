import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  IndianRupee,
  Search,
} from 'lucide-react';
import api from '../../api/axios';

const statusStyles = {
  Paid: 'bg-green-50 text-green-700',
  Pending: 'bg-orange-50 text-orange-700',
  Overdue: 'bg-red-50 text-red-700',
};

const Charges = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/charges');
      setHouseholds(res.data);
    } catch (err) {
      console.error('Failed to fetch charges:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHouseholds = useMemo(() => {
    return households.filter((household) => {
      const text = search.toLowerCase();

      const matchesSearch =
        household.household.toLowerCase().includes(text) ||
        household.head.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === 'All' || household.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [households, search, statusFilter]);

  const paidCount = households.filter((h) => h.status === 'Paid').length;
  const pendingCount = households.filter((h) => h.status === 'Pending').length;
  const overdueCount = households.filter((h) => h.status === 'Overdue').length;

  const totalCollected = households
    .filter((h) => h.status === 'Paid')
    .reduce((total, h) => total + h.amount, 0);

  const markPaid = async (id) => {
    try {
      const res = await api.patch(`/charges/${id}/pay`);

      setHouseholds((previous) =>
        previous.map((household) =>
          household._id === id ? res.data : household
        )
      );
    } catch (err) {
      console.error('Failed to mark as paid:', err);
      alert('Something went wrong while updating payment status.');
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-6">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-[#0F172A]">
          Household Charges
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Monitor household water-service fee collection.
        </p>

      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#64748B]">
                Total Collected
              </p>

              <p className="mt-2 text-2xl font-bold text-[#0F172A]">
                ₹{totalCollected}
              </p>
            </div>

            <div className="rounded-lg bg-[#E0F2FE] p-2.5">
              <IndianRupee size={20} className="text-[#0284C7]" />
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm text-[#64748B]">
            Paid
          </p>

          <p className="mt-2 text-2xl font-bold">
            {paidCount}
          </p>

        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm text-[#64748B]">
            Pending
          </p>

          <p className="mt-2 text-2xl font-bold">
            {pendingCount}
          </p>

        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">

          <p className="text-sm text-[#64748B]">
            Overdue
          </p>

          <p className="mt-2 text-2xl font-bold">
            {overdueCount}
          </p>

        </div>

      </div>

      {/* Table */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">

        <div className="border-b border-[#E2E8F0] p-5">

          <h2 className="text-lg font-semibold text-[#0F172A]">
            Household Fee Records
          </h2>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
              />

              <input
                type="text"
                placeholder="Search household or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-sm outline-none focus:border-[#0F766E]"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-[#E2E8F0] px-3 text-sm outline-none focus:border-[#0F766E]"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="bg-[#F8FAFC] text-left">

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Household
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Head of Household
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Members
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Fee
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Due Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-[#64748B]">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">

              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#64748B]">
                    Loading charge records...
                  </td>
                </tr>
              ) : filteredHouseholds.length > 0 ? (
                filteredHouseholds.map((household) => (

                  <tr
                    key={household._id}
                    className="hover:bg-[#F8FAFC]"
                  >

                    <td className="px-5 py-4 text-sm font-medium">
                      {household.household}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {household.head}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {household.members}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium">
                      ₹{household.amount}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#64748B]">
                      {household.dueDate}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          statusStyles[household.status]
                        }`}
                      >
                        {household.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-right">

                      {household.status !== 'Paid' && (

                        <button
                          onClick={() => markPaid(household._id)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] px-3 py-1.5 text-sm font-medium hover:border-[#16A34A] hover:text-[#16A34A]"
                        >
                          <CheckCircle size={15} />
                          Mark Paid
                        </button>

                      )}

                      {household.status === 'Paid' && (

                        <span className="text-xs text-[#16A34A]">
                          Recorded
                        </span>

                      )}

                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <IndianRupee size={28} className="text-[#64748B]" />

                      <p className="mt-3 text-sm font-medium text-[#0F172A]">
                        No charge records found
                      </p>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Try changing your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
};

export default Charges;