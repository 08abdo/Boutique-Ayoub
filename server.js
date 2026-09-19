// 1. قراءة ملف .env في أول سطر بمسار مطلق
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const app = express();

// 2. إعدادات حجم البيانات لاستقبال الصور المتعددة (Base64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 3. إعدادات CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 4. ربط الـ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Root Route
app.get("/", (req, res) => {
  res.send("PICKSY SHOP API (Supabase) is running...");
});

// 5. تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    "Supabase Check:",
    process.env.SUPABASE_URL ? "Loaded ✅" : "Not Loaded ❌",
  );
});
