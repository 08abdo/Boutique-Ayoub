const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "المستخدم موجود بالفعل" });

    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "تم إنشاء حساب الأدمن بنجاح" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "معلومات الدخول غير صحيحة" });
    }
    res.json({ message: "تم تسجيل الدخول بنجاح", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
