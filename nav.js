(function () {
  var brand = document.querySelector('.nav .brand');
  var overlay = document.getElementById('menu-overlay');
  var prev = null;

  function update() {
    if (!brand) return;
    var short = window.scrollY > 80;
    if (short !== prev) {
      prev = short;
      brand.classList.toggle('brand--short', short);
    }
  }

  if (overlay && typeof window.toggleMenu === 'function') {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        window.toggleMenu(false);
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());
