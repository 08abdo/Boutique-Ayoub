// ==========================================
// 1. إدارة السلة (LocalStorage)
// ==========================================
let cart = JSON.parse(localStorage.getItem("picksy_cart")) || [];

function updateCartUI() {
  const badge =
    document.getElementById("cartCount") || document.querySelector(".badge");
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
    modal.classList.toggle("open");
    modal.classList.toggle("active");
    if (
      modal.classList.contains("open") ||
      modal.classList.contains("active")
    ) {
      renderCartDrawer();
    }
  }
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsContainer");
  const totalElem = document.getElementById("cartTotalPrice");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">السلة فارغة حالياً</p>';
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
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1, '${item.image_url || ""}', '${item.selected_size || ""}')">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1, '${item.image_url || ""}', '${item.selected_size || ""}')">+</button>
          <button class="remove-btn" onclick="removeFromCart('${item.id}', '${item.image_url || ""}', '${item.selected_size || ""}')">حذف</button>
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
  showNotification("تمت إضافة المنتج للسلة بنجاح!");
}

// ==========================================
// 2. نافذة تفاصيل المنتج والـ Modals مع معرض الصور والمقاسات
// ==========================================
let selectedProduct = null;
let selectedProductVariantImage = null;
let selectedProductSize = null;

function openProductModal(product, currentCardImage = null) {
  selectedProduct = product;
  console.log("المنتج المختار الحالي:", product);

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

  // جلب المقاسات بجميع الاحتمالات الممكنة للحقول من السيرفر/Supabase
  const rawSizes =
    product.sizes !== undefined && product.sizes !== null
      ? product.sizes
      : product.pointures ||
        product.sizes_stock ||
        product.variants ||
        product.size ||
        product.pointure;

  renderSizeOptions(rawSizes);

  modal.classList.add("open");
  modal.classList.add("active");
}

function renderThumbnails(images, initialSelectedImage) {
  let thumbContainer = document.getElementById("modalThumbnailsContainer");

  if (!thumbContainer) {
    const mainImg = document.getElementById("modalProductImg");
    if (mainImg && mainImg.parentElement) {
      thumbContainer = document.createElement("div");
      thumbContainer.id = "modalThumbnailsContainer";
      thumbContainer.style.cssText =
        "display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 5px; justify-content: center;";
      mainImg.parentElement.appendChild(thumbContainer);
    }
  }

  if (!thumbContainer) return;
  thumbContainer.innerHTML = "";

  if (images.length > 1) {
    images.forEach((imgUrl) => {
      const thumb = document.createElement("img");
      thumb.src = imgUrl;
      thumb.style.cssText =
        "width: 50px; height: 50px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; opacity: 0.7; transition: all 0.2s;";

      if (imgUrl === initialSelectedImage) {
        thumb.style.borderColor = "#3fb950";
        thumb.style.opacity = "1";
      }

      thumb.onclick = () => {
        const mainImg = document.getElementById("modalProductImg");
        if (mainImg) mainImg.src = imgUrl;

        selectedProductVariantImage = imgUrl;

        Array.from(thumbContainer.children).forEach((child) => {
          child.style.borderColor = "transparent";
          child.style.opacity = "0.7";
        });
        thumb.style.borderColor = "#3fb950";
        thumb.style.opacity = "1";
      };

      thumbContainer.appendChild(thumb);
    });
  }
}

// دالة تحليل ومعالجة المقاسات بمختلف الأشكال الممكنة
function parseSizesData(data) {
  if (data === null || data === undefined || data === "") return [];
  let parsed = data;

  // 1. التعامل مع البيانات القادمة كـ String
  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      // إذا كانت النص يحوي فواصل مثل "39,40,41,42"
      if (data.includes(",")) {
        return data
          .split(",")
          .map((s) => ({ size: s.trim(), stock: 1 }))
          .filter((i) => i.size);
      }
      // إذا كان النص مقاساً واحداً فقط مثل "42" أو "M"
      if (data.trim() !== "") {
        return [{ size: data.trim(), stock: 1 }];
      }
      return [];
    }
  }

  let result = [];

  // 2. إذا كانت البيانات مصفوفة Array
  if (Array.isArray(parsed)) {
    result = parsed.map((item) => {
      if (typeof item === "object" && item !== null) {
        const sizeName =
          item.size || item.pointure || item.name || Object.keys(item)[0] || "";
        const sizeStock =
          item.stock !== undefined
            ? Number(item.stock)
            : item[sizeName] !== undefined
              ? Number(item[sizeName])
              : 1;
        return {
          size: String(sizeName).trim(),
          stock: isNaN(sizeStock) ? 1 : sizeStock,
        };
      }
      return { size: String(item).trim(), stock: 1 };
    });
  }
  // 3. إذا كانت البيانات كائن Object مثل {"41": 5, "42": 0}
  else if (typeof parsed === "object" && parsed !== null) {
    result = Object.keys(parsed).map((key) => ({
      size: String(key).trim(),
      stock: Number(parsed[key]) || 0,
    }));
  }

  return result.filter(
    (i) => i.size && i.size !== "undefined" && i.size !== "null",
  );
}

function renderSizeOptions(sizesData) {
  const sizeContainer = document.getElementById("modalSizesContainer");
  if (!sizeContainer) return;

  sizeContainer.innerHTML = "";
  selectedProductSize = null;

  const sizesList = parseSizesData(sizesData);
  console.log("المقاسات الجاهزة للعرض:", sizesList);

  if (sizesList.length === 0) {
    sizeContainer.style.display = "none";
    return;
  }

  sizeContainer.style.display = "block";

  const title = document.createElement("div");
  title.style.cssText =
    "font-weight: bold; margin-bottom: 8px; font-size: 0.95rem; color: #c9d1d9; text-align: center;";
  title.innerText = "اختر المقاس (Pointure):";
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
      btn.style.cssText = `
        padding: 8px 16px; border-radius: 6px; border: 1px solid #30363d;
        background: #21262d; color: #484f58; cursor: not-allowed;
        text-decoration: line-through; position: relative; font-size: 0.9rem;
      `;
    } else {
      btn.style.cssText = `
        padding: 8px 16px; border-radius: 6px; border: 1px solid #30363d;
        background: #0d1117; color: #fff; cursor: pointer; transition: all 0.2s; font-weight: bold; font-size: 0.9rem;
      `;

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
  if (modal) {
    modal.classList.remove("open");
    modal.classList.remove("active");
  }
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

function buyNowDirectly() {
  if (!selectedProduct) return;

  addToCart(selectedProduct, selectedProductVariantImage, selectedProductSize);
  closeProductModal();
  openCheckoutForm();
}

function openCheckoutForm() {
  if (!cart || cart.length === 0) {
    showNotification("السلة فارغة حالياً!", "error");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.add("open");
    modal.classList.add("active");
  }
}

function closeCheckoutForm() {
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.remove("active");
  }
}

function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.add("open");
    modal.classList.add("active");
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.remove("active");
  }
}

function showNotification(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  if (toast) {
    toast.innerText = message;
    toast.className = `toast-notification ${type} active`;
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  } else {
    console.log(`[Notification]: ${message}`);
  }
}

// ==========================================
// 3. جلب وعرض المنتجات + التصفية حسب القسم
// ==========================================
let allProducts = [];

async function fetchAndRenderProducts(selectedCategory = "الكل") {
  const productsGrid =
    document.getElementById("productsContainer") ||
    document.querySelector(".products-grid") ||
    document.getElementById("products-grid");

  if (!productsGrid) return;

  try {
    if (allProducts.length === 0) {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`خطأ في السيرفر: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        allProducts = data;
      } else if (data.products && Array.isArray(data.products)) {
        allProducts = data.products;
      }
    }

    let filteredProducts = allProducts;
    if (selectedCategory && selectedCategory !== "الكل") {
      filteredProducts = allProducts.filter((p) => {
        if (!p.category) return false;
        const prodCat = p.category.trim();
        const selCat = selectedCategory.trim();

        return (
          prodCat === selCat ||
          (selCat === "القسم الأول" && prodCat === "القسم 1") ||
          (selCat === "القسم الثاني" && prodCat === "القسم 2") ||
          (selCat === "القسم الثالث" && prodCat === "القسم 3")
        );
      });
    }

    productsGrid.innerHTML = "";

    if (!filteredProducts || filteredProducts.length === 0) {
      productsGrid.innerHTML = `<div class="loading-text">لا توجد منتجات متوفرة في هذا القسم.</div>`;
      return;
    }

    renderProductCards(filteredProducts, productsGrid);
  } catch (err) {
    console.error("General Error:", err);
    productsGrid.innerHTML = `<div class="error-msg">حدث خطأ أثناء تحميل السلع من السيرفر.</div>`;
  }
}

function renderProductCards(products, container) {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    let productImages = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      productImages = product.images;
    } else if (product.image_url) {
      productImages = [product.image_url];
    } else {
      productImages = ["https://via.placeholder.com/300"];
    }

    const badge =
      productImages.length > 1
        ? `<span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; z-index: 2;">🖼️ ${productImages.length} صور</span>`
        : "";

    const navArrows =
      productImages.length > 1
        ? `<button class="card-img-prev" style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; z-index: 3;">❮</button>
           <button class="card-img-next" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; z-index: 3;">❯</button>`
        : "";

    card.innerHTML = `
      <div class="image-box" id="img-box-${product.id}" style="position: relative; cursor: pointer; overflow: hidden;">
        ${badge}
        ${navArrows}
        <img id="main-card-img-${product.id}" src="${productImages[0]}" alt="${product.title || "منتج"}" style="width: 100%; height: 220px; object-fit: cover;">
      </div>
      <div class="card-content">
        <span class="category-tag">${product.category || "عام"}</span>
        <h3 class="product-name" id="title-${product.id}">${product.title || "منتج بدون عنوان"}</h3>
        <div class="card-footer">
          <span class="price">${Number(product.price || 0).toLocaleString()} د.ج</span>
          <button class="buy-btn" id="btn-add-${product.id}">إضافة للسلة</button>
        </div>
      </div>
    `;

    container.appendChild(card);

    let currentImgIdx = 0;

    if (productImages.length > 1) {
      const prevBtn = card.querySelector(".card-img-prev");
      const nextBtn = card.querySelector(".card-img-next");
      const cardImg = card.querySelector(`#main-card-img-${product.id}`);

      prevBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        currentImgIdx =
          (currentImgIdx - 1 + productImages.length) % productImages.length;
        cardImg.src = productImages[currentImgIdx];
      });

      nextBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        currentImgIdx = (currentImgIdx + 1) % productImages.length;
        cardImg.src = productImages[currentImgIdx];
      });
    }

    document
      .getElementById(`img-box-${product.id}`)
      .addEventListener("click", () => {
        const currentCardImg = card.querySelector(
          `#main-card-img-${product.id}`,
        )?.src;
        openProductModal(product, currentCardImg);
      });

    document
      .getElementById(`title-${product.id}`)
      .addEventListener("click", () => {
        const currentCardImg = card.querySelector(
          `#main-card-img-${product.id}`,
        )?.src;
        openProductModal(product, currentCardImg);
      });

    document
      .getElementById(`btn-add-${product.id}`)
      .addEventListener("click", (e) => {
        e.stopPropagation();
        const currentCardImg = card.querySelector(
          `#main-card-img-${product.id}`,
        )?.src;
        openProductModal(product, currentCardImg);
      });
  });
}

function filterByCategory(categoryName) {
  fetchAndRenderProducts(categoryName);

  const productsSection =
    document.getElementById("productsContainer") ||
    document.querySelector(".products-grid") ||
    document.getElementById("products-grid");

  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}

// ==========================================
// 4. الشراء المباشر وإرسال الطلبيات
// ==========================================
let isSubmitting = false;

async function handleDirectCheckout(e) {
  if (e) e.preventDefault();

  if (isSubmitting) return;

  if (!selectedProduct) {
    showNotification("لم يتم تحديد أي منتج!", "error");
    return;
  }

  const name = document.getElementById("modalCustName")?.value.trim();
  const phone = document.getElementById("modalCustPhone")?.value.trim();
  const address = document.getElementById("modalCustAddress")?.value.trim();

  if (!name || !phone || !address) {
    showNotification("الرجاء ملء جميع الحقول المطلوبة!", "error");
    return;
  }

  const submitBtn = document.querySelector(
    "#directBuyForm button[type='submit']",
  );
  const originalText = submitBtn ? submitBtn.innerText : "";

  try {
    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "جاري الإرسال...";
    }

    const orderPayload = {
      customer_name: name,
      phone: phone,
      address: address,
      items: [
        {
          id: selectedProduct.id,
          title: selectedProduct.title || selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
          size: selectedProductSize || "",
          image_url:
            selectedProductVariantImage ||
            selectedProduct.image_url ||
            (selectedProduct.images && selectedProduct.images[0]) ||
            "",
        },
      ],
      total_price: Number(selectedProduct.price || 0),
    };

    await sendOrderToServer(orderPayload, () => {
      closeProductModal();
      document.getElementById("directBuyForm")?.reset();
    });
  } finally {
    isSubmitting = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  }
}

// ==========================================
// 5. إرسال الطلبية من السلة
// ==========================================
function initCheckoutForm() {
  const checkoutForm = document.getElementById("checkoutForm");
  if (!checkoutForm) return;

  checkoutForm.onsubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (cart.length === 0) {
      showNotification("السلة فارغة!", "error");
      return;
    }

    const customerName = document.getElementById("custName")?.value.trim();
    const phone = document.getElementById("custPhone")?.value.trim();
    const address = document.getElementById("custAddress")?.value.trim();

    const totalPrice = cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0,
    );

    const formattedItems = cart.map((item) => ({
      id: item.id,
      title: item.title || item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.selected_size || "",
      image_url: item.image_url,
    }));

    const orderPayload = {
      customer_name: customerName,
      phone: phone,
      address: address,
      items: formattedItems,
      total_price: totalPrice,
    };

    const submitBtn = checkoutForm.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerText : "";

    try {
      isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "جاري الإرسال...";
      }

      await sendOrderToServer(orderPayload, () => {
        cart = [];
        saveCartAndSync();
        checkoutForm.reset();
        closeCheckoutForm();
        const cartModal = document.getElementById("cartModal");
        if (
          cartModal?.classList.contains("open") ||
          cartModal?.classList.contains("active")
        ) {
          toggleCart();
        }
      });
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
      }
    }
  };
}

async function sendOrderToServer(orderPayload, onSuccess) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (onSuccess) onSuccess();
      showSuccessModal();
    } else {
      showNotification(data.message || "تعذر إرسال الطلب", "error");
    }
  } catch (err) {
    console.error("Error submitting order:", err);
    showNotification(
      "تعذر الاتصال بالسيرفر. تأكد من تشغيل الـ Backend.",
      "error",
    );
  }
}

// ==========================================
// 6. إدارة تنقل القائمة الرئيسية وربط أزرار الأقسام
// ==========================================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-menu a");
  const sections = document.querySelectorAll("section, main, footer");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  window.addEventListener("scroll", () => {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  const categoryCards = document.querySelectorAll(
    ".category-card, .categories-grid > div",
  );
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card
        .querySelector("h3, h4, .category-title")
        ?.innerText.trim();
      if (title) {
        filterByCategory(title);
      }
    });
  });
}

// ==========================================
// 7. التهيئة عند تحميل الصفحة
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
  fetchAndRenderProducts();
  initNavigation();
  initCheckoutForm();

  const directBuyForm = document.getElementById("directBuyForm");
  if (directBuyForm) {
    directBuyForm.onsubmit = handleDirectCheckout;
  }
});
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}
