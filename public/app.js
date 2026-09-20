// ==========================================
// 1. إدارة السلة (LocalStorage)
// ==========================================
let cart = JSON.parse(localStorage.getItem("picksy_cart")) || [];

function updateCartUI() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalCount;
  }
}

function saveCartAndSync() {
  localStorage.setItem("picksy_cart", JSON.stringify(cart));
  updateCartUI();
}

function toggleCart() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    const isOpen =
      modal.classList.contains("open") || modal.classList.contains("active");
    if (!isOpen) {
      renderCartDrawer();
      modal.classList.add("open", "active");
    } else {
      modal.classList.remove("open", "active");
    }
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsContainer");
  const totalElem = document.getElementById("cartTotalPrice");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-cart-msg" style="text-align:center; padding:20px; color:#8b949e;">السلة فارغة حالياً</p>';
    if (totalElem) totalElem.innerText = "0 د.ج";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const itemPrice = Number(item.price) || 0;
    const itemTotal = itemPrice * item.quantity;
    total += itemTotal;

    const sizeTag = item.selected_size
      ? `<div style="font-size: 0.85rem; color: #3fb950; font-weight: bold; margin-top: 3px;">المقاس: ${item.selected_size}</div>`
      : "";

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image_url || (item.images && item.images[0]) || "https://via.placeholder.com/80"}" class="cart-item-img" alt="${item.title || item.name}">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title || item.name}</h4>
        ${sizeTag}
        <div class="cart-item-price">${itemPrice.toLocaleString()} د.ج</div>
        <div class="cart-item-actions">
          <button class="qty-btn" type="button" onclick="updateQuantity('${item.id}', -1, '${item.image_url || ""}', '${item.selected_size || ""}')">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" type="button" onclick="updateQuantity('${item.id}', 1, '${item.image_url || ""}', '${item.selected_size || ""}')">+</button>
          <button class="remove-btn" type="button" onclick="removeFromCart('${item.id}', '${item.image_url || ""}', '${item.selected_size || ""}')">حذف</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  if (totalElem) {
    totalElem.innerText = `${total.toLocaleString()} د.ج`;
  }
}

function updateQuantity(
  productId,
  change,
  selectedImage = "",
  selectedSize = "",
) {
  const item = cart.find(
    (p) =>
      String(p.id) === String(productId) &&
      (!selectedImage || p.image_url === selectedImage) &&
      (!selectedSize || p.selected_size === selectedSize),
  );
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId, selectedImage, selectedSize);
  } else {
    saveCartAndSync();
    renderCartDrawer();
  }
}

function removeFromCart(productId, selectedImage = "", selectedSize = "") {
  cart = cart.filter((p) => {
    if (String(p.id) !== String(productId)) return true;
    if (selectedImage && p.image_url !== selectedImage) return true;
    if (selectedSize && p.selected_size !== selectedSize) return true;
    return false;
  });
  saveCartAndSync();
  renderCartDrawer();
}

function addToCart(product, customImage = null, customSize = null) {
  if (!product || !product.id) return;

  const chosenImg =
    customImage ||
    product.selected_image ||
    product.image_url ||
    (product.images && product.images[0]) ||
    "";

  const chosenSize = customSize || product.selected_size || "";

  const existingItem = cart.find(
    (p) =>
      String(p.id) === String(product.id) &&
      p.image_url === chosenImg &&
      (p.selected_size || "") === chosenSize,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      image_url: chosenImg,
      selected_size: chosenSize,
      quantity: 1,
    });
  }

  saveCartAndSync();
  renderCartDrawer();
  showNotification("تمت إضافة المنتج للسلة بنجاح!");
}

// ==========================================
// 2. تفاصيل المنتج والمقاسات (Product Modal)
// ==========================================
let selectedProduct = null;
let selectedProductVariantImage = null;
let selectedProductSize = null;

function openProductModal(product, currentCardImage = null) {
  selectedProduct = product;

  const modal = document.getElementById("productModal");
  if (!modal) return;

  const imgEl = document.getElementById("modalProductImg");
  const titleEl = document.getElementById("modalProductTitle");
  const catEl = document.getElementById("modalProductCategory");
  const priceEl = document.getElementById("modalProductPrice");

  let productImages = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    productImages = product.images;
  } else if (product.image_url) {
    productImages = [product.image_url];
  } else {
    productImages = ["https://via.placeholder.com/300"];
  }

  selectedProductVariantImage = currentCardImage || productImages[0];

  if (imgEl) imgEl.src = selectedProductVariantImage;
  if (titleEl)
    titleEl.innerText = product.title || product.name || "بدون عنوان";
  if (catEl) catEl.innerText = product.category || "عام";
  if (priceEl)
    priceEl.innerText = `${Number(product.price || 0).toLocaleString()} د.ج`;

  renderThumbnails(productImages, selectedProductVariantImage);

  const rawSizes =
    product.sizes ||
    product.pointures ||
    product.sizes_stock ||
    product.variants ||
    product.size;
  renderSizeOptions(rawSizes);

  modal.classList.add("open", "active");
}

function renderThumbnails(images, initialSelectedImage) {
  let thumbContainer = document.getElementById("modalThumbnailsContainer");
  if (!thumbContainer) return;

  thumbContainer.innerHTML = "";

  if (images.length > 1) {
    images.forEach((imgUrl) => {
      const thumb = document.createElement("img");
      thumb.src = imgUrl;
      thumb.style.cssText =
        "width: 50px; height: 50px; border-radius: 6px; cursor: pointer; object-fit: cover; margin: 4px; border: 2px solid transparent;";
      if (imgUrl === initialSelectedImage) {
        thumb.style.borderColor = "#238636";
      }

      thumb.onclick = () => {
        const mainImg = document.getElementById("modalProductImg");
        if (mainImg) mainImg.src = imgUrl;

        selectedProductVariantImage = imgUrl;

        Array.from(thumbContainer.children).forEach(
          (child) => (child.style.borderColor = "transparent"),
        );
        thumb.style.borderColor = "#238636";
      };

      thumbContainer.appendChild(thumb);
    });
  }
}

function parseSizesData(data) {
  if (!data) return [];
  let parsed = data;

  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      if (data.includes(","))
        return data
          .split(",")
          .map((s) => ({ size: s.trim(), stock: 1 }))
          .filter((i) => i.size);
      return [{ size: data.trim(), stock: 1 }];
    }
  }

  let result = [];
  if (Array.isArray(parsed)) {
    result = parsed.map((item) => {
      if (typeof item === "object" && item !== null) {
        const sizeName =
          item.size || item.pointure || item.name || Object.keys(item)[0] || "";
        const sizeStock = item.stock !== undefined ? Number(item.stock) : 1;
        return {
          size: String(sizeName).trim(),
          stock: isNaN(sizeStock) ? 1 : sizeStock,
        };
      }
      return { size: String(item).trim(), stock: 1 };
    });
  } else if (typeof parsed === "object") {
    result = Object.keys(parsed).map((key) => ({
      size: String(key).trim(),
      stock: Number(parsed[key]) || 0,
    }));
  }

  return result.filter((i) => i.size && i.size !== "undefined");
}

function renderSizeOptions(sizesData) {
  const sizeContainer = document.getElementById("modalSizesContainer");
  if (!sizeContainer) return;

  sizeContainer.innerHTML = "";
  selectedProductSize = null;

  const sizesList = parseSizesData(sizesData);
  if (sizesList.length === 0) {
    sizeContainer.style.display = "none";
    return;
  }

  sizeContainer.style.display = "block";

  const title = document.createElement("div");
  title.style.cssText =
    "font-weight: bold; margin-bottom: 8px; font-size: 0.95rem; color: #c9d1d9; text-align: center;";
  title.innerText = "اختر المقاس:";
  sizeContainer.appendChild(title);

  const btnsBox = document.createElement("div");
  btnsBox.style.cssText =
    "display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;";

  sizesList.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerText = item.size;

    if (item.stock <= 0) {
      btn.disabled = true;
      btn.style.cssText =
        "padding: 6px 12px; border-radius: 6px; border: 1px solid #30363d; background: #21262d; color: #484f58; text-decoration: line-through;";
    } else {
      btn.style.cssText =
        "padding: 6px 12px; border-radius: 6px; border: 1px solid #30363d; background: #0d1117; color: #c9d1d9; cursor: pointer; font-weight: bold;";

      btn.onclick = () => {
        selectedProductSize = item.size;
        Array.from(btnsBox.children).forEach((b) => {
          if (!b.disabled) {
            b.style.background = "#0d1117";
            b.style.borderColor = "#30363d";
          }
        });
        btn.style.background = "#238636";
        btn.style.borderColor = "#238636";
      };

      if (!selectedProductSize) {
        selectedProductSize = item.size;
        btn.style.background = "#238636";
        btn.style.borderColor = "#238636";
      }
    }
    btnsBox.appendChild(btn);
  });

  sizeContainer.appendChild(btnsBox);
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.remove("open", "active");
}

function addCurrentProductToCart() {
  if (selectedProduct) {
    addToCart(
      selectedProduct,
      selectedProductVariantImage,
      selectedProductSize,
    );
    closeProductModal();
  }
}

// ==========================================
// 3. إدارة النوافذ المنبثقة وإشارت التنبيه
// ==========================================
function openCheckoutForm() {
  if (!cart || cart.length === 0) {
    showNotification("السلة فارغة حالياً!", "error");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("open", "active");
}

function closeCheckoutForm() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("open", "active");
}

function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) modal.classList.add("open", "active");
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) modal.classList.remove("open", "active");
}

function showNotification(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  if (toast) {
    toast.innerText = message;
    toast.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: ${type === "error" ? "#da3633" : "#238636"}; color: #fff; padding: 12px 24px; border-radius: 8px; z-index: 9999; display: block; font-weight: bold;`;
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }
}

// ==========================================
// 4. جلب وعرض المنتجات وتصفية الأقسام
// ==========================================
let allProducts = [];

async function fetchAndRenderProducts(selectedCategory = "all") {
  const productsGrid = document.getElementById("productsContainer");
  if (!productsGrid) return;

  try {
    if (allProducts.length === 0) {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error(`خطأ: ${response.status}`);
      const data = await response.json();
      allProducts = Array.isArray(data) ? data : data.products || [];
    }

    let filteredProducts = allProducts;
    if (selectedCategory && selectedCategory !== "all") {
      filteredProducts = allProducts.filter(
        (p) => p.category && p.category.trim() === selectedCategory.trim(),
      );
    }

    productsGrid.innerHTML = "";
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `<div class="loading-text" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #8b949e;">لا توجد منتجات متوفرة في هذا القسم حالياً.</div>`;
      return;
    }

    renderProductCards(filteredProducts, productsGrid);
  } catch (err) {
    console.error("Fetch Error:", err);
    productsGrid.innerHTML = `<div class="error-msg" style="grid-column: 1/-1; text-align: center; color: #f85149;">حدث خطأ أثناء تحميل السلع. تأكد من اتصال الخادم.</div>`;
  }
}

function filterByCategory(categoryName, cardElement) {
  // تحديث الكلاس active للأزرار
  const cards = document.querySelectorAll(".category-card");
  cards.forEach((c) => c.classList.remove("active"));
  if (cardElement) cardElement.classList.add("active");

  fetchAndRenderProducts(categoryName);
}

function renderProductCards(products, container) {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    let productImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image_url || "https://via.placeholder.com/300"];

    const badge =
      productImages.length > 1
        ? `<span class="img-count-badge">🖼️ ${productImages.length}</span>`
        : "";

    card.innerHTML = `
      <div class="image-box" id="img-box-${product.id}">
        ${badge}
        <img id="main-card-img-${product.id}" src="${productImages[0]}" alt="${product.title || "منتج"}">
      </div>
      <div class="card-content">
        <span class="category-tag">${product.category || "عام"}</span>
        <h3 class="product-name" id="title-${product.id}">${product.title || "منتج"}</h3>
        <div class="card-footer">
          <span class="price">${Number(product.price || 0).toLocaleString()} د.ج</span>
          <button class="buy-btn" id="btn-add-${product.id}">طلب / شراء</button>
        </div>
      </div>
    `;

    container.appendChild(card);

    const openHandler = () => {
      const currentCardImg = card.querySelector(
        `#main-card-img-${product.id}`,
      )?.src;
      openProductModal(product, currentCardImg);
    };

    document
      .getElementById(`img-box-${product.id}`)
      .addEventListener("click", openHandler);
    document
      .getElementById(`title-${product.id}`)
      .addEventListener("click", openHandler);
    document
      .getElementById(`btn-add-${product.id}`)
      .addEventListener("click", (e) => {
        e.stopPropagation();
        openHandler();
      });
  });
}

// ==========================================
// 5. إرسال الطلبيات (الشراء المباشر + السلة)
// ==========================================
let isSubmitting = false;

function initForms() {
  // 1. نموذج السلة الرئيسية
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.onsubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting || cart.length === 0) return;

      const customerName = document.getElementById("custName")?.value.trim();
      const phone = document.getElementById("custPhone")?.value.trim();
      const address = document.getElementById("custAddress")?.value.trim();

      const orderPayload = {
        customer_name: customerName,
        phone: phone,
        address: address,
        items: cart.map((item) => ({
          id: item.id,
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selected_size || "",
          image_url: item.image_url,
        })),
        total_price: cart.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
          0,
        ),
      };

      sendOrder(orderPayload, checkoutForm);
    };
  }

  // 2. نموذج الشراء المباشر من تفاصيل المنتج
  const directBuyForm = document.getElementById("directBuyForm");
  if (directBuyForm) {
    directBuyForm.onsubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting || !selectedProduct) return;

      const customerName = document
        .getElementById("modalCustName")
        ?.value.trim();
      const phone = document.getElementById("modalCustPhone")?.value.trim();
      const address = document.getElementById("modalCustAddress")?.value.trim();

      const orderPayload = {
        customer_name: customerName,
        phone: phone,
        address: address,
        items: [
          {
            id: selectedProduct.id,
            title: selectedProduct.title || selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
            size: selectedProductSize || "",
            image_url: selectedProductVariantImage || selectedProduct.image_url,
          },
        ],
        total_price: Number(selectedProduct.price) || 0,
      };

      sendOrder(orderPayload, directBuyForm, true);
    };
  }
}

async function sendOrder(orderPayload, formElement, isDirect = false) {
  const submitBtn = formElement.querySelector("button[type='submit']");
  try {
    isSubmitting = true;
    if (submitBtn) submitBtn.innerText = "جاري الإرسال...";

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      if (!isDirect) {
        cart = [];
        saveCartAndSync();
        closeCheckoutForm();
        toggleCart();
      } else {
        closeProductModal();
      }
      formElement.reset();
      showSuccessModal();
    } else {
      showNotification(data.message || "تعذر إرسال الطلب", "error");
    }
  } catch (err) {
    showNotification("تعذر الاتصال بالسيرفر", "error");
  } finally {
    isSubmitting = false;
    if (submitBtn)
      submitBtn.innerText = isDirect
        ? "تأكيد الشراء الآن ⚡"
        : "تأكيد وإرسال الطلبية";
  }
}

// ==========================================
// 6. التشغيل الذاتي عند تحميل الصفحة
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  fetchAndRenderProducts("all");
  initForms();

  // إغلاق القائمة الجانبية للهاتف عند الضغط
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.querySelector(".nav-menu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});
