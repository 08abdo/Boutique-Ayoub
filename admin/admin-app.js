const API_URL = "/api";
let currentCategory = "جميع المنتجات";
let allProducts = [];
let deleteTargetId = null;

// ==========================================
// 1. تجهيز وضغط الصور (Base64)
// ==========================================
function getBase64(file, maxWidth = 500, quality = 0.5) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

async function getMultipleBase64(files) {
  const promises = Array.from(files).map((file) => getBase64(file));
  return Promise.all(promises);
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function checkAuth() {
  const token = localStorage.getItem("adminToken");
  if (!token) window.location.href = "login.html";
}

// ==========================================
// إدارة المقاسات والمخزون الديناميكية
// ==========================================
function addAdminSizeRow(containerId, sizeValue = "", stockValue = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const row = document.createElement("div");
  row.className = "size-row";
  row.style.cssText = "display: flex; gap: 10px; align-items: center;";

  row.innerHTML = `
    <input type="text" class="size-input" placeholder="المقاس (مثلاً 38 أو M)" value="${sizeValue}" style="flex: 2; padding: 6px; border-radius: 6px; border: 1px solid #30363d; background: #0d1117; color: #fff;">
    <input type="number" class="stock-input" placeholder="الكمية" value="${stockValue}" min="0" style="flex: 1; padding: 6px; border-radius: 6px; border: 1px solid #30363d; background: #0d1117; color: #fff;">
    <button type="button" onclick="this.parentElement.remove()" style="background: #da3633; color: white; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer;">✕</button>
  `;

  container.appendChild(row);
}

function getAdminSizesData(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return {};

  const rows = container.querySelectorAll(".size-row");
  const sizesObj = {};

  rows.forEach((row) => {
    const size = row.querySelector(".size-input").value.trim();
    const stock = Number(row.querySelector(".stock-input").value) || 0;
    if (size) {
      sizesObj[size] = stock;
    }
  });

  return sizesObj;
}

function populateAdminSizes(containerId, sizesData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  if (!sizesData) {
    addAdminSizeRow(containerId);
    return;
  }

  // تحويل البيانات سواء كانت كائن (Object) أو مصفوفة (Array)
  if (Array.isArray(sizesData)) {
    sizesData.forEach((item) => {
      if (typeof item === "object") {
        addAdminSizeRow(
          containerId,
          item.size || item.pointure || "",
          item.stock || item.quantity || 0,
        );
      } else {
        addAdminSizeRow(containerId, item, 0);
      }
    });
  } else if (typeof sizesData === "object") {
    Object.keys(sizesData).forEach((size) => {
      addAdminSizeRow(containerId, size, sizesData[size]);
    });
  }

  if (container.children.length === 0) {
    addAdminSizeRow(containerId);
  }
}

// ==========================================
// 2. إدارة النوافذ المنبثقة (Modals)
// ==========================================
function openAddModal() {
  const catSelect = document.getElementById("categorySelect");
  if (catSelect && currentCategory !== "جميع المنتجات") {
    catSelect.value = currentCategory;
  }

  // إعادة تهيئة حقول المقاسات للإضافة
  const addSizesContainer = document.getElementById("addSizesContainer");
  if (addSizesContainer) {
    addSizesContainer.innerHTML = "";
    addAdminSizeRow("addSizesContainer");
  }

  document.getElementById("addProductModal").style.display = "flex";
}

function closeAddModal() {
  document.getElementById("addProductModal").style.display = "none";
  document.getElementById("addProductForm").reset();
}

function openEditModal(id, title, price, category, images, sizes) {
  document.getElementById("editProdId").value = id;
  document.getElementById("editProdTitle").value = title;
  document.getElementById("editProdPrice").value = price;

  const categorySelect = document.getElementById("editProdCategory");
  if (categorySelect && category) {
    categorySelect.value = category;
  }

  // تعبئة المقاسات والمخزون للتعديل
  populateAdminSizes("editSizesContainer", sizes);

  document.getElementById("editProdImageFiles").value = "";
  document.getElementById("editProductModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editProductModal").style.display = "none";
}

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("confirmDeleteModal").style.display = "flex";
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("confirmDeleteModal").style.display = "none";
}

// ==========================================
// 3. جلب وعرض البيانات والطلبات
// ==========================================
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderCategoryProducts();
  } catch (err) {
    console.error("خطأ في جلب البيانات:", err);
  }
}

async function fetchOrders() {
  const container = document.getElementById("adminOrdersContainer");
  if (!container) return;

  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    const orders = await res.json();

    if (!orders || orders.length === 0) {
      container.innerHTML =
        '<p style="text-align:center; color:#8b949e; grid-column: 1/-1;">لا توجد طلبيات واردة حتى الآن.</p>';
      return;
    }

    container.innerHTML = "";
    orders.forEach((order) => {
      const itemsList = Array.isArray(order.items)
        ? order.items
            .map((item) => {
              const itemImg =
                item.image_url ||
                (Array.isArray(item.images) && item.images[0]) ||
                "https://via.placeholder.com/50";

              const sizeText = item.size
                ? ` | المقاس: <strong>${item.size}</strong>`
                : "";

              return `
                <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #21262d;">
                  <img src="${itemImg}" alt="${item.title || item.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #30363d;">
                  <div>
                    <div style="color: #c9d1d9; font-weight: bold; font-size: 0.95rem;">${item.title || item.name}</div>
                    <div style="font-size: 0.85rem; color: #8b949e;">الكمية: (x${item.quantity || 1})${sizeText} - السعر: <span style="color: #3fb950;">${item.price} د.ج</span></div>
                  </div>
                </li>
              `;
            })
            .join("")
        : "لا توجد تفاصيل";

      const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleString("ar-DZ", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "غير محدد";

      let statusColor = "#e3b341";
      if (order.status === "مؤكدة") statusColor = "#238636";
      if (order.status === "مرفوضة") statusColor = "#da3633";

      const card = document.createElement("div");
      card.className = "admin-card";
      card.style.cssText =
        "background:#161b22; border:1px solid #30363d; border-radius:8px; padding:15px; color:#fff; display:flex; flex-direction:column; justify-content:space-between;";

      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #30363d; padding-bottom:8px; margin-bottom:10px;">
            <h4 style="margin:0;">👤 الزبون: ${order.customer_name}</h4>
            <span style="background:${statusColor}; color:#fff; padding:3px 10px; border-radius:12px; font-size:0.8rem; font-weight:bold;">${order.status || "جديد"}</span>
          </div>

          <p style="margin:4px 0; color:#8b949e; font-size:0.85rem;">🕒 الوقت: <span style="color:#c9d1d9;">${orderDate}</span></p>
          <p style="margin:4px 0;">📞 الهاتف: <a href="tel:${order.phone}" style="color:#58a6ff; text-decoration:none;">${order.phone}</a></p>
          <p style="margin:4px 0;">📍 العنوان: ${order.address}</p>

          <div style="margin-top:10px; background:#0d1117; padding:10px; border-radius:6px; border:1px solid #21262d;">
            <strong style="display: block; margin-bottom: 8px;">المنتجات المطلوبة:</strong>
            <ul style="list-style: none; padding: 0; margin: 0;">${itemsList}</ul>
          </div>

          <div style="margin-top:10px; font-weight:bold; color:#3fb950; font-size:1.05rem;">
            المجموع: ${Number(order.total_price || 0).toLocaleString()} د.ج
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:15px; padding-top:10px; border-top:1px solid #30363d;">
          <button onclick="updateOrderStatus('${order.id}', 'مؤكدة')" style="flex:1; padding:8px; background:#238636; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
            تأكيد الطلب ✅
          </button>
          <button onclick="updateOrderStatus('${order.id}', 'مرفوضة')" style="flex:1; padding:8px; background:#da3633; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
            رفض الطلب ❌
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("خطأ في جلب الطلبيات:", err);
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchOrders();
    } else {
      const errData = await res.json();
      alert(`حدث خطأ: ${errData.message || "تعذر تحديث حالة الطلب"}`);
    }
  } catch (err) {
    console.error("خطأ في تحديث الحالة:", err);
    alert("تعذر الاتصال بالسيرفر لتحديث الحالة.");
  }
}

function switchTab(categoryName, element) {
  currentCategory = categoryName;
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  if (element) element.classList.add("active");

  document.getElementById("currentSectionTitle").innerText =
    `إدارة: ${categoryName}`;
  document.getElementById("categoryLabel").innerText = categoryName;

  const addBtn = document.getElementById("openAddModalBtn");
  if (addBtn) addBtn.style.display = "inline-block";

  document.getElementById("productsSection").style.display = "block";
  document.getElementById("ordersSection").style.display = "none";

  renderCategoryProducts();
}

function showOrdersTab(element) {
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  if (element) element.classList.add("active");

  document.getElementById("currentSectionTitle").innerText =
    "إدارة: الطلبيات الواردة";
  document.getElementById("openAddModalBtn").style.display = "none";
  document.getElementById("productsSection").style.display = "none";
  document.getElementById("ordersSection").style.display = "block";

  fetchOrders();
}

function renderCategoryProducts() {
  const container = document.getElementById("adminProductsContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered =
    currentCategory === "جميع المنتجات"
      ? allProducts
      : allProducts.filter((item) => item.category === currentCategory);

  if (!filtered || filtered.length === 0) {
    container.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #8b949e;">لا توجد منتجات معروضة في هذا القسم.</p>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "admin-card";
    const safeTitle = item.title ? item.title.replace(/'/g, "\\'") : "";

    const images =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : [item.image_url || ""];
    const mainImg = images[0] || "https://via.placeholder.com/150";
    const badge =
      images.length > 1
        ? `<span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">🖼️ ${images.length} صور</span>`
        : "";

    const jsonImages = JSON.stringify(images).replace(/"/g, "&quot;");
    const jsonSizes = JSON.stringify(
      item.sizes || item.pointures || {},
    ).replace(/"/g, "&quot;");

    card.innerHTML = `
      <div style="position: relative;">
        <img src="${mainImg}" alt="${item.title}" style="width:100%; height:160px; object-fit:cover; border-radius:6px;">
        ${badge}
      </div>
      <div style="margin-top: 10px;">
        <h4 style="margin: 0 0 5px 0;">${item.title}</h4>
        <span style="color: #3fb950; font-weight: bold;">${item.price} د.ج</span>
        <div style="font-size:0.8rem; color:#8b949e; margin-top:3px;">القسم: ${item.category || "غير محدد"}</div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button onclick="openEditModal('${item.id}', '${safeTitle}', ${item.price}, '${item.category || ""}', ${jsonImages}, ${jsonSizes})" class="btn-confirm">تعديل ✏️</button>
        <button onclick="openDeleteModal('${item.id}')" class="btn-danger">حذف 🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================
// 4. الحفظ والتعديل والحذف
// ==========================================
document
  .getElementById("addProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerText;

    submitBtn.innerText = "جاري الحفظ والمعالجة...";
    submitBtn.disabled = true;

    const fileInput = document.getElementById("imageFiles");
    const categorySelect = document.getElementById("categorySelect");

    let imagesArray = [];

    try {
      if (fileInput && fileInput.files.length > 0) {
        imagesArray = await getMultipleBase64(fileInput.files);
      }

      const selectedCategory = categorySelect
        ? categorySelect.value
        : currentCategory;

      const sizesData = getAdminSizesData("addSizesContainer");

      const newProduct = {
        title: document.getElementById("name").value,
        price: Number(document.getElementById("price").value),
        image_url: imagesArray[0] || "",
        images: imagesArray,
        category: selectedCategory,
        sizes: sizesData,
        description: "Boutique Ayoub Product",
      };

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newProduct),
      });

      const responseData = await res.json();

      if (res.ok) {
        closeAddModal();
        fetchProducts();
      } else {
        alert(
          `فشل الحفظ: ${responseData.error || responseData.message || "حدث خطأ أثناء حفظ المنتج"}`,
        );
      }
    } catch (err) {
      console.error("خطأ في إضافة المنتج:", err);
      alert("حدث خطأ أثناء رفع المنتج.");
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });

async function saveProductEdit() {
  const id = document.getElementById("editProdId").value;
  const updatedTitle = document.getElementById("editProdTitle").value;
  const updatedPrice = Number(document.getElementById("editProdPrice").value);
  const updatedCategory = document.getElementById("editProdCategory").value;
  const fileInput = document.getElementById("editProdImageFiles");

  let imagesArray = [];

  try {
    if (fileInput && fileInput.files.length > 0) {
      imagesArray = await getMultipleBase64(fileInput.files);
    }

    const sizesData = getAdminSizesData("editSizesContainer");

    const updatedData = {
      title: updatedTitle,
      price: updatedPrice,
      category: updatedCategory,
      sizes: sizesData,
    };

    if (imagesArray.length > 0) {
      updatedData.image_url = imagesArray[0];
      updatedData.images = imagesArray;
    }

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      closeEditModal();
      fetchProducts();
    } else {
      const errData = await res.json();
      alert(`فشل التعديل: ${errData.error || errData.message}`);
    }
  } catch (err) {
    console.error("خطأ في تعديل المنتج:", err);
  }
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", async () => {
    if (!deleteTargetId) return;

    try {
      const res = await fetch(`${API_URL}/products/${deleteTargetId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        closeDeleteModal();
        fetchProducts();
      }
    } catch (err) {
      console.error("خطأ في حذف المنتج:", err);
    }
  });

function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
}

checkAuth();
fetchProducts();
