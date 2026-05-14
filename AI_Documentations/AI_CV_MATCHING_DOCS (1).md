# AI CV Matching Integration Documentation

This document describes the changes related to the new AI-powered CV matching feature added to the GoWork platform.

## 1. Overview
When a candidate applies for a job, the backend now automatically calculates a "Matching Percentage" using OpenAI (GPT-4o-mini). This score represents how well the candidate's skills and major align with the job description and requirements.

## 2. DTO Changes
The `CompanyApplicationDTO` has been updated to include a new field:

- **Field**: `matchingPercentage`
- **Type**: `int?` (Nullable Integer)
- **Range**: `0` to `100` (Note: In case of system error, it may return `500` as a placeholder).

### Updated DTO Structure:
```json
{
  "applicationId": 0,
  "candidateName": "string",
  "candidateEmail": "string",
  "jobTitle": "string",
  "applicationDate": "2024-05-10T...",
  "statusId": 0,
  "statusName": "string",
  "canAction": true,
  "matchingPercentage": 85 // <--- New Field
}
```

## 3. Affected Endpoints
The `matchingPercentage` field is now included in the response of the following endpoints:

1.  **List Applications (Screening Page)**:
    - `GET /api/Applications/applications`
2.  **List Shortlisted Candidates (Interviews Page)**:
    - `GET /api/Interviews/shortlisted`

## 4. Implementation Details
- **Trigger**: The calculation is performed synchronously during the `POST /api/Jobs/apply/{jobId}` (Apply to Job) request.
- **Storage**: The result is stored permanently in the `Applications` table.
- **Display**: The percentage should be displayed in the company's application list to help them prioritize candidates.

## 5. UI Recommendations
- Display the percentage prominently (e.g., in a badge or a progress bar).
- Use color coding (e.g., Green for >80%, Yellow for 50-80%, Red for <50%).
