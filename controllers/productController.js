const supabase = require("../config/supabase"); // التأكد من مسار ملف إعدادات Supabase

// 1. جلب كافة المنتجات
exports.getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
  }
};

// 2. إنشاء منتج جديد
exports.createProduct = async (req, res) => {
  try {
    const { title, name, price, category, image_url, images, sizes } = req.body;

    // معالجة المقاسات لحفظها كـ JSONB وتجنب قيمة null
    let processedSizes = sizes;
    if (!processedSizes || processedSizes === "" || processedSizes === "null") {
      processedSizes = {};
    }

    const newProduct = {
      title: title || name,
      price: Number(price) || 0,
      category: category || "عام",
      image_url: image_url || (images && images[0]) || "",
      images: Array.isArray(images) ? images : image_url ? [image_url] : [],
      sizes: processedSizes, // تمرير كائن الـ JSONB مباشرة لـ Supabase
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select();

    if (error) {
      console.error("Supabase Create Error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    console.error("Server Create Error:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
  }
};

// 3. تحديث منتج
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, price, category, image_url, images, sizes } = req.body;

    let processedSizes = sizes;
    if (!processedSizes || processedSizes === "" || processedSizes === "null") {
      processedSizes = {};
    }

    const updatedData = {
      title: title || name,
      price: Number(price) || 0,
      category: category || "عام",
      image_url: image_url || (images && images[0]) || "",
      images: Array.isArray(images) ? images : image_url ? [image_url] : [],
      sizes: processedSizes,
    };

    const { data, error } = await supabase
      .from("products")
      .update(updatedData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, data: data[0] });
  } catch (err) {
    console.error("Server Update Error:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
  }
};

// 4. حذف منتج
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (err) {
    console.error("Server Delete Error:", err);
    res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
  }
};
