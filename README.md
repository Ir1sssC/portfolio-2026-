# 陈瑜萱的设计作品集

作品集包含一个首页和独立案例页。预览使用 HTML、CSS 和浏览器原生 JavaScript 模块。工牌由指针捕获、阻尼弹簧和 SVG 挂绳驱动。

## 本地预览

解压后在本目录运行 `python -m http.server 4173 --bind 127.0.0.1 --directory dist`，然后打开 [本地预览](http://127.0.0.1:4173/)。预览所需的图片和代码都在压缩包内。Windows 可以双击 `preview.cmd` 启动预览。需要 Python 3。

## 替换内容

图片加载已使用本地 WebP / AVIF、响应式尺寸与延迟加载，所有原图及原地址仍保留。详见[完整体积对比和检查结果](docs/image-optimization-report.md)。

- 常规构建：`node build.mjs`。
- 检查图片与页面路径：`node scripts/check-image-assets.mjs`。
- 添加新素材后，可使用支持 WebP / AVIF 的 Pillow 运行 `python scripts/optimize-images.py`，再执行构建。派生图片已提交，Vercel 不需要安装 Pillow 或调用图片服务。

- 在 `dist/js/content.mjs` 修改姓名、介绍、联系信息、履历、常见问题以及图片轨迹配置。
- 将简历 PDF 放到 `dist/assets/`，在 `profile.resumeUrl` 填写相对于 `dist/` 的路径。构建时确认文件存在后，联系区才会显示下载入口。
- 在 `dist/js/works-data.mjs` 管理作品、分类、媒体和原型。将项目截图和封面放到 `dist/assets/`。图片可填写 `{ src, alt, width, height, caption }`，其中 `src` 相对于 `dist/assets/`。
- 修改文字、项目数量或模板后，在本目录运行 `node build.mjs` 刷新静态页面。需要 Node.js。
- 颜色、字号、间距和圆角位于 `dist/style.css` 顶部。工牌弹簧和图片轨迹参数分别位于 `dist/js/badge.mjs` 和 `dist/js/trail.mjs`。

## 作品媒体与 Figma 原型

- `cover` 管理首页封面。NITEOFF 与 Campus+ 使用 `deviceCover: true` 显示透明设备图。素材位于 `dist/assets/projects/portfolio/`。
- 两个 UI 案例使用 `caseLayout: 'compact-product'`，`overview` 管理项目概览段落，`showcase` 管理核心展示。NITEOFF 展示封面三设备组合图，Campus+ 的 `showcase.image` 使用原始高清蓝色展板，与首页透明手机图分别管理。
- `prototypeUrl` 填写实际的 `https://www.figma.com/proto/…` 分享链接，显示在项目卡片和案例页头部。没有链接时不生成入口。
- 数字孪生项目使用 `presentation: 'video'`，`video.src` 指向本地演示视频。点击后按需加载，支持静音播放、原生播放控制、关闭按钮和 ESC 关闭。
- RoomieBoard 使用 `presentation: 'live-prototype'`，在当前页面展示独立项目介绍与真实界面截图；`prototypeUrl` 管理新标签页体验入口。截图位于 `dist/assets/projects/roomieboard/`，来自已部署产品网页，使用现有大图组件查看。
- 海报系列使用 `caseLayout: 'poster-series'`，`concept` 管理设计理念，`gallery` 管理完整海报，`previewImages` 管理首页预览。详情页支持大图切换及缩放。周髀算经系列使用五张原始海报，没有视频。
- 三维和摄影系列在 `dist/js/works-data.mjs` 的 `mediaProjects` 中配置。数组顺序决定展示顺序。每项使用唯一的 `slug`，可填写 `category`、`title`、`kind`、`description`，以及有实际资料时的 `tools`、`location` 和 `year`。
- 三维媒体放在 `dist/assets/projects/motion/`，照片放在 `dist/assets/photography/`。在 `images` 中按顺序填写 `{ src, alt, width, height, caption }`。在 `videos` 中填写 `{ src, poster, width, height, caption }`，有字幕时可加 `captions`。路径相对于 `dist/assets/`。摄影系列用 `galleryLayout: 'photos'` 保留不同画幅。
- 填写或修改作品数据后运行 `node build.mjs`。

## 设计工具图标

将 SVG 或清晰的透明图标放到 `dist/assets/toolkit/`，在 `dist/js/toolkit-data.mjs` 加一条 `{ name, category, icon, order }`，然后运行 `node build.mjs`。`icon` 填文件名，`order` 从小到大排列。未设置 `icon` 的工具会显示名称。

- Figma 与 Unity 的品牌图形来自 Wikimedia Commons 和 Devicon。 [Figma](https://commons.wikimedia.org/wiki/File:Figma-logo.svg) · [Unity](https://github.com/devicons/devicon/blob/master/icons/unity/unity-original.svg)
- 五个 Adobe 应用图标来自 Adobe 产品资源。 [Photoshop](https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/ps_appicon.svg) · [Illustrator](https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/ai_appicon.svg) · [Animate](https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/an_appicon.svg) · [After Effects](https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/ae_appicon.svg) · [Premiere Pro](https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/pr_appicon.svg)
- Axure RP、HBuilderX、GoView 和 Procreate 使用各自的产品图标。 [Axure RP](https://www.axure.com/images/2026/01/Axure_RP_icon.png) · [HBuilderX](https://hx.dcloud.net.cn/static/favicon/favicon.png) · [GoView](https://github.com/dromara/go-view/blob/master/src/assets/logo.png) · [Procreate](https://apps.apple.com/au/app/procreate/id425073498)
- Cinema 4D、3ds Max 和 Maya 使用 Maxon 与 Autodesk 的品牌资源。 [Cinema 4D](https://www.maxon.net/en/about-maxon/branding) · [3ds Max](https://www.autodesk.com/products/3ds-max/overview) · [Maya](https://www.autodesk.com/products/maya/overview)
