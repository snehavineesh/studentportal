# Security Implementations for Student Dashboard

This document details the security measures and best practices implemented in the Student Dashboard application, satisfying the requirements for input validation, sanitization, authentication, and data protection.

## 1. Authentication & Identity
- **Provider**: Firebase Authentication (Email/Password) is used for secure user registration and login.
- **Password Hashing**: Passwords are never stored in plain text. Firebase automatically handles salting and hashing of passwords using scrypt on their secure servers.
- **Session Management**: Firebase handles session tokens (JWT) and automatically refreshes them, preventing session hijacking.
- **Role-Based Access Control (RBAC)**: User roles (`student` or `admin`) are stored securely in a Firestore `users` collection. A custom `ProtectedRoute` React component prevents unauthorized access to the Admin Dashboard.

## 2. Input Validation & Form Security
- **Frontend Validation**: The `zod` library is used to enforce strict schema validation before data is submitted.
  - Emails must match a valid regex pattern.
  - Passwords must be at least 8 characters and include uppercase letters, numbers, and special characters.
  - Empty fields are rejected.
- **Password Strength Meter**: A visual strength indicator is provided on the registration form to encourage strong passwords.

## 3. Cross-Site Scripting (XSS) Prevention
- **Sanitization**: The `dompurify` library is used to sanitize user inputs (e.g., Full Name, Email) during registration and when displaying data. This strips out any potentially malicious `<script>` tags or inline event handlers before they reach the database or DOM.
- **React Escaping**: React inherently escapes text rendered using JSX braces (`{}`), providing an additional layer of XSS protection.

## 4. Database Security (Firestore Rules)
Unauthorized access to Firestore is prevented using Firebase Security Rules. Only authenticated users can read or write data according to their role.

*(Note: The following rules should be deployed to the Firebase console)*
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is an admin
    function isAdmin() {
      return isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      // Users can read their own profile, admins can read all
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      // Users can only be created upon registration, admins can update
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update, delete: if isAdmin();
    }
  }
}
```

## 5. Network Security
- **HTTPS Enforcement**: All communication between the client and Firebase Authentication/Firestore happens automatically over HTTPS, encrypting data in transit and preventing Man-In-The-Middle (MITM) attacks.
- **CSRF Protection**: Firebase handles Cross-Site Request Forgery (CSRF) protection inherently through its secure token-based architecture.

## Summary
By combining strict input validation (`zod`), output sanitization (`dompurify`), robust authentication (Firebase), and strict database rules, this application ensures the confidentiality, integrity, and availability of student and admin data.
