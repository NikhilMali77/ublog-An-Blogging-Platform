# 📝 uBlog

**uBlog** is a full-stack MERN (MongoDB, Express, React, Node.js) web application that functions like a social media platform for blogging. Users can create a personal profile, write and share blogs or notes, interact with others by liking, saving, and commenting on posts.

## 🚀 Features

- 🌐 User authentication (signup/login)
- 🧑‍💼 Profile creation and management
- ✍️ Create and edit blog posts and notes
- 📤 Upload images via Cloudinary
- ❤️ Like and 💾 save posts
- 💬 Comment on blogs
- 🔍 Browse all blogs with user interactions
- 📱 Fully responsive UI

## 🛠️ Tech Stack

- **Frontend:** React, Redux, Tailwind CSS (or your styling choice)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Image Hosting:** Cloudinary
- **Authentication:** JWT + Cookies or Local Storage
- **Other:** dotenv, bcrypt, multer, etc.

---

## 📦 Installation and Setup

### 1. Clone the Repository

<pre><code>git clone https://github.com/NikhilMali77/ublog-An-Blogging-Platform.git
cd ublog</code></pre>

### 2. Install Dependencies

#### For Backend:

<pre><code>cd server
npm install</code></pre>

#### For Frontend:

<pre><code>cd client
npm install</code></pre>

### 3. Create `.env` files

#### Backend `.env` in `server/` directory:

<pre><code>SESSION_SECRET=your-secret
API_SECRET=your-apisecret
API_KEY=your-cloudinary-api-key
CLOUD_NAME=your-cloudinary-cloud-name
MONGO_URI=your-mongodb-uri</code></pre>

#### Frontend `.env` in `client/` directory (if needed):

<pre><code>REACT_APP_API_URL=http://localhost:5000</code></pre>

### 4. Run the App

#### Backend:

<pre><code>cd server
npm run dev</code></pre>

#### Frontend:

<pre><code>cd client
npm start</code></pre>

Now open your browser at:  
👉 `http://localhost:3000`

---

## 🖼️ Screenshots

![image](https://github.com/user-attachments/assets/28e2f6f9-78c9-4022-8204-8037eed58832)

![image](https://github.com/user-attachments/assets/231aae03-c316-4b58-b511-8876820c8783)![image](https://github.com/user-attachments/assets/ece4f151-dd0c-44ad-88d7-566afa8c4b3c)

![image](https://github.com/user-attachments/assets/13b0c9d1-28fb-4e14-b60f-ce83a4eb97f3)

![image](https://github.com/user-attachments/assets/7b6094c6-3bed-4227-8b98-c6cc3953f714)

![image](https://github.com/user-attachments/assets/5ab8252a-a756-49a1-bd08-312d4c7bcb0a)

![image](https://github.com/user-attachments/assets/281b5a9c-1318-4ecd-9577-caa1e7b2d596)


---

## 📂 Folder Structure

<pre><code>
ublog/
│
├── client/            # React frontend
│   └── ...
├── server/            # Express backend
│   └── ...
├── README.md
└── ...
</code></pre>

---

## 🌍 Deployment

You can deploy:

- **Frontend** on: Vercel / Netlify  
- **Backend** on: Render / Railway / Cyclic  
- **Database** on: MongoDB Atlas

> Make sure to set environment variables in your deployment settings.

---

## 🙌 Author

Built with 💙 by **Truptesh Tare** & **Nikhil Mali** 
