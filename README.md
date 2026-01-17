# JWT App - Node.js Authentication Boilerplate

A production-ready Node.js authentication boilerplate with JWT (JSON Web Token) authentication, role-based access control, and database migrations.

## 🚀 Features

- **JWT Authentication** - Access & Refresh token system
- **Role-Based Access Control (RBAC)** - Users, Roles, and Permissions
- **Secure Password Hashing** - Using bcrypt
- **Database Migrations** - Using Sequelize CLI
- **Rate Limiting** - Protects against brute-force attacks
- **File Upload** - Avatar upload support
- **Logging** - Request logging with Morgan & Winston
- **Security** - Helmet.js for HTTP headers protection
- **CORS** - Configurable cross-origin resource sharing
- **Environment Configuration** - Using dotenv

## 📁 Project Structure

```
jwt-app/
├── config/
│   └── config.json          # Sequelize database config
├── migrations/               # Database migrations
├── src/
│   ├── config/
│   │   ├── db.js            # MySQL connection pool
│   │   ├── jwt.js           # JWT configuration
│   │   └── logger.js        # Logger configuration
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── error.middleware.js     # Error handling
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── upload.middleware.js    # File uploads
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.service.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.routes.js
│   │       └── user.service.js
│   ├── public/uploads/       # Uploaded files
│   ├── routes/
│   │   └── index.js          # Route aggregator
│   ├── utils/
│   │   ├── hash.js           # Password hashing
│   │   ├── logger.js         # Winston logger
│   │   ├── response.js       # Response helpers
│   │   └── token.js          # JWT token utilities
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── .env.example              # Environment variables template
├── database.sql              # Raw SQL (optional reference)
└── package.json
```

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/jwt-app.git
cd jwt-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jwt_app

# JWT (generate secrets using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### 4. Configure database

Update `config/config.json` with your database credentials:

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "jwt_app",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### 5. Create database

```bash
mysql -u root -p -e "CREATE DATABASE jwt_app;"
```

### 6. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 7. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint              | Description         | Auth Required |
|--------|----------------------|---------------------|---------------|
| POST   | `/api/v1/auth/register`     | Register new user   | No            |
| POST   | `/api/v1/auth/login`        | Login user          | No            |
| POST   | `/api/v1/auth/refresh-token`| Refresh access token| No            |
| POST   | `/api/v1/auth/logout`       | Logout user         | Yes           |

### Users

| Method | Endpoint              | Description         | Auth Required |
|--------|----------------------|---------------------|---------------|
| GET    | `/api/v1/users/profile`     | Get user profile    | Yes           |
| PUT    | `/api/v1/users/profile`     | Update profile      | Yes           |
| PUT    | `/api/v1/users/avatar`      | Upload avatar       | Yes           |

## 🔐 Authentication Flow

1. **Register** - Create a new user account
2. **Login** - Receive access token (short-lived) and refresh token (long-lived)
3. **Access API** - Use access token in `Authorization: Bearer <token>` header
4. **Refresh** - When access token expires, use refresh token to get a new one
5. **Logout** - Invalidate refresh token

## 🗄️ Database Schema

### Tables

- **users** - User accounts
- **roles** - User roles (admin, user, etc.)
- **permissions** - Available permissions
- **role_permissions** - Role-permission relationships

### Relationships

- Each user has one role
- Each role can have many permissions
- Many-to-many relationship between roles and permissions

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Signed with separate secrets
- **Rate Limiting**:
  - General API: 100 requests / 15 minutes
  - Login: 5 attempts / 15 minutes
  - Registration: 3 accounts / hour
- **Helmet.js** - Secure HTTP headers
- **CORS** - Configurable origins

## 🧪 Generate JWT Secrets

Run this command to generate secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📝 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run migrate # Run database migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own applications.

---

**Built with ❤️ using Node.js, Express, MySQL, and JWT**
