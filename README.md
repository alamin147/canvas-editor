# 📌 Canvas Editor: Real-Time Collaborative Drawing Platform

A modern web-based canvas editing platform built with the MERN stack, offering a seamless collaborative drawing experience with features like real-time object manipulation, shape creation, and project management.

---

## 📖 Description

Canvas Editor is a free collaborative drawing platform that allows multiple users to work on the same canvas in real-time. Users can create shapes, add text, and manipulate objects while seeing other users' changes and cursor positions instantly. The platform features user authentication, project management, and real-time collaboration through WebSockets.

This project demonstrates a comprehensive implementation of a real-time collaborative drawing application with a focus on user experience, performance, and multi-user interaction.

---

## 🚀 Features

- ✅ User authentication (register/login) with secure JWT tokens
- 🔄 Real-time collaborative canvas editing with multiple users
- 👆 Live cursor position tracking of collaborators
- 📝 Shape creation tools (rectangles, circles, lines, text)
- 🎨 Color customization for both fill and stroke properties
- 🔄 Object manipulation (move, resize, rotate)
- 📋 Copy, paste, and duplicate functionality
- 🗑️ Object deletion
- 💾 Auto-save functionality with debouncing
- 📤 Manual save with keyboard shortcut (Ctrl+S)
- 👥 User invitation system for collaboration
- 🔄 Project management (create, view, edit, delete)
- 🌐 Socket-based real-time data synchronization
- 🔒 Secure API endpoints with authentication middleware

---

## 🧑‍💻 Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- Fabric.js (canvas manipulation)
- Socket.io-client (WebSocket communication)
- Redux Toolkit (state management)
- React Router
- React Hot Toast (notifications)
- React Icons

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Socket.io (WebSocket server)
- JWT Authentication
- Bcrypt (password hashing)

**Other:**
- RESTful API design
- Socket.io for real-time communication
- JWT for authentication
- Responsive UI design

---

## 📊 API Endpoints

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

---

## 🔌 Socket.io Events

The application uses Socket.io for real-time collaboration:

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

---

## 🛠️ Installation & Usage

```bash
# Clone the repository
git clone https://github.com/alamin147/canvas-editor.git

# Navigate to the backend
cd canvas-editor/canvas-editor-server
npm install

# Create .env file with required environment variables
# Then start the server
npm run dev

# Navigate to the frontend
cd ../canvas-editor-client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🗂️ Project Structure

```
canvas-editor/
├── canvas-editor-client/     # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom hooks
│   │   ├── layout/           # Layout components
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   │   ├── canvas-editor/ # Canvas editing page
│   │   │   │   ├── hooks/     # Canvas-specific hooks
│   │   │   │   ├── components/ # Canvas components
│   │   │   │   └── utils/      # Canvas utility functions
│   │   ├── provider/         # Context providers
│   │   ├── redux/            # Redux store and slices
│   │   └── types/            # TypeScript type definitions
│   └── ...
├── canvas-editor-server/     # Express backend
│   ├── src/
│   │   ├── app/              # Main application code
│   │   │   ├── config/       # Configuration files
│   │   │   ├── errors/       # Error handling
│   │   │   ├── middlewares/  # Express middlewares
│   │   │   ├── modules/      # API modules
│   │   │   │   ├── Auth/     # Authentication module
│   │   │   │   ├── project/  # Project management module
│   │   │   │   └── user/     # User management module
│   │   │   ├── routes/       # API routes
│   │   │   └── utils/        # Utility functions
│   │   └── server.ts         # Server entry point
│   └── ...
├── README.md
└── ...
```

---

## 🔐 Environment Variables

### Client (.env in canvas-editor-client)
```
VITE_SERVER_URL=http://localhost:5000
```

### Server (.env in canvas-editor-server)
```
PORT=5000
DATABASE_URL=your_mongodb_connection_string
NODE_ENV=development
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=7d
```

---

## 👥 Key User Workflows

1. **Authentication**: Users register or log in to access the platform
2. **Project Management**: Create new projects or access existing ones
3. **Canvas Editing**: Add shapes, text, and manipulate objects on the canvas
4. **Collaboration**: Invite other users to collaborate on projects in real-time
5. **Project Saving**: Changes are auto-saved and can be manually saved

---

## 🔄 Future Enhancements

- Image upload and manipulation
- Advanced text formatting
- Layer management
- Undo/redo functionality
- Canvas history playback
- Export to various formats (PNG, SVG, PDF)
- Touch support for mobile devices
- Advanced permission management for collaborators

---

## 👨‍💻 Author

Created by [Alamin](https://github.com/alamin147)
