# nodejs_auth_api

## Overview
This project is a backend API service built using Node.js, providing authentication and user management functionalities.

## Features

### 1. Authentication Module
- **Signup API** - Allows users to create an account.
- **SignIn API** - Enables users to log in using their credentials.
- **Forget Password API** - Sends a password reset link to the user's email.
- **Reset Password API** - Allows users to reset their password using a token.
- **Change Password API** - Enables authenticated users to change their password.

### 2. User Management
- **Get User Details API** - Fetches details of a specific user.
- **Upload User Profile Picture API** - Allows users to upload a profile picture.

## Tech Stack
- **Node.js**: v20.7.0
- **Express.js**
- **PostgreSQL**
- **JWT for Authentication**

## Installation

1. Clone the repository:

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file and configure your environment variables:
   ```env
    NODE_ENV=local
    DB_NAME='auth_module'
    DB_HOST='127.0.0.1'
    DB_USERNAME='postgres'
    DB_PASSWORD='1234'
    DB_PORT='5432'
    DB_CHARSET=utf8mb4
    PORT='4050'
    JWT_SECRET_KEY='YOUR_JWT_SECRET_KEY'
    JWT_SECRET_KEY_REFRESH = 'YOUR_JWT_SECRET_KEY_REFRESH'
    AWS_ACCESS_KEY='YOUR_AWS_ACCESS_KEY'
    AWS_SECRET_ACCESS_KEY='YOUR_AWS_SECRET_ACCESS_KEY'
    AWS_BUCKET_NAME='video-fredo-dev'
    AWS_BUCKET_REGION = 'us-east-1'
    CLOUDFRONT_URL='https://d2vy4wa5cy7tze.cloudfront.net'
   ```

4. Start the server:
   ```sh
   npm run watch
   ```

## API Documentation
Use Postman to test the APIs.
