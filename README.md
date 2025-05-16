# Express Login Authentication API

A secure and scalable authentication service built with Express.js, MongoDB, and JWT.

## 📋 Overview

This project provides a complete authentication system with user registration, login, protected routes, and token-based authentication using JSON Web Tokens (JWT).

## 🚀 Features

- **User Authentication**
  - Registration with data validation
  - Secure login with JWT token generation
  - Password hashing using bcrypt
  - Protected routes with JWT verification

- **API Structure**
  - RESTful API design principles
  - Modular route organization
  - Middleware for authentication

- **Security**
  - Password hashing
  - JWT token-based authentication
  - Input validation with express-validator
  - Environment variable management

## 🛠️ Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator
- **Development**: Nodemon for hot reloading

## 📦 Project Structure

```
expressLogin/
├── api/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   └── User.js           # User model schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes (register, login, logout)
│   │   └── protected.js      # Protected routes requiring authentication
│   ├── .env                  # Environment variables (not in git)
│   ├── package.json          # Project dependencies
│   └── server.js             # Express server configuration
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expressLogin
   ```

2. **Install dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `/api` directory with the following variables:
   ```
   PORT=8240
   MONGO_URI=mongodb://localhost:27017/express-login
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

5. **Run the server**
   ```bash
   npm run dev
   ```

## 🔒 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate user & get token | Public |
| POST | `/api/auth/logout` | Logout user | Public |

### Protected Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/protected/me` | Get current user data | Private |

## 📝 API Request Examples

### Register a User

```bash
curl -X POST http://localhost:8240/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8240/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:8240/api/protected/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🧪 Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands (as shown above)

## 🔐 Security Best Practices

This project follows these security best practices:

1. Password hashing using bcrypt
2. JWT-based stateless authentication
3. Input validation on all endpoints
4. Environment variables for sensitive information
5. Error handling middleware

## 📈 Future Enhancements

- Email verification for new users
- Password reset functionality
- OAuth integration for social login
- Role-based access control
- Rate limiting for API endpoints
- Comprehensive test suite

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
