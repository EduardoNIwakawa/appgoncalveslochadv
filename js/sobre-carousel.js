/**
 * Carrossel — Sobre Nós
 */
(function () {
  const slides = document.querySelectorAll('.sobre-slide');
  const dots   = document.querySelectorAll('.sobre-dot');
  const prev   = document.querySelector('.sobre-carousel-prev');
  const next   = document.querySelector('.sobre-carousel-next');

  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const DELAY  = 4000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(function () { goTo(current + 1); }, DELAY);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  if (prev) {
    prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  }
  if (next) {
    next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); resetAuto(); });
  });

  var track = document.querySelector('.sobre-carousel');
  if (track) {
    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });
  }

  startAuto();
})();
