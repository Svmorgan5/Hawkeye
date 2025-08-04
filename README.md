# Hawkeye Security Management System

A comprehensive full-stack web application for managing institutional security through real-time camera monitoring, member tracking, and automated alert systems.

## What is Hawkeye?

Hawkeye is a security management platform designed for educational institutions, businesses, and organizations that need to monitor premises, track members, and manage security alerts in real-time. The system provides role-based access control, automated scheduling, and cloud-based storage for a complete security solution.

## Key Features

- **Real-time Camera Monitoring** - Live camera feeds with snapshot archiving to AWS S3
- **Member Management** - Track students, staff, and visitors with role-based permissions
- **Automated Alert System** - Scheduled alerts with real-time notifications via SocketIO
- **Institution Management** - Multi-tenant support for different organizations
- **User Authentication** - Secure JWT-based authentication with role hierarchy
- **API Documentation** - Interactive Swagger UI for easy API exploration
- **Cloud Storage** - Secure image and snapshot uploads to AWS S3

## Tech Stack

**Backend:** Flask, SQLAlchemy, Marshmallow, Flask-SocketIO, APScheduler  
**Frontend:** React, TypeScript, Vite, React Router  
**Database:** PostgreSQL (Production), MySQL (Dev), SQLite (Testing)  
**Cloud:** AWS S3, Render Platform  
**Testing:** Pytest, Moto, GitHub Actions CI/CD

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL/MySQL database
- AWS S3 bucket (for file storage)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Svmorgan5/Hawkeye.git
cd Hawkeye
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database and AWS credentials
```

### 3. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Build frontend for production
npm run build
```

### 4. Database Setup
```bash
# Initialize database
python -c "from backend.application import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

### 5. Run the Application
```bash
# Development
flask run

# Production
gunicorn 'backend.application:create_app()'
```

## Configuration

### Environment Variables (.env)
```env
# Database
SQLALCHEMY_DATABASE_URI=postgresql://user:password@localhost/hawkeye_db

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-2
AWS_BUCKET_NAME=your-bucket-name

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password

# Security
SECRET_KEY=your-secret-key
```


```


```

### Explore More
Visit `/api/docs` for complete interactive API documentation.

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=backend --cov-report=term-missing

# Run specific test file
pytest tests/test_app.py
```



## Project Structure

```
Hawkeye/
├── backend/
│   ├── application/
│   │   ├── blueprints/          # API routes
│   │   ├── models.py            # Database models
│   │   └── __init__.py          # Flask app factory
├── src/                         # React frontend
├── static/                      # Built frontend assets
├── tests/                       # Test files
├── config.py                    # Configuration classes
├── requirements.txt             # Python dependencies
└── package.json                 # Node.js dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



.

---

**Live Demo:** [https://hawkeye-6uxy.onrender.com](https://hawkeye-6uxy.onrender.com)  
**API Documentation:** [https://hawkeye-6uxy.onrender.com/api/docs](https://hawkeye-6uxy.onrender.com/api/docs)