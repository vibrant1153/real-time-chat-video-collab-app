A high-performance, full-stack real-time collaboration platform designed for seamless team communication. This application features real-time 1-to-1 and group messaging, high-definition video conferencing, and a live collaborative whiteboard.

Built with a modern MERN-stack variant (Next.js 14, TypeScript, Express, and MongoDB), the application features a premium 'glassmorphism' UI, secure JWT-based authentication, and a fully responsive layout.

## ✨ Features

- **Real-Time Chat**: Sub-second latency messaging powered by Stream Chat SDK.
- **Video Conferencing**: High-definition video and audio calls using Stream Video SDK.
- **Interactive Whiteboard**: Shared, multi-user drawing boards integrated with `tldraw`.
- **Secure Authentication**: JWT-based auth, BCrypt password hashing, and secure API endpoints.
- **Modern UI/UX**: Premium glassmorphism design built with Tailwind CSS and Lucide React icons.
- **Robust Backend**: Modular Express/TypeScript backend with Mongoose ODM, Zod validation, and rate-limiting.

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Stream Video React SDK (`@stream-io/video-react-sdk`)
- Stream Chat React SDK (`stream-chat-react`)
- tldraw (Interactive canvas)
- Zustand (State management)
- React Hook Form & Zod (Form validation)

### Backend
- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- Stream Chat Server SDK
- JWT (JSON Web Tokens) & bcryptjs
- express-rate-limit

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or MongoDB Atlas)
- Stream.io Account (for Chat and Video API keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd real-time-chat-video-collab-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

You need to set up environment variables for both the frontend and backend.

**Backend (`backend/.env`)**
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env.local`)**
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 💻 Running the Application

Open two terminal windows to run both servers simultaneously.

**Start the Backend Server**
```bash
cd backend
npm run dev
```

**Start the Frontend Server**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

- `/frontend` - Next.js client application containing pages, components, and hooks.
  - `/app/auth` - Login and registration pages.
  - `/app/dashboard` - Main application dashboard including chat, calls, and whiteboard.
- `/backend` - Express.js server providing API routes and Stream token generation.
  - `/src/routes` - API endpoints for auth, users, and stream integration.
  - `/src/models` - Mongoose database schemas.

## 📝 License

This project is licensed under the ISC License.
