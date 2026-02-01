# Creative Project

A full-stack web application for managing tasks and habits with user authentication.

## Project Structure

```
Creative Project/
│
├── backend/              # Node.js backend server
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   ├── db/              # SQLite database
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   └── middleware/      # Authentication middleware
│
├── frontend/            # Vanilla HTML/CSS/JS frontend
│   ├── index.html      # Main HTML file
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript files
│
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Features

- User authentication (register/login)
- Task management (create, read, update, delete)
- Habit tracking with streak counter
- SQLite database
- RESTful API
- Responsive design

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will run on http://localhost:3000

### Frontend

Simply open `frontend/index.html` in a web browser, or use a local server:

```
cd frontend
python -m http.server 8000
```

Then visit http://localhost:8000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (requires auth)

### Tasks
- GET `/api/tasks` - Get all tasks (requires auth)
- POST `/api/tasks` - Create a task (requires auth)
- PUT `/api/tasks/:id` - Update a task (requires auth)
- DELETE `/api/tasks/:id` - Delete a task (requires auth)

### Habits
- GET `/api/habits` - Get all habits (requires auth)
- POST `/api/habits` - Create a habit (requires auth)
- PUT `/api/habits/:id` - Update a habit (requires auth)
- DELETE `/api/habits/:id` - Delete a habit (requires auth)

## Technologies Used

- **Backend**: Node.js, SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Basic token-based auth

## License

MIT
