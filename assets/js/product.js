/* ================= GLOBAL VARIABLES ================= */
let productName = "";
let productPrice = 0;
let hasSizes = false;
let hasColors = false;

/* ================= LOAD PRODUCT DATA ================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("Product not found");
    return;
  }

  const allProducts = window.PRODUCTS || [];
  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    alert("Product not found");
    return;
  }

  /* ================= BASIC PRODUCT INFO ================= */
  productName = product.name;
  productPrice = product.price;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("breadcrumbName").textContent = product.name;

  // DESCRIPTION
  const descEl = document.getElementById("productDescription");
  if (descEl) {
    descEl.textContent = product.description || "";
  }

  /* ================= IMAGE GALLERY ================= */
const mainImage = document.getElementById("mainImage");
const thumbs = document.getElementById("thumbs");

thumbs.innerHTML = "";

const images = [
  product.cover_image,
  ...(product.images || [])
].filter(Boolean);

if (images.length) {
  mainImage.src = images[0];

  images.forEach((img, index) => {
    const t = document.createElement("img");
    t.src = img;
    t.className = index === 0 ? "active" : ""; 
    
    t.onclick = function() {
      document.querySelectorAll('.thumbs img').forEach(thumb => {
        thumb.classList.remove('active');
      });
      
      this.classList.add('active');
      
      mainImage.src = img;
    };
    
    thumbs.appendChild(t);
  });
}

  /* ================= SIZE OPTIONS ================= */
  const sizeBox = document.getElementById("sizes");
  const sizeSelect = document.getElementById("sizeSelect");
  const sizeWrapper = sizeBox.closest(".option-box");

  const validSizes = (product.sizes || []).filter(s => s && s.trim() !== "");

  if (validSizes.length > 0) {
    hasSizes = true;

    sizeBox.innerHTML = "";
    sizeSelect.innerHTML = `<option value="">Select size</option>`;

    validSizes.forEach(size => {
      const span = document.createElement("span");
      span.textContent = size;

      span.onclick = () => {
        document.querySelectorAll(".sizes span")
          .forEach(s => s.classList.remove("active"));

        span.classList.add("active");
        sizeSelect.value = size;
      };

      sizeBox.appendChild(span);
      sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
    });

  } else {
    sizeWrapper.style.display = "none"; // hide empty section
  }

  /* ================= COLOR OPTIONS ================= */
  const colorBox = document.getElementById("colors");
  const colorSelect = document.getElementById("colorSelect");
  const colorWrapper = colorBox.closest(".option-box");

  const validColors = (product.colors || []).filter(c => c && c.trim() !== "");

  if (validColors.length > 0) {
    hasColors = true;

    colorBox.innerHTML = "";
    colorSelect.innerHTML = `<option value="">Select color</option>`;

    validColors.forEach(color => {
      const dot = document.createElement("span");
      dot.style.background = color;

      dot.onclick = () => {
        document.querySelectorAll(".colors span")
          .forEach(c => c.classList.remove("active"));

        dot.classList.add("active");
        colorSelect.value = color;
      };

      colorBox.appendChild(dot);
      colorSelect.innerHTML += `<option value="${color}">${color}</option>`;
    });

  } else {
    colorWrapper.style.display = "none"; // hide empty section
  }

  /* ================= TOTAL CALCULATION ================= */
  const qtyInput = document.getElementById("qty");
  const totalEl = document.getElementById("total");

  function updateTotal() {
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    qtyInput.value = qty;
    totalEl.textContent = productPrice * qty;
  }

  qtyInput.addEventListener("input", updateTotal);
  updateTotal();
});

/* ================= MODAL FUNCTIONS ================= */
window.openOrderModal = function () {
  document.getElementById("orderModal").classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeOrderModal = function () {
  document.getElementById("orderModal").classList.remove("active");
  document.body.style.overflow = "";
};

/* ================= WHATSAPP ORDER ================= */
window.sendWhatsApp = function () {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const qty = Math.max(1, Number(document.getElementById("qty").value));
  const size = document.getElementById("sizeSelect").value;
  const color = document.getElementById("colorSelect").value;
  const notes = document.getElementById("notes").value.trim();

  if (!name) return alert("Enter your full name");
  if (!/^[6-9]\d{9}$/.test(phone)) return alert("Enter valid Indian phone number");

  // Only check if exists
  if (hasSizes && !size) return alert("Select a size");
  if (hasColors && !color) return alert("Select a color");

  const total = productPrice * qty;
  const orderId = "TD" + Date.now();

  const msg = `
🛒 *NEW ORDER*
🆔 Order ID: ${orderId}

📦 Product: ${productName}
${hasSizes ? `📏 Size: ${size}\n` : ""}
${hasColors ? `🎨 Color: ${color}\n` : ""}
🔢 Qty: ${qty}

👤 Name: ${name}
📞 Phone: ${phone}

💰 Total: ₹${total}
📝 Notes: ${notes || "None"}
`;

  window.open(
    `https://wa.me/919946225102?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

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
