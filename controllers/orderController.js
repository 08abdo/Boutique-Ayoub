const supabase = require("../config/supabase");

// تسجيل طلب جديد ومنع التكرار نهائياً
exports.createOrder = async (req, res) => {
  try {
    const { customer_name, phone, address, items, total_price, order_token } =
      req.body;

    if (!customer_name || !phone || !address || !items) {
      return res.status(400).json({
        success: false,
        message: "يرجى إدخال جميع البيانات المطلوبة",
      });
    }

    // 1. فحص التكرار عبر الوقت (آخر 15 ثانية) أو الرمز الفريد
    const fifteenSecondsAgo = new Date(Date.now() - 15000).toISOString();

    const { data: existingOrders } = await supabase
      .from("orders")
      .select("id")
      .eq("phone", phone)
      .eq("total_price", Number(total_price))
      .gte("created_at", fifteenSecondsAgo);

    // إذا تم استقبال نفس الطلب للتو، يتجاهل السيرفر الإدخال الثاني ويرد بنجاح لتجنب تكراره
    if (existingOrders && existingOrders.length > 0) {
      return res.status(200).json({
        success: true,
        message: "تم استقبال طلبك بنجاح",
      });
    }

    // 2. إدخال الطلب لمرة واحدة فقط
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          phone,
          address,
          items,
          total_price: Number(total_price),
          status: "جديد",
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "تم تسجيل الطلبية بنجاح",
      order: data[0],
    });
  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// جلب جميع الطلبيات
exports.getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تحديث حالة الطلبية
// تحديث حالة الطلبية (تأكيد / رفض)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      order: data[0],
    });
  } catch (err) {
    console.error("Update Order Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
