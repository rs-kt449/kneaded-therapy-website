// Relies on KT_CART_KEY and ktGetCart() from script.js (loaded first on every page).

var KT_ITEM_META = {
  'Classic Brown Butter Chocolate Chip': { display: 'Classic Brown Butter Chocolate Chip', category: 'Cookie' },
  'Biscoff Stuffed Cookie': { display: 'Biscoff Stuffed Cookie', category: 'Cookie' },
  'Birthday Cake Cookie': { display: 'Birthday Cake Cookie', category: 'Cookie' },
  'The Chaos Cookie': { display: '"The Chaos Cookie"', category: 'Cookie · loaded' },
  'Fudge Brownie - The Dense One': { display: 'Fudge Brownie — "The Dense One"', category: 'Brownie' },
  'Salted Caramel Brownie': { display: 'Salted Caramel Brownie', category: 'Brownie' },
  'Browned Butter Blondie': { display: 'Browned Butter Blondie', category: 'Blondie' }
};

function ktSaveCart(cart) {
  localStorage.setItem(KT_CART_KEY, JSON.stringify(cart));
  ktUpdateCartBadge();
}

function ktAddToCart(name, qty) {
  var cart = ktGetCart();
  cart[name] = (cart[name] || 0) + qty;
  ktSaveCart(cart);
}

function ktSetQty(name, qty) {
  var cart = ktGetCart();
  if (qty <= 0) {
    delete cart[name];
  } else {
    cart[name] = qty;
  }
  ktSaveCart(cart);
}

function ktClearCart() {
  localStorage.removeItem(KT_CART_KEY);
  ktUpdateCartBadge();
}

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Menu page: "Add to Cart" widgets ----------
  var addRows = document.querySelectorAll('.menu-add-row');
  addRows.forEach(function (row) {
    var itemName = row.getAttribute('data-item');
    var qtyEl = row.querySelector('.qty-value');
    var minusBtn = row.querySelector('.qty-minus');
    var plusBtn = row.querySelector('.qty-plus');
    var addBtn = row.querySelector('.add-to-cart-btn');

    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        var q = parseInt(qtyEl.textContent, 10) || 1;
        if (q > 1) q -= 1;
        qtyEl.textContent = q;
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        var q = parseInt(qtyEl.textContent, 10) || 1;
        if (q < 24) q += 1;
        qtyEl.textContent = q;
      });
    }
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var q = parseInt(qtyEl.textContent, 10) || 1;
        ktAddToCart(itemName, q);
        var original = addBtn.textContent;
        addBtn.textContent = 'Added! ✓';
        addBtn.classList.add('added');
        addBtn.disabled = true;
        setTimeout(function () {
          addBtn.textContent = original;
          addBtn.classList.remove('added');
          addBtn.disabled = false;
          qtyEl.textContent = '1';
        }, 1100);
      });
    }
  });

  // ---------- Cart page: render cart + handle checkout ----------
  var cartContainer = document.getElementById('cartItemsContainer');
  if (!cartContainer) return;

  var emptyState = document.getElementById('cartEmptyState');
  var form = document.getElementById('orderForm');
  var summaryField = document.getElementById('orderSummaryField');
  var iframe = document.getElementById('hiddenIframe');
  var submitBtn = document.getElementById('placeOrderBtn');
  var hasSubmitted = false;

  function renderCart() {
    var cart = ktGetCart();
    var names = Object.keys(cart).filter(function (n) { return cart[n] > 0; });

    if (names.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (form) form.style.display = 'none';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (form) form.style.display = 'block';

    cartContainer.innerHTML = '';
    var lines = [];

    names.forEach(function (name) {
      var qty = cart[name];
      var meta = KT_ITEM_META[name] || { display: name, category: '' };
      lines.push(meta.display.replace(/"/g, '') + ' x' + qty);

      var row = document.createElement('div');
      row.className = 'order-item-row';
      row.innerHTML =
        '<div class="order-item-info">' +
          '<h4>' + meta.display + '</h4>' +
          '<p>' + meta.category + '</p>' +
        '</div>' +
        '<div class="qty-stepper">' +
          '<button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>' +
          '<span class="qty-value">' + qty + '</span>' +
          '<button type="button" class="qty-plus" aria-label="Increase quantity">+</button>' +
        '</div>';

      row.querySelector('.qty-minus').addEventListener('click', function () {
        ktSetQty(name, qty - 1);
        renderCart();
      });
      row.querySelector('.qty-plus').addEventListener('click', function () {
        ktSetQty(name, qty + 1);
        renderCart();
      });

      cartContainer.appendChild(row);
    });

    if (summaryField) summaryField.value = lines.join(', ');
  }

  renderCart();

  if (form) {
    form.addEventListener('submit', function (e) {
      var cart = ktGetCart();
      var total = Object.keys(cart).reduce(function (sum, k) { return sum + (cart[k] || 0); }, 0);
      if (total === 0) {
        e.preventDefault();
        alert('Your cart is empty — add something from the Menu first.');
        return;
      }
      hasSubmitted = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending your order…';
      }
    });
  }

  if (iframe) {
    iframe.addEventListener('load', function () {
      if (hasSubmitted) {
        ktClearCart();
        window.location.href = 'thank-you.html';
      }
    });
  }
});
