const User = require('../models/User');
const Village = require('../models/Village');
const Pump = require('../models/Pump');
const Complaint = require('../models/Complaint');
const WaterSupply = require('../models/WaterSupply');
const WaterQuality = require('../models/WaterQuality');
const Payment = require('../models/Payment');

// @desc    Get aggregated system analytics for admin dashboard
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Users Counts
    const [
      totalUsers, activeUsers, inactiveUsers,
      villagers, operators, admins
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'inactive' }),
      User.countDocuments({ role: 'villager' }),
      User.countDocuments({ role: 'operator' }),
      User.countDocuments({ role: 'admin' })
    ]);

    // 2. Villages and Households
    const [
      totalVillages, activeVillages, inactiveVillages,
      householdsResult
    ] = await Promise.all([
      Village.countDocuments(),
      Village.countDocuments({ status: 'active' }),
      Village.countDocuments({ status: 'inactive' }),
      Village.aggregate([{ $group: { _id: null, total: { $sum: '$households' } } }])
    ]);

    const totalHouseholds = householdsResult.length > 0 ? householdsResult[0].total : 0;

    // 3. Operational Pumps counts
    const [
      totalPumps, workingPumps, maintenancePumps, notWorkingPumps, unavailablePumps
    ] = await Promise.all([
      Pump.countDocuments(),
      Pump.countDocuments({ status: 'Working' }),
      Pump.countDocuments({ status: 'Under Maintenance' }),
      Pump.countDocuments({ status: 'Not Working' }),
      Pump.countDocuments({ status: 'Unavailable' })
    ]);

    // 4. Operational Complaints counts
    const [
      pendingComplaints, resolvedComplaints, confirmedComplaints, submittedComplaints, verifiedComplaints, maintenanceComplaints
    ] = await Promise.all([
      Complaint.countDocuments({ status: { $in: ['Submitted', 'Verified', 'Maintenance Started'] } }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Confirmed' }),
      Complaint.countDocuments({ status: 'Submitted' }),
      Complaint.countDocuments({ status: 'Verified' }),
      Complaint.countDocuments({ status: 'Maintenance Started' })
    ]);

    // 5. Water Supply metrics
    const [
      supplyCompleted, supplyMissed, supplyTotal
    ] = await Promise.all([
      WaterSupply.countDocuments({ status: 'Completed' }),
      WaterSupply.countDocuments({ status: 'Missed' }),
      WaterSupply.countDocuments()
    ]);
    const reliability = supplyTotal > 0 ? Math.round((supplyCompleted / supplyTotal) * 100) : 100;

    // 6. Water Quality metrics
    const [
      criticalQuality, attentionQuality
    ] = await Promise.all([
      WaterQuality.countDocuments({ status: 'Critical' }),
      WaterQuality.countDocuments({ status: 'Needs Attention' })
    ]);
    const wqStatus = criticalQuality > 0 ? 'Critical' : attentionQuality > 0 ? 'Needs Attention' : 'Safe';

    // 7. Payment fees aggregation
    const paymentSum = await Payment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalFees = paymentSum.length > 0 ? paymentSum[0].total : 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          villagers: villagers,
          operators: operators,
          admins: admins
        },
        villages: {
          total: totalVillages,
          active: activeVillages,
          inactive: inactiveVillages
        },
        households: {
          total: totalHouseholds,
          available: true
        },
        pumps: {
          total: totalPumps,
          working: workingPumps,
          maintenance: maintenancePumps,
          available: true
        },
        complaints: {
          pending: pendingComplaints,
          resolved: resolvedComplaints + confirmedComplaints,
          available: true
        },
        waterSupply: {
          reliability: `${reliability}%`,
          available: true
        },
        waterQuality: {
          status: wqStatus,
          available: true
        },
        feeCollection: {
          total: totalFees,
          available: true
        },
        charts: {
          usersByRole: {
            villagers: villagers,
            operators: operators,
            admins: admins
          },
          villagesByStatus: {
            active: activeVillages,
            inactive: inactiveVillages
          },
          pumpsByStatus: {
            working: workingPumps,
            notWorking: notWorkingPumps,
            maintenance: maintenancePumps,
            unavailable: unavailablePumps,
            available: true
          },
          complaintsTrend: {
            submitted: submittedComplaints,
            verified: verifiedComplaints,
            inProgress: maintenanceComplaints,
            resolved: resolvedComplaints,
            confirmed: confirmedComplaints,
            available: true
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics
};
