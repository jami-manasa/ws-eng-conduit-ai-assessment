# Implementation Plan

## Plan

### 1. Understand existing article flow
- Review the current article creation and editing flow in the backend (`backend/src/articles`) and frontend (`frontend/src/articles`).
- Identify how authorship is currently stored and enforced.
- Review existing APIs and DTOs for creating, updating, and fetching articles.

### 2. Extend the data model to support co-authors
- Introduce a many-to-many relationship between articles and users to represent co-authors.
- Add a join table (e.g., `article_co_authors`) via a database migration.
- Ensure the original author field remains unchanged and is still used for display on non-edit pages.

### 3. Backend changes for co-author support
- Update article create and update DTOs to accept a list of co-author user IDs.
- Update the article service and repository to:
  - Persist co-authors when creating or updating articles.
  - Fetch co-authors when reading articles.
  - Allow editing if the current user is either the original author or a co-author.
- Expose co-author information through article APIs for frontend consumption.

### 4. Implement article locking (ADVANCED)
- Add locking fields to the article model (e.g., `lockedByUserId`, `lockedAt`).
- When a user opens an article for editing:
  - Attempt to acquire a lock.
  - If the article is already locked by another user and the lock is not expired, return an error.
- Release the lock when:
  - The article is saved.
  - The user navigates away from the edit page.
  - The lock expires after 5 minutes of inactivity.
- Handle cases where a user loses the lock (e.g., network interruption) and return a clear error message.

### 5. Frontend changes – Create Article page
- Add a “Co-Authors” field implemented as a multi-select dropdown.
- Populate the dropdown with the list of all users fetched from the backend.
- Submit selected co-authors when creating an article.

### 6. Frontend changes – Edit Article page
- Display existing co-authors and allow updating them.
- On page load, call the backend to acquire the article lock.
- If the article is locked by another user, show an error message and prevent editing.
- Release the lock when the user saves or navigates away.

### 7. Acceptance testing and screenshots
- Manually execute the acceptance tests defined in the user story:
  - Creating an article with co-authors.
  - Editing the article as a co-author.
  - Verifying locking behavior with multiple users.
- Capture screenshots for each required test.
- Place screenshots directly in the `submission` folder.
## Co-Author Feature

- Articles support multiple co-authors
- Author and co-authors can edit articles
- Implemented using a many-to-many relationship
- Permissions enforced at service level

---

## Decisions

### Decision 1: Use a many-to-many relationship for co-authors
- Alternative: Store co-author emails as a comma-separated string on the article.
- Rationale: A relational approach supports validation, permissions, and the ADVANCED multi-select dropdown requirement, and integrates cleanly with existing user data.

### Decision 2: Implement locking in the backend
- Alternative: Handle locking only in the frontend.
- Rationale: Frontend-only locking is unreliable across sessions and devices. Backend locking ensures consistent enforcement and correctness.

### Decision 3: Use time-based lock expiration
- Alternative: Require explicit unlock only.
- Rationale: Time-based expiration handles crashes and lost connections without manual intervention and satisfies the 5-minute inactivity requirement.

---

## Notes

- No AWS or infrastructure changes are required; all locking and co-author logic is handled at the application and database level.
- The locking mechanism is designed so it can be extended later to support the optional “force unlock” story.
- All existing pages outside article creation and editing remain unchanged and continue to show only the original author.
