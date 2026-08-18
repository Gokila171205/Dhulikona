# JalTrack API Documentation

This document describes the REST API endpoints for JalTrack. 

All request and response bodies use JSON formatting.
Base URL: `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Users Management](#2-users-management)
3. [Villages Management](#3-villages-management)
4. [Complaints Management (Pending Member 1)](#4-complaints-management-pending-member-1)
5. [Notifications (Pending Member 1)](#5-notifications-pending-member-1)
6. [Payments (Pending Member 1)](#6-payments-pending-member-1)
7. [Pumps (Pending Member 2)](#7-pumps-pending-member-2)
8. [Water Supply (Pending Member 2)](#8-water-supply-pending-member-2)
9. [Water Quality (Pending Member 2)](#9-water-quality-pending-member-2)
10. [Maintenance (Pending Member 2)](#10-maintenance-pending-member-2)
11. [Analytics](#11-analytics)
12. [Reports](#12-reports)
13. [Audit Logs](#13-audit-logs)

---

## 1. Authentication

### POST /api/auth/login
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Authenticates a user and returns a JSON Web Token (JWT).
* **Authorization:** None
* **Request Body:**
  ```json
  {
    "phone": "9999999999",
    "password": "123456"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "6a7d6570eab6d145ea037b22",
        "userId": "U-ADMIN-001",
        "name": "System Admin",
        "phone": "9999999999",
        "role": "admin",
        "status": "active"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

## 2. Users Management

### GET /api/users
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Retrieves all users (paginated and filterable).
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Query Parameters:**
  * `search` (Optional) - Searches by userId, name, or phone.
  * `role` (Optional) - Filter by `admin`, `operator`, or `villager`.
  * `status` (Optional) - Filter by `active` or `inactive`.
  * `village` (Optional) - Filter by Village name.
  * `page` (Optional) - Page number (Default: `1`).
  * `limit` (Optional) - Records per page (Default: `10`).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6a7d6570eab6d145ea037b23",
        "userId": "U-012",
        "name": "Operator Ramesh",
        "phone": "9876543210",
        "role": "operator",
        "village": {
          "_id": "6a7d6570eab6d145ea037b28",
          "name": "Sonapur"
        },
        "status": "active"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 8, "totalPages": 1 }
  }
  ```

### GET /api/users/:id
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Retrieves details for a specific user.
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a7d6570eab6d145ea037b23",
      "userId": "U-012",
      "name": "Operator Ramesh",
      "phone": "9876543210",
      "role": "operator",
      "village": "6a7d6570eab6d145ea037b28",
      "status": "active",
      "createdAt": "2026-08-13T09:00:00.000Z"
    }
  }
  ```

### POST /api/users
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Creates a new user.
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Request Body:**
  ```json
  {
    "userId": "U-OP-101",
    "name": "Hari Prasad",
    "phone": "9876500123",
    "password": "securepassword",
    "role": "operator",
    "village": "6a7d6570eab6d145ea037b28",
    "status": "active"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a7d6580eab6d145ea037b30",
      "userId": "U-OP-101",
      "name": "Hari Prasad",
      "phone": "9876500123",
      "role": "operator",
      "village": "6a7d6570eab6d145ea037b28",
      "status": "active"
    }
  }
  ```

### PUT /api/users/:id
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Updates details of an existing user.
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Request Body:**
  ```json
  {
    "name": "Hari Prasad Sharma",
    "phone": "9876500123",
    "role": "operator",
    "village": "6a7d6570eab6d145ea037b28"
  }
  ```

### PATCH /api/users/:id/status
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Activates or deactivates a user.
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Request Body:**
  ```json
  {
    "status": "inactive"
  }
  ```

---

## 3. Villages Management

### GET /api/villages
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Retrieves all villages (paginated and filterable).
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Query Parameters:**
  * `search` (Optional) - Searches by name or villageId.
  * `district` (Optional) - Filter by district.
  * `status` (Optional) - Filter by `active` or `inactive`.
  * `page`, `limit` (Optional)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6a7d6570eab6d145ea037b28",
        "villageId": "V-001",
        "name": "Sonapur",
        "district": "Kamrup",
        "block": "Dimoria",
        "households": 250,
        "assignedOperator": {
          "_id": "6a7d6570eab6d145ea037b23",
          "name": "Operator Ramesh"
        },
        "status": "active"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 6, "totalPages": 1 }
  }
  ```

### POST /api/villages
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Creates a new village.
* **Authorization:** Bearer `<JWT>` (Admin Only)
* **Request Body:**
  ```json
  {
    "villageId": "V-004",
    "name": "Kamalpur",
    "district": "Kamrup",
    "block": "Kamalpur Block",
    "households": 150,
    "assignedOperator": "6a7d6570eab6d145ea037b23",
    "status": "active"
  }
  ```

### PUT /api/villages/:id
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Updates details of an existing village.
* **Authorization:** Bearer `<JWT>` (Admin Only)

### PATCH /api/villages/:id/status
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Activates or deactivates a village.
* **Authorization:** Bearer `<JWT>` (Admin Only)

---

## 4. Complaints Management (Pending Member 1)

### POST /api/complaints
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Submitted by a villager to report issues.
* **Authorization:** Bearer `<JWT>` (Villager Role)
* **Request Body:**
  ```json
  {
    "title": "Dirty water supply",
    "description": "The water supplied today contains silt and is muddy.",
    "village": "6a7d6570eab6d145ea037b28"
  }
  ```

### GET /api/complaints
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Returns complaints (Villagers see their own, Operators see assigned, Admins see all).
* **Authorization:** Bearer `<JWT>`

### GET /api/complaints/:id
* **Status:** `PENDING` (MEMBER 1 OWNED)

### PUT /api/complaints/:id
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Edit a complaint.

### PATCH /api/complaints/:id/status
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Update status of the complaint.
* **Status Lifecycle:** `Submitted` -> `Verified` -> `Maintenance Started` -> `Resolved` -> `Confirmed`

---

## 5. Notifications (Pending Member 1)

### GET /api/notifications
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Returns notification alerts for the logged-in user.

### PATCH /api/notifications/:id/read
* **Status:** `PENDING` (MEMBER 1 OWNED)

### PATCH /api/notifications/read-all
* **Status:** `PENDING` (MEMBER 1 OWNED)

---

## 6. Payments (Pending Member 1)

### GET /api/payments
* **Status:** `PENDING` (MEMBER 1 OWNED)
* **Description:** Fetches tax/fee payment statuses of households in the villages.
* **Authorization:** Bearer `<JWT>`

---

## 7. Pumps (Pending Member 2)

### GET /api/pumps
* **Status:** `PENDING` (MEMBER 2 OWNED)
* **Description:** Retrieves all water pump registry logs.

### POST /api/pumps
* **Status:** `PENDING` (MEMBER 2 OWNED)

### PUT /api/pumps/:id
* **Status:** `PENDING` (MEMBER 2 OWNED)

---

## 8. Water Supply (Pending Member 2)

### GET /api/water-supply
* **Status:** `PENDING` (MEMBER 2 OWNED)
* **Description:** Operator records of scheduled and actual water deliveries.

### POST /api/water-supply
* **Status:** `PENDING` (MEMBER 2 OWNED)

---

## 9. Water Quality (Pending Member 2)

### GET /api/water-quality
* **Status:** `PENDING` (MEMBER 2 OWNED)
* **Description:** Water health test parameters (pH, Turbidity, Chlorine, etc.).

### POST /api/water-quality
* **Status:** `PENDING` (MEMBER 2 OWNED)

---

## 10. Maintenance (Pending Member 2)

### GET /api/maintenance
* **Status:** `PENDING` (MEMBER 2 OWNED)
* **Description:** Action maintenance tasks (assigned to Operators).

### POST /api/maintenance
* **Status:** `PENDING` (MEMBER 2 OWNED)

---

## 11. Analytics

### GET /api/analytics/dashboard
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Retrieves total users, villages, and households counts. Checks for teammate modules (`pumps`, `complaints`, `waterSupply`, `waterQuality`, `feeCollection`) and sets `available: false` if they are not yet populated.
* **Authorization:** Bearer `<JWT>` (Admin Only)

---

## 12. Reports

### GET /api/reports/summary
### GET /api/reports/users
### GET /api/reports/villages
### GET /api/reports/activity
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Standardised printable report formats (Summary, Users, Villages, Activities).
* **Authorization:** Bearer `<JWT>` (Admin Only)

---

## 13. Audit Logs

### GET /api/audit-logs
* **Status:** `IMPLEMENTED` (MEMBER 3)
* **Description:** Returns read-only activity logs.
* **Authorization:** Bearer `<JWT>` (Admin Only)
