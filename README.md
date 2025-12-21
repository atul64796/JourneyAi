# 🌍 Journey AI – Frontend

Journey AI is an AI-powered storytelling platform that helps users transform ideas into immersive travel stories.  
This repository contains the **frontend application** built for a modern, fast, and intuitive user experience.

---

## ✨ Features

- 🧠 AI-powered story generation interface
- 🔐 User authentication & authorization
- 👤 User profile & story management
- 🛠️ Admin dashboard with analytics
- 📊 Data visualization (charts & summaries)
- 📩 Feedback submission
- 🎨 Responsive and modern UI

---

## 🛠️ Tech Stack

- **React**
- **Vite**
- **Axios**
- **Recharts**
- **JWT Authentication**
- **CSS / Tailwind (if used)**
- **Vercel (Deployment)**

- frontend/
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ services/
│ ├─ hooks/
│ └─ main.jsx
├─ public/
├─ package.json
└─ README.md


---

## ⚙️ Environment Variables

Create a `.env` file in the root:


---

## ▶️ Run Locally

Install dependencies:
```bash
npm install
start server and frontend:
npm run dev

##API Integration

All API calls are handled via a centralized Axios instance:

Authorization: Bearer <JWT_TOKEN>

🌍 Deployment

Platform: Vercel

Build Command: npm run build

Framework: Vite + React

Automatic deployments on every GitHub push.
📄 License

This project is licensed under the MIT License.

✨ Author

Debjit Atul Sankha Chandryee
Crafting intelligent and engaging storytelling experiences with AI.

🤝 Contributing

Contributions and feature suggestions are welcome.
Fork the repository and submit a pull request.


---

# 🧠 Journey AI – Backend (`README.md`)

```md
# 🧠 Journey AI – Backend

Journey AI Backend powers authentication, AI story generation, admin operations, and feedback management.  
It serves as the core API layer for the Journey AI platform.

---

## 🚀 Features

- 🔐 JWT-based authentication & authorization
- 👤 User management (ban, activate/deactivate)
- 🛡️ Admin-only protected routes
- ✍️ AI-generated travel stories
- 🗣️ Text-to-speech integration
- 📩 Feedback system with admin responses
- ☁️ Cloudinary media uploads
- 🍪 Secure cookies & token handling

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT**
- **Google GenAI / OpenAI**
- **Cloudinary**
- **Multer**
- **Render (Deployment)**

---

## 📁 Project Structure

backend/
├─ controllers/
├─ middlewares/
├─ models/
├─ routes/
├─ utils/
├─ index.js
├─ package.json
├─ LICENSE
└─ README.md

---

## ⚙️ Environment Variables

Create a `.env` file in root:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


---

## ▶️ Run Locally

Install dependencies:
```bash
npm install
npm run dev
http://localhost:8000
🔗 API Base URL
/j1/v1
GET /j1/v1/admin/users


🧑‍💻 Admin Routes
GET    /admin/users
PATCH  /admin/users/:userId/ban
PATCH  /admin/users/:userId/status
GET    /admin/feedback
PATCH  /admin/feedback/:feedbackId/respond
DELETE /admin/feedback/:feedbackId

🌍 Deployment

Backend: Render

Database: MongoDB Atlas

Auto Deploy: Enabled on GitHub push

📄 License

This project is licensed under the MIT License.
See the LICENSE
 file for details.

✨ Author

Debjit Atul Sankha Chandryee
Building scalable AI-driven platforms with modern web technologies.


---

## ✅ What you have now
✔ Professional **frontend README**  
✔ Professional **backend README**  
✔ Recruiter & startup ready  
✔ Clean open-source presentation  

---

If you want next:
- Add **GitHub badges**
- Create **monorepo README**
- Add **screenshots / demo GIF**
- Write **API documentation**

Just tell me 🚀



