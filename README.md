# Lumina - Modern Art Gallery Web Application

Lumina is a premium, modern, full-stack Art Gallery Web Application built with React (Vite), Tailwind CSS, GSAP, and Node.js/Express. It features smooth UI animations, dark theme aesthetics, an artwork reservation system, and a custom API.

## Project Structure

- `/server` - Node.js & Express REST API backend
- `/client` - React (Vite) frontend with Tailwind CSS and GSAP

## Technologies Used

**Frontend:**
- React (via Vite)
- Tailwind CSS (v4)
- GSAP & `@gsap/react` for complex animations
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs for Auth
- Multer for Image Uploads

## Installation & Setup

### 1. Backend Setup
```bash
cd server
npm install
```
Make sure you have MongoDB running locally or a MongoDB Atlas URI. Check the `.env` file in the `server` directory.

To start the backend server in development mode:
```bash
npm run dev
# The server will start on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
```

To start the frontend Vite server:
```bash
npm run dev
# The frontend will start on http://localhost:5173
```

## Features Implemented
- **Animated Hero & Scrolling**: Smooth reveals and transitions using GSAP.
- **Gallery & Filtering**: View and filter artworks intuitively.
- **Authentication**: JWT-based login and registration system.
- **Reservation System**: Authenticated users can reserve available artworks.
- **Admin Dashboard Layout**: A foundational layout for CRUD operations on artists and artworks. 
- **Dark Theme Aesthetics**: Deep dark-mode aesthetic with custom scrollbars and minimalist typography.

## API Endpoints (Brief)
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `GET /api/artworks` - Fetch all artworks
- `GET /api/artworks/:id` - Fetch single artwork
- `GET /api/artists` - Fetch all artists
- `GET /api/exhibitions` - Fetch exhibitions
- `POST /api/reservations` - Reserve an artwork
