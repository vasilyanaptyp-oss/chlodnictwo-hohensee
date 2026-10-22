(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');

  /* header shadow + mobile menu */
  var hdr = doc.getElementById('hdr'), burger = hdr.querySelector('.burger'), mnav = doc.getElementById('mnav');
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(open) {
    hdr.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Menu');
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('open')); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); } });
  doc.addEventListener('click', function (e) { if (hdr.classList.contains('open') && !hdr.contains(e.target)) setMenu(false); });

  /* reveal on scroll */
  var items = [].slice.call(doc.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* form -> mail program */
  var form = doc.getElementById('cform');
  if (form) {
    var err = form.querySelector('.f-err');
    var M = { name: 'Wpisz imię i nazwisko.', contact: 'Podaj telefon lub e-mail.', msg: 'Napisz krótko, czego potrzebujesz.' };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, name = f.name.value.trim(), contact = f.contact.value.trim(), msg = f.msg.value.trim(), topic = f.topic.value;
      [f.name, f.contact, f.msg].forEach(function (x) { x.classList.remove('bad'); x.removeAttribute('aria-invalid'); });
      var bad = !name ? f.name : !contact ? f.contact : !msg ? f.msg : null;
      if (bad) {
        bad.classList.add('bad'); bad.setAttribute('aria-invalid', 'true');
        err.textContent = M[bad.name]; err.hidden = false; bad.focus(); return;
      }
      err.hidden = true;
      var body = msg + '\n\n' + 'Imię i nazwisko: ' + name + '\n' + 'Kontakt: ' + contact;
      var url = 'mailto:' + form.getAttribute('data-mail') + '?subject=' + encodeURIComponent('Zapytanie ze strony: ' + topic) + '&body=' + encodeURIComponent(body);
      if (window.__noNav) { window.__lastMail = url; return; }
      window.location.href = url;
    });
  }
})();
