# API Documentation: Company Applications Management

This document provides the necessary API details for integrating the **Company Applications** dashboard page.

## Authentication
- **Requirement**: User must be logged in as a `Company`.
- **Method**: The API expects a JWT token (typically stored in a secure HttpOnly cookie named `access_token` or provided in the `Authorization: Bearer` header).

---

## 1. Fetch Applications
Retrieves a paginated list of applications for the current company's jobs.

- **Endpoint**: `GET /api/Applications/applications`
- **Query Parameters**:
  - `SearchTerm` (string, optional): Filter by candidate name or email.
  - `JobId` (int, optional): Filter by a specific job.
  - `StatusId` (int, optional): Filter by application status ID.
  - `Page` (int, default: 1): Current page number.
  - `PageSize` (int, default: 10): Number of items per page.

### Response Structure (`PaginatedResult<CompanyApplicationDTO>`)
```json
{
  "items": [
    {
      "applicationId": 123,
      "candidateName": "John Doe",
      "candidateEmail": "john@example.com",
      "jobTitle": "Backend Developer",
      "applicationDate": "2024-05-11T10:00:00Z",
      "candidateDescription": "Computer Science Major",
      "resumeUrl": "https://...",
      "statusId": 1,
      "statusName": "PendingReview",
      "matchingPercentage": 85,
      "canShortlist": true,
      "canReject": true,
      "canHire": false
    }
  ],
  "totalCount": 50,
  "currentPage": 1,
  "pageSize": 10
}
```

---

## 2. Shortlist Candidate
Moves an application from `Pending Review` to `Shortlisted`.

- **Endpoint**: `POST /api/Applications/{applicationId}/shortlist`
- **Parameters**: `applicationId` (in URL)
- **Constraint**: Only available if `canShortlist` is `true`.

### Response
```json
{
  "statusCode": 200,
  "data": {
    "message": "Application shortlisted successfully."
  }
}
```

---

## 3. Reject Candidate
Rejects an application.

- **Endpoint**: `POST /api/Applications/{applicationId}/reject`
- **Parameters**: `applicationId` (in URL)
- **Constraint**: Only available if `canReject` is `true` (occurs at Review stage or after a Completed interview).

### Response
```json
{
  "statusCode": 200,
  "data": {
    "message": "Application rejected successfully."
  }
}
```

---

## 4. Hire Candidate
Moves an application to the final `Hired` state.

- **Endpoint**: `POST /api/Applications/{applicationId}/hire`
- **Parameters**: `applicationId` (in URL)
- **Constraint**: Only available if `canHire` is `true` (occurs when candidate is Shortlisted AND an interview is Completed).

### Response
```json
{
  "statusCode": 200,
  "data": {
    "message": "Candidate hired successfully."
  }
}
```

---

## Workflow Integration Logic
To correctly integrate the UI actions, follow the boolean flags provided in each application object:

1. **Shortlist Button**: Show/Enable if `canShortlist` is `true`.
2. **Reject Button**: Show/Enable if `canReject` is `true`.
3. **Hire Button**: Show/Enable if `canHire` is `true`.
4. **No Actions**: If all flags are `false` (e.g., status is `Shortlisted` but waiting for interview, or status is `Withdrawn`), do not show any action buttons.
