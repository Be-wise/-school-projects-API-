# School Management System API

A RESTful API for managing school operations including students, 
teachers, classes, subjects, grades and attendance.

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt

## Architecture
This project follows a modular architecture with clear separation 
of concerns across routes, controllers, and services.

## Project Structure
src/
├── auth/
├── middleware/
├── modules/
│   ├── students/
│   ├── teachers/
│   ├── subjects/
│   ├── classes/
│   ├── grades/
│   └── attendance/
└── utils/

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### Installation
1. Clone the repository
   git clone https://github.com/yourusername/school-management-api

2. Install dependencies
   npm install

3. Set up environment variables
   cp .env.example .env
   fill in your database credentials and JWT secret

4. Set up the database
   run the SQL scripts in /database folder

5. Start the server
   npm run dev

## API Endpoints

### Students
POST   /api/students         → create student
GET    /api/students         → get all students
GET    /api/students/:id     → get student by id
PATCH  /api/students/:id     → update student
DELETE /api/students/:id     → soft delete student

### Teachers
POST   /api/teachers                          → create teacher
GET    /api/teachers                          → get all teachers
GET    /api/teachers/:id                      → get teacher by id
PATCH  /api/teachers/:id                      → update teacher
DELETE /api/teachers/:id                      → soft delete teacher
POST   /api/teachers/:id/subjects             → assign subject
GET    /api/teachers/:id/subjects             → get teacher subjects
DELETE /api/teachers/:id/subjects/:subjectId  → remove subject
POST   /api/teachers/:id/classes              → assign class
GET    /api/teachers/:id/classes              → get teacher classes
DELETE /api/teachers/:id/classes/:classId     → remove class

### Subjects
POST   /api/subjects         → create subject
GET    /api/subjects         → get all subjects
GET    /api/subjects/:id     → get subject by id
PATCH  /api/subjects/:id     → update subject
DELETE /api/subjects/:id     → soft delete subject

### Classes
POST   /api/classes          → create class
GET    /api/classes          → get all classes
GET    /api/classes/:id      → get class by id
PATCH  /api/classes/:id      → update class
DELETE /api/classes/:id      → soft delete class

## Security
- Passwords hashed with bcrypt
- JWT authentication with role based access
- Parameterized queries prevent SQL injection
- Input sanitization on all endpoints
- Soft deletes preserve data integrity

## Roles
- Admin    → full access
- Teacher  → assigned classes and subjects only
- Student  → own data only
- Parent   → their child data only

## Roadmap
- [ ] OTP email verification on registration
- [ ] Grades module
- [ ] Attendance module
- [ ] Learning materials upload via Supabase
- [ ] News and announcements
- [ ] Frontend in Next.js
- [ ] Supabase migration
- [ ] Deployment on Railway and Vercel

