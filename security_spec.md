# Security Specification - Nexus CRM

## 1. Data Invariants
- A Lead must be associated with a valid User ID (`userId`).
- A User profile can only be accessed/modified by the User themselves (`uid == auth.uid`).
- Lead access is confined to the User who created the lead.

## 2. The "Dirty Dozen" Payloads (Examples of unauthorized access)
1. Creating a lead with a different `userId` than `auth.uid`.
2. Creating a user profile for a different UID.
3. Accessing a lead created by another user.
4. Updating another user's lead.
5. Deleting another user's lead.
6. Injecting a 1.5KB string as Lead ID.
7. Injecting special characters as Lead ID.
8. Updating a lead's status to an invalid enum.
9. Updating a lead's `userId`.
10. Creating a lead without `name`.
11. Reading another user's profile.
12. Updating another user's profile.

## 3. Test Runner
We will use firestore-rules-test to verify these.
