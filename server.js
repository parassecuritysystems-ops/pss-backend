require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const { adminsDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: [
    "https://parassecurity.in",
    "https://pssadmin.parassecurity.in",
    "https://api.parassecurity.in"
  ],
  credentials: true
}));

app.use(express.static(path.join(__dirname, "admin")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= MIDDLEWARE =================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/quote", quoteRoutes);

app.use("/api/chatbot", chatbotRoutes);

app.use("/api/admin", adminRoutes);



// ================= DEFAULT ADMIN =================

adminsDB.findOne(
  { email: "parassecuritysystems@gmail.com" },
  async (err, admin) => {

    if (!admin) {

      const hashedPassword = await bcrypt.hash("Paras@123", 10);

      adminsDB.insert({
        name: "Super Admin",
        email: "parassecuritysystems@gmail.com",
        password: hashedPassword,
        role: "superadmin",
        createdAt: new Date()
      });

      console.log("✅ Default admin created");
      console.log("📧 Email: parassecuritysystems@gmail.com");
      console.log("🔑 Password: Paras@123");
    }

  }
);


const fs = require("fs");

if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database");
}


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on ${PORT}`);
});
