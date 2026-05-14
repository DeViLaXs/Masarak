# Company Management Admin API Documentation

> **Base URL**: `/api/Admin`
> **Authentication**: JWT via HttpOnly cookie (`access_token`)
> **Required Roles**: `Admin` or `SubAdmin`

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
  "errors": ["Company not found."]
}
```

---

## Company Status Values

These are the valid status values used across all endpoints:

| Value | ID | Meaning (AR) | Description |
|-------|-----|--------------|-------------|
| `PendingApproval` | 1 | في انتظار التوثيق | Registered, awaiting admin verification |
| `Active` | 2 | موثقة | Approved and active |
| `Suspended` | 3 | معلّقة | Temporarily blocked |
| `Inactive` | 4 | غير نشطة | Voluntarily deactivated |
| `Rejected` | 5 | مرفوضة | Admin rejected the registration |
| `Blocked` | 6 | محظورة | Admin blocked/deleted the company |

---

## 1. GET `/api/Admin/statistics`

Dashboard stat cards — returns counts for each company status.

### Request
```
GET /api/Admin/statistics
```
No query parameters.

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "totalCompanies": 247,
    "pendingVerification": 18,
    "verified": 195,
    "rejected": 34
  },
  "errors": []
}
```

---

## 2. GET `/api/Admin/companies`

Paginated list of companies with search, filter, and sort support.

### Request
```
GET /api/Admin/companies?page=1&pageSize=10&search=التقنية&status=PendingApproval&sortBy=name&sortOrder=desc
```

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | int | No | `1` | Page number (min: 1) |
| `pageSize` | int | No | `10` | Items per page (1–50, resets to 10 if invalid) |
| `search` | string | No | — | Search by company name (partial match) |
| `status` | string | No | — | Filter by status: `PendingApproval`, `Active`, `Suspended`, `Inactive`, `Rejected` |
| `sortBy` | string | No | `createdAt` | Sort field: `name`, `email`, `status`, `createdAt` |
| `sortOrder` | string | No | `desc` | Sort direction: `asc` or `desc` |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "companyName": "شركة التقنية المتقدمة",
        "industry": "تقنية المعلومات",
        "email": "info@advancedtech.sa",
        "phoneNumber": "+966 5678 234 11",
        "createdAt": "2024-01-15T00:00:00Z",
        "status": "PendingApproval",
        "logoUrl": "https://storage.example.com/logos/company1.png"
      },
      {
        "id": 2,
        "companyName": "مؤسسة البناء الحديث",
        "industry": "المقاولات والبناء",
        "email": "contact@modernbuild.sa",
        "phoneNumber": "+966 6789 345 12",
        "createdAt": "2024-01-10T00:00:00Z",
        "status": "Active",
        "logoUrl": null
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 247,
    "totalPages": 25
  },
  "errors": []
}
```

> **Pagination text**: Use `totalCount`, `currentPage`, and `pageSize` to render:
> `عرض {(currentPage-1)*pageSize + 1} إلى {min(currentPage*pageSize, totalCount)} من أصل {totalCount} شركة`

---

## 3. GET `/api/Admin/companies/{id}`

Get full details for a single company (eye icon / view action).

### Request
```
GET /api/Admin/companies/1
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Company (Employer) ID |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "companyName": "شركة التقنية المتقدمة",
    "industry": "تقنية المعلومات",
    "email": "info@advancedtech.sa",
    "phoneNumber": "+966 5678 234 11",
    "createdAt": "2024-01-15T00:00:00Z",
    "status": "PendingApproval",
    "logoUrl": "https://storage.example.com/logos/company1.png",
    "emailConfirmed": false,
    "totalJobs": 12,
    "city": "الرياض",
    "governate": "منطقة الرياض"
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
  "errors": ["Company not found."]
}
```

---

## 4. PATCH `/api/Admin/companies/{id}/status`

Change a company's status (approve ✓, reject, suspend).

### Request
```
PATCH /api/Admin/companies/1/status
Content-Type: application/json
```

```json
{
  "status": "Active"
}
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Company (Employer) ID |

### Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | ✅ Yes | Target status: `PendingApproval`, `Active`, `Suspended`, `Inactive`, `Rejected` |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Company status updated successfully."
  },
  "errors": []
}
```

### Errors

| Code | Cause |
|------|-------|
| `400` | Invalid status value |
| `404` | Company not found |

---

## 5. DELETE `/api/Admin/companies/{id}`

Soft-delete a company — sets its status to **Blocked** (does NOT remove from database).

### Request
```
DELETE /api/Admin/companies/1
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Company (Employer) ID |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Company has been blocked successfully."
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
  "errors": ["Company not found."]
}
```

---

## 6. PUT `/api/Admin/companies/{id}`

Edit a company's details (edit ✏ action).

### Request
```
PUT /api/Admin/companies/1
Content-Type: application/json
```

```json
{
  "companyName": "شركة التقنية المتقدمة الجديدة",
  "industry": "تقنية المعلومات",
  "email": "newemail@advancedtech.sa",
  "phoneNumber": "+966 5000 000 00"
}
```

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Company (Employer) ID |

### Body Parameters

All fields are **optional** — only send the fields you want to update.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `companyName` | string | No | 3–100 chars | Company name |
| `industry` | string | No | 3–100 chars | Industry/sector |
| `email` | string | No | Valid email, max 100 chars | Company email |
| `phoneNumber` | string | No | Valid phone, max 20 chars | Phone number |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Company updated successfully."
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
  "errors": ["Company not found."]
}
```

---

## 7. POST `/api/Admin/companies/bulk-action`

Perform a bulk action on multiple companies (via checkbox selections).

### Request
```
POST /api/Admin/companies/bulk-action
Content-Type: application/json
```

```json
{
  "companyIds": [1, 5, 12],
  "action": "Approve"
}
```

### Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyIds` | int[] | ✅ Yes | Array of company IDs to act on |
| `action` | string | ✅ Yes | One of: `Approve`, `Reject`, `Suspend`, `Delete` |

### Action → Status Mapping

| Action | Sets Status To |
|--------|---------------|
| `Approve` | `Active` (ID: 2) |
| `Reject` | `Rejected` (ID: 5) |
| `Suspend` | `Suspended` (ID: 3) |
| `Delete` | `Blocked` (ID: 6) |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "successCount": 3,
    "failedCount": 0,
    "message": "3 companies processed successfully."
  },
  "errors": []
}
```

### Errors

| Code | Cause |
|------|-------|
| `400` | Empty `companyIds` array or invalid `action` value |

---

## Quick Reference

| # | Method | Endpoint | Body | Purpose |
|---|--------|----------|------|---------|
| 1 | `GET` | `/api/Admin/statistics` | — | Stats cards |
| 2 | `GET` | `/api/Admin/companies` | — (query params) | Paginated table |
| 3 | `GET` | `/api/Admin/companies/{id}` | — | View detail |
| 4 | `PATCH` | `/api/Admin/companies/{id}/status` | `{ status }` | Change status |
| 5 | `DELETE` | `/api/Admin/companies/{id}` | — | Soft delete (→ Blocked) |
| 6 | `PUT` | `/api/Admin/companies/{id}` | `{ companyName?, industry?, email?, phoneNumber? }` | Edit company |
| 7 | `POST` | `/api/Admin/companies/bulk-action` | `{ companyIds, action }` | Bulk ops |
