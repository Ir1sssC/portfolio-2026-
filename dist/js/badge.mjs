const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const radians = (degrees) => degrees * Math.PI / 180;

export function DraggableBadge(rig) {
  const badge = rig.querySelector('[data-badge]');
  const ribbonLayers = rig.querySelectorAll('.ribbon, .ribbon-shadow, .ribbon-weave');
  const seams = rig.querySelector('.ribbon-seam');
  const lettering = rig.querySelector('#strap-type');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const axis = () => ({ value: 0, velocity: 0, target: 0 });
  const x = axis();
  const y = axis();
  const angle = axis();
  const pitch = axis();
  const yaw = axis();
  const dimensions = { center: 0, badgeTop: 0, limitX: 0 };
  let drag = null;
  let hovering = false;
  let visible = true;
  let previousFrame = 0;
  let frame = 0;

  function step(spring, delta, stiffness, damping) {
    spring.velocity += ((spring.target - spring.value) * stiffness - spring.velocity * damping) * delta;
    spring.value += spring.velocity * delta;
  }

  function paint() {
    const rotation = angle.value;
    badge.style.transform = `translate3d(${x.value}px, ${y.value}px, 0) rotate(${rotation}deg) perspective(850px) rotateX(${pitch.value}deg) rotateY(${yaw.value}deg)`;

    // The ribbon ends at the rotating ring, 62px above the badge's pivot.
    const anchor = dimensions.center;
    const ringOffset = 62;
    const endX = anchor + x.value + ringOffset * Math.sin(radians(rotation));
    const endY = Math.max(10, dimensions.badgeTop + y.value + 11 - ringOffset * Math.cos(radians(rotation)));
    const sway = endX - anchor;
    const curve = (offset) => `M${anchor + offset} -5 C${anchor + offset + sway * .16} ${endY * .31},${endX + offset - sway * .16} ${endY * .82},${endX + offset} ${endY}`;
    const half = 15;
    const outline = `${curve(-half)} L${endX + half} ${endY} C${endX + half - sway * .16} ${endY * .82},${anchor + half + sway * .16} ${endY * .31},${anchor + half} -5 Z`;
    ribbonLayers.forEach((path) => path.setAttribute('d', outline));
    seams.setAttribute('d', `${curve(-half + 2)} ${curve(half - 2)}`);
    lettering.setAttribute('d', curve(2.5));
  }

  function animate(time) {
    frame = 0;
    const elapsed = Math.min((time - (previousFrame || time)) / 1000, .033);
    previousFrame = time;
    if (!drag) {
      angle.target = motion.matches ? 0 : Math.sin(time * .00162) * (hovering ? .45 : 1.5);
      for (const spring of [x, y]) step(spring, elapsed, 146, 19);
    }
    step(angle, elapsed, drag ? 220 : 115, drag ? 23 : 14);
    step(pitch, elapsed, 190, 23);
    step(yaw, elapsed, 190, 23);
    paint();
    wake();
  }

  function wake() {
    if (!frame && (visible || drag) && !document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
  }

  function measure() {
    dimensions.center = rig.clientWidth / 2;
    dimensions.badgeTop = badge.offsetTop;
    dimensions.limitX = Math.max(35, Math.min(455, (window.innerWidth - badge.offsetWidth) / 2 - 12));
    paint();
    wake();
  }

  function resetTilt() {
    pitch.target = 0;
    yaw.target = 0;
  }

  badge.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || drag) return;
    drag = { id: event.pointerId, pointerX: event.clientX, pointerY: event.clientY, startX: x.value, startY: y.value, time: event.timeStamp };
    badge.setPointerCapture(event.pointerId);
    badge.classList.add('dragging');
    x.velocity = 0;
    y.velocity = 0;
    resetTilt();
    wake();
  });

  badge.addEventListener('pointermove', (event) => {
    if (!drag) {
      if (event.pointerType !== 'mouse' || motion.matches) return;
      const box = badge.getBoundingClientRect();
      hovering = true;
      yaw.target = ((event.clientX - box.left) / box.width - .5) * 13;
      pitch.target = (.5 - (event.clientY - box.top) / box.height) * 10;
      wake();
      return;
    }
    if (drag.id !== event.pointerId) return;
    const nextX = clamp(drag.startX + event.clientX - drag.pointerX, -dimensions.limitX, dimensions.limitX);
    const nextY = clamp(drag.startY + event.clientY - drag.pointerY, 76 - dimensions.badgeTop, 165);
    const seconds = Math.max((event.timeStamp - drag.time) / 1000, .008);
    x.velocity = .36 * x.velocity + .64 * (nextX - x.value) / seconds;
    y.velocity = .36 * y.velocity + .64 * (nextY - y.value) / seconds;
    x.value = nextX;
    y.value = nextY;
    drag.time = event.timeStamp;
    angle.target = clamp(-nextX * .064 - x.velocity * .007, -28, 28);
    if (motion.matches) paint();
  });

  function release(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const isFlick = event.type === 'pointerup' && event.timeStamp - drag.time < 90;
    x.velocity = isFlick ? clamp(x.velocity * .55, -900, 900) : 0;
    y.velocity = isFlick ? clamp(y.velocity * .55, -900, 900) : 0;
    drag = null;
    hovering = false;
    badge.classList.remove('dragging');
    resetTilt();
    if (motion.matches) {
      for (const spring of [x, y, angle, pitch, yaw]) Object.assign(spring, axis());
      paint();
    }
    wake();
  }

  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) badge.addEventListener(event, release);
  badge.addEventListener('pointerleave', () => { hovering = false; resetTilt(); });
  badge.addEventListener('click', (event) => {
    if (event.detail !== 0 || motion.matches) return;
    x.velocity += 290;
    angle.velocity -= 94;
    wake();
  });

  motion.addEventListener('change', () => {
    if (motion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const spring of [x, y, angle, pitch, yaw]) Object.assign(spring, axis());
      paint();
    }
    wake();
  });
  document.addEventListener('visibilitychange', wake);
  new ResizeObserver(measure).observe(rig);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }).observe(rig);
  measure();
}
