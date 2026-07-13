# Gloss Pharma ERP - Backend

## Overview

Gloss Pharma ERP Backend is a RESTful API built using the MERN stack. It is designed to manage pharmaceutical inventory, employees, purchases, sales, reports, documents, and AI-powered assistance with secure authentication and role-based access control.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Cloudinary
* Google Gemini AI
* Nodemailer
* Multer
* Swagger
* ExcelJS
* PDFKit

---

## Features

### Authentication

* User Registration
* Secure Login
* JWT Authentication
* Role-Based Access Control (RBAC)
* Forgot Password (OTP)
* Verify OTP
* Reset Password
* Email Notifications

### Employee Management

* Create Employee
* Update Employee
* Delete Employee
* Employee Search
* Pagination

### Product Management

* Create Product
* Update Product
* Delete Product
* Stock Management
* Batch Number Management
* Expiry Date Management
* Product Search
* Pagination

### Purchase Management

* Purchase Entry
* Purchase Number Auto Generation
* Supplier Management
* Inventory Auto Update

### Sales Management

* Sales Invoice Generation
* Invoice Number Auto Generation
* Customer Management
* Inventory Auto Deduction

### Inventory

* Live Stock Tracking
* Minimum Stock Monitoring
* Low Stock Alerts

### Reports

* Sales Reports
* Purchase Reports
* Inventory Reports
* Dashboard Statistics

### Documents

* File Upload
* Cloudinary Integration
* Document Management

### AI Assistant

* Google Gemini Integration
* ERP Query Assistant

### Export

* PDF Invoice Generation
* Excel Report Export

### System

* Company Settings
* Audit Logs
* Health Check API
* System Information API
* Swagger API Documentation

---

## API Modules

* Authentication
* Employees
* Products
* Purchases
* Sales
* Reports
* Dashboard
* AI Assistant
* Documents
* Notifications
* Settings
* Audit Logs

---

## Security

* JWT Authentication
* Password Hashing (bcrypt)
* Protected Routes
* Role-Based Authorization
* OTP Verification
* Environment Variables
* Input Validation

---

## Folder Structure

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
│   ├── seed/
│   ├── app.js
│   └── server.js
│
├── uploads/
├── package.json
└── .env
```

---

## Installation

```bash
git clone <repository-url>

cd backend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file and configure:

* PORT
* MONGODB_URI
* ACCESS_TOKEN_SECRET
* ACCESS_TOKEN_EXPIRY
* REFRESH_TOKEN_SECRET
* REFRESH_TOKEN_EXPIRY
* CLOUDINARY_CLOUD_NAME
* CLOUDINARY_API_KEY
* CLOUDINARY_API_SECRET
* GEMINI_API_KEY
* SMTP_HOST
* SMTP_PORT
* SMTP_EMAIL
* SMTP_PASSWORD

---

## Current Status

**Backend Version:** v1.0

### Completed Modules

* Authentication
* Employee Management
* Product Management
* Purchase Management
* Sales Management
* Inventory Management
* Dashboard
* Reports
* AI Integration
* Document Upload
* Email Service
* OTP Verification
* PDF Invoice
* Excel Export
* Notifications
* Settings
* Audit Logs
* Swagger Documentation

---

## Future Enhancements

* Google Login
* Refresh Token Auto Rotation
* Multi-Factor Authentication (MFA)
* Advanced Analytics Dashboard
* Docker Deployment

---

## Author

**Kapil Rohilla**

Web Developer Intern

Gloss Pharmaceuticals Pvt. Ltd.

Built with Node.js, Express.js, MongoDB, and modern backend architecture.
