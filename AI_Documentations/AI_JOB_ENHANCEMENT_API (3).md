# AI Job Description Enhancement API Documentation (Structured DTO)

This endpoint allows employers to use AI to professionally enhance and structure their job descriptions. The API now returns a structured JSON object for better integration.

## Endpoint Details
- **URL:** `/api/Jobs/enhance-description`
- **Method:** `POST`
- **Authentication:** Required (Users must have the `Company` role)
- **Content-Type:** `application/json`

---

## Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | The title of the job position. |
| `description` | `string` | Yes | The draft or rough description to be enhanced. |

---

## Response
The API returns a standard `ApiResponse` where the `data` field contains a structured object.

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "enhanced_description": "### About the Role\nWe are looking for a dedicated Software Engineer...\n\n### Responsibilities\n- Develop applications using C#...\n\n### Requirements\n- Proficiency in .NET framework..."
  },
  "errors": []
}
```

### Error Responses
- **401 Unauthorized:** Missing or invalid `Company` role.
- **500 Internal Server Error:** AI service failure or invalid output.

---

## Technical Details
- **Response Format:** The backend explicitly requests a JSON object from the AI model (using `ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat()`).
- **DTOs Used:** 
  - Request: `EnhanceJobDescriptionDTO`
  - Response Data: `JobDescriptionEnhancementResultDTO`
