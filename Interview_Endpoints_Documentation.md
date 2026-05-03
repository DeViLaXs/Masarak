# Interview Management API Documentation

> **Base URL:** `https://<your-domain>/api/Interviews`  
> **Authentication:** JWT Bearer token via `access_token` HttpOnly cookie  
> **Authorization:** Role = `Admin`  
> All responses follow the same wrapper shape:
> ```json
> {
>   "statusCode": 200,
>   "success": true,
>   "data": { ... },
>   "errors": []
> }
> ```

---

## Endpoints Overview

| # | Method | Route | Description |
|---|--------|-------|-------------|
| 1 | `GET` | `/api/Interviews/statistics` | Stats cards (counts per status) |
| 2 | `GET` | `/api/Interviews` | Paginated interview list |
| 3 | `GET` | `/api/Interviews/{id}` | Single interview detail |
| 4 | `PATCH` | `/api/Interviews/{id}/status` | Update interview status |
| 5 | `POST` | `/api/Interviews/{id}/reschedule` | Reschedule interview |
| 6 | `GET` | `/api/Interviews/statuses` | All statuses (for dropdowns) |

---

## 1. Get Interview Statistics

Used to populate the **6 stat cards** at the top of the page.

**Request**
```
GET /api/Interviews/statistics
```

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "scheduled": 2,
    "confirmed": 1,
    "completed": 1,
    "rescheduled": 2,
    "cancelled": 1,
    "noShow": 1
  },
  "errors": []
}
```

**Field Reference**

| Field | Type | Description |
|-------|------|-------------|
| `scheduled` | `int` | Interviews with status = Scheduled |
| `confirmed` | `int` | Interviews with status = Confirmed |
| `completed` | `int` | Interviews with status = Completed |
| `rescheduled` | `int` | Interviews with status = Rescheduled |
| `cancelled` | `int` | Interviews with status = Cancelled |
| `noShow` | `int` | Interviews with status = NoShow |

---

## 2. Get Interview List (Paginated + Filtered)

Used to populate the **interview table** with search and filter support.

**Request**
```
GET /api/Interviews
```

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `searchTerm` | `string` | No | — | Search by candidate name or job title |
| `statusId` | `int` | No | — | Filter by status ID (see [Status IDs](#status-ids)) |
| `page` | `int` | No | `1` | Page number |
| `pageSize` | `int` | No | `10` | Items per page (max 50) |

**Example Request**
```
GET /api/Interviews?searchTerm=أحمد&statusId=1&page=1&pageSize=10
```

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "items": [
      {
        "interviewId": 1,
        "applicationId": 5,
        "candidateName": "أحمد محمد العلي",
        "candidateEmail": "ahmed@example.com",
        "jobTitle": "مطور واجهات أمامية",
        "interviewDate": "2026-05-09T10:00:00",
        "interviewTypeName": "InPerson",
        "location": "مقر الشركة - الرياض",
        "statusId": 4,
        "statusName": "أعيد جدولتها",
        "notes": null
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 8,
    "totalPages": 1
  },
  "errors": []
}
```

**`items[]` Field Reference**

| Field | Type | Description |
|-------|------|-------------|
| `interviewId` | `int` | Unique interview ID |
| `applicationId` | `int` | Linked application ID |
| `candidateName` | `string` | Full candidate name |
| `candidateEmail` | `string` | Candidate email |
| `jobTitle` | `string` | Job title |
| `interviewDate` | `datetime` | Date & time of the interview (ISO 8601) |
| `interviewTypeName` | `string` | `"Online"` / `"InPerson"` / `"Phone"` |
| `location` | `string` | Address line + governate |
| `statusId` | `int` | Status ID (see [Status IDs](#status-ids)) |
| `statusName` | `string` | Human-readable status label |
| `notes` | `string?` | Optional notes (nullable) |

**Pagination Fields**

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | `int` | Current page number |
| `pageSize` | `int` | Items per page |
| `totalCount` | `int` | Total matching records |
| `totalPages` | `int` | Computed: `ceil(totalCount / pageSize)` |

---

## 3. Get Single Interview

Used to load detail view / modal for one interview.

**Request**
```
GET /api/Interviews/{id}
```

**Path Parameter**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `int` | Interview ID |

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "interviewId": 1,
    "applicationId": 5,
    "candidateName": "أحمد محمد العلي",
    "candidateEmail": "ahmed@example.com",
    "jobTitle": "مطور واجهات أمامية",
    "interviewDate": "2026-05-09T10:00:00",
    "interviewTypeName": "InPerson",
    "location": "مقر الشركة - الرياض",
    "statusId": 1,
    "statusName": "مجدولة",
    "notes": "يرجى الحضور قبل الموعد بـ 10 دقائق"
  },
  "errors": []
}
```

**Error Responses**

| Status | When |
|--------|------|
| `404` | Interview not found or doesn't belong to this employer |

---

## 4. Update Interview Status

Used by the action buttons: **تأكيد**, **مكتملة**, **إلغاء**, **لم يحضر**.

**Request**
```
PATCH /api/Interviews/{id}/status
Content-Type: application/json
```

**Path Parameter**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `int` | Interview ID |

**Request Body**
```json
{
  "statusId": 6
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `statusId` | `int` | Yes | Target status ID (see [Status IDs](#status-ids)) |

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Interview status updated successfully."
  },
  "errors": []
}
```

**Error Responses**

| Status | When |
|--------|------|
| `400` | `statusId` is not a valid/active status |
| `404` | Interview not found |

---

## 5. Reschedule Interview

Used by the **إعادة جدولة** button. Sets status to `Rescheduled (4)` and updates the date.

**Request**
```
POST /api/Interviews/{id}/reschedule
Content-Type: application/json
```

**Path Parameter**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `int` | Interview ID |

**Request Body**
```json
{
  "newDate": "2026-05-15T14:00:00",
  "notes": "تم تأجيل المقابلة بناءً على طلب المرشح"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newDate` | `datetime` | Yes | New interview date & time (ISO 8601) |
| `notes` | `string` | No | Optional notes to attach |

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Interview rescheduled successfully."
  },
  "errors": []
}
```

**Error Responses**

| Status | When |
|--------|------|
| `404` | Interview not found |

---

## 6. Get Interview Statuses (Lookup)

Used to populate the **status filter dropdown**. Returns all active statuses ordered by `sortOrder`.

**Request**
```
GET /api/Interviews/statuses
```

**Response `200 OK`**
```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    { "id": 1, "name": "مجدولة" },
    { "id": 2, "name": "مكتملة" },
    { "id": 3, "name": "ملغاة" },
    { "id": 4, "name": "أعيد جدولتها" },
    { "id": 5, "name": "لم يحضر" },
    { "id": 6, "name": "مؤكدة" }
  ],
  "errors": []
}
```

---

## Status IDs

| ID | English Name | Arabic Label (UI) | Used By |
|----|-------------|-------------------|---------|
| `1` | Scheduled | مجدولة | Default after creation |
| `2` | Completed | مكتملة | "مكتملة" button |
| `3` | Cancelled | ملغاة | "إلغاء" button |
| `4` | Rescheduled | أعيد جدولتها | Reschedule endpoint (auto-set) |
| `5` | NoShow | لم يحضر | "لم يحضر" button |
| `6` | Confirmed | مؤكدة | "تأكيد" button |

---

## Interview Type Values

| Value | Description |
|-------|-------------|
| `"Online"` | Remote / video call |
| `"InPerson"` | Physical location |
| `"Phone"` | Phone call |

---

## Error Response Shape

All error responses follow this structure:

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "errors": ["Interview not found."]
}
```

---

## Authentication Notes

- The JWT is sent automatically via the `access_token` **HttpOnly cookie** — no manual `Authorization` header needed.
- All endpoints require the logged-in user to have the `Admin` role.
- All queries are automatically scoped to the employer's own data — an employer can only see interviews linked to their own job postings.
