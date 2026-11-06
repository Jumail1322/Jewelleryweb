(function () {
  'use strict';

  var CDN = 'https://ornmnt-jewelry.myshopify.com/cdn/shop/files/';

  var PRODUCTS = [
    { title: 'Coil Ring',         price: '₹2,800', type: 'ring',     img: '077158f7803d823bc6b092a7ffafa076cbff7f5d_1.jpg?v=1779250132&width=533' },
    { title: 'Gather Earrings',   price: '₹2,800', type: 'earring',  img: '0dd9f5c8d54813a313e00ae24269a80ff01a1677_1_b204f251-d1be-4964-a88a-11f1e4c11a5a.jpg?v=1779174354&width=533' },
    { title: 'Pool Pendant',      price: '₹2,800', type: 'necklace', img: '68d07f7eb221a08d40e76883458f1099f84dc90b_1.jpg?v=1779250082&width=533' },
    { title: 'Slim Cuff',         price: '₹2,800', type: 'bracelet', img: 'a7c326a28bf7260c6a5327ff7add3673a34ca34a_1_9cbd866d-86c7-45eb-909b-2b0cbe6f1905.jpg?v=1779172675&width=533' },
    { title: 'Texture Band Ring', price: '₹2,800', type: 'ring',     img: 'c175562b94089bece7d00d43eea6541ad50a2592_1_e27f63aa-6609-4dc8-a088-93734a4092b8.jpg?v=1779172611&width=533' },
    { title: 'Thread Necklace',   price: '₹2,800', type: 'necklace', img: '097db85472597d43ac290ffc0ebc7d04871d5109_1.jpg?v=1779103393&width=533' }
  ];

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cardHTML(p) {
    return (
      '<a href="#" class="product-card">' +
        '<img class="product-card__img" src="' + CDN + p.img + '" alt="' + p.title + '" loading="lazy">' +
        '<div class="product-card__info">' +
          '<span class="product-card__title">' + p.title + '</span>' +
          '<span class="product-card__price">' + p.price + '</span>' +
        '</div>' +
        '<span class="sma-button-third product-card__cta">View details</span>' +
      '</a>'
    );
  }

  /* Runs cb once the element is at least `threshold` visible, and on leave. */
  function onVisible(el, threshold, enter, leave) {
    if (!('IntersectionObserver' in window)) { enter(); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) enter();
        else if (leave) leave();
      });
    }, { threshold: threshold }).observe(el);
  }

  /* ---------------- Header: hide on scroll down, reveal on scroll up ---------------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var h = header.offsetHeight;
      header.classList.toggle('is-scrolled', y > h);
      header.classList.toggle('is-hidden', y > last && y > h);
      last = y;
    }, { passive: true });

    var drawer = document.querySelector('[data-drawer]');
    function setDrawer(open) {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    document.querySelector('[data-drawer-open]').addEventListener('click', function () { setDrawer(true); });
    document.querySelector('[data-drawer-close]').addEventListener('click', function () { setDrawer(false); });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  }

  /* ---------------- Hero mini carousel: 5s auto-advance, pauses on hover ---------------- */
  function initBannerCarousel() {
    var carousel = document.querySelector('[data-banner-carousel]');
    if (!carousel) return;
    var track = carousel.querySelector('[data-track]');
    var total = track.children.length;
    var index = 0;
    var timer = null;

    function advance() {
      index = (index + 1) % total;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
    }
    function start() { stop(); if (!reducedMotion) timer = setInterval(advance, 5000); }
    function stop() { clearInterval(timer); timer = null; }

    start();
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
  }

  /* ---------------- Featured products: tap-to-preview on touch devices ----------------
     Desktop is pure CSS (:hover + :has). On touch the first tap adds .is-active,
     which mirrors the hover state; a second tap follows the link. */
  function initFeaturedTouch() {
    var section = document.querySelector('[data-featured]');
    if (!section || !window.matchMedia('(hover: none)').matches) return;

    var boxes = section.querySelectorAll('.sma-featured-product-box');
    var videos = section.querySelectorAll('.sma-featured-section-video');

    function pauseAll() { videos.forEach(function (v) { v.pause(); }); }
    pauseAll();

    boxes.forEach(function (box, i) {
      box.addEventListener('click', function (e) {
        if (box.classList.contains('is-active')) return;
        e.preventDefault();
        boxes.forEach(function (b) { b.classList.remove('is-active'); });
        pauseAll();
        box.classList.add('is-active');
        var v = section.querySelector('.sma-featured-section-video--' + (i + 1));
        if (v) v.play().catch(function () {});
      });
    });

    document.addEventListener('click', function (e) {
      var active = section.querySelector('.sma-featured-product-box.is-active');
      if (active && !active.contains(e.target)) {
        active.classList.remove('is-active');
        pauseAll();
      }
    });
  }

  /* ---------------- The Signatures: icon tabs filter the grid ---------------- */
  function initCollection() {
    var grid = document.querySelector('[data-collection-grid]');
    var tabs = document.querySelectorAll('[data-tabs] .collection-tab');
    if (!grid) return;

    function render(filter) {
      var list = filter ? PRODUCTS.filter(function (p) { return p.type === filter; }) : PRODUCTS;
      grid.innerHTML = list.map(function (p, i) {
        return '<li class="scroll-trigger animate--slide-in is-visible" style="--animation-order:' + (i + 1) + '">' + cardHTML(p) + '</li>';
      }).join('');
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var wasActive = tab.classList.contains('is-active');
        tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
        // Clicking the active tab again resets to "all"
        if (wasActive) { render(null); return; }
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        render(tab.dataset.filter);
      });
    });

    // First paint animates in when scrolled into view
    grid.innerHTML = PRODUCTS.map(function (p, i) {
      return '<li class="scroll-trigger animate--slide-in" style="--animation-order:' + (i + 1) + '">' + cardHTML(p) + '</li>';
    }).join('');
    observeScrollTriggers(grid);
  }

  /* ---------------- Category grid: last-hovered tile stays lit ---------------- */
  function initCategoryGrid() {
    var grid = document.querySelector('[data-category-grid]');
    if (!grid) return;
    var boxes = grid.querySelectorAll('.sma-category-box');
    boxes.forEach(function (box) {
      box.addEventListener('mouseenter', function () {
        if (!canHover.matches) return;
        boxes.forEach(function (b) { b.classList.remove('is-active'); });
        box.classList.add('is-active');
      });
    });
  }

  /* ---------------- Wear-it carousels: bar dots + autoplay while in view ---------------- */
  function initWearCarousels() {
    document.querySelectorAll('[data-wear-carousel]').forEach(function (carousel) {
      var track = carousel.querySelector('.sma-wear-carousel-track');
      var dotsWrap = carousel.querySelector('.sma-wear-dots');
      var offset = parseInt(track.dataset.products, 10) || 0;

      // Rotate the product list so each row leads with different pieces
      var list = PRODUCTS.slice(offset).concat(PRODUCTS.slice(0, offset));
      track.innerHTML = list.map(function (p) { return '<div class="sma-wear-card">' + cardHTML(p) + '</div>'; }).join('');

      var cards = Array.prototype.slice.call(track.children);
      var current = 0;
      var paused = false;
      var timer = null;

      var dots = cards.map(function (_, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'sma-wear-dot' + (i === 0 ? ' is-active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { goTo(i); restart(); });
        dotsWrap.appendChild(d);
        return d;
      });

      function setDot(i) {
        current = i;
        dots.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
      }
      function goTo(i) {
        track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
        setDot(i);
      }
      function start() {
        stop();
        if (reducedMotion) return;
        timer = setInterval(function () {
          if (!paused) goTo((current + 1) % cards.length);
        }, 5000);
      }
      function stop() { clearInterval(timer); timer = null; }
      function restart() { if (timer) start(); }

      var scrollDebounce;
      track.addEventListener('scroll', function () {
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(function () {
          var left = track.scrollLeft;
          var closest = 0;
          var min = Infinity;
          cards.forEach(function (c, i) {
            var d = Math.abs(c.offsetLeft - track.offsetLeft - left);
            if (d < min) { min = d; closest = i; }
          });
          if (closest !== current) setDot(closest);
        }, 80);
      }, { passive: true });

      carousel.addEventListener('mouseenter', function () { paused = true; });
      carousel.addEventListener('mouseleave', function () { paused = false; });
      carousel.addEventListener('touchstart', function () { paused = true; }, { passive: true });

      onVisible(carousel, 0.25, start, stop);
    });
  }

  /* ---------------- Testimonials ---------------- */
  function initTestimonials() {
    var root = document.querySelector('[data-testimonial]');
    if (!root) return;
    var track = root.querySelector('.sma-testimonial__track');
    var slides = Array.prototype.slice.call(track.children);
    var img = root.querySelector('.sma-testimonial__image');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var dotsWrap = root.querySelector('.sma-testimonial__dots');
    var mobile = window.matchMedia('(max-width: 768px)');
    var active = 0;
    var autoplay = null;
    var inView = false;

    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'sma-testimonial__dot';
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
      return d;
    });

    function offsetOf(i) {
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var x = 0;
      for (var k = 0; k < i; k++) x += slides[k].offsetWidth + gap;
      return x;
    }

    function goTo(i) {
      if (i < 0 || i >= slides.length) return;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      track.style.transform = 'translateX(-' + offsetOf(i) + 'px)';
      prev.classList.toggle('is-disabled', i === 0);
      next.classList.toggle('is-disabled', i === slides.length - 1);

      if (i !== active) {
        img.style.opacity = '0';
        setTimeout(function () { img.src = slides[i].dataset.image; img.style.opacity = '1'; }, 200);
      }
      active = i;
    }

    slides.forEach(function (s, i) { s.addEventListener('click', function () { goTo(i); }); });
    prev.addEventListener('click', function () { goTo(active - 1); });
    next.addEventListener('click', function () { goTo(active + 1); });

    // Swipe on touch
    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (dx < -50) goTo((active + 1) % slides.length);
      else if (dx > 50) goTo((active - 1 + slides.length) % slides.length);
    }, { passive: true });

    // Mobile only: auto-advance every 5s while visible
    function syncAutoplay() {
      clearInterval(autoplay);
      if (mobile.matches && inView && !reducedMotion) {
        autoplay = setInterval(function () { goTo((active + 1) % slides.length); }, 5000);
      }
    }
    onVisible(root, 0.25, function () { inView = true; syncAutoplay(); }, function () { inView = false; syncAutoplay(); });
    mobile.addEventListener('change', syncAutoplay);

    window.addEventListener('resize', function () {
      track.style.transition = 'none';
      track.style.transform = 'translateX(-' + offsetOf(active) + 'px)';
      requestAnimationFrame(function () { track.style.transition = ''; });
    });

    goTo(0);
  }

  /* ---------------- Product reel: page dots + autoscroll while visible ---------------- */
  function initReel() {
    var root = document.querySelector('[data-reel]');
    if (!root) return;
    var slider = root.querySelector('[data-reel-slider]');
    var dotsWrap = root.querySelector('[data-reel-dots]');
    var slides = slider.children;
    var perPage = 1;
    var pages = 1;
    var page = 0;
    var timer = null;
    var hovering = false;

    function step() {
      var gap = parseFloat(getComputedStyle(slider).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }
    function layout() {
      perPage = Math.max(1, Math.floor(slider.offsetWidth / step()));
      pages = Math.ceil(slides.length / perPage);
      dotsWrap.innerHTML = '';
      dotsWrap.style.display = pages > 1 ? '' : 'none';
      for (var i = 0; i < pages; i++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'sma-reel__dot' + (i === page ? ' is-active' : '');
        d.setAttribute('aria-label', 'Go to page ' + (i + 1));
        d.addEventListener('click', goTo.bind(null, i));
        dotsWrap.appendChild(d);
      }
    }
    function setDot(i) {
      page = i;
      Array.prototype.forEach.call(dotsWrap.children, function (d, k) { d.classList.toggle('is-active', k === i); });
    }
    function goTo(i) {
      slider.scrollTo({ left: i * perPage * step(), behavior: 'smooth' });
      setDot(i);
    }
    function start() {
      stop();
      if (pages <= 1 || reducedMotion) return;
      timer = setInterval(function () { if (!hovering) goTo(page >= pages - 1 ? 0 : page + 1); }, 4000);
    }
    function stop() { clearInterval(timer); timer = null; }

    slider.addEventListener('scroll', function () {
      var p = Math.round(slider.scrollLeft / (perPage * step()));
      if (p !== page && p >= 0 && p < pages) setDot(p);
    }, { passive: true });
    slider.addEventListener('mouseenter', function () { hovering = true; });
    slider.addEventListener('mouseleave', function () { hovering = false; });

    // Only play reel videos that are on screen
    Array.prototype.forEach.call(slides, function (slide) {
      var v = slide.querySelector('video');
      onVisible(slide, 0.5, function () { v.play().catch(function () {}); }, function () { v.pause(); });
    });

    layout();
    onVisible(root, 0.25, start, stop);
    window.addEventListener('resize', function () { layout(); if (page >= pages) setDot(pages - 1); });
  }

  /* ---------------- Scroll-in reveal ---------------- */
  function observeScrollTriggers(scope) {
    var els = (scope || document).querySelectorAll('.scroll-trigger:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Newsletter (front-end only) ---------------- */
  function initNewsletter() {
    var form = document.querySelector('[data-newsletter]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelector('[data-newsletter-msg]').hidden = false;
      form.reset();
    });
  }

  initHeader();
  initBannerCarousel();
  initFeaturedTouch();
  initCollection();
  initCategoryGrid();
  initWearCarousels();
  initTestimonials();
  initReel();
  observeScrollTriggers();
  initNewsletter();
})();
