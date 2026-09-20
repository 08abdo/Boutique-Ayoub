/* =========================================================
   1. المتغيرات العامة وإعادة الضبط (Variables & Base Setup)
   ========================================================= */
root {
  --bg-dark: #161b22;
  --bg-card: #0d1117;
  --bg-hover: #21262d;
  --border-color: #30363d;
  --accent-gold: #eee8aa;
  --accent-green: #238636;
  --accent-green-hover: #2ea043;
  --accent-red: #da3633;
  --accent-red-hover: #f85149;
  --text-main: #f0f6fc;
  --text-muted: #8b949e;
  --text-sub: #c9d1d9;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Cairo", sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-dark);
  color: var(--accent-gold);
  min-height: 100vh;
  direction: rtl;
  text-align: right;
  overflow-x: hidden; /* لمنع التمرير الأفقي غير المرغوب */
}

/* تخصيص شريط التمرير (Custom Scrollbar) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-gold);
}

/* =========================================================
   2. الهيدر وشريط التنقل (Header & Navbar)
   ========================================================= */
.header {
  background-color: var(--bg-dark);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: 0.5px;
}

.logo span {
  color: var(--accent-gold);
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-menu a {
  position: relative;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.4rem 0;
  transition: color 0.3s ease;
}

.nav-menu a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 0;
  height: 2px;
  background-color: var(--accent-gold);
  border-radius: 2px;
  transition: width 0.3s ease, right 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: var(--accent-gold);
}

.nav-menu a:hover::after,
.nav-menu a.active::after {
  width: 100%;
  right: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.cart-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--text-sub);
  cursor: pointer;
}

.icon {
  width: 22px;
  height: 22px;
}

.badge {
  position: absolute;
  top: -6px;
  left: -8px;
  background-color: var(--accent-gold);
  color: var(--bg-dark);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-select {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

/* =========================================================
   3. القسم الرئيسي (Hero / Banner Section)
   ========================================================= */
.hero,
.hero-section {
  position: relative;
  padding: 5rem 1.5rem;
  text-align: center;
  margin: 1.5rem auto;
  max-width: 1200px;
  border-radius: 16px;
  overflow: hidden;
  background-image: linear-gradient(rgba(13, 17, 23, 0.75), rgba(13, 17, 23, 0.75)), url("images/banner.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.hero-container,
.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title,
.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.8rem;
  line-height: 1.3;
}

.hero-title span,
.hero-content h1 span {
  color: var(--accent-gold);
}

.hero-subtitle,
.hero-content p {
  font-size: 1.15rem;
  color: var(--text-sub);
  line-height: 1.7;
}

/* =========================================================
   4. قسم التصنيفات (Categories Section)
   ========================================================= */
.categories-section {
  padding: 2.5rem 1.5rem 1rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.categories-container .section-title {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  color: var(--accent-gold);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
}

.category-card {
  position: relative;
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.cat-img-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.cat-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.cat-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(13, 17, 23, 0.2) 0%, rgba(13, 17, 23, 0.85) 100%);
}

.cat-info {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 1rem;
  z-index: 2;
  text-align: center;
}

.cat-info h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
}

.cat-info p {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-top: 2px;
}

.category-card:hover {
  border-color: var(--accent-gold);
  transform: translateY(-4px);
}

.category-card:hover .cat-img-box img {
  transform: scale(1.08);
}

.category-card.active {
  border-color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(47, 129, 247, 0.4);
}

/* =========================================================
   5. قسم المنتجات (Products Grid)
   ========================================================= */
.main-container {
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1.5rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: var(--text-main);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, border-color 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-gold);
}

/* إصلاح إطار وطول الصور لضمان عدم اختفائها في الهواتف */
.image-box {
  width: 100%;
  height: 220px; /* طول ثابت يضمن ظهور الصورة على الهاتف */
  aspect-ratio: 1/1;
  background-color: var(--bg-hover);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* شارة عدد الصور على كارت المنتج */
.product-card .image-box .img-count-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1rem;
}

.category-tag {
  font-size: 0.75rem;
  color: var(--accent-gold);
  font-weight: 600;
}

.product-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0.3rem 0;
  cursor: pointer;
}

.product-name:hover {
  color: var(--accent-gold);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.price {
  font-weight: 800;
  color: var(--accent-gold);
  font-size: 1.1rem;
}

.buy-btn {
  background-color: var(--accent-gold);
  color: var(--bg-dark);
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  transition: background-color 0.2s, color 0.2s;
}

.buy-btn:hover {
  background-color: var(--accent-green-hover);
  color: #ffffff;
}

.loading-text,
.error-msg {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
}

/* =========================================================
   6. النوافذ المنبثقة وسلة التسوق (Modals & Off-canvas)
   ========================================================= */
.cart-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: flex-end; /* لفتح السلة جانباً */
  align-items: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.cart-modal.open,
.cart-modal.active {
  visibility: visible;
  opacity: 1;
}

.cart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.cart-content {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: var(--bg-dark);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 2;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.cart-modal.open .cart-content {
  transform: translateX(0);
}

.cart-content.checkout-step {
  height: auto;
  max-height: 90vh;
  margin: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transform: scale(0.9);
}

.cart-modal.open .cart-content.checkout-step,
.cart-modal.active .cart-content.checkout-step {
  transform: scale(1);
}

.cart-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  font-size: 1.2rem;
  color: var(--text-main);
}

.close-cart {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-cart:hover {
  color: var(--accent-red-hover);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.empty-cart-msg {
  text-align: center;
  color: var(--text-muted);
  margin-top: 3rem;
  font-size: 0.95rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background-color: var(--bg-card);
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.cart-item-img {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  background-color: var(--bg-hover);
}

.cart-item-details {
  flex: 1;
}

.cart-item-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}

.cart-item-price {
  color: var(--accent-gold);
  font-weight: 700;
  font-size: 0.85rem;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.qty-btn {
  background-color: var(--bg-hover);
  border: 1px solid var(--border-color);
  color: var(--text-sub);
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.qty-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.cart-item-qty {
  font-size: 0.85rem;
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--accent-red-hover);
  cursor: pointer;
  margin-right: auto;
  font-size: 0.8rem;
  font-weight: 600;
}

.cart-footer {
  padding: 1.2rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-dark);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.cart-total span:last-child {
  color: var(--accent-gold);
}

.checkout-btn {
  width: 100%;
  padding: 0.86rem;
  background-color: var(--accent-gold);
  color: var(--bg-dark);
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.checkout-btn:hover {
  background-color: var(--accent-green-hover);
  color: #ffffff;
}

/* تنسيق النماذج */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
  text-align: right;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-sub);
}

.form-group input,
.form-group select,
.form-group textarea {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  font-size: 16px; /* 16px لمنع الزوم التلقائي في الآيفون */
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent-gold);
}

/* =========================================================
   7. النوافذ المنبثقة للتأكيد والنجاح وتنبيهات Toast
   ========================================================= */
.toast-notification {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background-color: var(--bg-dark);
  color: var(--text-main);
  border: 1px solid var(--accent-green);
  padding: 0.9rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 3000;
  visibility: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.toast-notification.active {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.toast-notification.error {
  border-color: var(--accent-red);
  color: var(--accent-red-hover);
}

#customConfirmModal,
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.25s ease;
}

#customConfirmModal.active,
.custom-modal.active {
  visibility: visible;
  opacity: 1;
}

.confirm-modal-box,
.modal-content-box {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  width: 92%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: scale(0.9);
  transition: transform 0.25s ease;
}

#customConfirmModal.active .confirm-modal-box,
.custom-modal.active .modal-content-box {
  transform: scale(1);
}

.confirm-modal-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.modal-icon-success {
  width: 60px;
  height: 60px;
  background-color: rgba(35, 134, 54, 0.2);
  border: 2px solid var(--accent-green);
  color: #3fb950;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1.2rem auto;
}

.btn-cancel {
  flex: 1;
  background-color: var(--bg-hover);
  color: var(--text-sub);
  border: 1px solid var(--border-color);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: var(--border-color);
  color: #ffffff;
}

.btn-confirm-action {
  flex: 1;
  background-color: var(--accent-red);
  color: #ffffff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-confirm-action:hover {
  background-color: var(--accent-red-hover);
}

.modal-btn-ok {
  width: 100%;
  background-color: var(--accent-green);
  color: #ffffff;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-btn-ok:hover {
  background-color: var(--accent-green-hover);
}

/* مصغرات الصور لجميع الشاشات */
#modalThumbnailsContainer {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  padding: 6px 4px;
}

#modalThumbnailsContainer img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.7;
  transition: all 0.25s ease-in-out;
}

#modalThumbnailsContainer img:hover {
  opacity: 1;
  transform: translateY(-2px);
}

#modalThumbnailsContainer img.active-thumb {
  border-color: var(--accent-green-hover);
  opacity: 1;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

/* =========================================================
   8. الفوتر (Footer Section)
   ========================================================= */
.footer {
  background: linear-gradient(180deg, #0d1117 0%, #090d13 100%);
  border-top: 1px solid var(--bg-hover);
  padding: 4rem 1.5rem 1.5rem 1.5rem;
  text-align: center;
  position: relative;
}

.footer-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-logo-circle {
  width: 75px;
  height: 75px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
  margin-bottom: 1.2rem;
}

.logo-text {
  color: #0d1117;
  font-weight: 800;
  font-size: 1.4rem;
}

.footer-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.4rem;
}

.footer-title span {
  color: var(--accent-gold);
}

.footer-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 1.8rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.25s ease;
}

.social-btn:hover {
  background-color: var(--accent-gold);
  border-color: var(--accent-gold);
  color: var(--bg-dark);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(238, 232, 170, 0.3);
}

.footer-bottom {
  width: 100%;
  padding-top: 1.5rem;
  border-top: 1px solid var(--bg-hover);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.developer-tag {
  background-color: var(--bg-dark);
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

.developer-tag code {
  color: var(--accent-gold);
  font-weight: bold;
}

.developer-tag span {
  color: #ffffff;
  font-weight: 600;
}

/* =========================================================
   9. التجاوب مع مختلف الشاشات (Responsive Design)
   ========================================================= */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }

  .nav-menu {
    gap: 0.8rem;
  }

  .nav-menu a {
    font-size: 0.85rem;
  }

  .hero,
  .hero-section {
    padding: 2.5rem 1rem;
    margin: 1rem 0.8rem;
    border-radius: 12px;
  }

  .hero-title,
  .hero-content h1 {
    font-size: 1.6rem;
  }

  .hero-subtitle,
  .hero-content p {
    font-size: 0.9rem;
  }

  .categories-section,
  .main-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* جعل شبكة المنتجات من 2 أعمدة ممتازة للهاتف */
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .category-card {
    height: 120px;
  }

  .product-card {
    border-radius: 10px;
  }

  /* تحديد ارتفاع متناسق للصور على الهواتف */
  .image-box {
    height: 160px;
  }

  .card-content {
    padding: 0.7rem;
  }

  .product-name {
    font-size: 0.88rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 0.95rem;
  }

  .buy-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }

  /* السلة تملأ العرض المتاح في الشاشات الصغيرة */
  .cart-content {
    max-width: 88%;
  }

  .footer-bottom {
    justify-content: center;
    text-align: center;
  }

  .toast-notification {
    right: 15px;
    left: 15px;
    bottom: 15px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  /* للشاشات الصغرى جداً */
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .image-box {
    height: 140px;
  }
}
