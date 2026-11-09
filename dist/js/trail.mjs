export function CursorImageTrail(layer, images, { distance = 63, interval = 68, limit = 7, duration = 870 } = {}) {
  const hero = layer.closest('.hero');
  const pointer = matchMedia('(any-pointer: fine) and (prefers-reduced-motion: no-preference)');
  let index = 0;
  let previous = null;
  let preloaded = false;

  function preload() {
    if (!pointer.matches || preloaded) return;
    preloaded = true;
    for (const { src } of images) {
      const preview = new Image();
      preview.fetchPriority = 'low';
      preview.decoding = 'async';
      preview.src = src;
    }
  }

  hero.addEventListener('pointerenter', preload);
  hero.addEventListener('pointerleave', () => { previous = null; });
  hero.addEventListener('pointermove', (event) => {
    if (!pointer.matches || event.pointerType !== 'mouse' || event.buttons || images.length === 0) return;
    if (event.target.closest('a, button, .hero-copy')) return;
    const now = performance.now();
    if (previous && (Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < distance || now - previous.time < interval)) return;
    preload();
    previous = { x: event.clientX, y: event.clientY, time: now };
    const bounds = layer.getBoundingClientRect();
    const { src, width, angle } = images[index++ % images.length];
    const photo = document.createElement('img');
    photo.alt = '';
    photo.src = src;
    photo.decoding = 'async';
    photo.style.setProperty('--trail-width', `${width}px`);
    photo.style.left = `${event.clientX - bounds.left}px`;
    photo.style.top = `${event.clientY - bounds.top}px`;
    if (layer.childElementCount >= limit) layer.firstElementChild.remove();
    layer.append(photo);
    const pose = (rotation, scale, offset = 0) => `translate(-50%, calc(-50% + ${offset}px)) rotate(${rotation}deg) scale(${scale})`;
    const animation = photo.animate([
      { opacity: 0, transform: pose(angle - 3, .76) },
      { opacity: .84, transform: pose(angle, 1), offset: .19 },
      { opacity: .7, transform: pose(angle, 1), offset: .6 },
      { opacity: 0, transform: pose(angle + 3, 1.025, 12) },
    ], { duration, easing: 'cubic-bezier(.18,.7,.2,1)', fill: 'both' });
    animation.onfinish = () => photo.remove();
  });
}
