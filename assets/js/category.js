/* ================= LOAD CATEGORY PRODUCTS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("name");

  const titleEl = document.getElementById("categoryTitle");
  const nameEl = document.getElementById("categoryName");
  const container = document.getElementById("products");

  /* ================= URL PARAMETER HANDLING ================= */
  // fallback
  if (!category) {
    nameEl.textContent = "Products";
    titleEl.textContent = "Products";
    return;
  }

  // set titles
  nameEl.textContent = category;
  titleEl.textContent = category;

  /* ================= FILTER PRODUCTS ================= */
  // get products from localStorage
  const allProducts = window.PRODUCTS || [];

  // filter + sort
  const filtered = allProducts
    .filter(p => p.category === category && p.available)
    .sort((a, b) => Number(b.id) - Number(a.id));

  /* ================= RENDER PRODUCTS ================= */
  // clear container
  container.innerHTML = "";

  // empty state
  if (!filtered.length) {
    container.innerHTML = `<p style="padding:20px">No products found</p>`;
    return;
  }

  // render products
  filtered.forEach(p => {
    container.innerHTML += `
      <div class="product-card" onclick="location.href='product.html?id=${p.id}'">

        <div class="product-image">
          <img src="${p.cover_image || ''}">
          <span class="price-tag">₹${p.price}</span>
        </div>

        <h4 class="product-title">${p.name}</h4>

      </div>
    `;
  });
});

/* Preloader */
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "0.3s";

    setTimeout(() => {
      preloader.style.display = "none";
    }, 300);
  }, 300);
});
