# API Documentation: Company Interviews Management

This document provides the necessary API details for integrating the **Company Interviews** dashboard page.

## Authentication
- **Requirement**: User must be logged in as a `Company`.
- **Method**: The API expects a JWT token (typically stored in a secure HttpOnly cookie named `access_token` or provided in the `Authorization: Bearer` header).

---

## 1. Fetch Interview Statistics
Retrieves counts for each interview status to populate the statistics cards.

- **Endpoint**: `GET /api/Interviews/statistics`
- **Response Structure (`InterviewStatisticsDTO`)**:
```json
{
  "scheduled": 10,
  "confirmed": 5,
  "completed": 8,
  "rescheduled": 2,
  "cancelled": 1,
  "noShow": 3,
  "missingInterview": 0
}
```

---

## 2. Fetch Interviews List
Retrieves a paginated list of interviews for the current company.

- **Endpoint**: `GET /api/Interviews`
- **Query Parameters**:
  - `SearchTerm` (string, optional): Filter by candidate name or job title.
  - `StatusId` (int, optional): Filter by interview status ID.
  - `Page` (int, default: 1): Current page number.
  - `PageSize` (int, default: 10): Number of items per page.

### Response Structure (`PaginatedResult<CompanyInterviewDTO>`)
```json
{
  "items": [
    {
      "interviewId": 45,
      "candidateName": "Ali Mohammed",
      "candidateEmail": "ali@example.com",
      "jobTitle": "Frontend Developer",
      "interviewDate": "2024-05-15T14:30:00Z",
      "interviewTypeName": "Online",
      "location": "Zoom Meeting Link",
      "statusId": 1,
      "statusName": "Scheduled",
      "canReschedule": true,
      "canCancel": true,
      "canComplete": false,
      "canMarkAsMissing": false
    }
  ],
  "totalCount": 29,
  "currentPage": 1,
  "pageSize": 10
}
```

---

## 3. Update Interview Status
Used for general status updates.

- **Endpoint**: `PATCH /api/Interviews/{id}/status`
- **Body**: `{ "statusId": int }`

---

## 4. Specific Action Endpoints

### A. Complete Interview
Marks the interview as completed and sets the application outcome (Hired/Rejected).
- **Endpoint**: `POST /api/Interviews/{id}/complete`
- **Body**: `{ "isHired": bool }`

### B. Cancel Interview
- **Endpoint**: `POST /api/Interviews/{id}/cancel`

### C. Mark as No Show / Missing
- **Endpoint**: `POST /api/Interviews/{id}/missing`

### D. Reschedule Interview
- **Endpoint**: `POST /api/Interviews/{id}/reschedule`
- **Body**: `{ "newDate": "ISO-8601-Date", "notes": "string" }`

---

## 5. Interview Scheduling Flow

### A. Get Shortlisted Candidates
Retrieves candidates who are ready to be interviewed (Status = Shortlisted).
- **Endpoint**: `GET /api/Interviews/shortlisted`
- **Query Parameters**: `SearchTerm`, `Page`, `PageSize`.
- **Response**: `PaginatedResult<CompanyApplicationDTO>`

### B. Schedule New Interview
- **Endpoint**: `POST /api/Interviews/schedule`
- **Body (`ScheduleInterviewDTO`)**:
```json
{
  "applicationId": 123,
  "interviewDate": "2024-05-20T10:00:00Z",
  "interviewTypeId": 1, 
  "notes": "Bring your laptop",
  "meetingLink": "https://zoom.us/j/...", 
  "addressLine1": "123 Tech Street",
  "countryId": 1,
  "governateId": 5
}
```

---

## Workflow Integration Logic

### 1. Interview Types
The logic depends on the `interviewTypeId`:
- **Online (ID: 1)**: 
  - `meetingLink` is **Required**.
  - `addressLine1`, `countryId`, and `governateId` are **Ignored**.
- **Physical (InPerson ID: 2, Phone ID: 3)**:
  - `addressLine1` is **Required**.
  - `meetingLink` is **Ignored**.
  - **Address Fallback**: If `countryId` or `governateId` are not provided, the API automatically uses the **Job's Location** (Country and Governate) and saves the new address for the interview.

### 2. Action Flags
Use the boolean flags to control button visibility:

1. **Reschedule Button**: Show if `canReschedule` is `true`.
2. **Cancel Button**: Show if `canCancel` is `true`.
3. **Complete Button**: Show if `canComplete` is `true` (available on or after the interview date).
4. **No Show Button**: Show if `canMarkAsMissing` is `true`.
