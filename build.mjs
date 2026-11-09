import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { profile, skills, experience, faq } from './dist/js/content.mjs';
import { categories, projects, mediaProjects } from './dist/js/works-data.mjs';
import { toolkit } from './dist/js/toolkit-data.mjs';

const esc = (text) => String(text).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const pad = (number) => String(number).padStart(2, '0');
const arrow = (direction = 'out') => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${{ out: 'M6 18 18 6M7 6h11v11', down: 'M12 3v17m-6-6 6 6 6-6', left: 'M21 12H4m7-7-7 7 7 7', up: 'M12 21V4m-6 6 6-6 6 6' }[direction]}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mark = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.15"><ellipse cx="20" cy="20" rx="5.8" ry="18"/><ellipse cx="20" cy="20" rx="5.8" ry="18" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="5.8" ry="18" transform="rotate(120 20 20)"/></g><circle cx="20" cy="20" r="2.3" fill="currentColor"/></svg>`;
const nav = [['works', '精选作品'], ['about', '关于我'], ['experience', '经历'], ['faq', '常见问题'], ['contact', '联系']];
const homeNav = [['about', '关于我'], ['works', '作品'], ['experience', '经历'], ['contact', '联系']];
const index = (number, label) => `<div class="section-index micro"><span>${number} /</span> ${label}</div>`;
const aboutGraphic = await readFile(new URL('./dist/assets/profile-graphic.svg', import.meta.url), 'utf8');
const resumeAvailable = profile.resumeUrl && await stat(new URL(`./dist/${profile.resumeUrl}`, import.meta.url)).then(
  (file) => file.isFile(),
  () => false,
);

function Header(root, home) {
  const homePath = home ? '' : `${root}index.html`;
  const brandLabel = home ? `<span class="brand-label">个人作品集 / ${esc(profile.year)}</span>` : `<span>${esc(profile.chineseName)}</span>`;
  const links = home ? homeNav : nav;
  return `<header class="site-header" id="site-header"><div class="header-inner frame">
    <a href="${homePath}#top" class="brand" aria-label="${esc(profile.chineseName)}的作品集首页">${mark}${brandLabel}</a>
    <button class="menu-toggle micro" type="button" aria-expanded="false" aria-controls="nav-links"><span>菜单</span><i aria-hidden="true"></i></button>
    <nav id="nav-links" aria-label="作品集导航">${links.map(([id, label]) => `<a href="${homePath}#${id}">${label}</a>`).join('')}</nav>
  </div></header>`;
}

function DraggableBadge() {
  return `<div class="badge-rig" data-badge-rig>
    <svg class="lanyard" width="100%" height="100%" aria-hidden="true"><defs>
      <linearGradient id="ribbon" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#426c7d"/><stop offset=".14" stop-color="#6b99aa"/><stop offset=".52" stop-color="#5d8a9b"/><stop offset=".87" stop-color="#6593a5"/><stop offset="1" stop-color="#3d6475"/></linearGradient>
      <pattern id="weave" width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5H4M1 0V3" stroke="#fff" stroke-opacity=".1" stroke-width=".5"/></pattern>
    </defs><path class="ribbon-shadow"/><path class="ribbon"/><path class="ribbon-weave"/><path class="ribbon-seam"/><text class="lanyard-type"><textPath href="#strap-type" startOffset="42">${esc(profile.chineseName)} / 设计档案</textPath></text><path id="strap-type" fill="none"/></svg>
    <span class="badge-hint micro" aria-hidden="true">${arrow()}<span>拖动工牌试试</span></span>
    <button class="badge" data-badge type="button" aria-label="互动设计师工牌，拖动后松手，或按回车键使工牌摆动">
      <span class="badge-ring" aria-hidden="true"></span><span class="badge-clasp" aria-hidden="true"></span>
      <span class="badge-slot" aria-hidden="true"></span>
      <span class="badge-heading"><span class="badge-name"><span>${esc(profile.chineseName)}</span> <span class="badge-name-en" lang="en">${esc(profile.englishName)}</span></span><span class="badge-id">个人档案<br>编号 001</span></span>
      <span class="badge-body"><img src="${esc(profile.badgePhoto)}" alt="${esc(profile.badgePhotoAlt)}" width="1080" height="720" draggable="false" fetchpriority="high"></span>
      <span class="badge-bottom"><span class="barcode" aria-hidden="true"></span><span>创意设计</span><span class="badge-emblem">${mark}</span></span>
    </button>
  </div>`;
}

function CursorImageTrail() {
  return '<div class="cursor-trail" data-image-trail aria-hidden="true"></div>';
}

function Hero() {
  return `<section class="hero" aria-labelledby="hero-title">${CursorImageTrail()}
    <div class="hero-inner frame">
      <div class="badge-exit">${DraggableBadge()}</div>
      <div class="hero-copy">
        <h1 id="hero-title">设计师</h1>
        <div class="hero-summary"><p class="hero-role">${esc(profile.role)}</p><p class="hero-description">${esc(profile.intro)}</p></div>
      </div>
      <div class="hero-bottom"><a class="scroll-link micro" href="#about">${arrow('down')} 向下浏览</a></div>
    </div>
  </section>`;
}

const orderedProjects = categories.flatMap(({ id }) => projects.filter((project) => project.category === id));
const caseProjects = orderedProjects.filter((project) => !['video', 'practice', 'live-prototype'].includes(project.presentation));
const catalogProjects = [...orderedProjects, ...mediaProjects];
const countWorks = (entries) => entries.reduce((count, entry) =>
  count + (entry.category === 'photography' ? (entry.images?.length ?? 0) : 1), 0);
const pending = (label) => `<p class="work-pending micro">${esc(label)}</p>`;

function MediaImage(image, root = '', folder = 'assets/') {
  const size = image.width && image.height ? ` width="${esc(image.width)}" height="${esc(image.height)}"` : '';
  return `<img src="${root}${folder}${esc(image.src)}" alt="${esc(image.alt ?? '')}"${size} loading="lazy" decoding="async">`;
}

function ImageLink(image, root = '') {
  return `<a class="image-enlarge" href="${root}assets/${esc(image.src)}" data-image-open target="_blank" rel="noopener noreferrer" aria-label="放大查看${esc(image.alt)}">${MediaImage(image, root)}</a>`;
}

function ProjectCover(project) {
  return MediaImage(project.cover);
}

function ProjectCard(project, number) {
  return `<article class="project-card"${project.featured ? ' data-featured' : ''}>
    <a href="projects/${project.slug}/index.html" class="project-link" aria-label="查看《${esc(project.title)}》案例">
      <div class="project-image"${project.deviceCover ? ' data-device-cover' : ''}${CoverCrop(project.cover)}>${ProjectCover(project)}<span class="project-open micro">查看案例 ${arrow()}</span></div>
      <div class="project-meta micro"><span>${pad(number)} / ${esc(project.kind)}</span>${project.year ? `<span>${esc(project.year)}</span>` : ''}</div>
      <div class="project-title"><h4>${esc(project.title)}</h4>${arrow()}</div>
      <p>${esc(project.description)}</p>
    </a>${ProjectTags(project.tags)}${ProjectPrototype(project)}
  </article>`;
}

function DemoProject(project, number) {
  const attributes = `data-video-src="assets/${esc(project.video.src)}" data-video-poster="assets/${esc(project.cover.src)}" data-video-title="${esc(project.title)}"`;
  return `<article class="demo-project" aria-labelledby="${esc(project.slug)}-title">
    <button class="demo-cover" type="button" ${attributes} aria-label="观看${esc(project.title)}项目演示">
      ${MediaImage(project.cover)}<span class="demo-play" aria-hidden="true">▷</span>
    </button>
    <div class="demo-copy">
      <div class="project-meta micro"><span>${pad(number)} / Web 开发与数据可视化</span><span>${esc(project.year)}</span></div>
      <h4 id="${esc(project.slug)}-title">${esc(project.title)}</h4>
      <p class="micro" lang="en">${esc(project.englishName)}</p><p class="demo-kind micro" lang="en">${esc(project.kind)}</p>
      <p>${esc(project.description)}</p><p class="micro">${esc(project.background)}</p>
      ${ProjectTags(project.tools)}<button class="prototype-link demo-action" type="button" ${attributes}>观看项目演示 ${arrow()}</button>
    </div>
  </article>`;
}

function LiveProject(project, number) {
  return `<article class="live-project" id="work-${esc(project.slug)}" aria-labelledby="${esc(project.slug)}-title">
    <header class="live-project-heading">
      <div><div class="project-meta micro"><span>${pad(number)} / 独立产品项目</span></div>
        <h4 id="${esc(project.slug)}-title">${esc(project.title)}</h4><p class="live-english micro" lang="en">${esc(project.englishName)}</p>
        <p class="live-kind micro" lang="en">${esc(project.kind)}</p>${ProjectTags([...project.tags, ...project.tools])}</div>
      <div class="live-project-summary"><p>${esc(project.description)}</p>
        <a class="prototype-link live-prototype-link" href="${esc(project.prototypeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="体验 RoomieBoard 合租协作看板原型，在新标签页打开">体验原型 ${arrow()}</a></div>
    </header>
    <div class="live-project-images" data-image-gallery>${project.images.map((image, i) => `<figure>${ImageLink(image)}<figcaption class="micro">${i === 0 ? '01 / 房源详情与多维评估' : '02 / 室友意见与看房清单'}<span>线上界面截图</span></figcaption></figure>`).join('')}</div>
  </article>`;
}

function TaxMindProject(project, number) {
  return `<article class="taxmind-project" id="work-taxmind" aria-labelledby="taxmind-title">
    <div class="taxmind-intro">
      <span class="micro">${pad(number)} / 产品实践</span><h4 id="taxmind-title">${esc(project.title).replace('｜', '｜<br>')}</h4>
      <p class="micro" lang="en">${esc(project.englishName)}</p><p class="micro taxmind-kind" lang="en">${esc(project.kind)}</p>
      <p>${esc(project.description)}</p>
      <div class="taxmind-contributions"><h5>个人贡献 <span class="micro" lang="en">My Contribution</span></h5>${project.contributions.map((item) => `<div><h6>${esc(item.title)}</h6><p>${esc(item.description)}</p></div>`).join('')}</div>
      ${ProjectTags(project.tools)}
    </div>
    <div class="taxmind-media" data-image-gallery aria-label="TaxMind 小程序与公众号展示">
      <div class="taxmind-screens">${project.images.map((image) => `<figure><figcaption class="micro">${esc(image.caption)}</figcaption>${ImageLink(image)}</figure>`).join('')}</div>
      <p class="micro taxmind-zoom-hint">点击图片查看大图</p>
    </div>
  </article>`;
}

function StickerProject(project, number) {
  const titleId = `graphic-${esc(project.slug)}`;
  return `<article class="brand-project ip-project" aria-labelledby="${titleId}"><div class="brand-panel" data-presentation="ip-board">
    <div class="ip-intro"><span class="micro">${pad(number)} / ${esc(project.kind)}</span><h4 id="${titleId}">${esc(project.title).replace('》', '》<br>')}</h4>
      <p>${esc(project.description)}</p><figure class="ip-character">${MediaImage(project.character)}</figure>
    </div>
    <div class="ip-stickers" data-image-gallery>${project.gallery.map((image) => `<figure>${ImageLink(image)}</figure>`).join('')}</div>
  </div></article>`;
}

function GalleryVideo(video) {
  const captions = video.captions ? `<track kind="captions" srclang="zh" label="中文字幕" src="assets/${esc(video.captions)}">` : '';
  return `<video controls playsinline muted preload="none" width="${esc(video.width)}" height="${esc(video.height)}" src="assets/${esc(video.src)}" poster="assets/${esc(video.poster)}" aria-label="${esc(video.caption)}">${captions}</video>`;
}

function GalleryProject(project, number) {
  const titleId = `${project.category}-${esc(project.slug)}`;
  const media = [...(project.gallery ?? project.images ?? []), ...(project.videos ?? [])];
  const scrollable = media.length > 1 && project.presentation !== 'editorial';
  const viewportId = `${titleId}-images`;
  const metadata = [project.tools?.join('、'), project.location, project.year].filter(Boolean).join(' · ');
  return `<article class="graphic-project"${project.presentation === 'editorial' ? ' data-presentation="editorial"' : ''} aria-labelledby="${titleId}">
    <div class="graphic-intro">
      <span class="micro">${pad(number)} / ${esc(project.kind)}</span>
      <h4 id="${titleId}">${esc(project.title)}</h4>
      <p>${esc(project.description)}</p>${project.galleryNote ? `<p class="micro">${esc(project.galleryNote)}</p>` : ''}${metadata ? `<p class="micro">${esc(metadata)}</p>` : ''}
    </div>
    <div class="graphic-gallery" data-graphic-layout="${esc(project.galleryLayout ?? 'default')}"${scrollable ? ' data-board-gallery' : ''}>
      ${scrollable ? `<div class="graphic-toolbar">
        <span class="micro" id="${titleId}-hint">拖动或左右滑动浏览</span>
        <div class="graphic-controls">
          <button type="button" data-board-step="-1" aria-controls="${viewportId}" aria-label="上一张作品" disabled>${arrow('left')}</button>
          <span class="micro" data-board-count role="status">01 / ${pad(media.length)}</span>
          <button type="button" data-board-step="1" aria-controls="${viewportId}" aria-label="下一张作品">${arrow('left')}</button>
        </div>
      </div>` : ''}${media.length ? `<div class="graphic-viewport" id="${viewportId}"${scrollable ? ` data-board-viewport tabindex="0" role="region" aria-labelledby="${titleId}" aria-describedby="${titleId}-hint"` : ''}>
        ${media.map((item) => {
          const ratio = project.galleryLayout === 'photos' ? ` style="--photo-ratio: ${item.width / item.height}"` : '';
          return `<figure data-board-slide${ratio}>${item.poster ? GalleryVideo(item) : MediaImage(item)}${item.caption ? `<figcaption class="micro">${esc(item.caption)}</figcaption>` : ''}</figure>`;
        }).join('')}
      </div>` : pending('作品待补充')}
    </div>
  </article>`;
}

function BrandProject(project, number) {
  if (project.presentation === 'ip-board') return StickerProject(project, number);
  const titleId = `graphic-${esc(project.slug)}`;
  return `<article class="brand-project" aria-labelledby="${titleId}">
    <div class="brand-panel"${project.presentation === 'editorial' ? ' data-presentation="editorial"' : ''}>
      <div class="graphic-intro brand-intro">
        <span class="micro">${pad(number)} / ${esc(project.stackIntro?.kind ?? project.kind)}</span>
        <h4 id="${titleId}">${project.caseLayout === 'poster-series' ? esc(project.title).replace('：', '：<br>') : esc(project.displayTitle ?? project.title)}</h4>${project.subtitle ? `<p class="project-subtitle">${esc(project.subtitle)}</p>` : ''}
        <p>${esc(project.stackIntro?.description ?? project.description)}</p>${project.galleryNote ? `<p class="micro">${esc(project.galleryNote)}</p>` : ''}${project.caseLayout === 'poster-series' ? `<p class="micro" lang="en">${esc(project.englishName)}<br>${esc(project.year)}</p><p class="micro" lang="en">${esc(project.tagline)}</p><a class="prototype-link" href="projects/${esc(project.slug)}/index.html">查看完整作品 ${arrow()}</a>` : ''}
      </div>
      <div class="brand-images" data-brand-layout="${esc(project.galleryLayout ?? 'default')}"${project.imageLinks ? ' data-image-gallery' : ''}>
        ${(project.previewImages ?? project.gallery).map((item) => `<figure>${project.imageLinks ? ImageLink(item) : MediaImage(item)}${item.caption ? `<figcaption class="micro">${esc(item.caption)}</figcaption>` : ''}</figure>`).join('')}
      </div>
    </div>
  </article>`;
}

function WorkCategory(category, i) {
  const entries = catalogProjects.filter((project) => project.category === category.id);
  const count = countWorks(entries);
  let content = '';
  if (entries.length && category.id === 'product') {
    content = `<div class="project-grid" data-layout="${category.id}">${entries.map((project, j) => {
      if (project.presentation === 'video') return DemoProject(project, j + 1);
      if (project.presentation === 'practice') return TaxMindProject(project, j + 1);
      if (project.presentation === 'live-prototype') return LiveProject(project, j + 1);
      return ProjectCard(project, j + 1);
    }).join('')}</div>`;
  } else if (entries.length && category.id === 'graphic') {
    content = `<div class="brand-stack" data-brand-stack>${entries.map((project, j) => BrandProject(project, j + 1)).join('')}</div>`;
  } else if (entries.length) {
    content = `<div class="graphic-projects">${entries.map((project, j) => GalleryProject(project, j + 1)).join('')}</div>`;
  }
  return `<section class="work-category" data-category="${category.id}" data-entry-count="${count}" aria-labelledby="work-${category.id}">
    <header class="work-category-heading"><span class="micro work-category-number">${pad(i + 1)} /</span><div><h3 id="work-${category.id}">${esc(category.title)}</h3><p class="micro" lang="en">${esc(category.english)}</p></div><span class="micro work-category-count">${pad(count)} 项</span></header>
    ${category.description ? `<p class="work-category-description">${esc(category.description)}</p>` : ''}${content}
  </section>`;
}

function ProjectGallery() {
  return `<section class="section works frame" id="works" aria-labelledby="works-title">
    ${index('01', '作品目录')}
    <div class="works-heading"><h2 id="works-title">精选作品</h2><p>从数字产品到平面与动效，记录设计构想和尝试。</p></div>
    <div class="filter-bar"><div class="filters" role="group" aria-label="筛选作品类别"><button type="button" class="micro" aria-pressed="true" data-filter="all">全部作品</button>${categories.map((category) => `<button type="button" class="micro" aria-pressed="false" data-filter="${category.id}">${esc(category.filter)}</button>`).join('')}</div><p class="micro result-count" aria-live="polite" data-count>共 ${countWorks(catalogProjects)} 项</p></div>
    <div class="work-catalog" data-gallery>${categories.map(WorkCategory).join('')}</div>
  </section>`;
}

function Toolkit() {
  return `<div class="toolkit">
    <div class="toolkit-heading"><h3 id="toolkit-title">设计工具</h3><span class="micro" lang="en">Creative Toolkit</span></div>
    <ul class="toolkit-grid" aria-labelledby="toolkit-title">${[...toolkit].sort((a, b) => a.order - b.order).map(({ name, category, icon }) => `<li class="toolkit-item" title="${esc(name)} · ${esc(category)}">${icon ? `<img class="toolkit-logo" src="assets/toolkit/${esc(icon)}" alt="" width="44" height="44" loading="lazy" decoding="async">` : ''}<span class="toolkit-name" lang="en">${esc(name)}</span></li>`).join('')}</ul>
  </div>`;
}

function About() {
  return `<section class="about section" id="about" aria-labelledby="about-title"><div class="frame">
    ${index('02', '个人介绍')}
    <div class="about-grid">
      <figure class="about-portrait">${aboutGraphic.trim()}<figcaption class="micro"><span>图 02 / 视觉手记</span><span>几何练习</span></figcaption></figure>
      <div class="about-copy">
        <h2 id="about-title">关于我</h2>
        <p class="about-lede">${esc(profile.about)}</p>
        <p>${esc(profile.aboutEducation)}</p>
        <p>${esc(profile.approach)}</p>
        <div class="skills"><span class="micro">设计方向</span><ul>${skills.map((skill) => `<li>${esc(skill)}</li>`).join('')}</ul></div>
      </div>
    </div>
    ${Toolkit()}
  </div></section>`;
}

function Experience() {
  return `<section class="section experience frame" id="experience" aria-labelledby="experience-title">
    ${index('03', '学习与实践')}<h2 id="experience-title">个人经历</h2>
    <section class="experience-group" aria-labelledby="experience-work-title">
      <div class="experience-group-heading"><h3 id="experience-work-title">实习与工作经历</h3><span class="micro" lang="en">Work Experience</span></div>
      <div class="experience-labels micro" aria-hidden="true"><span>时间</span><span>公司</span><span>岗位</span><span>简介</span></div>
      <ul class="experience-list experience-work">${experience.work.map(({ period, company, role, description, projectAnchor }) => `<li>
        <span class="micro experience-period">${esc(period)}</span>
        <div class="experience-position"><h4>${esc(company)}</h4><p class="experience-role">${esc(role)}</p></div>
        <p class="experience-description">${esc(description)}${projectAnchor ? `<a class="experience-project-link" href="#${esc(projectAnchor)}" data-show-project>查看相关项目 ${arrow()}</a>` : ''}</p>
      </li>`).join('')}</ul>
    </section>
    <section class="experience-group" aria-labelledby="experience-education-title">
      <div class="experience-group-heading"><h3 id="experience-education-title">教育背景</h3><span class="micro" lang="en">Education</span></div>
      <ul class="experience-list experience-education">${experience.education.map(({ institution, englishName, period, program }) => `<li>
        <span class="micro experience-period">${esc(period)}</span>
        <div><h4>${esc(institution || '本科教育')}</h4>${englishName ? `<p class="experience-school-en" lang="en">${esc(englishName)}</p>` : ''}</div>
        <p>${esc(program)}</p>
      </li>`).join('')}</ul>
    </section>
    <section class="experience-group" aria-labelledby="experience-campus-title">
      <div class="experience-group-heading"><h3 id="experience-campus-title">校园经历与荣誉</h3><span class="micro" lang="en">Campus &amp; Honors</span></div>
      <ul class="experience-campus">${experience.campus.map(({ title, description }) => `<li><h4>${esc(title)}</h4><p>${esc(description)}</p></li>`).join('')}</ul>
    </section>
  </section>`;
}

function FAQ() {
  return `<section class="section faq frame" id="faq" aria-labelledby="faq-title"><div>${index('05', '问答')}<h2 id="faq-title">常见问题</h2></div>
    <div class="faq-list">${faq.map((item, i) => `<details><summary><span class="micro">${pad(i + 1)}</span><strong>${esc(item.question)}</strong><i aria-hidden="true"></i></summary><p>${esc(item.answer)}</p></details>`).join('')}</div>
  </section>`;
}

function Contact() {
  const email = esc(profile.email);
  const secondaryEmail = esc(profile.secondaryEmail);
  return `<section class="contact section" id="contact" aria-labelledby="contact-title"><div class="frame">
    ${index('06', '保持联系')}<h2 id="contact-title">一起做点<br>有意思的事。</h2>
    <p class="contact-intro">${esc(profile.contactIntro)}</p>
    <div class="contact-row">
      <div><span class="micro">直接联系 / <span lang="en">CONTACT</span></span>
        <a class="contact-email" href="mailto:${email}">${email}</a>
        <div class="contact-actions"><a class="contact-action" href="mailto:${email}">发送邮件 ${arrow()}</a><button class="contact-action" type="button" data-copy-email="${email}">复制邮箱</button></div>
        <a class="contact-email contact-secondary" href="mailto:${secondaryEmail}">${secondaryEmail}</a>
        <p class="micro contact-copy-status" role="status"></p>
      </div>
      <div><span class="micro">实习意向 / <span lang="en">OPPORTUNITIES</span></span>
        <p>${esc(profile.opportunities)}</p><div class="contact-availability">${profile.availability.map((line) => `<p>${esc(line)}</p>`).join('')}</div>
        ${resumeAvailable ? `<a class="contact-action" href="${esc(profile.resumeUrl)}" target="_blank" rel="noopener noreferrer">下载我的简历 ${arrow()}</a>` : ''}
      </div>
      <div class="contact-mark" aria-hidden="true">${mark}</div>
    </div>
  </div></section>`;
}

function Footer(home) {
  const signature = home ? `<span class="micro footer-signature" lang="en">© ${esc(profile.year)} Iris Chen · Designed &amp; Built with Curiosity</span>` : `<span class="micro">${esc(profile.chineseName)} © ${esc(profile.year)}</span><span class="micro footer-edition">设计作品集 / 第一版</span>`;
  return `<footer class="site-footer"><div class="frame footer-inner">${signature}<a class="micro" href="#top">返回顶部 ${arrow('up')}</a></div></footer>`;
}

function page({ title, description, root = '', home = false, body }) {
  return `<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#cbdfe9"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="icon" href="${root}assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}style.css"><script type="module" src="${root}js/main.mjs"></script></head><body class="${home ? 'home' : 'case-page'}"><a class="skip-link" href="#main">跳到正文</a><div id="top"></div>${Header(root, home)}<main id="main">${body}</main>${Footer(home)}</body></html>`;
}

function CoverCrop(cover) {
  return cover?.crop ? ` data-cover-crop="${esc(cover.crop)}"` : '';
}

function MediaGallery(images, label, visualLayout, interactive = false) {
  if (!images?.length) return pending(label);
  return `<div class="case-media-grid"${visualLayout ? ` data-visual-layout="${esc(visualLayout)}"` : ''}${interactive ? ' data-image-gallery' : ''}>${images.map((image) => {
    const media = MediaImage(image, '../../');
    const caption = image.caption ? `<figcaption class="micro">${esc(image.caption)}</figcaption>` : '';
    return `<figure>${interactive ? ImageLink(image, '../../') : visualLayout ? `<a href="../../assets/${esc(image.src)}" target="_blank" rel="noopener noreferrer" aria-label="查看大图：${esc(image.caption ?? image.alt)}">${media}</a>` : media}${caption}</figure>`;
  }).join('')}</div>`;
}

function ProjectTags(tags) {
  return tags?.length ? `<ul class="work-tags" aria-label="项目标签">${tags.map((tag) => `<li class="micro">${esc(tag)}</li>`).join('')}</ul>` : '';
}

function ProjectPrototype(project) {
  if (!/^https:\/\/(?:www\.)?figma\.com\/proto\/[\w-]+(?:[/?#][^\s]*)?$/i.test(project.prototypeUrl ?? '')) return '';
  return `<div class="prototype-row"><a class="prototype-link" href="${esc(project.prototypeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="点击查看原型，${esc(project.title)}，在新标签页打开">点击查看原型 ${arrow()}</a></div>`;
}

function ProductCase(project) {
  const image = project.showcase.image ?? project.cover;
  return `<section class="case-block case-overview"><h2>项目概览</h2><p class="micro case-eyebrow" lang="en">Project Overview</p>
    <div class="case-prose">${project.overview.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
  </section>
  <section class="case-block" id="prototype"><h2>${esc(project.showcase.title)}</h2><p class="micro case-eyebrow" lang="en">${esc(project.showcase.english)}</p>
    <figure class="compact-showcase${project.showcase.image ? ' compact-board' : ''}" data-image-gallery>
      ${project.showcase.image ? `<a class="image-enlarge" href="../../assets/${esc(image.src)}" data-image-open aria-label="放大查看 Campus+ 完整项目展板">${MediaImage(image, '../../')}</a>` : MediaImage(image, '../../')}${project.showcase.caption ? `<figcaption>${esc(project.showcase.caption)}</figcaption>` : ''}
    </figure>
  </section>`;
}

function PosterCase(project) {
  return `<section class="case-block"><h2>设计理念</h2><p class="micro case-eyebrow" lang="en">Design Concept</p>
    <div class="case-prose">${project.concept.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
  </section>
  <section class="case-block"><h2>系列海报</h2><p class="micro case-eyebrow" lang="en">Poster Gallery</p>
    <div class="poster-gallery" data-image-gallery>${project.gallery.map((image) => `<figure><a class="image-enlarge" href="../../assets/${esc(image.src)}" data-image-open aria-label="放大查看${esc(image.caption)}">${MediaImage(image, '../../')}</a><figcaption class="micro">${esc(image.caption)}</figcaption></figure>`).join('')}</div>
  </section>`;
}

function MediaDialogs({ video = false, image = false } = {}) {
  return `${video ? `<dialog class="media-dialog video-dialog" data-video-dialog aria-labelledby="video-dialog-title">
    <div class="media-toolbar"><h2 class="micro" id="video-dialog-title"></h2><button type="button" data-media-close aria-label="关闭视频">关闭 ×</button></div>
    <video controls playsinline muted preload="none" width="1280" height="720"></video><p class="media-error micro" role="status" hidden>视频暂时无法加载，请稍后重试。</p>
  </dialog>` : ''}${image ? `<dialog class="media-dialog image-dialog" data-image-dialog aria-label="作品高清大图">
    <div class="media-toolbar"><p class="micro" data-image-caption role="status"></p><div class="media-controls"><button type="button" data-image-step="-1" aria-label="上一张作品">←</button><button type="button" data-image-step="1" aria-label="下一张作品">→</button><button type="button" data-media-close aria-label="关闭大图">关闭 ×</button></div></div>
    <div class="lightbox-stage"><button type="button" data-image-zoom aria-label="放大图片" aria-pressed="false"><img alt=""></button></div>
    <p class="micro lightbox-hint">点击图片放大，再次点击还原</p>
  </dialog>` : ''}`;
}

function VisualCase(project) {
  return `<section class="case-block"><h2>作品图集</h2><p class="visual-intro">${esc(project.description)}${project.galleryNote ? ` ${esc(project.galleryNote)}` : ''}</p>${MediaGallery(project.gallery, '作品图待补充', project.galleryLayout ?? 'default', Boolean(project.imageLinks))}
    ${project.video ? `<video controls playsinline preload="metadata" src="../../assets/${esc(project.video.src)}"${project.video.poster ? ` poster="../../assets/${esc(project.video.poster)}"` : ''}>${project.video.captions ? `<track kind="captions" srclang="zh" label="中文字幕" src="../../assets/${esc(project.video.captions)}">` : ''}</video>` : ''}${ProjectPrototype(project)}</section>`;
}

function CaseStudy(project, i) {
  const next = caseProjects[(i + 1) % caseProjects.length];
  const separateCover = project.cover && !project.gallery?.some((image) => image.src === project.cover.src);
  if (!project.caseLayout) {
    return `<article class="case frame"><a class="case-back micro" href="../../index.html#works">${arrow('left')} 返回作品列表</a>
    <header class="case-header">${index(pad(i + 1), '项目案例')}<h1>${esc(project.displayTitle ?? project.title)}</h1>${project.subtitle ? `<p class="visual-subtitle">${esc(project.subtitle)}</p>` : ''}<p>${esc(project.kind)}</p><div class="case-meta micro"><span>${esc(categories.find(({ id }) => id === project.category).title)}</span>${project.year ? `<span>${esc(project.year)}</span>` : ''}</div>${ProjectTags(project.tags)}${project.category === 'product' ? ProjectPrototype(project) : ''}</header>
    ${separateCover ? `<figure class="case-image"${CoverCrop(project.cover)}>${MediaImage(project.cover, '../../')}</figure>` : ''}${VisualCase(project)}
    ${next && next !== project ? `<a class="case-next" href="../${next.slug}/index.html"><div><span class="micro">下一个项目</span><strong>${esc(next.title)}</strong></div>${arrow()}</a>` : ''}
  </article>${project.imageLinks ? MediaDialogs({ image: true }) : ''}`;
  }
  return `<article class="case frame case-compact${project.caseLayout === 'poster-series' ? ' case-posters' : ''}"><a class="case-back micro" href="../../index.html#works">${arrow('left')} 返回作品列表</a>
    <header class="case-header">${index(pad(i + 1), '项目案例')}<h1>${esc(project.caseTitle ?? project.title)}</h1>
      ${project.caseSubtitle ? `<p class="case-subtitle">${esc(project.caseSubtitle)}</p>` : ''}${project.englishName ? `<p lang="en">${esc(project.englishName)}</p>` : ''}<p class="case-kind" lang="en">${esc(project.caseKind)}</p><div class="case-meta micro"><span>${esc(categories.find(({ id }) => id === project.category).title)}</span>${project.year ? `<span>${esc(project.year)}</span>` : ''}</div>${project.tools ? `<p class="case-tools micro" lang="en">${esc(project.tools.join(' / '))}</p>` : ''}${project.caseLayout === 'poster-series' ? `<p class="micro">${esc(project.background)}</p>` : ''}${ProjectTags(project.tags)}${project.category === 'product' ? ProjectPrototype(project) : ''}</header>
    ${project.caseLayout === 'poster-series' ? PosterCase(project) : ProductCase(project)}
    <a class="case-return prototype-link" href="../../index.html#works">${arrow('left')} 返回作品集</a>
  </article>${MediaDialogs({ image: project.caseLayout === 'poster-series' || Boolean(project.showcase?.image) })}`;
}

await writeFile('dist/index.html', page({ title: `${profile.chineseName}｜设计作品集`, description: '陈瑜萱的设计作品集，涵盖 UI/UX 与产品设计、平面与品牌视觉、三维与动效及摄影。', home: true, body: [Hero(), About(), ProjectGallery(), Experience(), FAQ(), Contact(), MediaDialogs({ video: true, image: true })].join('') }));
await Promise.all(caseProjects.map(async (project, i) => {
  const directory = `dist/projects/${project.slug}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, page({ title: `${project.title}｜${profile.chineseName}的作品集`, description: project.description, root: '../../', body: CaseStudy(project, i) }));
}));
