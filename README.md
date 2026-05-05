# Team Task Manager

A Full-Stack Team Task Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication**: Secure JWT-based signup and login.
- **Project Management**: Create projects (creator becomes Admin), add/remove members.
- **Task Management**: Create tasks, assign to members, update status (Kanban-style).
- **Dashboard**: View statistics (Total tasks, tasks by status, overdue tasks).
- **Role-Based Access**: Admins can manage tasks/members; Members can view and update status.

## Tech Stack
- **Frontend**: React, Vite, React Router, Axios, Vanilla CSS (Modern Aesthetic).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth.

## Local Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd team-task-manager
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=supersecretkey_change_in_production
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
This runs both the Node backend (port 5000) and the Vite frontend concurrently.

## Deployment to Railway
This repository is configured as a monorepo for easy deployment to Railway.
1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the Node.js environment.
3. Ensure you add the following Environment Variables in Railway:
   - `MONGO_URI` (Your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong random string)
   - `NODE_ENV` (Set to `production`)
4. Railway will run `npm run build` (which builds the React client) and `npm start` (which starts the Express server and serves the React client statically).

