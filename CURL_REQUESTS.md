# API Endpoint cURL Requests

This document contains all cURL requests for testing the API endpoints. Replace `http://localhost:3000` with your actual server URL if different.

## Base URL

```
http://localhost:3000
```

---

## Health & Status Endpoints

### 1. Root Endpoint

```bash
curl -X GET http://localhost:3000/
```

### 2. Health Check

```bash
curl -X GET http://localhost:3000/health
```

### 3. API Status

```bash
curl -X GET http://localhost:3000/api
```

---

## Authentication Endpoints

### 4. Sign Up (Register New User)

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\",
    \"password\": \"password123\",
    \"role\": \"user\"
  }"
```

**Response (201):**

```json
{
    "message": "User registered",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
    }
}
```

### 5. Sign Up (Admin User)

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Admin User\",
    \"email\": \"admin@example.com\",
    \"password\": \"admin123\",
    \"role\": \"admin\"
  }"
```

### 6. Sign In (Login)

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{
    \"email\": \"john.doe@example.com\",
    \"password\": \"password123\"
  }"
```

**Note:** The `-c cookies.txt` flag saves cookies (including the JWT token) to a file for use in subsequent requests.

**Response (200):**

```json
{
    "message": "User signed in successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
    }
}
```

### 7. Sign In (Admin)

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{
    \"email\": \"admin@example.com\",
    \"password\": \"admin123\"
  }"
```

### 8. Sign Out (Logout)

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt
```

**Response (200):**

```json
{
    "message": "User signed out successfully"
}
```

---

## User Management Endpoints

**Note:** All user endpoints require authentication. Make sure to sign in first and use the `-b cookies.txt` flag to send the authentication cookie.

### 9. Get All Users (Admin Only)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Response (200):**

```json
{
    "message": "Successfully retrieved users",
    "users": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "user",
            "created_at": "2025-10-05T10:00:00.000Z",
            "updated_at": "2025-10-05T10:00:00.000Z"
        }
    ],
    "count": 1
}
```

### 10. Get User by ID (Authenticated Users)

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Replace `1` with the actual user ID.**

**Response (200):**

```json
{
    "message": "User retrieved successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user",
        "created_at": "2025-10-05T10:00:00.000Z",
        "updated_at": "2025-10-05T10:00:00.000Z"
    }
}
```

### 11. Update User by ID (Own Profile)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"name\": \"John Updated\",
    \"email\": \"john.updated@example.com\"
  }"
```

**Note:** Users can only update their own profile. Admins can update any user.

**Response (200):**

```json
{
    "message": "User updated successfully",
    "user": {
        "id": 1,
        "name": "John Updated",
        "email": "john.updated@example.com",
        "role": "user",
        "created_at": "2025-10-05T10:00:00.000Z",
        "updated_at": "2025-10-05T10:30:00.000Z"
    }
}
```

### 13. Update User Role (Admin Only)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"role\": \"admin\"
  }"
```

**Note:** Only admin users can change roles.

### 14. Delete User by ID (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Response (200):**

```json
{
    "message": "User deleted successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
    }
}
```

---

## Alternative: Using Authorization Header

If you prefer using the JWT token in the Authorization header instead of cookies:

### 1. Sign in and extract token

```bash
# Sign in and save response
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{
    \"email\": \"john.doe@example.com\",
    \"password\": \"password123\"
  }"

# Extract token from cookies.txt manually or use it directly
```

### 2. Use token in requests (if your middleware supports Bearer tokens)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Note:** Check your `auth.middleware.ts` to see if it supports Bearer tokens. If not, you must use cookies.

---

## Common Error Responses

### 400 - Bad Request (Validation Error)

```json
{
    "error": "Validation failed",
    "details": "name: String must contain at least 2 character(s)"
}
```

### 401 - Unauthorized

```json
{
    "error": "Invalid credentials"
}
```

### 403 - Forbidden

```json
{
    "error": "Access denied",
    "message": "You can only update your own information"
}
```

### 404 - Not Found

```json
{
    "error": "User not found"
}
```

### 409 - Conflict

```json
{
    "error": "Email already exist"
}
```

### 500 - Internal Server Error

```json
{
    "error": "Database error, please try again later"
}
```

---

## Testing Workflow

### Complete Testing Sequence

1. **Create a regular user:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\",\"role\":\"user\"}"
```

2. **Create an admin user:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

3. **Sign in as regular user:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

4. **Get own user profile:**

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -b cookies.txt
```

5. **Update own profile:**

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"name\":\"Updated User\"}"
```

6. **Try to get all users (should fail for regular user):**

```bash
curl -X GET http://localhost:3000/api/users \
  -b cookies.txt
```

7. **Sign out:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt
```

8. **Sign in as admin:**

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

9. **Get all users (should succeed for admin):**

```bash
curl -X GET http://localhost:3000/api/users \
  -b cookies.txt
```

10. **Delete a user (admin only):**

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -b cookies.txt
```

---

## Tips

1. **Save cookies:** Use `-c cookies.txt` when signing in to save authentication cookies
2. **Use cookies:** Use `-b cookies.txt` in subsequent requests to send authentication
3. **Pretty print JSON:** Pipe output to `jq` for formatted JSON (if installed):
    ```bash
    curl ... | jq .
    ```
4. **Verbose output:** Add `-v` flag to see detailed request/response headers
5. **Silent mode:** Add `-s` flag to hide progress bar
6. **Follow redirects:** Add `-L` flag if needed

---

## PowerShell Alternative Commands

If you're using PowerShell, you can use `Invoke-RestMethod` instead:

### Sign Up

```powershell
$body = @{
    name = "John Doe"
    email = "john.doe@example.com"
    password = "password123"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/sign-up" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Sign In

```powershell
$body = @{
    email = "john.doe@example.com"
    password = "password123"
} | ConvertTo-Json

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/sign-in" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -SessionVariable session

# Use $session in subsequent requests
```

### Get Users (with session)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" `
  -Method Get `
  -WebSession $session
```
