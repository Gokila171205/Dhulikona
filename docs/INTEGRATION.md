# JalTrack Team Integration Guide

This guide establishes the roles, responsibilities, shared code blocks, status lifecycles, and database relationships to ensure a smooth integration between Members 1, 2, and 3.

---

## 1. Role Definitions

JalTrack strictly defines exactly three user roles. No other roles should be created or used:
* **admin**: System administrators with full administrative dashboard permissions.
* **operator**: Village operators (also referred to as Technicians) responsible for water operations, pump upkeep, and repair dispatches.
* **villager**: Local residents who use the portal to report water quality/supply issues, view pump statuses, and check fee payment records.

---

## 2. Team Responsibilities & API Ownership

### Member 1: Villager & Complaint Module
* **Responsibilities:** Villager portal, complaint submissions, notification alerts, tax/fee payments registry.
* **Owned API Endpoints:**
  * `POST /api/complaints` (Submit new complaint)
  * `GET /api/complaints` (Villagers retrieve their own, Operators retrieve assigned, Admins retrieve all)
  * `PATCH /api/complaints/:id/status` (Update workflow status)
  * `GET /api/notifications` (Fetch alerts)
  * `PATCH /api/notifications/:id/read` (Mark notification as read)
  * `GET /api/payments` (Tax/fee records)

### Member 2: Operator & Water Operations Module
* **Responsibilities:** Operator portal, water pump registry, scheduled & completed water deliveries, water quality monitoring tests, maintenance work orders.
* **Owned API Endpoints:**
  * `GET/POST/PUT /api/pumps` (Pumps inventory)
  * `GET/POST /api/water-supply` (Water delivery logs)
  * `GET/POST /api/water-quality` (pH, Turbidity, Chlorine tests)
  * `GET/POST/PUT /api/maintenance` (Maintenance orders)

### Member 3: Admin & Infrastructure Module
* **Responsibilities:** Admin dashboard, global search/filters, user registries, village boundaries, system audit logs, printable summary reports, central authentication.
* **Owned API Endpoints:**
  * `POST /api/auth/login` (Authentication JWT)
  * `GET/POST/PUT/PATCH /api/users` (Users registry and activation status)
  * `GET/POST/PUT/PATCH /api/villages` (Villages registry and boundary boundaries)
  * `GET /api/audit-logs` (Read-only audit trail)
  * `GET /api/analytics/dashboard` (Analytics dashboard totals)
  * `GET /api/reports/...` (Printable reports for users, villages, activity)

---

## 3. Shared Code Infrastructure

### Shared Models
* `User` (in `server/models/User.js`): Shared schema for admins, operators, and villagers.
* `Village` (in `server/models/Village.js`): Holds village data, households count, and assigned operator.
* `AuditLog` (in `server/models/AuditLog.js`): Centrally records actions across all modules.
* `Complaint` (in `server/models/Complaint.js`): Shared complaint schema.
* `Pump` (in `server/models/Pump.js`): Shared pump schema.

### Shared Middleware
* `protect` (in `server/middleware/authMiddleware.js`): Verifies JWT from request headers (`Authorization: Bearer <token>`) and attaches the authenticated user object as `req.user`.
* `authorizeRoles(...roles)` (in `server/middleware/roleMiddleware.js`): Restricts access to specific role lists (`admin`, `operator`, `villager`).

### Shared API Client
* `api` (in `client/src/services/api.js`): Unified Axios instance configured with token interceptors and automatic unwrap response filters. No secondary Axios clients should be created.

---

## 4. Database Relationships

Ensure the following Object references are maintained consistently across schemas:
* **User → Village:** `User.village` references `Village._id`.
* **Village → Assigned Operator:** `Village.assignedOperator` references `User._id` (representing the `operator` role).
* **Pump → Village:** `Pump.village` references `Village._id`.
* **WaterSupply → Village / Operator:** `WaterSupply.village` references `Village._id`; `WaterSupply.recordedBy` references `User._id` (Operator).
* **WaterQuality → Village / Operator:** `WaterQuality.village` references `Village._id`; `WaterQuality.recordedBy` references `User._id` (Operator).
* **Complaint → User / Village / Operator:** `Complaint.reportedBy` references `User._id` (Villager); `Complaint.village` references `Village._id`; `Complaint.assignedTo` references `User._id` (Operator).
* **Maintenance → Pump / Complaint / Operator:** `Maintenance.pump` references `Pump._id`; `Maintenance.complaint` references `Complaint._id`; `Maintenance.assignedTo` references `User._id` (Operator).
* **Payment → Household / Village:** `Payment.village` references `Village._id`.
* **Notification → User:** `Notification.userId` references `User._id`.
* **AuditLog → User / Related Record:** `AuditLog.userId` references `User._id`; `AuditLog.relatedRecordId` stores String ID reference.

---

## 5. Workflow & State Lifecycles

### Complaint Lifecycle (Member 1)
The status enums in `server/models/Complaint.js` are:
* `Submitted` (Initial state when reported by a villager)
* `Verified` (Verified by an operator or system)
* `Maintenance Started` (Operator triggers maintenance task)
* `Resolved` (Operator completes fix)
* `Confirmed` (Villager confirms resolution)

*Compatibility Mapping for Admin Dashboard/Reports:*
* `Submitted` -> `REPORTED`
* `Verified` -> `VERIFIED`
* `Maintenance Started` -> `IN_PROGRESS`
* `Resolved` -> `RESOLVED`
* `Confirmed` -> `CONFIRMED`

### Maintenance Lifecycle (Member 2)
The state transition flow is:
* `Pending` (Job created)
* `Assigned` (Job given to an operator)
* `In Progress` (Fix underway)
* `Completed` (Fix completed)
* `Cancelled` (Job aborted)

---

## 6. Status Convention Inventory (Frontend vs Database)

The status variables defined in the frontend mock data files and database collections are:
* **Complaint:**
  * Frontend: `Submitted`, `Verified`, `Maintenance Started`, `Resolved`, `Confirmed` (Title Case)
  * Database: `Submitted`, `Verified`, `Maintenance Started`, `Resolved`, `Confirmed` (Title Case)
* **Maintenance:**
  * Frontend: `Pending`, `Assigned`, `In Progress`, `Completed`, `Cancelled` (Title Case)
  * Database: Pending development (should match Title Case frontend list)
* **Pump:**
  * Frontend: `Working`, `Not Working`, `Under Maintenance`, `Unavailable` (Title Case)
  * Database: `Working`, `Not Working`, `Under Maintenance`, `Unavailable` (Title Case)
* **Water Supply:**
  * Frontend: `Scheduled`, `Completed`, `Missed`, `Cancelled` (Title Case)
  * Database: Pending development (should match Title Case frontend list)
* **Water Quality:**
  * Frontend: `Safe`, `Needs Attention`, `Critical` (Title Case)
  * Database: Pending development (should match Title Case frontend list)
* **Payment:**
  * Frontend: `Paid`, `Pending`, `Partially Paid`, `Overdue` (Title Case)
  * Database: Pending development (should match Title Case frontend list)

---

## 7. Audit Logging Requirements

Every member must record important state transitions using the `createAuditLog` helper:
```javascript
const { createAuditLog } = require('../services/auditService');

// Example Usage during complaint creation (Member 1):
await createAuditLog({
  userId: req.user._id,
  userName: req.user.name,
  role: req.user.role,
  action: 'CREATE',
  module: 'COMPLAINTS',
  description: `Submitted complaint: "${complaint.title}"`,
  result: 'SUCCESS',
  village: req.user.village?.name,
  relatedRecordId: complaint._id.toString()
});
```

---

## 8. Analytics & Report Compatibility

### Analytics Dashboard
The endpoint `GET /api/analytics/dashboard` returns a JSON object containing module availability flags:
```json
{
  "pumps": { "available": false },
  "complaints": { "available": false },
  "waterSupply": { "available": false },
  "waterQuality": { "available": false },
  "feeCollection": { "available": false }
}
```
* **Integration Step:** When these collections are implemented on the backend, update `analyticsController.js` to run the respective aggregation counts and change the corresponding `available` flags to `true`.

### Reports Summary
The endpoint `GET /api/reports/summary` operates similarly. Returning `available: false` or `"Not yet available"` for unimplemented metrics ensures clean visual rendering in the reports module.

---

## 9. Integration Readiness Matrix

### BLOCKERS
* None. All core administrative boundaries are fully integrated and compatible.

### WARNINGS
* **Complaint status case conversion:** The Mongoose enum uses Title Case (`Submitted`, `Verified`, `Maintenance Started`), whereas Audit Trail logs and global lists assume uppercase convention (`SUBMITTED`, `VERIFIED`, `IN_PROGRESS`). Safe conversion utilities (`.toUpperCase()`) are used on the frontend to bridge this gap.
* **Empty databases:** Dashboard statistics and reports will show zero records and `"Data not available"` flags until Member 1 and Member 2 collections are seeded.

### READY
* **Shared User Roles:** Admin, Operator, and Villager role tokens pass verification tests.
* **Shared API Service:** A single Axios client `api.js` is fully connected.
* **Village Relationships:** `User.village` and `Village.assignedOperator` ObjectID bindings match.
