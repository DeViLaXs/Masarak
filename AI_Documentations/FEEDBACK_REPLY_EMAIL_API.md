# Feedback Reply Email API Documentation (Updated)

This endpoint allows administrators to send email replies to users. The subject is now handled automatically by the backend.

## Endpoint Details
- **URL:** `/api/Feedbacks/send-reply`
- **Method:** `POST`
- **Authentication:** Required (Users must have the `Admin` role)
- **Content-Type:** `application/json`

---

## Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | Yes | The recipient's email address. |
| `message` | `string` | Yes | The body of the email message. |

### Example Request
```json
{
  "email": "user@example.com",
  "message": "Hello, thank you for your suggestion. We have added it to our roadmap."
}
```

---

## Response
Standard `ApiResponse` with a `ConfirmationResponseDTO`.

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "message": "Email sent successfully."
  },
  "errors": []
}
```

---

## Technical Details
- **Subject:** The backend automatically uses the subject line: `"Response to your Feedback - GoWork"`.
