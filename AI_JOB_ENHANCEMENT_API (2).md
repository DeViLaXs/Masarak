# AI Job Description Enhancement API Documentation (Updated)

This endpoint allows employers to use AI to professionally enhance and structure their job descriptions during the job creation process. The backend uses a refined **System + User messaging pattern** to ensure high-quality and structured output.

## Endpoint Details
- **URL:** `/api/Jobs/enhance-description`
- **Method:** `POST`
- **Authentication:** Required (Users must have the `Company` role)
- **Content-Type:** `application/json`

---

## Request Body
The request expects a JSON object containing the current job title and the draft description.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | The title of the job position. |
| `description` | `string` | Yes | The draft or rough description to be enhanced. |

### Example Request
```json
{
  "title": "Software Engineer",
  "description": "Looking for someone who knows C# and SQL. Good pay."
}
```

---

## Response
The API returns a standard `ApiResponse` where the `data` field contains the enhanced description as a string.

### Success Response (200 OK)
```json
{
  "statusCode": 200,
  "success": true,
  "data": "### About the Role\nWe are looking for a dedicated Software Engineer to join our team...\n\n### Responsibilities\n- Develop and maintain robust applications using C#...\n- Optimize database queries and schemas using SQL Server...\n\n### Requirements\n- Proficiency in C# and .NET framework...\n- Strong knowledge of SQL and relational databases...",
  "errors": []
}
```

### Error Responses
- **401 Unauthorized:** If the user is not logged in or doesn't have the `Company` role.
- **500 Internal Server Error:** If the AI service is unavailable, misconfigured, or returns an empty response.

---

## Integration Tips
1. **Response Handling:** If `statusCode` is 200, the `data` field will contain a string with structured text.
2. **Loading State:** AI generation can take 2-5 seconds. Ensure you show a loading spinner on the button.
3. **Multi-language Support:** The system automatically detects the input language. If you provide an Arabic title/description, the enhancement will be in Arabic.
4. **HTML/Markdown:** The response may contain markdown-style structure (e.g., section headers). You can render this directly or parse it as needed in your frontend editor.
