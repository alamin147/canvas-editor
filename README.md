# Canvas Editor

A real-time collaborative canvas editing application with a backend API for user authentication, project management, and socket-based collaboration.

## API Endpoints

The Canvas Editor application provides the following API endpoints:

### Base URL

http://localhost:5000/api/v1

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /auth/signup | Register a new user | No |
| POST | /auth/login | Login with existing credentials | No |
| POST | /auth/change-password | Change user password | Required |

### User

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | /user/me | Get current user information | Required |

### Projects

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | /projects | Create a new canvas project | Required |
| GET | /projects | Get all projects for current user | Required |
| GET | /projects/:projectId | Get a specific project by ID | Required |
| PATCH | /projects/:projectId | Update a project | Required |
| DELETE | /projects/:projectId | Delete a project | Required |

## Socket.io Events

The application also uses Socket.io for real-time collaboration:

### Server URL

http://localhost:5000

### Client to Server Events

| Event | Description | Payload |
|-------|-------------|---------|
| join-canvas | Join a specific canvas project | { projectId, userId, username, userColor } |
| mouse-move | Send mouse position updates | { projectId, position: { x, y } } |
| canvas-update | Send canvas object updates | { projectId, operation, objectId, object } |

### Server to Client Events

| Event | Description | Payload |
|-------|-------------|---------|
| user-joined | New user joined the canvas | User data object |
| user-left | User left the canvas | { socketId } |
| active-users | List of active users in the canvas | Array of user objects |
| user-mouse-move | A user's mouse position updated | { socketId, position } |
| canvas-update | Canvas object was updated | { socketId, userId, operation, object, objectId } |