function ModalLifecycle(dialog) {
  let trigger;
  dialog.querySelector('[data-media-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('media-open');
    trigger?.focus({ preventScroll: true });
  });
  return (opener) => {
    trigger = opener;
    document.documentElement.classList.add('media-open');
    dialog.showModal();
  };
}

export function ProjectVideo(dialog) {
  const open = ModalLifecycle(dialog);
  const video = dialog.querySelector('video');
  const title = dialog.querySelector('#video-dialog-title');
  const error = dialog.querySelector('.media-error');
  video.addEventListener('error', () => { error.hidden = false; });
  document.querySelectorAll('[data-video-src]').forEach((button) => {
    button.addEventListener('click', () => {
      title.textContent = button.dataset.videoTitle;
      error.hidden = true;
      video.muted = true;
      video.poster = button.dataset.videoPoster;
      video.src = button.dataset.videoSrc;
      open(button);
      document.querySelectorAll('video').forEach((other) => { if (other !== video) other.pause(); });
      video.play().catch(() => { /* Native controls remain available if playback requires another gesture. */ });
    });
  });
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
}

export function ImageLightbox(dialog) {
  const open = ModalLifecycle(dialog);
  const stage = dialog.querySelector('.lightbox-stage');
  const zoom = dialog.querySelector('[data-image-zoom]');
  const image = zoom.querySelector('img');
  const caption = dialog.querySelector('[data-image-caption]');
  const previous = dialog.querySelector('[data-image-step="-1"]');
  const next = dialog.querySelector('[data-image-step="1"]');
  let items = [];
  let index = 0;

  function show(target) {
    index = Math.max(0, Math.min(items.length - 1, target));
    const item = items[index];
    const original = item.querySelector('img');
    image.src = item.href;
    image.alt = original.alt;
    zoom.style.setProperty('--image-width', `${original.getAttribute('width') || original.naturalWidth}px`);
    caption.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} · ${item.closest('figure').querySelector('figcaption')?.textContent || original.alt}`;
    previous.hidden = next.hidden = items.length === 1;
    previous.disabled = index === 0;
    next.disabled = index === items.length - 1;
    stage.classList.remove('is-zoomed');
    stage.scrollTo(0, 0);
    zoom.setAttribute('aria-pressed', 'false');
    zoom.setAttribute('aria-label', '放大图片');
  }

  document.querySelectorAll('[data-image-gallery]').forEach((gallery) => {
    const links = [...gallery.querySelectorAll('[data-image-open]')];
    links.forEach((link, i) => link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      items = links;
      show(i);
      open(link);
    }));
  });
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || stage.classList.contains('is-zoomed')) return;
    event.preventDefault();
    show(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  zoom.addEventListener('click', () => {
    const enlarged = stage.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.setAttribute('aria-label', enlarged ? '还原图片' : '放大图片');
  });
}
