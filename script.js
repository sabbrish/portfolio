(function () {
  'use strict';
  var root = document.documentElement;

  function store(k, v) {
    try { if (v === undefined) { return localStorage.getItem(k); } localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* Feature 1: light and dark theme toggle */
  var themeBtn = document.getElementById('themeToggle');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  var saved = store('theme');
  applyTheme(saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next); store('theme', next);
  });

  /* Feature 2: mobile navigation menu */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { setMenu(false); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); } });

  /* Feature 3: project filter buttons */
  var chips = document.querySelectorAll('.chip');
  var projects = document.querySelectorAll('.project');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      projects.forEach(function (p) { p.hidden = !(f === 'all' || p.getAttribute('data-cat') === f); });
    });
  });

  /* Feature 4: contact form validation with a clear confirmation */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  function check(id, errId, msg, test) {
    var input = document.getElementById(id), err = document.getElementById(errId);
    var ok = test(input.value.trim());
    err.textContent = ok ? '' : msg;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = check('name', 'nameErr', 'Enter your name.', function (v) { return v.length > 0; });
    var b = check('email', 'emailErr', 'Enter a valid email address, like name@example.com.', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
    var c = check('message', 'msgErr', 'Write a message of at least 10 characters.', function (v) { return v.length >= 10; });
    if (a && b && c) {
      status.textContent = 'Your message looks good. This demo form cannot send messages, so please email me directly at your.email@example.com.';
      form.reset();
    } else {
      status.textContent = 'Please fix the highlighted fields.';
    }
  });

  /* Feature 5: back-to-top button */
  var toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function () { toTop.hidden = window.scrollY < 400; }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });


  /* Feature 6: highlight the nav link for the section in view */
  var links = document.querySelectorAll('.nav a');
  var secs = document.querySelectorAll('section[data-nav]');
  function spy() {
    var y = window.scrollY + 120, cur = 'home';
    secs.forEach(function (s) { if (s.offsetTop <= y) { cur = s.id; } });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) { cur = 'contact'; }
    if (cur === 'skills') { cur = 'about'; }
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + cur;
      a.classList.toggle('active', on);
      if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
