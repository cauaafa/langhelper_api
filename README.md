# LangHelper Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/cloud/atlas)

The backend API for LangHelper - a language learning platform that provides structured courses, lessons, and exercises.

## Features
- JWT Authentication with email-based tokens
- Course/Unit/Lesson management system
- Exercise creation (explanations & questions)
- User progress tracking
- RESTful API endpoints
- Image upload support
- Role-based access control (User/Dev)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Email:** SendGrid
- **File Upload:** Multer
- **Validation:** Express Validator

## Planning to implement in the future
- **Google OAuth**
- **Swagger**
- **Unit tests**
- **Docker**

## Installation
1. Clone repository:
- git clone https://github.com/your-username/langhelper-api.git
- cd langhelper-api

2. Install dependencies: 
- npm install 

3. Create.env file with: 
- PORT=5000 
- DB_USER=your_mongodb_user 
- DB_PASS=your_mongodb_password 
- JWT_SECRET=your_jwt_secret 
- SENDGRID_API_KEY=your_sendgrid_key 
- SENDGRID_API_EMAIL=your@email.com 
- CRYPT_PASS=encryption_pass 
- CRYPT_SALT=encryption_salt 

4. Start server: 
- npm run server

## Request Routes:
Core Routes:
- GET - / - Checks if API is working (root endpoint)
- GET - /api/courses - Gets all courses
- GET - /api/courses/lang/:lang - Gets courses by language
- GET - /api/courses/:id - Gets course by ID
- GET - /api/lessons/:id - Gets lesson by ID
- GET - /api/users/profile - Gets current user profile
- GET - /api/users/:id - Gets user by ID

Authentication Routes
- POST - /api/users/register - Registers new user
- POST - /api/users/login - Logs in user
- POST - /api/tokens/create - Creates and sends user token via email

User Management
- PUT - /api/users/ - Updates user profile
- PUT - /api/users/addlesson - Marks lesson as completed
- DELETE - /api/users/resetlessons - Resets user's completed lessons

User Management (Dev Only)
- PUT - /api/users/promote/:id - Promotes user to developer role

Course Management (Dev Only)
- POST - /api/courses/create - Creates new course
- PUT - /api/courses/:id - Updates course
- DELETE - /api/courses/:id - Deletes course
- POST - /api/courses/:id/unit - Adds unit to course
- PUT - /api/courses/:id/unit/:unitId - Updates unit
- DELETE - /api/courses/:id/unit/:unitId - Deletes unit

Lesson Management (Dev Only)
- POST - /api/lessons/create/:id/unit/:unitId - Creates new lesson
- PUT - /api/lessons/:id - Updates lesson
- DELETE - /api/lessons/:courseId/unit/:unitId/lesson/:id - Deletes lesson

Exercise Management (Dev Only)
- POST - /api/exercises/:id - Creates new exercise
- PUT - /api/exercises/:id/exercise/:exerciseId - Updates exercise
- DELETE - /api/exercises/:id/exercise/:exerciseId - Deletes exercise

Option Management (Dev Only)
- POST - /api/options/:lessonId/exercise/:exerciseId - Creates new option
- PUT - /api/options/answer/:lessonId/exercise/:exerciseId/option/:optionId - Sets answer
- PUT - /api/options/:lessonId/exercise/:exerciseId/option/:optionId - Updates option
- DELETE - /api/options/:lessonId/exercise/:exerciseId/option/:optionId - Deletes option

Requests info:
- Protected routes require Authorization: Bearer <token> header
- Token routes require userToken: <6-digit-code> header
- All routes return JSON responses
  
## Deployment:

1. Create production MongoDB cluster
2. Set enviroment variables in hosting platform
3. Install dependencies: 
- npm install --production 

4. Start server: 
- node app.js
