# Testing Guide - Create/Edit Admin User Feature

## 🧪 Pre-Testing Checklist

- [ ] Application builds without errors
- [ ] No console errors on startup
- [ ] Admin user listing page loads
- [ ] Global loader component is visible in page (even if hidden)

---

## 📋 Test Cases

### TEST 1: Dialog Opening - Create New User

**Steps:**
1. Navigate to Admin Users page
2. Click the "New" button (top left)

**Expected:**
- ✅ Dialog opens with title "Create Admin User"
- ✅ Dialog is centered on screen
- ✅ All form fields are empty
- ✅ Username, Email, Mobile, Type fields visible
- ✅ Password and Confirm Password fields visible
- ✅ Cancel and Save buttons are enabled
- ✅ Dialog has responsive width (50rem on desktop)

**Result:** ☐ Pass ☐ Fail

---

### TEST 2: Dialog Opening - Edit Existing User

**Steps:**
1. Navigate to Admin Users page
2. Click the edit icon (pencil) on any user row

**Expected:**
- ✅ Dialog opens with title "Edit Admin User"
- ✅ Username field is pre-filled and READ-ONLY
- ✅ Email field is pre-filled and editable
- ✅ Mobile field is pre-filled and editable
- ✅ Type field is pre-filled and editable
- ✅ Password and Confirm Password fields are HIDDEN
- ✅ Cancel and Save buttons are enabled

**Result:** ☐ Pass ☐ Fail

---

### TEST 3: Form Validation - Required Fields

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Leave all fields empty
3. Click "Save"

**Expected:**
- ✅ Error message appears: "Username and Email are required"
- ✅ Dialog stays open
- ✅ Loader does NOT show
- ✅ No API call is made

**Result:** ☐ Pass ☐ Fail

---

### TEST 4: Form Validation - Email Format

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Enter username: `testuser`
3. Enter email: `invalid-email` (without @)
4. Click "Save"

**Expected:**
- ✅ Validation error related to email format OR
- ✅ Backend validation returns error
- ✅ Error message displays
- ✅ Dialog stays open

**Result:** ☐ Pass ☐ Fail

---

### TEST 5: Password Validation - Length

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Fill required fields:
   - Username: `testuser`
   - Email: `test@example.com`
3. Enter password: `Abc123!` (only 7 chars)
4. Enter confirm password: `Abc123!`
5. Click "Save"

**Expected:**
- ✅ Error message appears mentioning password requirements
- ✅ Error states: "at least 8 chars..."
- ✅ Dialog stays open
- ✅ No API call

**Result:** ☐ Pass ☐ Fail

---

### TEST 6: Password Validation - Complexity

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Fill required fields:
   - Username: `testuser`
   - Email: `test@example.com`
3. Try passwords:
   - `abcdefgh` (no uppercase/number/special) → Should FAIL
   - `ABCDEFGH` (no lowercase/number/special) → Should FAIL
   - `Abcdefgh` (no number/special) → Should FAIL
   - `Abc12345` (no special) → Should FAIL
   - `Abc12345!` (all requirements) → Should PASS

**Expected:**
- ✅ Invalid passwords show error
- ✅ Valid password allows proceed
- ✅ Helper text visible: "Must be at least 8 characters..."

**Result:** ☐ Pass ☐ Fail

---

### TEST 7: Password Confirmation Match

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Fill all required fields
3. Enter password: `TestPass123!`
4. Enter confirm password: `TestPass999!` (different)
5. Press Tab or Spacebar (triggers keyup)

**Expected:**
- ✅ Error appears immediately: "Passwords do not match."
- ✅ Error disappears when they match

**Result:** ☐ Pass ☐ Fail

---

### TEST 8: Successful User Creation

**Steps:**
1. Open "Create Admin User" dialog
2. Fill form:
   - Username: `newuser1`
   - Email: `newuser1@test.com`
   - Mobile: `123-456-7890`
   - Type: `Admin`
   - Password: `SecurePass123!`
   - Confirm: `SecurePass123!`
3. Click "Save"

**Expected:**
- ✅ Loader appears with message "Saving user..."
- ✅ Spinner rotates
- ✅ Overlay darkens
- ✅ Buttons are disabled
- ✅ Save button shows loading indicator
- ✅ After 1-3 seconds, success message appears
- ✅ Loader disappears
- ✅ Dialog closes
- ✅ New user appears in table
- ✅ Success toast/notification shows: "User created successfully"

**Result:** ☐ Pass ☐ Fail

---

### TEST 9: Successful User Edit

**Steps:**
1. Click edit on any user
2. Modify:
   - Email: Change to new email
   - Mobile: Change to new mobile
3. Click "Save"

**Expected:**
- ✅ Loader appears with message "Updating user..."
- ✅ Spinner rotates
- ✅ Buttons disabled during update
- ✅ After success, loader disappears
- ✅ Dialog closes
- ✅ Table updates with new data
- ✅ Success message: "User updated successfully"

**Result:** ☐ Pass ☐ Fail

---

### TEST 10: Error Handling - API Failure

**Steps:**
1. (Simulate API failure by disconnecting from network OR)
2. Create/edit user (network should fail)

**Expected:**
- ✅ Loader appears during request
- ✅ Loader disappears on error
- ✅ Error message displays
- ✅ Dialog stays open
- ✅ User can retry
- ✅ Form data is preserved

**Result:** ☐ Pass ☐ Fail

---

### TEST 11: Cancel Button Functionality

**Steps (Create Mode):**
1. Open "Create Admin User" dialog
2. Fill some fields
3. Click "Cancel"

**Expected:**
- ✅ Dialog closes immediately
- ✅ Form data is cleared/discarded
- ✅ Return to listing page
- ✅ No data saved

**Result:** ☐ Pass ☐ Fail

---

### TEST 12: Username Read-Only in Edit Mode

**Steps:**
1. Open edit dialog for any user
2. Try to click in username field
3. Try to type or paste text

**Expected:**
- ✅ Username field is READ-ONLY
- ✅ Cannot click to edit
- ✅ Cannot change username
- ✅ Cannot paste in field
- ✅ Visual indication (grayed out)

**Result:** ☐ Pass ☐ Fail

---

### TEST 13: Date Pipe Working in Table

**Steps:**
1. View Admin Users table
2. Look at "Created" column

**Expected:**
- ✅ Dates display in format: `dd-MMM-yyyy` (e.g., "01-Nov-2024")
- ✅ No errors in console about date pipe
- ✅ No "[date pipe missing]" error messages

**Result:** ☐ Pass ☐ Fail

---

### TEST 14: Responsive Design - Tablet

**Steps:**
1. Open browser developer tools
2. Set viewport to tablet size (768px width)
3. Open create/edit dialog

**Expected:**
- ✅ Dialog width becomes 75vw
- ✅ Dialog remains readable
- ✅ Form fields stack properly
- ✅ Buttons visible and clickable

**Result:** ☐ Pass ☐ Fail

---

### TEST 15: Responsive Design - Mobile

**Steps:**
1. Set viewport to mobile size (375px width)
2. Open create/edit dialog

**Expected:**
- ✅ Dialog width becomes 90vw
- ✅ Dialog fits screen
- ✅ No horizontal scrolling
- ✅ Form fields readable
- ✅ Buttons clickable
- ✅ Loader visible

**Result:** ☐ Pass ☐ Fail

---

### TEST 16: Modal Backdrop Click

**Steps:**
1. Open create/edit dialog
2. Click on the dark overlay/backdrop

**Expected:**
- ✅ Dialog closes (if modal closes on backdrop click)
- ✅ OR Dialog stays open (if configured to not close)
- ✅ Behavior consistent with requirements

**Result:** ☐ Pass ☐ Fail

---

### TEST 17: Escape Key to Close

**Steps:**
1. Open create/edit dialog
2. Press Escape key

**Expected:**
- ✅ Dialog closes
- ✅ Returns to listing page
- ✅ Data not saved

**Result:** ☐ Pass ☐ Fail

---

### TEST 18: Global Loader Service Integration

**Steps:**
1. Open create/edit dialog
2. Fill form and click Save
3. Watch for loader appearance

**Expected:**
- ✅ Loader service message shows: "Saving user..." or "Updating user..."
- ✅ Loader type is "saving" (blue border)
- ✅ Spinner visible in center of screen
- ✅ Dark overlay with blur applied
- ✅ z-index is high enough (loader on top)

**Result:** ☐ Pass ☐ Fail

---

### TEST 19: Multiple Rapid Submissions

**Steps:**
1. Open create dialog
2. Fill form completely
3. Click "Save" multiple times rapidly

**Expected:**
- ✅ Only one request sent
- ✅ Button disabled after first click
- ✅ No duplicate entries created
- ✅ Loader shows only once

**Result:** ☐ Pass ☐ Fail

---

### TEST 20: Edit After Create

**Steps:**
1. Create new user successfully
2. Find new user in table
3. Click edit on newly created user
4. Modify one field
5. Save

**Expected:**
- ✅ New user appears in table
- ✅ Edit dialog opens with new user data
- ✅ Can modify successfully
- ✅ Edit saves correctly
- ✅ Table updates

**Result:** ☐ Pass ☐ Fail

---

## 🐛 Bug Reporting Template

If you find an issue, please report:

```
TITLE: [Brief description]

STEPS TO REPRODUCE:
1. ...
2. ...
3. ...

EXPECTED BEHAVIOR:
- ...

ACTUAL BEHAVIOR:
- ...

BROWSER: [Chrome/Firefox/Safari] Version: [X.X]

SCREENSHOTS:
[Attach if possible]

CONSOLE ERRORS:
[Copy any console errors]

SEVERITY: [Critical/High/Medium/Low]
```

---

## ✅ Sign-Off Checklist

After completing all tests:

- [ ] All 20 tests passed
- [ ] No console errors
- [ ] No network errors
- [ ] Responsive on all devices
- [ ] Error handling works
- [ ] Loader displays correctly
- [ ] Form validation works
- [ ] Date pipe working
- [ ] User can create/edit/cancel
- [ ] Data persists correctly
- [ ] Feature ready for production

---

## 📊 Test Results Summary

```
Total Tests: 20
Passed: __/20
Failed: __/20
Skipped: __/20

Date Tested: ________________
Tested By: __________________
Browser: ____________________
Device: _____________________

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Performance Testing

### Load Time Test
- [ ] Dialog opens within 500ms
- [ ] Form renders smoothly
- [ ] No jank or stuttering

### API Response Test
- [ ] Create request completes in < 3 seconds
- [ ] Edit request completes in < 3 seconds
- [ ] Error responses handled quickly

### Memory Test
- [ ] Create/edit dialog multiple times
- [ ] Close and reopen
- [ ] Check for memory leaks in DevTools

---

## 🎯 Final Verification

Before marking as complete:

```
✅ All tests passing
✅ No console errors
✅ No network errors
✅ Responsive design working
✅ Loader integration working
✅ Form validation working
✅ API communication working
✅ Error handling working
✅ UI/UX smooth
✅ Ready for production deployment
```

**Feature Status: READY FOR PRODUCTION** ✨
