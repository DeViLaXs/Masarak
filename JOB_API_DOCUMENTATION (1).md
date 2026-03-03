# Job Management API Documentation

> **Base URL**: `/api/Job`
> **Authentication**: JWT via HttpOnly cookie (`access_token`)
> **Required Role**: `Company` — each company can only see/manage their own jobs.

---

## Standard Response Wrapper

```json
{
  "statusCode": 200,
  "success": true,
  "data": { ... },
  "errors": []
}
```

---

## Job Status Values

| Value | Arabic | Description |
|-------|--------|-------------|
| `Published` | نشطة | Actively accepting applications |
| `Closed` | غير نشطة | Manually closed by employer |
| `Filled` | تم التعيين | Position filled |
| `Expired` | منتهية | Auto-detected: `ExpirationDate < now` |

---

## 1. GET `/api/Job/jobs`

Paginated list of the logged-in company's jobs.

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | int | No | `1` | Page number |
| `pageSize` | int | No | `10` | Items per page (1–50) |
| `search` | string | No | — | Search by job title |
| `status` | string | No | — | `Published`, `Closed`, `Expired` |
| `jobTypeId` | int | No | — | Filter by job type ID |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "مطور واجهات أمامية",
        "description": "تطوير تطبيقات الويب باستخدام React",
        "jobType": "FullTime",
        "minSalary": 8000,
        "maxSalary": 12000,
        "currency": "Saudi Riyal",
        "postedDate": "2025-01-01T00:00:00Z",
        "expirationDate": "2025-01-31T00:00:00Z",
        "applicantsCount": 24,
        "status": "Published"
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 4,
    "totalPages": 1
  }
}
```

---

## 2. GET `/api/Job/jobs/{id}`

Full details for a single job.

### Response `200 OK`
```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "title": "مطور واجهات أمامية",
    "description": "تطوير تطبيقات الويب باستخدام React",
    "jobTypeId": 1,
    "jobType": "FullTime",
    "categoryId": 1,
    "category": "تقنية المعلومات",
    "jobLocationTypeId": 1,
    "jobLocationType": "OnSite",
    "currencyId": 1,
    "currency": "Saudi Riyal",
    "minSalary": 8000,
    "maxSalary": 12000,
    "postedDate": "2025-01-01T00:00:00Z",
    "expirationDate": "2025-01-31T00:00:00Z",
    "applicantsCount": 24,
    "status": "Published",
    "addressLine": "",
    "countryId": 122,
    "country": "Saudi Arabia",
    "governateId": 1,
    "governate": "Riyadh",
    "skills": [
      { "id": 51, "name": "React" },
      { "id": 6, "name": "TypeScript" }
    ]
  }
}
```

---

## 3. POST `/api/Job/jobs`

Create a new job posting.

### Request Body
```json
{
  "title": "مطور واجهات أمامية",
  "description": "تطوير تطبيقات الويب باستخدام React",
  "jobTypeId": 1,
  "categoryId": 1,
  "jobLocationTypeId": 1,
  "currencyId": 1,
  "countryId": 122,
  "governateId": 1,
  "addressLine": "شارع التحلية",
  "minSalary": 8000,
  "maxSalary": 12000,
  "expirationDate": "2025-02-28T00:00:00Z",
  "skillIds": [51, 6, 58],
  "newSkills": ["Next.js"]
}
```

### Body Parameters

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ | 2–100 chars | Job title |
| `description` | string | ✅ | max 700 chars | Job description |
| `jobTypeId` | int | ✅ | — | From `GET /api/Job/job-types` |
| `categoryId` | int | ✅ | — | From `GET /api/Job/categories` |
| `jobLocationTypeId` | int | ✅ | — | From `GET /api/Job/location-types` |
| `currencyId` | int | ✅ | — | From `GET /api/Job/currencies` |
| `countryId` | int | ✅ | — | From `GET /api/Job/countries` |
| `governateId` | int | ✅ | — | From `GET /api/Job/governates/{countryId}` |
| `addressLine` | string | No | — | Street address / additional info |
| `minSalary` | decimal | ✅ | 0.01–1,000,000 | Minimum salary |
| `maxSalary` | decimal | ✅ | 0.01–1,000,000 | Maximum salary |
| `expirationDate` | DateTime | ✅ | Must be future | From calendar date picker |
| `skillIds` | int[] | No | — | IDs of existing skills |
| `newSkills` | string[] | No | — | Names of new skills to auto-create |

### Response `200 OK`
```json
{
  "statusCode": 201,
  "data": { "message": "Job created successfully." }
}
```

### Errors

| Code | Cause |
|------|-------|
| `400` | Expiration date in the past / Min > Max salary / Validation |
| `401` | Company profile not found |

---

## 4. PUT `/api/Job/jobs/{id}`

Update an existing job. All fields are **optional** — only send fields you want to change.

### Request Body
```json
{
  "title": "مطور واجهات أمامية (محدث)",
  "minSalary": 9000,
  "skillIds": [51, 6, 55],
  "newSkills": ["Remix"]
}
```

### Response `200 OK`
```json
{
  "statusCode": 200,
  "data": { "message": "Job updated successfully." }
}
```

---

## 5. PATCH `/api/Job/jobs/{id}/status`

Activate or deactivate a job.

### Request Body
```json
{ "status": "Closed" }
```

| Status | Arabic | Action |
|--------|--------|--------|
| `Published` | تنشيط | Activate the job |
| `Closed` | إلغاء | Deactivate the job |

### Response `200 OK`
```json
{
  "statusCode": 200,
  "data": { "message": "Job status updated successfully." }
}
```

---

## Lookup Endpoints (for combo boxes)

All return `{ "statusCode": 200, "data": [...] }`.
All lookup endpoints return **all items by default**. Pass `?search=keyword` to filter results.

### 6. GET `/api/Job/categories`
Returns all categories. Optional `?search=` filters by name.
```
GET /api/Job/categories
GET /api/Job/categories?search=تطوير
```
```json
[{ "id": 1, "name": "تطوير البرمجيات" }, { "id": 2, "name": "تطوير الويب" }]
```

### 7. GET `/api/Job/job-types`
```json
[{ "id": 1, "name": "FullTime" }, { "id": 2, "name": "PartTime" }]
```

### 8. GET `/api/Job/location-types`
```json
[{ "id": 1, "name": "OnSite" }, { "id": 2, "name": "Remote" }, { "id": 3, "name": "Hybrid" }]
```

### 9. GET `/api/Job/currencies`
Returns all currencies. Optional `?search=` filters by name or code.
```
GET /api/Job/currencies
GET /api/Job/currencies?search=ريال
```
```json
[{ "id": 1, "code": "SAR", "name": "ريال سعودي" }, { "id": 2, "code": "USD", "name": "دولار أمريكي" }]
```

### 10. GET `/api/Job/countries`
Returns all countries. Optional `?search=` filters by name or code.
```
GET /api/Job/countries
GET /api/Job/countries?search=سعود
```
```json
[{ "id": 1, "name": "المملكة العربية السعودية", "code": "SA" }, { "id": 2, "name": "مصر", "code": "EG" }]
```

### 11. GET `/api/Job/governates/{countryId}`
Loads governates after country is selected. Optional `?search=` filters by name.
```
GET /api/Job/governates/1
GET /api/Job/governates/1?search=الرياض
```
```json
[{ "id": 1, "name": "الرياض" }, { "id": 2, "name": "مكة المكرمة" }]
```

### 12. GET `/api/Job/skills`
Returns all skills. Optional `?search=` filters by name.
```
GET /api/Job/skills
GET /api/Job/skills?search=جافا
```
```json
[{ "id": 1, "name": "جافاسكريبت (JavaScript)" }, { "id": 3, "name": "جافا (Java)" }]
```

---

## Quick Reference

| # | Method | Endpoint | Purpose | Searchable |
|---|--------|----------|---------|------------|
| 1 | `GET` | `/api/Job/jobs` | Paginated job list | ✅ query params |
| 2 | `GET` | `/api/Job/jobs/{id}` | Job detail | — |
| 3 | `POST` | `/api/Job/jobs` | Create job | — |
| 4 | `PUT` | `/api/Job/jobs/{id}` | Edit job | — |
| 5 | `PATCH` | `/api/Job/jobs/{id}/status` | Activate / Deactivate | — |
| 6 | `GET` | `/api/Job/categories` | Lookup: categories | ✅ `?search=` |
| 7 | `GET` | `/api/Job/job-types` | Lookup: job types | — |
| 8 | `GET` | `/api/Job/location-types` | Lookup: location types | — |
| 9 | `GET` | `/api/Job/currencies` | Lookup: currencies | ✅ `?search=` |
| 10 | `GET` | `/api/Job/countries` | Lookup: countries | ✅ `?search=` |
| 11 | `GET` | `/api/Job/governates/{countryId}` | Lookup: governates | ✅ `?search=` |
| 12 | `GET` | `/api/Job/skills` | Lookup: skills | ✅ `?search=` |
