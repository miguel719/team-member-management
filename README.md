# Team Member Management

This project implements a team member management application using Django (backend) and React (frontend), with support for user roles, authentication, and member profile management.

## Features

- Token-based authentication (JWT)
- Role-based access control (`admin` and `regular`)
- List, add, update, and delete team members
- Basic user profile (name, email, phone)
- Auth-protected frontend and backend routes
- Seeder for initial users (admin + regular)
- Docker-based local development
- Pytest coverage for backend endpoints

## Tech Stack

- **Backend:** Django 5 + Django REST Framework
- **Frontend:** React (Vite)
- **Database:** PostgreSQL
- **Auth:** JWT via SimpleJWT
- **Testing:** Pytest (backend), Jest + React Testing Library (frontend)
- **Containerization:** Docker

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the App

```bash
docker-compose up --build
```

Frontend available at `http://localhost:3000`

## Seeded Users

These users are automatically created by the seeder:

**Admin User**
- Email: `admin@example.com`
- Password: `adminpass`

**Regular User**
- Email: `user1@example.com`
- Password: `userpass`

## API Endpoints

### Authentication

- `POST /members/login/` – Login with credentials
- `POST /members/signup/` – Create a new user with optional profile info

### Members

- `GET /members/` – List all users (admin only)
- `GET /members/me/` – Get current authenticated user data
- `POST /members/` – Create a new member (admin can create admins)
- `PATCH /members/{id}/` – Update profile and/or role
- `DELETE /members/{id}/` – Delete member (admin only)

## Database Models

### User

- Inherits from Django’s default user model
- Adds `role` field (`admin`, `regular`)

### Profile

- One-to-one linked to `User`
- Fields: `first_name`, `last_name`, `email`, `phone`

## Running Tests

```bash
docker-compose exec backend pytest
```

## Backend Test Coverage

### 1. Signup

1. Create user with valid email and password  
2. Reject creation if email or password is missing  
3. Reject creation if email already exists  

### 2. Login

4. Log in with valid credentials  
5. Reject login with incorrect credentials  

### 3. Current Profile (/me)

6. Return data of authenticated user  
7. Reject if unauthenticated  

### 4. Member Listing

8. Authenticated user gets list of members  
9. Reject if unauthenticated  

### 5. Member Creation

10. Admin creates regular user  
11. Admin creates another admin  
12. Regular user cannot create admin  

### 6. Member Deletion

13. Admin can delete a user  
14. Regular user cannot delete a user  

### 7. Member Editing

15. Admin can update user profile  
16. Admin can change a user's role  
17. Regular user cannot assign admin role  

### 8. Member Detail (/members/{id}/)

18. Fetch a single member by ID  
19. Reject if unauthenticated  

## Frontend Test Coverage

### 1. Login Page

- Shows error if credentials are invalid  
- Redirects to list on successful login

### 2. Signup Page

- Shows error if passwords do not match  
- Calls API and navigates on successful signup  
- Displays error if API call fails

### 3. Member List Page

- Fetches and displays members from API  
- Displays logged-in user email  
- Navigates to add and edit pages  
- Handles empty list gracefully

### 4. Member Form Page

- Shows empty form in add mode  
- Loads member data in edit mode  
- Submits data to correct API endpoint  
- Shows delete button only for admin users  
- Navigates back to list on save or cancel

### Running Frontend Tests

Tests are executed inside the frontend container. Run them with:

```bash
docker-compose exec frontend npm test
```

## Future Improvements

- Pagination and filtering for members
- Member search bar
- Password recovery and reset flow
- Profile image upload

## Development Time Log

- 20 min – Requirement analysis and planning  
- 25 min – Backend setup with Django + Docker  
- 25 min – Frontend setup (Vite + React)  
- 35 min – JWT authentication and login  
- 20 min – Role system and profile model  
- 30 min – Member CRUD endpoints  
- 50 min – Frontend layout and login  
- 15 min – Signup flow  
- 25 min – `/me` route and frontend guard  
- 15 min – Member list and UI  
- 40 min – Form page and backend refactor  
- 15 min – Seeder with initial users  
- 50 min – Backend test coverage with Pytest
- 35 min - Front end basic test coverage with Jest 
