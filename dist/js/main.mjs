import { DraggableBadge } from './badge.mjs';
import { CursorImageTrail } from './trail.mjs';
import { trail } from './content.mjs';
import { BrandStack, HeroTransition } from './scroll-effects.mjs';
import { ImageLightbox, ProjectVideo } from './project-media.mjs';

function Header(header) {
  const menu = header.querySelector('.menu-toggle');
  const nav = header.querySelector('nav');
  const links = [...nav.querySelectorAll('a')];
  const setMenu = (open) => {
    menu.setAttribute('aria-expanded', String(open));
    menu.firstElementChild.textContent = open ? '关闭' : '菜单';
    nav.classList.toggle('open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (event) => { if (!header.contains(event.target) && nav.classList.contains('open')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  let queued = false;
  let current;
  function update() {
    queued = false;
    header.classList.toggle('scrolled', window.scrollY > 10);
    let active;
    const threshold = header.offsetHeight + Math.min(100, window.innerHeight * .17);
    for (const section of sections) {
      if (section.getBoundingClientRect().top > threshold) break;
      active = section.id;
    }
    if (active === current) return;
    current = active;
    for (const link of links) {
      if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function queueUpdate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);
  update();
}

function ProjectGallery(gallery) {
  const works = gallery.closest('.works');
  const buttons = [...works.querySelectorAll('[data-filter]')];
  const groups = [...gallery.querySelectorAll('[data-entry-count]')];
  const count = works.querySelector('[data-count]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const filter = button.dataset.filter;
      for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
      let total = 0;
      for (const group of groups) {
        group.hidden = filter !== 'all' && group.dataset.category !== filter;
        if (group.hidden) {
          group.querySelectorAll('video').forEach((video) => video.pause());
          continue;
        }
        if (!motion.matches) {
          group.getAnimations().forEach((animation) => animation.cancel());
          group.animate([{ opacity: .5, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
        }
        total += Number(group.dataset.entryCount);
      }
      count.textContent = `共 ${total} 项`;
    });
  }
  document.querySelectorAll('[data-show-project]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      const group = target?.closest('[data-category]');
      if (group?.hidden) buttons.find((button) => button.dataset.filter === group.dataset.category)?.click();
    });
  });
}

function BoardCarousel(gallery) {
  const viewport = gallery.querySelector('[data-board-viewport]');
  const slides = [...viewport.querySelectorAll('[data-board-slide]')];
  const previous = gallery.querySelector('[data-board-step="-1"]');
  const next = gallery.querySelector('[data-board-step="1"]');
  const count = gallery.querySelector('[data-board-count]');
  const full = gallery.querySelector('[data-board-full]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clampIndex = (value) => Math.min(slides.length - 1, Math.max(0, value));
  function slidePosition(slide) {
    const max = viewport.scrollWidth - viewport.clientWidth;
    return Math.min(max, slide.offsetLeft - slides[0].offsetLeft);
  }
  let index = 0;
  let drag;

  function update() {
    if (drag || !viewport.clientWidth) return;
    const left = viewport.scrollLeft;
    let visibleIndex = 0;
    let nearest = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slidePosition(slide) - left);
      if (distance < nearest) {
        nearest = distance;
        visibleIndex = i;
      }
    });
    if (index === visibleIndex) return;
    slides[index].querySelector('video')?.pause();
    index = visibleIndex;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (full) full.href = slides[index].dataset.full;
  }

  function show(target) {
    viewport.scrollTo({ left: slidePosition(slides[clampIndex(target)]), behavior: motion.matches ? 'instant' : 'smooth' });
    update();
  }

  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  viewport.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(viewport);
  viewport.addEventListener('keydown', (event) => {
    if (event.target !== viewport || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('video')) return;
    drag = { id: event.pointerId, x: event.clientX, left: viewport.scrollLeft, index };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', (event) => {
    if (event.pointerId === drag?.id) viewport.scrollLeft = drag.left + drag.x - event.clientX;
  });
  function finishDrag(event) {
    if (event.pointerId !== drag?.id) return;
    const distance = drag.x - event.clientX;
    const advance = event.type === 'pointerup' && Math.abs(distance) > viewport.clientWidth * .08;
    const target = drag.index + (advance ? Math.sign(distance) : 0);
    drag = undefined;
    viewport.classList.remove('is-dragging');
    show(target);
  }
  viewport.addEventListener('pointerup', finishDrag);
  viewport.addEventListener('pointercancel', finishDrag);
  viewport.addEventListener('lostpointercapture', finishDrag);
  viewport.addEventListener('dragstart', (event) => event.preventDefault());
}

function CopyEmail(button) {
  const status = button.closest('.contact-row').querySelector('.contact-copy-status');
  let reset;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = '已复制';
    } catch {
      status.textContent = '复制失败，请手动复制';
    }
    clearTimeout(reset);
    reset = setTimeout(() => { status.textContent = ''; }, 2200);
  });
}

Header(document.querySelector('#site-header'));
const hero = document.querySelector('.hero');
const about = document.querySelector('#about');
if (hero && about) HeroTransition(hero, about);
const brandStack = document.querySelector('[data-brand-stack]');
if (brandStack) BrandStack(brandStack);
const rig = document.querySelector('[data-badge-rig]');
if (rig) DraggableBadge(rig);
const layer = document.querySelector('[data-image-trail]');
if (layer) CursorImageTrail(layer, trail);
const gallery = document.querySelector('[data-gallery]');
if (gallery) ProjectGallery(gallery);
document.querySelectorAll('[data-board-gallery]').forEach(BoardCarousel);
const workVideos = [...document.querySelectorAll('.graphic-viewport video')];
for (const video of workVideos) {
  video.addEventListener('play', () => {
    for (const other of workVideos) if (other !== video) other.pause();
  });
}
const copyEmail = document.querySelector('[data-copy-email]');
if (copyEmail) CopyEmail(copyEmail);
const projectVideo = document.querySelector('[data-video-dialog]');
if (projectVideo) ProjectVideo(projectVideo);
const imageLightbox = document.querySelector('[data-image-dialog]');
if (imageLightbox) ImageLightbox(imageLightbox);

const faqItems = [...document.querySelectorAll('.faq details')];
for (const item of faqItems) {
  item.addEventListener('toggle', () => {
    if (item.open) for (const other of faqItems) if (other !== item) other.open = false;
  });
}
