document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  ktUpdateCartBadge();
});

// Shared cart-badge updater — runs on every page (via script.js) so the
// nav "Cart" count stays in sync no matter where the customer is on the site.
// Cart data itself lives in localStorage under KT_CART_KEY (see cart.js).
var KT_CART_KEY = 'kt_cart_v1';

function ktGetCart() {
  try {
    return JSON.parse(localStorage.getItem(KT_CART_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function ktUpdateCartBadge() {
  var cart = ktGetCart();
  var count = Object.keys(cart).reduce(function (sum, key) {
    return sum + (parseInt(cart[key], 10) || 0);
  }, 0);

  var badges = document.querySelectorAll('.cart-count');
  badges.forEach(function (badge) {
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  });
}
