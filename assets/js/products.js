/* ================= GLOBAL PRODUCTS ================= */
let ALL_PRODUCTS = [];

/* ================= OPEN PRODUCT ================= */
window.openProduct = id => {
  window.location.href = `product.html?id=${id}`;
};

/* ================= LOAD FROM LOCALSTORAGE ================= */
document.addEventListener("DOMContentLoaded", () => {
  // get products from localStorage (admin)
  ALL_PRODUCTS = window.PRODUCTS || [];

  // filter only enabled products
  ALL_PRODUCTS = ALL_PRODUCTS.filter(p => p.available);

  // sort latest first
  ALL_PRODUCTS.sort((a, b) => Number(b.id) - Number(a.id));

  renderProducts(ALL_PRODUCTS);
});

/* ================= RENDER PRODUCTS ================= */
function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = `<p style="padding:20px">No products found</p>`;
    return;
  }

  const grouped = {};

  // group by category
  products.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  // render categories
  Object.keys(grouped).forEach(category => {
    container.innerHTML += `
      <div class="category-header">
        <h2 class="category-title">${category}</h2>
        <a class="view-more" href="category.html?name=${encodeURIComponent(category)}">
          View More →
        </a>
      </div>

      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[category].map(p => `
            <div class="swiper-slide">
              <div class="product-card" onclick="openProduct('${p.id}')">
                <div class="product-image">
                  <img src="${p.cover_image || ''}" alt="${p.name}">
                  <span class="price-tag">₹${p.price}</span>
                </div>
                <h4 class="product-title">${p.name}</h4>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  initSwipers();
}

/* ================= INIT SWIPER ================= */
function initSwipers() {
  document.querySelectorAll(".productSwiper").forEach(swiperEl => {
    if (swiperEl.swiper) swiperEl.swiper.destroy(true, true);

    new Swiper(swiperEl, {
      slidesPerView: "auto",
      spaceBetween: 16,
      freeMode: true,
      grabCursor: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false
      },
      speed: 3000,
      loop: true,

      breakpoints: {
        768: {
          spaceBetween: 24
        }
      }
    });
  });
}
