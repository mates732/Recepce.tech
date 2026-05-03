(function () {
  var brand = document.querySelector('.nav .brand');
  if (!brand) return;
  var prev = null;
  function update() {
    var short = window.scrollY > 80;
    if (short !== prev) {
      prev = short;
      brand.classList.toggle('brand--short', short);
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}());
