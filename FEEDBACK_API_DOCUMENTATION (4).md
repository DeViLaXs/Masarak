# Feedback API Documentation

This document describes the endpoints for managing user feedback (Feature Requests and Complaints).

## Base URL
- `/api/Feedbacks`

---

## 1. Submit Feedback
Allows users to send feedback to the backend.

- **URL:** `/api/Feedbacks`
- **Method:** `POST`
- **Authentication:** Required (Any logged-in user)
- **Content-Type:** `application/json`

### Request Body (SubmitFeedbackDTO)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `feedbackType` | `integer` | Yes | 1 = FeatureRequest, 2 = Complaint |
| `message` | `string` | Yes | Feedback message (Min 10, Max 300 chars) |

### Example Request
```json
{
  "feedbackType": 1,
  "message": "I would love to see a dark mode feature!"
}
```

---

## 2. Get All Feedbacks
Retrieves a paginated list of all submitted feedbacks with optional filtering.

- **URL:** `/api/Feedbacks`
- **Method:** `GET`
- **Authentication:** Required (Admin Role)
- **Query Parameters:**
  - `feedbackTypeId` (optional): Filter by type (e.g., `?feedbackTypeId=1`)
  - `pageNumber` (optional): Defaults to `1`
  - `pageSize` (optional): Defaults to `10`

### Success Response (200 OK)
Returns a `PaginatedResult` containing `FeedbackResponseDTO` items.
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "reviewerName": "John Doe",
        "reviewerEmail": "john.doe@example.com",
        "logoUrl": "https://secure-sas-url.com/logo.png",
        "feedbackTypeName": "FeatureRequest",
        "message": "I would love to see a dark mode feature!",
        "isRead": false,
        "createdAt": "2024-05-03T19:25:00Z"
      }
    ],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1
  },
  "errors": []
}
```

---

## 3. Get Feedback Types
Retrieves the list of available feedback types (for dropdowns/filters).

- **URL:** `/api/Feedbacks/types`
- **Method:** `GET`
- **Authentication:** Required (Authorized user)

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    { "id": 1, "name": "FeatureRequest" },
    { "id": 2, "name": "Complaint" }
  ],
  "errors": []
}
```

---

## 4. Mark Feedback as Read
Updates the `IsRead` status of a feedback to `true`.

- **URL:** `/api/Feedbacks/{id}/read`
- **Method:** `PATCH`
- **Authentication:** Required (Admin Role)

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Feedback marked as read."
  },
  "errors": []
}
```

---

## 5. Delete Feedback
Permanently removes a feedback entry.

- **URL:** `/api/Feedbacks/{id}`
- **Method:** `DELETE`
- **Authentication:** Required (Admin Role)

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Feedback deleted successfully."
  },
  "errors": []
}
```

---

## Integration Notes
- **Logo URL:** The `logoUrl` field returns a secure, temporary SAS URL for the company logo (or profile photo).
- **Pagination:** The list of feedbacks is paginated.
- **Admin Access:** Management endpoints are restricted to the **Admin** role.
- **Filtering:** Use `feedbackTypeId` in the query string to filter results.
