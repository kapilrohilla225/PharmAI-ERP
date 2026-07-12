```md
# Pharma ERP Backend

A production-ready backend for a Pharmaceutical ERP system built with Node.js, Express.js, and MongoDB Atlas.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Morgan
- Cookie Parser

---

## Project Structure

```

backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md

````

---

## Features

- User Authentication (JWT)
- Role Based Access Control
- Employee Management
- Inventory Management
- Supplier Management
- Dashboard APIs
- Document Management
- Reports
- Global Error Handling
- Common API Response Format
- MongoDB Atlas Integration

---

## Installation

Clone the repository

```bash
git clone <repository-url>
````

Move into the backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

## Run Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## API Base URL

```
http://localhost:5000/api/v1
```

---

## Current Modules

* Authentication
* Employee
* Inventory
* Supplier
* Dashboard
* Reports
* Documents

---

## Folder Responsibilities

### config

Database configuration and application constants.

### controllers

Handle incoming requests and return responses.

### middlewares

Authentication, authorization, validation, and error handling.

### models

MongoDB schemas and models.

### routes

API endpoints.

### services

Business logic.

### utils

Reusable helper functions and common utilities.

### validators

Request validation.

---

## API Response Format

Success

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Something went wrong"
}
```

---

## Development Rules

* Follow MVC Architecture.
* Keep controllers thin.
* Put business logic inside services.
* Store secrets in `.env`.
* Use MongoDB Atlas.
* Write reusable code.
* Maintain clean folder structure.
* Commit changes after each completed module.

---

## Author

**Kapil Rohilla**

Web Developer Intern

Gloss Pharmaceuticals Pvt. Ltd.

```
```
