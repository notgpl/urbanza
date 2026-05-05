(function() {
  "use strict";

  // SCROLL EFFECTS - Header scrolled class and scroll top button
  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  // MOBILE NAVIGATION - Toggle and dropdown functionality
  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  // SCROLL TOP BUTTON
  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  // ANIMATIONS & LIGHTBOX
  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  // SWIPER CAROUSEL - Product slider
  new Swiper(".productSwiper", {
    slidesPerView: 1.4,
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    breakpoints: {
      576: { slidesPerView: 2.2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }
  });

  // HASH LINK SCROLLING - Smooth scroll to sections on page load
  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  // NAVIGATION SCROLLSPY - Active nav link highlighting
  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// ISOTOPE LAYOUT - Portfolio/grid filtering
/**
 * Init isotope layout and filters
 */
document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
  let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
  let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
  let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

  let initIsotope;
  imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
    initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
      itemSelector: '.isotope-item',
      layoutMode: layout,
      filter: filter,
      sortBy: sort
    });
  });

  isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
    filters.addEventListener('click', function() {
      isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
      this.classList.add('filter-active');
      initIsotope.arrange({
        filter: this.getAttribute('data-filter')
      });
      if (typeof aosInit === 'function') {
        aosInit();
      }
    }, false);
  });
});

// ULTRA SMOOTH FAQ - Accordion functionality
/* ================= ULTRA SMOOTH FAQ ================= */
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    btn.addEventListener("click", () => {
      // close others smoothly
      items.forEach(i => {
        if (i !== item) {
          const a = i.querySelector(".faq-answer");
          a.style.height = "0px";
          i.classList.remove("active");
        }
      });

      // toggle current
      if (item.classList.contains("active")) {
        answer.style.height = "0px";
        item.classList.remove("active");
      } else {
        item.classList.add("active");
        answer.style.height = answer.scrollHeight + "px";
      }
    });
  });
});

// DYNAMIC CATEGORIES MENU - Populate dropdown from products data
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("categoryMenu");
  if (!menu) return;

  const products = window.PRODUCTS || [];

  // unique categories
  const categories = [...new Set(
    products.map(p => p.category)
  )];

  // clear old
  menu.innerHTML = "";

  // add items
  categories.forEach(cat => {
    menu.innerHTML += `
      <li>
        <a href="category.html?name=${encodeURIComponent(cat)}">
          ${cat}
        </a>
      </li>
    `;
  });
});

const wrapper = document.querySelector(".category-search-wrapper");
const input = document.getElementById("categorySearch");

wrapper.addEventListener("click", () => {
  wrapper.classList.add("active");
  input.focus();
});

// optional: close when clicking outside
document.addEventListener("click", (e) => {
  if (!wrapper.contains(e.target)) {
    wrapper.classList.remove("active");
  }
});

/* ================= SEARCH FUNCTIONALITY ================= */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("categorySearch"); // 👈 changed

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    if (!q) {
      renderProducts(ALL_PRODUCTS);
      return;
    }

    const filtered = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );

    renderProducts(filtered);
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
