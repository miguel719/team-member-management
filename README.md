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
python manage.py createsuperuser
http://localhost:8000/admin

# Endpoint to implement
- POST /members/login
- POST /members/signup/
- GET /members
- UPDATE /members
- DELETE /members


# Tests includes


# Development Logs
- 20 minutes: to review and define initial requierements
- 25 minutes: Implements initial boiler plate of backend with django rest and base docker containers 
- 25 minutes: Install front end boiler plated (vite + react +docker)
- 35 minutes: Configure initial urls and create basic auth using Django JWT


