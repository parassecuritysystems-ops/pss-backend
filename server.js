require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { adminsDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


// ================= DUMMY ADMIN CHECK =================

(async () => {

  const existing = await new Promise((resolve) => {
    adminsDB.findOne(
      { email: "test@gmail.com" },
      (err, doc) => resolve(doc)
    );
  });

  if (!existing) {

    const hashedPassword = await bcrypt.hash("123456", 10);

    adminsDB.insert({
      name: "Test Admin",
      email: "test@gmail.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date()
    });

    console.log("✅ Dummy admin created");

  } else {

    console.log("✅ Dummy admin already exists");

  }

})();


// ================= MIDDLEWARE =================

app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));

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

// router.get("/all-admins", (req, res) => {
//   adminsDB.find({}, (err, docs) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         error: err.message
//       });
//     }

//     res.json({
//       success: true,
//       count: docs.length,
//       admins: docs
//     });
//   });
// });

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on ${PORT}`);
});
