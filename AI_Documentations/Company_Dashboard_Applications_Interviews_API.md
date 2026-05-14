# Company Dashboard — Applications & Interviews API Documentation

> **Base URL:** `https://your-api-domain.com/api`  
> **Authentication:** JWT Bearer token (sent as HttpOnly cookie `access_token`)  
> **Required Role:** `Company` or `Admin`

---

## Table of Contents

1. [Applications Page](#1-applications-page)
   - [GET Applications List](#11-get-applications-list)
   - [GET Filter Options](#12-get-filter-options)
   - [POST Reject Application](#13-reject-application)
   - [POST Hire Candidate](#14-hire-candidate)
   - [POST Schedule Interview](#15-schedule-interview)
2. [Interviews Page](#2-interviews-page)
   - [GET Interviews List](#21-get-interviews-list)
   - [GET Filter Options](#22-get-filter-options-1)
   - [POST Cancel Interview](#23-cancel-interview)
   - [POST Reschedule Interview](#24-reschedule-interview)
   - [POST Complete Interview](#25-complete-interview)
   - [POST Mark Missing Interview](#26-mark-missing-interview)
3. [Lookup Endpoints (Shared)](#3-lookup-endpoints-shared)
4. [Action Flags Logic](#4-action-flags-logic)
5. [Schedule/Reschedule Dialog Form Rules](#5-schedulerescheduledialog-form-rules)
6. [State Machine Diagram](#6-state-machine-diagram)
7. [Error Response Format](#7-error-response-format)

---

## Response Wrapper

Every endpoint returns:
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
  "statusCode": 400,
  "success": false,
  "data": null,
  "errors": ["Error message here"]
}
```

---

## 1. Applications Page

### 1.1 GET Applications List

**`GET /api/Applications/company`**

Retrieves a paginated list of all applications for the logged-in company's jobs.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | int | No | 1 | Page number |
| `pageSize` | int | No | 10 | Items per page (max 50) |
| `search` | string | No | null | Search by **job title** or **candidate name** |
| `applicationStatusId` | int | No | null | Filter by application status ID |
| `jobId` | int | No | null | Filter by specific job |

#### Response Body — `data`

```json
{
  "items": [
    {
      "applicationId": 1,
      "profilePhoto": "https://blob.azure.com/...",
      "fullName": "Ahmed Ali Mohammed",
      "email": "ahmed@example.com",
      "jobTitle": "Senior Developer",
      "applicationDate": "2026-05-10T14:30:00Z",
      "matchingPercentage": 85,
      "applicationStatus": "PendingReview",
      "cvDownloadUrl": "https://blob.azure.com/...",
      "canReject": true,
      "canSchedule": true,
      "canHire": false
    }
  ],
  "currentPage": 1,
  "pageSize": 10,
  "totalCount": 47,
  "totalPages": 5
}
```

#### Table Columns Mapping

| Column | Field | Notes |
|---|---|---|
| Profile Photo | `profilePhoto` | Image URL (nullable — show placeholder if null) |
| Full Name | `fullName` | Candidate's full name |
| Email | `email` | Candidate's email |
| Job Name | `jobTitle` | The job they applied for |
| Application Date | `applicationDate` | ISO 8601 datetime |
| Matching % | `matchingPercentage` | AI match score (nullable — show "N/A" if null) |
| Status | `applicationStatus` | Status badge text |
| Download CV | `cvDownloadUrl` | URL for download button (nullable — disable button if null) |
| Actions | `canReject`, `canSchedule`, `canHire` | Show/hide buttons based on flags |

---

### 1.2 GET Filter Options

**`GET /api/Applications/company/filters`**

Returns the data needed for the two filter dropdowns.

#### Response Body — `data`

```json
{
  "statuses": [
    { "id": 1, "name": "PendingReview" },
    { "id": 2, "name": "Shortlisted" },
    { "id": 3, "name": "Rejected" },
    { "id": 6, "name": "Hired" },
    { "id": 7, "name": "Withdrawn" },
    { "id": 8, "name": "Interview" },
    { "id": 9, "name": "MissingInterview" },
    { "id": 10, "name": "Interviewed" }
  ],
  "jobs": [
    { "id": 1, "name": "Senior Developer" },
    { "id": 2, "name": "UI/UX Designer" }
  ]
}
```

**Usage:**
- `statuses` → populate the "Application Status" filter dropdown
- `jobs` → populate the "Job Title" filter dropdown

---

### 1.3 Reject Application

**`POST /api/Applications/{id}/reject`**

Rejects an application. No request body needed.

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | int | Application ID |

#### Allowed From Statuses
- `PendingReview` (1)
- `Shortlisted` (2)
- `Interviewed` (10)

#### Success Response — `data`
```json
{
  "message": "Application rejected successfully."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Application not found. |
| 400 | Application can only be rejected from PendingReview, Shortlisted, or Interviewed status. |

---

### 1.4 Hire Candidate

**`POST /api/Applications/{id}/hire`**

Hires a candidate. No request body needed.

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | int | Application ID |

#### Allowed From Status
- `Interviewed` (10) **only**

#### Success Response — `data`
```json
{
  "message": "Candidate hired successfully."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Application not found. |
| 400 | Only applications in Interviewed status can be hired. |

---

### 1.5 Schedule Interview

**`POST /api/Applications/{id}/schedule-interview`**

Opens a dialog → user fills the form → sends this request.

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | int | Application ID |

#### Allowed From Status
- `PendingReview` (1) **only**

#### Request Body

```json
{
  "interviewDate": "2026-05-20T10:00:00Z",
  "notes": "Please bring your portfolio",
  "interviewTypeId": 1,
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "countryId": null,
  "governateId": null,
  "addressLine": null
}
```

#### Request Fields

| Field | Type | Required | Condition | Description |
|---|---|---|---|---|
| `interviewDate` | DateTime | ✅ Always | — | Must be in the future |
| `notes` | string | ❌ | — | Max 200 chars |
| `interviewTypeId` | int | ✅ Always | — | `1` = Online, `2` = InPerson, `3` = Phone |
| `meetingLink` | string | ✅ If Online | `interviewTypeId = 1` | Max 500 chars |
| `countryId` | int | ✅ If InPerson | `interviewTypeId = 2` | From countries lookup |
| `governateId` | int | ✅ If InPerson | `interviewTypeId = 2` | From governates lookup |
| `addressLine` | string | ✅ If InPerson | `interviewTypeId = 2` | Street address |

#### Dialog Form Behavior

```
┌─────────────────────────────────────┐
│  Schedule Interview                 │
├─────────────────────────────────────┤
│  Interview Date*:  [date picker]    │
│  Notes:            [text area]      │
│  Interview Type*:  [dropdown]       │
│                                     │
│  ── If Online ──────────────────    │
│  Meeting Link*:    [text input]     │
│                                     │
│  ── If InPerson ────────────────    │
│  Country*:         [combo box]      │
│  Governate*:       [combo box]      │
│  Address Line*:    [text input]     │
│                                     │
│  [Cancel]              [Schedule]   │
└─────────────────────────────────────┘
```

#### Side Effects
- Application status → `Shortlisted` (2)
- New Interview record created with status → `Scheduled` (1)

#### Success Response — `data`
```json
{
  "message": "Interview scheduled successfully."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Application not found. |
| 400 | Only applications in PendingReview status can be scheduled for an interview. |
| 400 | Interview date must be in the future. |
| 400 | Invalid interview type. |
| 400 | Meeting link is required for online interviews. |
| 400 | Country, governate, and address line are required for in-person interviews. |
| 400 | Invalid country. |
| 400 | Invalid governate for the selected country. |

---

## 2. Interviews Page

### 2.1 GET Interviews List

**`GET /api/Interviews/company`**

Retrieves a paginated list of all interviews for the company's jobs.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` | int | No | 1 | Page number |
| `pageSize` | int | No | 10 | Items per page (max 50) |
| `search` | string | No | null | Search by **candidate name** or **job title** |
| `interviewStatusId` | int | No | null | Filter by interview status ID |
| `jobId` | int | No | null | Filter by specific job |

#### Response Body — `data`

```json
{
  "items": [
    {
      "interviewId": 1,
      "applicationId": 5,
      "candidateName": "Ahmed Ali Mohammed",
      "jobTitle": "Senior Developer",
      "interviewDate": "2026-05-20T10:00:00Z",
      "interviewType": "Online",
      "interviewStatus": "Scheduled",
      "location": "https://meet.google.com/abc-defg-hij",
      "canCancel": true,
      "canReschedule": true,
      "canComplete": false,
      "canMarkMissing": false
    },
    {
      "interviewId": 2,
      "applicationId": 8,
      "candidateName": "Sara Hassan",
      "jobTitle": "UI Designer",
      "interviewDate": "2026-05-13T14:00:00Z",
      "interviewType": "InPerson",
      "interviewStatus": "Confirmed",
      "location": "Yemen, Aden, 123 Main Street",
      "canCancel": false,
      "canReschedule": false,
      "canComplete": true,
      "canMarkMissing": true
    }
  ],
  "currentPage": 1,
  "pageSize": 10,
  "totalCount": 12,
  "totalPages": 2
}
```

#### Table Columns Mapping

| Column | Field | Notes |
|---|---|---|
| Candidate Name | `candidateName` | Full name |
| Job Title | `jobTitle` | — |
| Interview Date & Time | `interviewDate` | ISO 8601 — format as date + time |
| Interview Type | `interviewType` | "Online", "InPerson", or "Phone" |
| Interview Status | `interviewStatus` | Status badge |
| Location | `location` | If InPerson → `"Country, Governate, Address"`. If Online → meeting link (clickable). If null → "N/A" |
| Actions | `canCancel`, `canReschedule`, `canComplete`, `canMarkMissing` | Show/hide buttons |

---

### 2.2 GET Filter Options

**`GET /api/Interviews/company/filters`**

#### Response Body — `data`

```json
{
  "statuses": [
    { "id": 1, "name": "Scheduled" },
    { "id": 2, "name": "Completed" },
    { "id": 3, "name": "Cancelled" },
    { "id": 4, "name": "Rescheduled" },
    { "id": 5, "name": "NoShow" },
    { "id": 6, "name": "Confirmed" },
    { "id": 7, "name": "MissingInterview" },
    { "id": 8, "name": "Withdrawn" }
  ],
  "jobs": [
    { "id": 1, "name": "Senior Developer" },
    { "id": 2, "name": "UI/UX Designer" }
  ]
}
```

---

### 2.3 Cancel Interview

**`POST /api/Interviews/{id}/cancel`**

Cancels an interview. No request body needed.

#### Allowed From
- `Scheduled` (1) — any date
- `Confirmed` (6) — only if interview date ≠ today

#### Side Effects
- Interview status → `Cancelled` (3)
- Application status → `Rejected` (3)

#### Success Response — `data`
```json
{
  "message": "Interview cancelled and application rejected."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Interview not found. |
| 400 | Interview can only be cancelled when in Scheduled status, or Confirmed status with a future date. |

---

### 2.4 Reschedule Interview

**`POST /api/Interviews/{id}/reschedule`**

Updates the interview with new date/type/location. Same dialog form as Schedule.

#### Allowed From Status
- `Scheduled` (1) **only**

#### Request Body
Same shape as [Schedule Interview](#15-schedule-interview) request body.

```json
{
  "interviewDate": "2026-05-25T14:00:00Z",
  "notes": "Updated notes",
  "interviewTypeId": 2,
  "meetingLink": null,
  "countryId": 1,
  "governateId": 3,
  "addressLine": "456 New Street"
}
```

#### Side Effects
- Interview details updated
- Status stays `Scheduled` (candidate must re-confirm)
- `respondedAt` is reset to null

#### Success Response — `data`
```json
{
  "message": "Interview rescheduled successfully."
}
```

---

### 2.5 Complete Interview

**`POST /api/Interviews/{id}/complete`**

Marks the interview as completed. No request body needed.

#### Allowed From
- `Confirmed` (6) — **only if interview date = today**

#### Side Effects
- Interview status → `Completed` (2)
- Application status → `Interviewed` (10)

#### Success Response — `data`
```json
{
  "message": "Interview marked as completed."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Interview not found. |
| 400 | Only confirmed interviews can be marked as completed. |
| 400 | Interview can only be marked as completed on the interview date. |

---

### 2.6 Mark Missing Interview

**`POST /api/Interviews/{id}/missing`**

Marks that the candidate did not attend. No request body needed.

#### Allowed From
- `Confirmed` (6) — **only if interview date = today**

#### Side Effects
- Interview status → `MissingInterview` (7)
- Application status → `MissingInterview` (9)

#### Success Response — `data`
```json
{
  "message": "Interview marked as missing."
}
```

#### Error Responses
| Code | Message |
|---|---|
| 404 | Interview not found. |
| 400 | Only confirmed interviews can be marked as missing. |
| 400 | Interview can only be marked as missing on the interview date. |

---

## 3. Lookup Endpoints (Shared)

These endpoints are **already available** from `JobsController`. Use them for combo boxes in the schedule/reschedule dialog:

| Purpose | Endpoint | Response |
|---|---|---|
| Interview Types | `GET /api/Jobs/job-types` | Not exact — use hardcoded values below |
| Countries | `GET /api/Jobs/countries` | `[{ id, name, code }]` |
| Governates | `GET /api/Jobs/governates/{countryId}` | `[{ id, name }]` |

#### Interview Types (Hardcoded Values)
```
1 = Online
2 = InPerson
3 = Phone
```

---

## 4. Action Flags Logic

### Applications Table

| Application Status | `canReject` | `canSchedule` | `canHire` |
|---|:---:|:---:|:---:|
| PendingReview (1) | ✅ | ✅ | ❌ |
| Shortlisted (2) | ✅ | ❌ | ❌ |
| Rejected (3) | ❌ | ❌ | ❌ |
| Hired (6) | ❌ | ❌ | ❌ |
| Withdrawn (7) | ❌ | ❌ | ❌ |
| MissingInterview (9) | ❌ | ❌ | ❌ |
| Interviewed (10) | ✅ | ❌ | ✅ |

### Interviews Table

| Interview Status | Date Condition | `canCancel` | `canReschedule` | `canComplete` | `canMarkMissing` |
|---|---|:---:|:---:|:---:|:---:|
| Scheduled (1) | any | ✅ | ✅ | ❌ | ❌ |
| Confirmed (6) | date ≠ today | ✅ | ❌ | ❌ | ❌ |
| Confirmed (6) | date = today | ❌ | ❌ | ✅ | ✅ |
| Completed (2) | any | ❌ | ❌ | ❌ | ❌ |
| Cancelled (3) | any | ❌ | ❌ | ❌ | ❌ |
| MissingInterview (7) | any | ❌ | ❌ | ❌ | ❌ |
| Withdrawn (8) | any | ❌ | ❌ | ❌ | ❌ |

---

## 5. Schedule/Reschedule Dialog Form Rules

Both the "Schedule Interview" and "Reschedule Interview" dialogs use the **same form** with conditional fields:

```
If interviewTypeId === 1 (Online):
  → Show "Meeting Link" text input (required)
  → Hide Country, Governate, Address Line

If interviewTypeId === 2 (InPerson):
  → Hide "Meeting Link"
  → Show Country combo box (required) — fetch from GET /api/Jobs/countries
  → Show Governate combo box (required) — fetch from GET /api/Jobs/governates/{countryId}
  → Show Address Line text input (required)

If interviewTypeId === 3 (Phone):
  → Hide Meeting Link, Country, Governate, Address Line
  → (Optional: show meeting link for phone number)
```

**Governate depends on Country:** When the user selects a country, fetch governates for that country via `GET /api/Jobs/governates/{countryId}`.

---

## 6. State Machine Diagram

### Application Status Flow

```
                ┌──────────────┐
                │ PendingReview│
                └──────┬───────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
       ┌────────┐ ┌────────┐ ┌───────────┐
       │Rejected│ │Withdrawn│ │Shortlisted│
       └────────┘ └────────┘ └─────┬─────┘
                                   │
                    ┌──────────────┼─────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌───────────┐  ┌──────────────┐
              │ Rejected │  │Interviewed│  │MissingIntrvw │
              └──────────┘  └─────┬─────┘  └──────────────┘
                                 │
                          ┌──────┼──────┐
                          ▼             ▼
                    ┌──────────┐  ┌────────┐
                    │ Rejected │  │ Hired  │
                    └──────────┘  └────────┘
```

### Interview Status Flow

```
    ┌───────────┐
    │ Scheduled │◄──────── (Reschedule resets to Scheduled)
    └─────┬─────┘
          │
    ┌─────┼──────────┐
    ▼     ▼          ▼
┌────────┐┌─────────┐┌──────────┐
│Cancelled││Confirmed││ Withdrawn│
└────────┘└────┬────┘└──────────┘
               │
         ┌─────┼──────┐
         ▼     ▼      ▼
   ┌────────┐┌─────────┐┌──────────────┐
   │Cancelled││Completed││MissingIntrvw │
   └────────┘└─────────┘└──────────────┘
```

---

## 7. Error Response Format

All errors follow this shape:

```json
{
  "statusCode": 400,
  "success": false,
  "data": null,
  "errors": [
    "Error message describing what went wrong."
  ]
}
```

### Common Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad Request — validation failed or invalid state transition |
| 401 | Unauthorized — not logged in or company profile not found |
| 404 | Not Found — resource doesn't exist or doesn't belong to this company |

---

## Quick Reference — All Endpoints

| # | Method | URL | Description |
|---|---|---|---|
| 1 | GET | `/api/Applications/company` | List applications (paginated, filterable) |
| 2 | GET | `/api/Applications/company/filters` | Get filter dropdown data |
| 3 | POST | `/api/Applications/{id}/reject` | Reject application |
| 4 | POST | `/api/Applications/{id}/hire` | Hire candidate |
| 5 | POST | `/api/Applications/{id}/schedule-interview` | Schedule interview |
| 6 | GET | `/api/Interviews/company` | List interviews (paginated, filterable) |
| 7 | GET | `/api/Interviews/company/filters` | Get filter dropdown data |
| 8 | POST | `/api/Interviews/{id}/cancel` | Cancel interview |
| 9 | POST | `/api/Interviews/{id}/reschedule` | Reschedule interview |
| 10 | POST | `/api/Interviews/{id}/complete` | Mark completed |
| 11 | POST | `/api/Interviews/{id}/missing` | Mark missing interview |
