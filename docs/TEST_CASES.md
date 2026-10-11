# CivicConnect — Test Cases

## 1. Functional Testing

| ID | Test Case | Expected Result | Status |
|---|---|---|---|
| TC-01 | User registration | Account created with valid details | Tested |
| TC-02 | User login | Valid credentials authenticate the user | Tested |
| TC-03 | Complaint submission | Complaint saved with photo and location | Tested |
| TC-04 | Duplicate detection | Nearby duplicate complaints identified | Tested |
| TC-05 | Complaint cancellation | Eligible complaint cancelled | Tested |
| TC-06 | Complaint resolution | After-photo required for resolution | Tested |
| TC-07 | Complaint rating | Eligible reporter can submit a rating | Tested |
| TC-08 | Public issues map | Markers open complaint details | Tested |

## 2. Security Testing

| ID | Test Case | Expected Result | Status |
|---|---|---|---|
| ST-01 | Unauthenticated admin access | Protected operations rejected | Tested |
| ST-02 | Citizen attempts admin action | Unauthorized action rejected | Tested |
| ST-03 | Unsupported file upload | Upload rejected | Tested |
| ST-04 | Oversized image upload | Upload rejected | Tested |
| ST-05 | Invalid request data | Invalid input handled safely | Tested |
| ST-06 | Repeated login attempts | Configured rate limits enforced | Not Tested |

## 3. Test Environment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Testing approach: Manual functional and security testing

## 4. Status Definitions

- **Tested:** Test executed and expected behavior observed.
- **Failed:** Test executed and actual behavior did not match expectations.
- **Not Tested:** Test has not been executed or its result has not been verified.

