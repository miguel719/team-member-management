# team-member-management
Implement a team member managemente application on Djando and React


# Requierements
- 3 User Screen to list, add and edit members
- Login screen to authenticate
- Include auth and roles system with admin and regular user roles
- We will add a seeder to implement initial admin users and regular users
- The project will be build on docker container to run locally
- Include basic testing flow

## Technologies

- Backend: Django + Django REST Framework
- Frontend: React (Vite)
- Database: PostgreSQL
- Auth: Token-based (e.g., JWT)
- Docker: Local development containers
- Testing: Pytest (backend), Jest + React Testing Library (frontend)

# Starting Project

## Instructions implementing

## Users created with seeders
- On the start project some members are created on the seeder, the admin membre credentials
    - admin@example.com
    - adminspass
- For regular users you can use this:
    - user1@example.com
    - userpass

# Testing
- Run on the backend container: pytest


# Endpoint Implementes
- POST /members/login/
- POST /members/signup/
- GET /members/
- GET /members/me
- POST /members/add/
- PATCH /members/profiles/{id}/
- DELETE /members/{id}/

# Models
- Users (uses default email, password), extends to add role column
- Profile: first_name, last_name, email, phone
- Reset user password

# Tests includes

# ToDo Improvements (outside of the scope)
- Members pagination and sort
- Members search filter

# Development Logs
- 20 minutes: to review and define initial requierements
- 25 minutes: Implements initial boiler plate of backend with django rest and base docker containers 
- 25 minutes: Install front end boiler plated (vite + react +docker)
- 35 minutes: Configure initial urls and create basic auth using Django JWT
- 20 minutes: implements roles and profiles models
- 30 minutes: implements the GET, PATCH and DELETE endpoints
- 50 minutes: Congfigure react theme and create basic login and list
- 15 minutes: Add login and signup flow
- 25 minutes: Implement me endpoint and stablish protected routes
- 15 minutes: Implement list page
- 40 minutes: back views refactor and member form page
- 15 minutes: implement seeder