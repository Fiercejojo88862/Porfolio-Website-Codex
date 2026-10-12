'use strict';
const root = document.documentElement;
root.classList.add('js');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = motionPreference.matches;
const supportsObserver = 'IntersectionObserver' in window;
root.classList.toggle('motion-ready', !reducedMotion && supportsObserver);

const toggle = document.querySelector('#nav-toggle');
const nav = document.querySelector('#site-nav');
function closeMenu(returnFocus = false) {
  if (!toggle || !nav) return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const roles = ['Software + Data Engineering Student', 'Linux & Docker Homelab Builder', 'Responsive Web Developer', 'C++ · Node.js · Python'];
const typed = document.querySelector('#typed');
let typingTimer;
function startTyping() {
  clearTimeout(typingTimer);
  if (!typed) return;
  typed.textContent = roles[0];
  if (reducedMotion) return;
  let role = 0;
  let character = roles[0].length;
  let deleting = true;
  function tick() {
    if (reducedMotion || document.hidden) return;
    const word = roles[role];
    character += deleting ? -1 : 1;
    typed.textContent = word.slice(0, character);
    let delay = deleting ? 25 : 55;
    if (!deleting && character === word.length) { deleting = true; delay = 1900; }
    else if (deleting && character === 0) { role = (role + 1) % roles.length; deleting = false; delay = 300; }
    typingTimer = setTimeout(tick, delay);
  }
  typingTimer = setTimeout(tick, 2200);
}
startTyping();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearTimeout(typingTimer);
  else startTyping();
});

// Throttle viewport motion to one update per frame. CSS variables keep hover zoom independent.
const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('.site-header');
const parallax = [...document.querySelectorAll('[data-parallax]')];
const scrubImages = [...document.querySelectorAll('[data-scrub-scale]')];
let scrollPending = false;
function updateScroll() {
  scrollPending = false;
  const distance = root.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
  if (header) header.classList.toggle('scrolled', scrollY > 40);
  parallax.forEach(card => {
    card.style.setProperty('--parallax', reducedMotion ? '0px' : `${Math.max(-25, Math.min(25, scrollY * Number(card.dataset.parallax)))}px`);
  });
  scrubImages.forEach(image => {
    if (image.closest('[hidden]')) return;
    const bounds = image.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    image.style.setProperty('--scrub-scale', reducedMotion ? '1' : (1 + fraction * .055).toFixed(4));
  });
}
function requestScrollUpdate() {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', requestScrollUpdate, {passive: true});
window.addEventListener('resize', requestScrollUpdate, {passive: true});
window.addEventListener('load', requestScrollUpdate);
requestScrollUpdate();

// All three articles are readable without JavaScript. Enhance to a manual carousel.
const carousel = document.querySelector('#carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = carousel.querySelector('#carousel-dots');
  const status = carousel.querySelector('#carousel-status');
  const controls = carousel.querySelector('.carousel-controls');
  let active = 0;
  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show project ${index + 1}: ${slide.querySelector('h3').textContent}`);
    button.setAttribute('aria-controls', slide.id);
    button.addEventListener('click', () => show(index, true));
    dots.append(button);
    return button;
  });
  function show(index, updateHash = false) {
    active = (index + slides.length) % slides.length;
    const focusWillHide = slides.some((slide, i) => i !== active && slide.contains(document.activeElement));
    if (focusWillHide) carousel.focus({preventScroll: true});
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    if (status) status.textContent = `Project ${active + 1} of ${slides.length}: ${slides[active].querySelector('h3').textContent}`;
    if (updateHash) history.replaceState(null, '', '#' + slides[active].id);
    requestScrollUpdate();
  }
  function fromHash() {
    const index = slides.findIndex(slide => '#' + slide.id === window.location.hash);
    show(index >= 0 ? index : 0);
  }
  carousel.querySelector('#prev-btn').addEventListener('click', () => show(active - 1, true));
  carousel.querySelector('#next-btn').addEventListener('click', () => show(active + 1, true));
  carousel.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      show(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowLeft' ? -1 : 1), true);
    }
  });
  controls.hidden = false;
  fromHash();
  window.addEventListener('hashchange', fromHash);
}


const counters = [...document.querySelectorAll('[data-count]')];
const revealElements = [...document.querySelectorAll('.section > .container')];
const skillItems = [...document.querySelectorAll('.skill-list li')];
const counterFrames = new Map();
function finalCount(element) { element.textContent = element.dataset.count + (element.dataset.suffix || ''); }
function animateCount(element) {
  if (reducedMotion) { finalCount(element); return; }
  const start = performance.now();
  const target = Number(element.dataset.count);
  function frame(now) {
    if (reducedMotion) { finalCount(element); return; }
    const fraction = Math.min(1, (now - start) / 1200);
    const eased = fraction === 1 ? 1 : 1 - Math.pow(2, -10 * fraction);
    element.textContent = Math.round(target * eased) + (element.dataset.suffix || '');
    if (fraction < 1) counterFrames.set(element, requestAnimationFrame(frame));
    else counterFrames.delete(element);
  }
  counterFrames.set(element, requestAnimationFrame(frame));
}
if (supportsObserver && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), {threshold: 0, rootMargin: '0px 0px -30px 0px'});
  revealElements.forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
  const skillObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); skillObserver.unobserve(entry.target); }
  }), {threshold: .2});
  skillItems.forEach(element => skillObserver.observe(element));
  const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
  }), {threshold: .5});
  counters.forEach(element => countObserver.observe(element));
}
motionPreference.addEventListener('change', event => {
  reducedMotion = event.matches;
  root.classList.toggle('motion-ready', !reducedMotion && supportsObserver);
  // Content already seen stays visible when preferences change mid-session.
  revealElements.forEach(element => element.classList.add('visible'));
  skillItems.forEach(element => element.classList.add('visible'));
  counterFrames.forEach(frame => cancelAnimationFrame(frame));
  counterFrames.clear();
  counters.forEach(finalCount);
  startTyping();
  requestScrollUpdate();
});

// GitHub Pages has no mail backend. Validate, then open an honest email draft.
const form = document.querySelector('#contact-form');
if (form) {
  form.noValidate = true;
  const fields = ['name', 'email', 'message'].map(name => form.elements.namedItem(name));
  const status = document.querySelector('#form-status');
  function errorFor(field) {
    const value = field.value.trim();
    if (field.name === 'name') return value.length < 2 ? 'Enter your name with at least 2 characters.' : '';
    if (field.name === 'email') return !value || field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address.' : '';
    return value.length < 10 ? 'Write at least 10 characters about your role or project.' : '';
  }
  function validate(field) {
    const error = errorFor(field);
    document.querySelector('#' + field.name + '-error').textContent = error;
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.hasAttribute('aria-invalid')) validate(field);
    status.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    fields.forEach(validate);
    const invalid = fields.find(field => field.getAttribute('aria-invalid') === 'true');
    if (invalid) { status.textContent = 'Please correct the highlighted fields.'; invalid.focus(); return; }
    const [name, email, message] = fields.map(field => field.value.trim());
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
    status.textContent = 'Your draft is ready. Send it from your email app. If no app opens, email Josephshaker2020@aol.com directly. Your text will stay here.';
    window.location.href = `mailto:Josephshaker2020@aol.com?subject=${subject}&body=${body}`;
  });
}
