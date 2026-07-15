# Lumina: Immersive 3D Art Gallery

A premium MERN stack virtual museum experience built with React, GSAP, and Node.js. 

![3D Gallery Preview](C:/Users/visha/.gemini/antigravity/brain/6152659b-19a8-4fdb-94dd-326734042027/virtual_gallery_painting_room_1774530511800.png)

## 🚀 Features

### Immersive 3D Experience (No Three.js/WebGL)
- **Virtual Museum**: Explore themed rooms (Painting, Sculpture, Digital) using horizontal scroll navigation.
- **CSS 3D Transforms**: Simulated depth using `perspective`, `rotateY`, and `translateZ`.
- **GSAP Animations**: Fluid scroll-based movement and card-flipping effects.
- **Spotlight Lighting**: Museum-grade aesthetics with dynamic gradients and shadows.

### User Roles & Authentication
- **User Role**: Browse the collection, enter the 3D gallery, view details, search/filter, and manage a personal wishlist.
- **Admin Role**: Full Dashboard control to Add, Update, and Delete artworks/artists.
- **JWT Protection**: Secure authentication with role-based access control.

### Advanced Capabilities
- **Multer Image Uploads**: Direct image management on the server.
- **Search & Filter**: Real-time filtering by category, artist, price, and keyword.
- **Responsive Design**: Tailored for all devices with a dark-themed, premium feel.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, GSAP (animations), Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JSON Web Tokens (JWT), BcryptJS.
- **Media**: Multer (File Uploads).

## 📥 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Setup Steps
1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
3. **Setup Frontend**
   ```bash
   cd ../client
   npm install Or npm i
   ```
4. **Run Development Server**
   - Start Backend: `cd server && npm run dev`
   - Start Frontend: `cd client && npm run dev`

## 📊 Sample Data
Included `seeder.js` in the server folder to populate the database with professional sample artworks and artists.
```bash
cd server
node seeder.js
```

---
*Built as a high-end final year project and resume demonstration of full-stack engineering and creative UI development.*
