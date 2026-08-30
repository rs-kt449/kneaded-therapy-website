document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('orderForm');
  if (!form) return;

  var rows = document.querySelectorAll('.order-item-row');
  var summaryBox = document.getElementById('orderSummary');
  var summaryField = document.getElementById('orderSummaryField');

  function updateSummary() {
    var lines = [];
    rows.forEach(function (row) {
      var qtyEl = row.querySelector('.qty-value');
      var qty = parseInt(qtyEl.textContent, 10) || 0;
      if (qty > 0) {
        var itemName = row.getAttribute('data-item');
        lines.push(itemName + ' x' + qty);
      }
    });

    if (lines.length === 0) {
      summaryBox.textContent = 'No items selected yet — add a few above.';
      summaryBox.classList.add('empty');
    } else {
      summaryBox.textContent = 'Order: ' + lines.join(', ');
      summaryBox.classList.remove('empty');
    }
    summaryField.value = lines.join(', ');
  }

  rows.forEach(function (row) {
    var qtyEl = row.querySelector('.qty-value');
    var minusBtn = row.querySelector('.qty-minus');
    var plusBtn = row.querySelector('.qty-plus');

    minusBtn.addEventListener('click', function () {
      var qty = parseInt(qtyEl.textContent, 10) || 0;
      if (qty > 0) qty -= 1;
      qtyEl.textContent = qty;
      updateSummary();
    });

    plusBtn.addEventListener('click', function () {
      var qty = parseInt(qtyEl.textContent, 10) || 0;
      if (qty < 24) qty += 1;
      qtyEl.textContent = qty;
      updateSummary();
    });
  });

  var hasSubmitted = false;
  var iframe = document.getElementById('hiddenIframe');
  var submitBtn = document.getElementById('placeOrderBtn');

  form.addEventListener('submit', function (e) {
    var total = 0;
    rows.forEach(function (row) {
      var qtyEl = row.querySelector('.qty-value');
      total += parseInt(qtyEl.textContent, 10) || 0;
    });
    if (total === 0) {
      e.preventDefault();
      alert('Please select at least one item before placing your order.');
      return;
    }
    updateSummary();

    // Form posts into the hidden iframe (no page navigation, no CORS issues).
    // We flag that a real submission is in flight, then redirect once the
    // iframe finishes loading the response from the backend.
    hasSubmitted = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending your order…';
    }
  });

  if (iframe) {
    iframe.addEventListener('load', function () {
      if (hasSubmitted) {
        window.location.href = 'thank-you.html';
      }
    });
  }

  updateSummary();
});
