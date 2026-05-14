# Frontend Changes Required — Job Management Form (إضافة وظيفة جديدة)

> These changes are required on the **Add/Edit Job** form to align with the backend data model.

---

## 1. ❌ Remove: "مدة عرض الوظيفة بالأيام" (Duration in Days)

**Replace with**: A **date picker (calendar)** labeled **"تاريخ انتهاء الوظيفة"** (Job Expiration Date)
- Must only allow selecting **future dates**
- The selected date is sent directly as `expirationDate` (ISO 8601 format)
- No duration calculation needed — the backend stores the date as-is

---

## 2. ❌ Remove: "المتطلبات والمهارات" Textarea

**Replace with**: A **searchable multi-select combo box** labeled **"المتطلبات والمهارات"** (Requirements & Skills)

### Behavior:
1. The combo box fetches existing skills from: `GET /api/Job/skills?search={query}`
2. As the user types, it **searches** the existing skills and shows matching results
3. The user can **select multiple skills** from the results
4. If the typed skill **does not exist**, show an option like: `+ إضافة "{skillName}" كمهارة جديدة` (Add "{skillName}" as a new skill)
5. When "Add new skill" is selected, the backend will create it automatically during job creation
6. Send the selected skills as: `skillIds: [1, 5, 23]` for existing skills, and `newSkills: ["React Native", "Flutter"]` for new ones

### API:
```
GET /api/Job/skills?search=React
```
```json
[
  { "id": 1, "name": "React" },
  { "id": 2, "name": "React Native" }
]
```

---

## 3. ➕ Add: "تصنيف الوظيفة" (Job Category) — Combo Box

**Type**: Searchable dropdown (single select)

### Behavior:
1. Fetches all categories from: `GET /api/Job/categories`
2. User selects one category
3. Send as: `categoryId: 3`

### API:
```
GET /api/Job/categories
```
```json
[
  { "id": 1, "name": "تقنية المعلومات" },
  { "id": 2, "name": "التصميم" },
  { "id": 3, "name": "إدارة الأعمال" }
]
```

---

## 4. ➕ Add: "العملة" (Currency) — Searchable Combo Box

**Type**: Searchable dropdown (single select)
**Position**: Next to the salary fields

### Behavior:
1. Fetches all currencies from: `GET /api/Job/currencies`
2. User can type to search (e.g., "ريال" or "SAR")
3. Send as: `currencyId: 1`

### API:
```
GET /api/Job/currencies
```
```json
[
  { "id": 1, "code": "SAR", "name": "Saudi Riyal" },
  { "id": 2, "code": "USD", "name": "US Dollar" }
]
```

---

## 5. ➕ Add: "نوع مكان العمل" (Location Type) — Combo Box

**Type**: Dropdown (single select)

### Behavior:
1. Fetches from: `GET /api/Job/location-types`
2. User selects: حضوري (OnSite), عن بعد (Remote), هجين (Hybrid)
3. Send as: `jobLocationTypeId: 1`

### API:
```
GET /api/Job/location-types
```
```json
[
  { "id": 1, "name": "OnSite" },
  { "id": 2, "name": "Remote" },
  { "id": 3, "name": "Hybrid" }
]
```

---

## 6. ✏️ Change: "موقع العمل" (Work Location) → Country + Governate Combo Boxes

**Replace** the single text input with **two searchable combo boxes**:

### 6a. "الدولة" (Country)
- Fetches from: `GET /api/Job/countries`
- User can type to search
- Send as: `countryId: 1`

### 6b. "المحافظة / المنطقة" (Governate/Region)
- Fetches from: `GET /api/Job/governates/{countryId}` (loads after country is selected)
- User can type to search
- Send as: `governateId: 5`

### API:
```
GET /api/Job/countries
```
```json
[
  { "id": 1, "name": "المملكة العربية السعودية", "code": "SA" },
  { "id": 2, "name": "الإمارات العربية المتحدة", "code": "AE" }
]
```

```
GET /api/Job/governates/1
```
```json
[
  { "id": 1, "name": "الرياض" },
  { "id": 2, "name": "جدة" },
  { "id": 3, "name": "الدمام" }
]
```

---

## 7. ✏️ Change: "نوع الدوام" (Job Type) — Keep but use API

The current radio buttons (دوام كامل / دوام جزئي) should fetch values from the API instead of being hardcoded:

```
GET /api/Job/job-types
```
```json
[
  { "id": 1, "name": "FullTime" },
  { "id": 2, "name": "PartTime" }
]
```

---

## 8. ❌ Remove: "حذف" (Delete) Button

Remove the **delete button** (🗑) from the job table row actions. Jobs should only be deactivated (status → Closed), not deleted.

The remaining action buttons should be:
- **تعديل** (Edit)
- **إلغاء / تنشيط** (Deactivate / Activate)

---

## Updated Form Field Summary

| # | Field (AR) | Type | Sends | Source |
|---|------------|------|-------|--------|
| 1 | عنوان الوظيفة | Text input | `title` | User input |
| 2 | وصف الوظيفة | Textarea (500 chars) | `description` | User input |
| 3 | نوع الدوام | Radio/Dropdown | `jobTypeId` | `GET /api/Job/job-types` |
| 4 | تصنيف الوظيفة | Searchable combo | `categoryId` | `GET /api/Job/categories` |
| 5 | نوع مكان العمل | Dropdown | `jobLocationTypeId` | `GET /api/Job/location-types` |
| 6 | الدولة | Searchable combo | `countryId` | `GET /api/Job/countries` |
| 7 | المحافظة | Searchable combo | `governateId` | `GET /api/Job/governates/{countryId}` |
| 8 | العملة | Searchable combo | `currencyId` | `GET /api/Job/currencies` |
| 9 | الراتب من | Number input | `minSalary` | User input |
| 10 | الراتب إلى | Number input | `maxSalary` | User input |
| 11 | تاريخ انتهاء الوظيفة | Date picker (future only) | `expirationDate` | User input |
| 12 | المتطلبات والمهارات | Multi-select combo | `skillIds`, `newSkills` | `GET /api/Job/skills?search=` |
