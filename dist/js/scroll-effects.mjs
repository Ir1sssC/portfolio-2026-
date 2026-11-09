function progress(value, start, end) {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function trackVisibleScroll(element, render) {
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      render();
    });
  };
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) window.addEventListener('scroll', schedule, { passive: true });
    else window.removeEventListener('scroll', schedule);
    schedule();
  }).observe(element);
  window.addEventListener('resize', schedule);
  schedule();
  return schedule;
}

export function HeroTransition(hero, about) {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const schedule = trackVisibleScroll(hero, () => {
    if (!motion.matches) return;
    const height = window.innerHeight;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const aboutTop = about.getBoundingClientRect().top;
    const exit = progress(heroBottom, height * .82, height * .5);
    hero.style.setProperty('--hero-exit', exit.toFixed(4));
    hero.classList.toggle('is-exited', exit === 1);
    about.style.setProperty('--about-title-enter', progress(aboutTop, height * .88, height * .63).toFixed(4));
    about.style.setProperty('--about-body-enter', progress(aboutTop, height * .81, height * .54).toFixed(4));
  });
  motion.addEventListener('change', schedule);
}

export function BrandStack(stack) {
  const panels = [...stack.querySelectorAll('.brand-panel')];
  const outgoing = panels.slice(0, -1);
  const desktopMotion = matchMedia('(min-width: 881px) and (prefers-reduced-motion: no-preference)');

  const schedule = trackVisibleScroll(stack, () => {
    if (!desktopMotion.matches || !stack.hasAttribute('data-stack-ready') || !stack.clientWidth) return;
    const covers = outgoing.map((panel, i) => {
      const height = panel.offsetHeight;
      const runway = panel.parentElement.clientHeight - height;
      const pinEnd = parseFloat(getComputedStyle(panel).top) + height;
      const nextTop = panels[i + 1].parentElement.getBoundingClientRect().top;
      return progress(nextTop, pinEnd, pinEnd - runway);
    });
    outgoing.forEach((panel, i) => panel.style.setProperty('--brand-covered', covers[i].toFixed(4)));
  });

  const measure = () => {
    if (!desktopMotion.matches || !stack.clientWidth) return;
    const heights = outgoing.map((panel) => panel.offsetHeight);
    outgoing.forEach((panel, i) => panel.style.setProperty('--brand-height', `${heights[i]}px`));
    stack.setAttribute('data-stack-ready', '');
    schedule();
  };
  const sizes = new ResizeObserver(measure);
  outgoing.forEach((panel) => sizes.observe(panel));
  desktopMotion.addEventListener('change', measure);
  measure();
}
