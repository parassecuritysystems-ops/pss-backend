require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ================= CONNECT MONGODB =================

connectDB();

// ================= CORS =================

app.use(cors({
  origin: [
    "https://parassecurity.in",
    "https://pssadmin.parassecurity.in",
    "https://api.parassecurity.in",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true
}));

// ================= STATIC FILES =================

app.use(express.static(path.join(__dirname, "admin")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

// ================= BODY PARSER =================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/admin", adminRoutes);

// ================= DEFAULT SUPER ADMIN =================

async function createDefaultAdmin() {

  try {

    const admin = await Admin.findOne({
      email: "parassecuritysystems@gmail.com"
    });

    if (!admin) {

      const hashedPassword = await bcrypt.hash(
        "Paras@123",
        10
      );

      await Admin.create({
        name: "Super Admin",
        email: "parassecuritysystems@gmail.com",
        password: hashedPassword,
        role: "superadmin",
        createdAt: new Date()
      });

      console.log("✅ Default admin created");
      console.log("📧 Email: parassecuritysystems@gmail.com");
      console.log("🔑 Password: Paras@123");

    } else {

      console.log("✅ Super Admin already exists");

    }

  } catch (error) {

    console.error("Default Admin Error:", error);

  }

}

createDefaultAdmin();

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("=================================");
  console.log(`✅ Server Running on Port ${PORT}`);
  console.log("=================================");

});