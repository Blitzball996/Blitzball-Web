/* Scroll reveal + nav shadow for the blitz.mom gateway page. */
(function () {
  'use strict';

  var items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var siblings = Array.prototype.slice.call(
        e.target.parentElement ? e.target.parentElement.children : []
      ).filter(function (n) { return n.classList.contains('reveal'); });
      var i = Math.max(0, siblings.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) { io.observe(el); });

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 8px 30px rgba(0,0,0,0.42)'
        : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
