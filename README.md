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
│   ├── class-subject/
│   ├── parents
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
POST   /api/students/bulk    → create bulk students
GET    /api/students         → get all students
GET    /api/students/:id     → get student by id
PATCH  /api/students/:id     → update student
DELETE /api/students/:id     → soft delete student

### Teachers
POST   /api/teachers                          → create teacher
POST   /api/teachers/bulk                     → create bulk teachers
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
POST   /api/subjects/bulk    → create bulk subjects
GET    /api/subjects         → get all subjects
GET    /api/subjects/:id     → get subject by id
PATCH  /api/subjects/:id     → update subject
DELETE /api/subjects/:id     → soft delete subject

### Classes
POST   /api/classes          → create class
POST   /api/classes/bulk     → create bulk class
GET    /api/classes          → get all classes
GET    /api/classes/:id      → get class by id
PATCH  /api/classes/:id      → update class
DELETE /api/classes/:id      → soft delete class

### Parents
POST    /api/parents                                      → create parent
POST    /api/parents/bulk                                 → create bulk parents
POST    /api/parents/:parentId/assign-student/:studentId  → assign parent to student
POST    /api/parents/bulk-assign                          → bulk assign parents to students
GET     /api/parents                                      → get parents
GET     /api/parents/:id                                  → get parent by id
PATCH   /api/parents/:id                                  → update parent
DELETE  /api/parents/:id                                  → delete parent

### Grades
POST    /api/grades                     → create grades
POST    /api/grades/bulk                → create bulk grades
GET     /api/grades                     → get all grades
GET     /api/grades/student/:studentId  → get grades by student id
GET     /api/grades/:id                 → get grades by id
PATCH   /api/grades/:id                 → update grades
DELETE  /api/grades/:id                 → delete grades

### Attendance 
POST    /api/attendance                      → create attendance
POST    /api/attendance/bulk                 → create bulk attendance
GET     /api/attendance                      → get all attendances
GET     /api/attendance/student/:studentId   → get attendance by student id
GET     /api/attendance/:id                  → get attendance by id
PATCH    /api/attendance/:id                 → update attendance
DELETE    /api/attendance/:id                → delete attendance

### Class-subjects
POST    /api/class-subjects         → create class-subject
POST    /api/class-subjects/bulk    → create bulk class-subjects
GET     /api/class-subjects         → get all class-subjects
GET     /api/class-subjects/:id     → get class-subject by id
PATCH    /api/class-subjects/:id    → update class-subject
DELETE    /api/class-subjects/:id   → delete class-subject

POST    /api/class-subjects/:id/enroll                  → enroll student into class-subjects
POST    /api/class-subjects/bulk-enroll                 → bulk enroll students into class-subjects
GET     /api/class-subjects/:id/students                → get students by class-subjects id
DELETE    /api/class-subjects/:id/unenroll/:studentId   → unenroll studentfrom class-subject

## Security
- Passwords hashed with bcrypt
- JWT authentication with role based access
- Ownership checks
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
- [ ] Learning materials upload via Supabase
- [ ] News and announcements
- [ ] Frontend in  React.js
- [ ] Supabase migration
- [ ] Deployment on Railway and Vercel
- [ ] Academic analyst (python)

## Author
Mtetwa Blessing
 
