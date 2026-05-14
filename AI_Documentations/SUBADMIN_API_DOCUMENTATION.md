# Sub-Admin Management API Documentation

> **Base URL**: `/api/Admin`
> **Authentication**: JWT via HttpOnly cookie (`access_token`)
> **Required Role**: `Admin` only (SubAdmins cannot access these endpoints)

---

## Standard Response Wrapper

All endpoints return this wrapper:

```json
{
  "statusCode": 200,
  "success": true,
  "data": { ... },
  "errors": []
}
```

On error:

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "errors": ["Sub-admin not found."]
}
```

---

## Sub-Admin Status Values

| Value | Description (AR) | Description |
|-------|-------------------|-------------|
| `Active` | نشط | Active and can use the platform |
| `Suspended` | معلّق | Temporarily suspended by admin |
| `Blocked` | محظور | Blocked/deleted by admin (soft delete) |

---

## 1. GET `/api/Admin/sub-admins/statistics`

Dashboard stat cards — returns counts for each sub-admin status.

### Request
```
GET /api/Admin/sub-admins/statistics
```
No query parameters.

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "totalSubAdmins": 3,
    "activeSubAdmins": 2,
    "suspendedSubAdmins": 1
  },
  "errors": []
}
```

---

## 2. GET `/api/Admin/sub-admins`

Paginated list of sub-admins with search and filter support.

### Request
```
GET /api/Admin/sub-admins?page=1&pageSize=10&search=أحمد&status=Active
```

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | int | No | `1` | Page number (min: 1) |
| `pageSize` | int | No | `10` | Items per page (1–50, resets to 10 if invalid) |
| `search` | string | No | — | Search by name or email (partial match) |
| `status` | string | No | — | Filter by status: `Active`, `Suspended`, `Blocked` |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "أحمد محمود",
        "email": "ahmed@masarak.net",
        "phoneNumber": "0501234567",
        "createdAt": "2023-10-15T00:00:00Z",
        "status": "Active"
      },
      {
        "id": 2,
        "name": "سارة خالد",
        "email": "sara@masarak.net",
        "phoneNumber": "0507654321",
        "createdAt": "2023-11-02T00:00:00Z",
        "status": "Active"
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 3,
    "totalPages": 1
  },
  "errors": []
}
```

---

## 3. GET `/api/Admin/sub-admins/{id}`

Get full details for a single sub-admin.

### Request
```
GET /api/Admin/sub-admins/1
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Sub-admin user ID |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "name": "أحمد محمود",
    "email": "ahmed@masarak.net",
    "phoneNumber": "0501234567",
    "createdAt": "2023-10-15T00:00:00Z",
    "status": "Active"
  },
  "errors": []
}
```

### Error `404`
```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "errors": ["Sub-admin not found."]
}
```

---

## 4. PATCH `/api/Admin/sub-admins/{id}/status`

Change a sub-admin's status (activate / suspend).

### Request
```
PATCH /api/Admin/sub-admins/1/status
Content-Type: application/json
```

```json
{
  "status": "Suspended"
}
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Sub-admin user ID |

### Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | ✅ Yes | Target status: `Active`, `Suspended`, `Blocked` |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Sub-admin status updated successfully."
  },
  "errors": []
}
```

### Errors

| Code | Cause |
|------|-------|
| `400` | Invalid status value |
| `404` | Sub-admin not found |

---

## 5. DELETE `/api/Admin/sub-admins/{id}`

Soft-delete a sub-admin — sets status to **Blocked** (does NOT remove from database).

### Request
```
DELETE /api/Admin/sub-admins/1
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Sub-admin user ID |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Sub-admin has been blocked successfully."
  },
  "errors": []
}
```

### Error `404`
```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "errors": ["Sub-admin not found."]
}
```

---

## 6. PUT `/api/Admin/sub-admins/{id}`

Edit a sub-admin's details.

### Request
```
PUT /api/Admin/sub-admins/1
Content-Type: application/json
```

```json
{
  "name": "أحمد محمود المحدث",
  "email": "ahmed.new@masarak.net",
  "phoneNumber": "0509999999"
}
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Sub-admin user ID |

### Body Parameters

All fields are **optional** — only send the fields you want to update.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | No | 2–100 chars | Display name |
| `email` | string | No | Valid email, max 100 chars | Email address |
| `phoneNumber` | string | No | Valid phone, max 20 chars | Phone number |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Sub-admin updated successfully."
  },
  "errors": []
}
```

### Error `404`
```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "errors": ["Sub-admin not found."]
}
```

---

## 7. POST `/api/Admin/sub-admins`

Create a new sub-admin account.

### Request
```
POST /api/Admin/sub-admins
Content-Type: application/json
```

```json
{
  "name": "محمد عبدالله",
  "email": "mohamed@masarak.net",
  "password": "SecureP@ss123",
  "passwordConfirmation": "SecureP@ss123",
  "phoneNumber": "0551122334"
}
```

### Body Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | ✅ Yes | 2–100 chars | Display name |
| `email` | string | ✅ Yes | Valid email, max 100 chars | Email address (must be unique) |
| `password` | string | ✅ Yes | Min 8 chars | Password |
| `passwordConfirmation` | string | ✅ Yes | Must match `password` | Password confirmation |
| `phoneNumber` | string | ✅ Yes | Valid phone, max 20 chars | Phone number |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Sub-admin created successfully."
  },
  "errors": []
}
```

### Errors

| Code | Cause |
|------|-------|
| `400` | Email already in use / Invalid password / Validation error |

---

## Quick Reference

| # | Method | Endpoint | Body | Purpose |
|---|--------|----------|------|---------|
| 1 | `GET` | `/api/Admin/sub-admins/statistics` | — | Stats cards |
| 2 | `GET` | `/api/Admin/sub-admins` | — (query params) | Paginated table |
| 3 | `GET` | `/api/Admin/sub-admins/{id}` | — | View detail |
| 4 | `PATCH` | `/api/Admin/sub-admins/{id}/status` | `{ status }` | Change status |
| 5 | `DELETE` | `/api/Admin/sub-admins/{id}` | — | Soft delete (→ Blocked) |
| 6 | `PUT` | `/api/Admin/sub-admins/{id}` | `{ name?, email?, phoneNumber? }` | Edit sub-admin |
| 7 | `POST` | `/api/Admin/sub-admins` | `{ name, email, password, passwordConfirmation, phoneNumber }` | Create sub-admin |
