// 按这里的顺序展示分类。项目与照片数由对应的数据条目生成。
export const categories = [
  { id: 'product', filter: 'UI/UX 与产品', title: 'UI/UX 与产品设计', english: 'UI/UX & PRODUCT DESIGN' },
  { id: 'graphic', filter: '平面视觉', title: '平面与品牌视觉', english: 'GRAPHIC & VISUAL DESIGN' },
  { id: 'motion', filter: '三维与动效', title: '三维与动效', english: '3D & MOTION' },
  { id: 'photography', filter: '摄影', title: '摄影作品', english: 'PHOTOGRAPHY', description: '用镜头记录日常，也收藏那些偶然出现的光影、色彩与瞬间。' },
];

const graphicImage = (name, width, height, caption, alt = caption) => ({
  src: `projects/graphic/${name}.webp`, width, height, caption, alt,
});

const taskImage = (folder, name, width, height, alt) => ({
  src: `projects/${folder}/${name}`, width, height, alt,
});

const golden = [
  graphicImage('golden-01', 1024, 1536, '实战班促销主视觉', '橙色 AI 财税管理师实战班海报，展示品牌角色、课程产品与促销信息'),
  graphicImage('golden-02', 941, 1672, '实战计划课程长图 · 橙色版', '橙色课程宣传长图，展示适合人群、课程亮点与课程体系'),
  graphicImage('golden-03', 1024, 1536, '实战计划课程长图 · 蓝色版', '蓝金色 AI 财税管理师实战计划课程宣传长图'),
];

const clio = [
  [528, 'Glaze Lip Serum / New Colors，模特与渐变唇彩色号'],
  [582, '02 JUICY BERRY，模特手持唇部精华与产品视觉'],
  [618, 'POINT 01 / POINT 02，唇部质感与钥匙链产品卖点'],
  [737, 'POINT 03，硅胶刷头及产品管身色号'],
  [525, 'COLOR SHADE，四种色号与使用提示'],
].map(([width, alt], i) => taskImage('task3_clio', `clio_phone_0${i + 1}.png`, width, 2048, alt));

const packaging = [
  graphicImage('packaging-01', 1920, 1440, '提拉米苏包装', '提拉米苏包装盒效果图，白色盒面搭配可可色格纹'),
  graphicImage('packaging-02', 1920, 1281, '和藏酒礼盒', '和藏酒礼盒效果图，盒面结合书法、印章与山水插画'),
];

const valorant = [
  ['01_rose.png', '叼着玫瑰的 Q 版特工表情'],
  ['02_joy.png', '开心的 Q 版特工表情'],
  ['03_green_hat.png', '绿色帽子的 Q 版特工表情'],
  ['04_surprised.png', '吃惊的 Q 版特工表情'],
  ['05_blue_hair.png', '蓝色头发的 Q 版特工表情'],
  ['06_crying.png', '哭泣的 Q 版特工表情'],
  ['07_yellow.png', '黄色造型的 Q 版特工表情'],
  ['08_confused.png', '疑惑的 Q 版特工表情'],
].map(([name, alt]) => taskImage('task1_valorant/stickers', name, 512, 512, alt));

const portfolioImage = (name, width, height, alt, caption) => ({
  src: `projects/portfolio/${name}`, width, height, alt, caption,
});

const zhoubi = [
  ['zhoubi-liangzhu-yucong.jpg', '01 良渚玉琮 — 天圆地方的文化意象'],
  ['zhoubi-yingxian-pagoda.jpg', '02 应县木塔 — 几何结构与传统建筑'],
  ['zhoubi-qiheng-siji.jpg', '03 七衡四极 — 古代天文模型的几何表达'],
  ['zhoubi-xingsu-zhoudu.jpg', '04 星宿周度 — 星象、周度与天文图形'],
  ['zhoubi-ridao-cesuan.jpg', '05 日道测算 — 日影测量与古代数学智慧'],
].map(([name, caption]) => portfolioImage(name, 1448, 2048, caption, caption));

export const projects = [
  {
    slug: 'niteoff', title: 'NITEOFF', category: 'product', kind: '跨设备睡眠健康体验设计',
    description: '围绕睡眠习惯、睡前行为与个人反思，探索跨 iPhone、MacBook 和 Apple Watch 的健康体验。',
    caseLayout: 'compact-product', caseTitle: 'NITEOFF',
    caseKind: 'UI/UX Design / Preventive Health / Cross-device Experience',
    overview: [
      'NITEOFF 是一款面向预防性健康的跨设备睡眠习惯管理应用，旨在帮助用户减少熬夜行为，逐步建立更健康的睡前习惯。',
      '项目围绕用户的睡眠时间、睡前行为和个人反思展开，通过睡眠记录、数据可视化、提醒与奖励机制，帮助用户了解自己的作息模式，并在日常生活中逐步调整晚睡习惯。',
      '产品覆盖 iPhone、MacBook 和 Apple Watch 三个设备，探索不同使用场景下的连续性数字体验。',
    ],
    tags: ['UI/UX Design', 'Sleep Wellness', 'Cross-device', 'Figma'],
    deviceCover: true,
    cover: portfolioImage('niteoff-devices-transparent.png', 1448, 1086, 'NITEOFF 的 iPhone、MacBook 与 Apple Watch 三设备组合，透明背景'),
    showcase: {
      title: '跨设备体验', english: 'Cross-device Experience',
      caption: '通过 iPhone、MacBook 与 Apple Watch 的跨设备设计，将睡眠记录、数据反思与习惯提醒融入不同的日常使用场景。',
    },
    prototypeUrl: 'https://www.figma.com/proto/4zUURv7HoEcIzAYoiiGMDo/9105-A3A4-Project-Iris-Chen?node-id=46-1070&t=Yxe1yhmbNUyvfMiz-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=46%3A1070',
  },
  {
    slug: 'campus-services', title: '校园一站式服务 App', category: 'product', kind: '校园服务产品设计',
    description: 'Campus+ 将教务查询、宿舍服务和校园活动整合在同一个应用中。',
    caseLayout: 'compact-product', caseTitle: 'Campus+',
    caseSubtitle: '校园一站式服务 App', caseKind: 'UI/UX Design / Campus Services / Mobile App',
    overview: [
      'Campus+ 是一款面向高校学生的一站式校园服务 App，旨在解决校园服务信息分散、功能入口复杂、不同平台之间切换不便等问题。',
      '应用整合课程查询、校园生活、宿舍服务、校园活动等日常需求，通过统一的信息架构和直观的移动端界面，让学生能够更加便捷地获取校园信息与服务。',
      '设计重点在于整合校园服务入口、优化信息呈现方式，并提供清晰、高效的移动端使用体验。',
    ],
    tags: ['UI/UX Design', 'Mobile App', 'Campus Services', 'Figma'],
    deviceCover: true,
    cover: portfolioImage('campus-plus-phones-transparent.png', 1122, 1402, 'Campus+ 两台交错排列的手机样机，透明背景'),
    showcase: {
      title: '项目展板', english: 'Project Board',
      image: portfolioImage('campus-project-board.jpg', 3508, 4961, 'Campus+ 完整原始蓝色项目展板，包含标题、手机、产品背景及功能架构'),
    },
    prototypeUrl: 'https://www.figma.com/proto/3uokg8o4Vnz04g2aHdfC70/%E6%AF%95%E8%AE%BE?node-id=254-3665&t=t7DRBpYKyDIfd2k2-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=254%3A3719&show-proto-sidebar=1',
  },
  {
    slug: 'roomieboard', title: '留学生合租协作看板', englishName: 'RoomieBoard — Shared Housing Decision Board',
    category: 'product', kind: 'Independent Project / Product Design / Web Development', presentation: 'live-prototype',
    description: '为准备出国、计划共同租房的室友设计的协作看板。将候选房源、看房意见与待确认事项集中到一个界面，帮助室友整理讨论，一起做出租房决策。',
    tags: ['Independent Project'], tools: ['HTML', 'CSS', 'JavaScript'],
    prototypeUrl: 'https://portfolio.auroramoriarty61.workers.dev/',
    images: [
      taskImage('roomieboard', 'roomieboard-overview.png', 1440, 1000, 'RoomieBoard 线上原型的真实界面：候选房源详情、位置通勤、多维评估与跟进状态'),
      taskImage('roomieboard', 'roomieboard-collaboration.png', 761, 626, 'RoomieBoard 线上原型的真实界面：室友看房评论与待确认的问题清单'),
    ],
  },
  {
    slug: 'digital-twin-campus', title: '数字孪生智慧校园系统', englishName: 'Digital Twin Smart Campus System',
    category: 'product', kind: 'Web Development / Data Visualization / Digital Twin', year: '2025', presentation: 'video',
    description: '基于 Web 的数字孪生智慧校园模拟系统，通过三维校园模型与数据可视化驾驶舱，整合能耗监测、设备管理、车辆管理及人员出入信息，探索更直观、高效的校园运营管理方式。',
    background: '第十七届上海市大学生计算机应用能力大赛获奖项目。',
    tools: ['HTML', 'CSS', 'JavaScript', 'Vue 3', 'GoView', 'Python', 'Django', 'SQLite', '3D GIS'],
    cover: portfolioImage('smart-campus-cover.jpg', 1280, 720, '数字孪生智慧校园模拟系统的三维模型与数据可视化驾驶舱'),
    video: { src: 'projects/portfolio/smart-campus-demo.mp4', width: 1280, height: 720 },
  },
  {
    slug: 'taxmind', title: '税启智 TaxMind｜微信小程序与公众号运营', category: 'product',
    englishName: 'TaxMind — Mini Program & Content Operations', presentation: 'practice',
    kind: 'Product Operations / WeChat Mini Program / Content Operations',
    description: '在高顿教育实习期间，我参与「税启智 TaxMind」微信小程序的产品内容管理与运营支持工作。项目依托小鹅通平台，围绕财税学习与职业教育场景组织课程和栏目内容，参与日常配置维护及使用体验检查。同时，我独立负责配套微信公众号的内容运营，从选题、视觉素材整理、图文编辑到发布维护，协同呈现小程序与公众号的内容触点。',
    background: '高顿教育实习期间参与的实际项目与内容运营工作。',
    tools: ['小鹅通', '微信小程序', '微信公众号'],
    contributions: [
      { title: '01 小程序内容与产品运营', description: '基于小鹅通平台组织课程与栏目内容，进行内容配置、信息更新和使用流程检查，并协助整理运营反馈。' },
      { title: '02 公众号独立运营', description: '独立处理公众号选题、视觉素材整理、图文编辑排版、发布和日常维护。' },
    ],
    images: [
      { ...taskImage('task2_taxmind', 'taxmind_mini_program_home.jpg', 942, 2048, '税启智 TaxMind 小程序首页，课程与栏目内容'), caption: '01 / 小程序首页' },
      { ...taskImage('task2_taxmind', 'taxmind_mini_program_learning.jpg', 942, 2048, '税启智 TaxMind 小程序学习与课程页'), caption: '02 / 小程序学习页' },
      { ...taskImage('task2_taxmind', 'taxmind_official_account_home.jpg', 942, 2048, '税启智 TaxMind 公众号主页与内容列表'), caption: '03 / 微信公众号' },
      { ...taskImage('task2_taxmind', 'taxmind-official-and-mini-program-qr.png', 1280, 913, '税智 TaxMind 公众号与税启智 TaxMind 小程序的原始二维码展示图'), caption: '04 / 公众号与小程序二维码' },
    ],
  },
  {
    slug: 'golden-education-visuals', title: '高顿教育 · 产品宣传视觉', category: 'graphic', kind: '品牌视觉设计',
    presentation: 'editorial',
    description: '为高顿教育的 AI 财税管理师课程设计促销海报与产品宣传长图。',
    cover: { ...golden[0], crop: 'top' },
    gallery: golden,
    galleryLayout: 'campaign',
  },
  {
    slug: 'clio-lip-serum', title: 'CLIO · 晶亮护唇精华', category: 'graphic', kind: '品牌详情页设计',
    displayTitle: '电商详情页设计', subtitle: 'CLIO · 晶亮护唇精华', imageLinks: true,
    presentation: 'editorial',
    description: '移动端产品详情页，依次呈现主视觉、色号、产品卖点与挂饰用法。',
    stackIntro: {
      kind: '品牌详情页设计 / 移动端视觉',
      description: '围绕产品色号、视觉包装与产品卖点，设计移动端详情页视觉。',
    },
    cover: { ...clio[0], crop: 'portrait' },
    gallery: clio,
    galleryLayout: 'clio-five',
  },
  {
    slug: 'packaging-design', title: '提拉米苏与和藏酒礼盒', category: 'graphic', kind: '包装设计',
    displayTitle: '包装设计展示', subtitle: '提拉米苏与和藏酒礼盒',
    presentation: 'editorial',
    description: '两款包装效果图，以可可色格纹和书法山水分别呈现甜品盒与酒礼盒。',
    cover: packaging[0],
    gallery: packaging,
  },
  {
    slug: 'valorant-stickers', title: '《无畏契约》特工动态表情包', category: 'graphic', kind: 'IP 形象衍生',
    presentation: 'ip-board', imageLinks: true,
    description: '基于《无畏契约》特工形象进行系列表情包视觉延展，通过 Q 版造型与夸张的情绪表达，探索游戏角色在社交场景中的趣味化呈现。',
    character: taskImage('task1_valorant', 'valorant_character_cutout_from_reference.png', 880, 1080, '黄色衣服、绿色帽子的《无畏契约》特工完整立绘及原有小机器人'),
    cover: { ...valorant[0], crop: 'contain' },
    gallery: valorant,
    galleryLayout: 'stickers',
  },
  {
    slug: 'ancient-chinese-mathematics', title: '古算之光：周髀算经微探', englishName: 'Ancient Chinese Mathematics',
    category: 'graphic', year: '2024', kind: 'Graphic Design / Experimental Poster / Cultural Visual Design',
    caseLayout: 'poster-series', caseKind: 'Graphic Design / Competition Project',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    background: '2024 年上海市计算机应用能力大赛团队参赛作品。',
    description: '以中国古代数学典籍《周髀算经》为灵感，将传统天文数学、几何线条和文化符号融入现代实验性平面设计。',
    tagline: 'Ancient Wisdom, Experimental Visuals.',
    concept: [
      '本系列以《周髀算经》中的数学与天文知识为视觉创作基础，将「天圆地方」「日道测算」「七衡四极」「星宿周度」等传统概念转化为现代平面设计语言。',
      '在视觉表达上，运用几何线条、天文图形、传统文化符号与实验性字体排版，结合高饱和度的撞色、网点纹理和图形叠加，创造兼具历史文化内涵与现代视觉冲击力的系列海报。',
      '设计希望以更加年轻化、当代化的方式重新呈现中国古代数学文化，让抽象的科学知识转化为更具视觉感染力的艺术表达。',
    ],
    cover: zhoubi[0], gallery: zhoubi, previewImages: zhoubi.slice(0, 3), galleryLayout: 'poster-series',
  },
];

const motionImage = (name, width, height, caption, alt) => ({
  src: `projects/motion/${name}.webp`, width, height, caption, alt,
});
const motionVideo = (name, width, height, caption) => ({
  src: `projects/motion/${name}.mp4`, poster: `projects/motion/${name}-poster.webp`, width, height, caption,
});
const photograph = (name, width, height, caption, alt) => ({
  src: `photography/${name}.webp`, width, height, caption, alt,
});

export const mediaProjects = [
  {
    slug: 'cosmetics-rendering', category: 'motion', title: '美妆产品渲染', kind: '产品建模与渲染',
    presentation: 'editorial',
    description: '以面霜、唇膏和粉底为对象，呈现玻璃、金属与膏体在不同光线下的质感。',
    images: [
      motionImage('cosmetics-cream', 1280, 1280, '面霜', '半透明红色面霜罐与悬浮的黑色罐盖'),
      motionImage('cosmetics-lipstick', 1320, 1760, '唇膏', '不同色号的唇膏与带细纹的黑色管身'),
      motionImage('cosmetics-foundation', 1280, 1707, '粉底', '粉色半透明球体间的 NARS 粉底瓶'),
    ],
  },
  {
    slug: 'loft-interior', category: 'motion', title: '复式室内场景', kind: '空间建模与渲染',
    presentation: 'editorial',
    description: '用剖切视角呈现两层居住空间、家具布局和室内光影。',
    images: [
      motionImage('loft-interior', 1700, 1133, '室内全景', '复式室内剖切渲染，上层为卧室和书桌，下层为客厅、厨房和浴室'),
    ],
  },
  {
    slug: 'scene-animation', category: 'motion', title: '三维动画练习', kind: '场景动效',
    presentation: 'editorial',
    description: '三段短片分别呈现落花、山路行车和水面波动。',
    videos: [
      motionVideo('falling-blossoms', 1280, 720, '落花纷飞'),
      motionVideo('mountain-drive', 800, 600, '山路行车动画'),
      motionVideo('water-ripples', 968, 544, '水面波动'),
    ],
  },
  {
    slug: 'photo-notes', category: 'photography', title: '摄影手记', kind: '街景与建筑',
    presentation: 'editorial',
    description: '记录街头人物、建筑细节和光影在城市表面留下的变化。',
    galleryLayout: 'photos',
    images: [
      photograph('flag-and-sky', 990, 1760, '屋檐与旗帜', '云层下飘扬的红旗与建筑屋檐'),
      photograph('street-and-gate', 1700, 956, '街巷一角', '几位穿制服的人经过阳光下的街巷铁门'),
      photograph('architectural-detail', 1700, 956, '砖墙与浮雕', '红砖建筑转角处的白色浮雕与窗框'),
      photograph('bus-and-crosswalk', 1700, 957, '公交与斑马线', '蓝色公交车经过被树影覆盖的斑马线'),
      photograph('brick-facade', 1700, 956, '红砖立面', '成排的窗户、铁栏杆与红砖立面'),
    ],
  },
];
