# EventHub Organizer API Documentation

This document outlines the API endpoints integrated with the **Organizer Dashboard** frontend. All endpoints are hosted on the Laravel backend API server.

---

## Base Configuration

- **Development API URL**: `http://127.0.0.1:8000/api`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <token>` (for protected endpoints)

---

## 1. Authentication Endpoints

### 1.1 Register Organizer
Registers a new user (with role `organizer` or `attendee`).

* **Endpoint**: `POST /register`
* **Authentication**: None
* **Request Body**:
```json
{
  "full_name": "Nguyen Van A",
  "email": "organizer@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "organizer"
}
```

* **Success Response (201 Created)**:
```json
{
  "message": "Register successfully",
  "token": "3|plainTextTokenString...",
  "user": {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "organizer@example.com",
    "role": "organizer",
    "created_at": "2026-05-17T10:00:00.000000Z",
    "updated_at": "2026-05-17T10:00:00.000000Z"
  }
}
```

---

### 1.2 Login
Authenticates the user and returns a Sanctum personal access token.

* **Endpoint**: `POST /login`
* **Authentication**: None
* **Request Body**:
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

* **Success Response (200 OK)**:
```json
{
  "data": {
    "id": 1,
    "name": "Admin Organizer",
    "email": "admin@gmail.com",
    "role": "organizer",
    "created_at": "2026-05-17T10:00:00.000000Z",
    "updated_at": "2026-05-17T10:00:00.000000Z"
  },
  "access_token": "4|plainTextTokenString...",
  "token_type": "Bearer"
}
```

---

### 1.3 Logout
Revokes the current authentication token.

* **Endpoint**: `POST /logout`
* **Authentication**: Required (`Bearer <token>`)
* **Success Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

---

## 2. Dashboard Endpoints

### 2.1 Get Dashboard Stats
Fetches total organizer statistics and categories with pre-counted events for the logged-in organizer.

* **Endpoint**: `GET /dashboard-stats`
* **Authentication**: Required (`Bearer <token>`)
* **Success Response (200 OK)**:
```json
{
  "stats": {
    "total_events": 2,
    "total_participants": 0,
    "active_events": 2
  },
  "categories": [
    {
      "id": 1,
      "name": "Music",
      "events_count": 1
    },
    {
      "id": 2,
      "name": "Sports",
      "events_count": 1
    }
  ]
}
```

---

## 3. Categories Management Endpoints

> [!NOTE]
> Creating, updating, and deleting categories are restricted actions that require an authenticated active token.

### 3.1 Get All Categories (Public)
Fetches a list of all existing event categories without organizer-specific counts.

* **Endpoint**: `GET /categories`
* **Authentication**: None
* **Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Music",
    "created_at": "2026-05-17T09:09:25.000000Z",
    "updated_at": "2026-05-17T09:09:25.000000Z"
  },
  {
    "id": 2,
    "name": "Sports",
    "created_at": "2026-05-17T09:09:25.000000Z",
    "updated_at": "2026-05-17T09:09:25.000000Z"
  }
]
```

---

### 3.2 Create Category
Creates a new event category.

* **Endpoint**: `POST /categories`
* **Authentication**: Required (`Bearer <token>`)
* **Request Body**:
```json
{
  "name": "Art & Theatre"
}
```

* **Success Response (201 Created)**:
```json
{
  "id": 3,
  "name": "Art & Theatre",
  "updated_at": "2026-05-17T10:15:00.000000Z",
  "created_at": "2026-05-17T10:15:00.000000Z"
}
```

---

### 3.3 Update Category
Updates an existing category's name.

* **Endpoint**: `PUT /categories/{id}`
* **Authentication**: Required (`Bearer <token>`)
* **Request Body**:
```json
{
  "name": "Art & Culture"
}
```

* **Success Response (200 OK)**:
```json
{
  "id": 3,
  "name": "Art & Culture",
  "created_at": "2026-05-17T10:15:00.000000Z",
  "updated_at": "2026-05-17T10:20:00.000000Z"
}
```

---

### 3.4 Delete Category
Deletes a category from the database.

* **Endpoint**: `DELETE /categories/{id}`
* **Authentication**: Required (`Bearer <token>`)
* **Success Response (200 OK)**:
```json
{
  "message": "Category deleted successfully"
}
```
