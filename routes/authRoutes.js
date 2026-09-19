const express = require("express");
const router = express.Router();

// POST /api/auth/login (تسجيل دخول الأدمن فقط)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@picksy.com" && password === "admin1234") {
      return res.status(200).json({
        success: true,
        token: "picksy-admin-secret-token-123",
        user: {
          name: "Admin",
          email: "admin@picksy.com",
          role: "admin",
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "حدث خطأ في السيرفر: " + error.message,
    });
  }
});

module.exports = router;
