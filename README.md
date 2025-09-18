---

# 📚 Collaborative Study Room

Collaborative Study Room is a professional, real-time web application designed for students to collaborate in virtual study rooms. Built in just **3 hours** for a Build-a-Thon competition, it provides a suite of interactive tools for productive group learning.

---

## 🌐 Live Demo

- **Frontend:** [study-room-build-a-thon.vercel.app](https://study-room-build-a-thon.vercel.app)
- **Backend:** [study-room-build-a-thon.onrender.com](https://study-room-build-a-thon.onrender.com)

---

## ✨ Features

- Create and join multiple study rooms
- Real-time chat powered by Socket.io
- Shared whiteboard for collaborative drawing
- Flashcards for group learning
- Quiz creation and participation with scoring
- Pomodoro timer for focused study sessions
- Session scheduling with integrated calendar
- Responsive, mobile-first design

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io, MongoDB Atlas
- **Deployment:** Vercel (frontend), Render (backend)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collaborative-study-room.git
cd collaborative-study-room
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Usage Notes

- For production, update the API URLs in the `.env` files to point to your deployed backend.
- Ensure MongoDB Atlas is accessible from your backend server.

---

## 👩‍💻 Contributors

- Tarun Parvathi
- Deekonda Sairam
- Darshi Kusuma

---

## 🏆 Project Notes

Built as part of the Build-a-Thon Competition in just 3 hours.  
Designed to encourage collaborative and engaging study experiences.

---