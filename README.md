# Authentication Service

## Overview
The Authentication Service is a critical component of the Learning Management System (LMS), responsible for managing user authentication and profile operations. It provides secure and efficient user registration, login, password management, and Google sign-in functionality.

## Features
- User registration and login.
- Password hashing and secure storage using **bcrypt**.
- Password reset via email.
- Google OAuth 2.0 sign-in integration.
- User profile management (view and update profile details).
- Token-based authentication using **JWT**.

## Tech Stack
- **Node.js**: Backend runtime for scalable application development.
- **Express.js**: Framework for building RESTful APIs.
- **PostgreSQL**: Database for user data storage.
- **JWT**: Secure token-based authentication.
- **Google OAuth 2.0**: For social login functionality.