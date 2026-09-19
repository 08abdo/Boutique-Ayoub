const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();

// إعدادات حجم البيانات
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// إعدادات CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ربط الـ Routes الخاصة بالـ API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// مسار فحص الـ API للمطورين
app.get("/api-status", (req, res) => {
  res.send("BOUTIQUE AYOUB API (Supabase) is running...");
});

// =========================================================
// تقديم ملفات الواجهات (Frontend Static Files)
// =========================================================

// 1. تقديم ملفات لوحة التحكم (Admin) عند طلب /admin
app.use("/admin", express.static(path.join(__dirname, "admin")));

// 2. تقديم ملفات المتجر للزبائن (Public) في الرابط الرئيسي /
app.use(express.static(path.join(__dirname, "public")));

// 3. توجيه جميع مسارات الأدمن الفرعية إلى صفحة admin/index.html
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

// 4. توجيه بقية المسارات إلى صفحة public/index.html الخاصة بالزبائن
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================================================
// تشغيل السيرفر
// =========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🛒 Customer App: http://localhost:${PORT}`);
  console.log(`🛠️ Admin Panel: http://localhost:${PORT}/admin`);
});
