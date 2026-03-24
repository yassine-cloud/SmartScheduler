# Smart Scheduler

Smart Scheduler is a full-stack web application for intelligent project and task management. It enables teams to create, organize, and track projects, tasks, and resources efficiently, with real-time notifications and a modern, user-friendly interface.

## Technologies Used

- **Frontend:** Angular, Angular Material, RxJS, Nginx (for production)
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** MySQL
- **Other:** Docker, Docker Compose, JWT, Nodemailer

## Getting Started

You can run the project either locally with npm or using Docker (recommended for full stack setup).

### 1. Run with Docker (Recommended)

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

```bash
docker-compose up --build
```

- The frontend will be available at: http://localhost/
- The backend API will be available at: http://localhost:3000/
- MySQL will run on port 3306 (default credentials set in docker-compose.yaml)

### 2. Run Locally with npm

#### Backend
```bash
cd backend
npm install
npm start
# The backend runs on http://localhost:3000
```

#### Frontend
```bash
cd frontend
npm install
npm start
# The frontend runs on http://localhost:4200
```

> **Note:** For local development, you may need to set up a MySQL database and configure environment variables in `backend/.env`.

## License

This project is licensed under the MIT License.

