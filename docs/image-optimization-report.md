# 图片加载优化报告

基线：`26b9363badd1806b83e45ba626989ca9097513b1`。备份分支：`backup/before-image-optimization-20261110`。

## 范围与结果

- 检查全部 81 张图片：19 PNG、11 JPG、36 WebP、15 SVG，原始总量 32.54 MB。
- 66 个栅格图片配置了现代格式或响应式尺寸；透明图片的原生尺寸 Alpha 通道逐像素保留。
- 所有 81 张原图的 SHA256 不变。原文件、原资源地址、高清放大入口继续有效。
- 设备图和界面使用高质量 WebP；二维码、表情图和角色抠图使用无损 WebP；高频纹理海报使用 4:4:4 AVIF，并提供旧浏览器的响应式 JPEG 回退。
- 通过 `<picture>` / `srcset` / `sizes` 按实际显示尺寸选择资源，不需要运行时图片代理。
- 首屏工牌和案例页主图优先加载；其余图继续 Lazy Loading。动效封面在接近视口时加载；鼠标轨迹预热降为低优先级。
- CSS 仅补充 picture 的布局兼容规则，原页面内容、网格、字体、背景、动效参数不变。
- 未更改域名、DNS、Vercel 项目或托管配置；未引入第三方图片域名、字体服务或依赖。

## 浏览器实际图片传输量

使用 Chromium，本地静态服务器，关闭浏览器缓存。桌面 1440×1000 / DPR1；手机 390×844 / DPR2。完整页面数据包含动效封面。

| 场景 | 优化前 | 优化后 | 减少 |
|---|---:|---:|---:|
| 桌面首屏 | 575.6 KB | 71.6 KB | 87.6% |
| 桌面完整首页 | 20.76 MB | 4.89 MB | 76.4% |
| 手机首屏 | 563.9 KB | 99.9 KB | 82.3% |
| 手机完整首页 | 20.76 MB | 7.83 MB | 62.3% |
| NITEOFF 案例 | 1.24 MB | 218.8 KB | 82.3% |
| Campus+ 案例 | 4.64 MB | 688.0 KB | 85.2% |
| 古算之光案例 | 9.42 MB | 2.18 MB | 76.8% |

这些是传输字节对比，不是中国大陆真实测速秒数。本次没有中国大陆测速节点，不能据此承诺固定的打开时间；实际速度仍取决于访问线路和现有 CDN 缓存。

## 请求与兼容性检查

- 首屏避免了提前下载三段动效封面。现代浏览器未同时请求图片的 PNG/JPG 后备图和 WebP/AVIF。
- 完整首页 58 个图片请求，URL 无重复；仅一张主图设置高优先级，没有全站图片 preload。
- 网站运行时没有第三方图片请求。Figma 和 RoomieBoard 是点击后访问的外部链接，SVG 内的 w3.org 字符串只是命名空间。
- 不支持 AVIF 时，海报自动使用较小 JPEG；已模拟验证，不会出现破图。
- 8 个页面、766 条本地路径检查通过，无 404；原图仍然全部存在。
- 1440/768/390 像素页面布局对比通过，无横向溢出；图片比例最大差异约 1.2 像素。
- 工牌拖拽、作品筛选、高清大图前后切换与 ESC、视频播放、减少动态效果模式正常，无新增控制台错误。

## 所有原始图片对比

下表是原生尺寸的编码体积；浏览页面时通常实际下载更小的响应式版本，见上方真实传输统计。保留原图会增加仓库存储，但不会让现代浏览器同时下载两套图片。

| 原始资源 | 原大小 | 优化后原生尺寸 | 减少 | 输出 |
|---|---:|---:|---:|---|
| `projects/portfolio/campus-project-board.jpg` | 4.64 MB | 1.42 MB | 69.5% | image/webp |
| `projects/portfolio/zhoubi-liangzhu-yucong.jpg` | 2.47 MB | 2.20 MB | 10.8% | image/avif |
| `projects/portfolio/zhoubi-yingxian-pagoda.jpg` | 2.00 MB | 1.65 MB | 17.7% | image/avif |
| `projects/portfolio/zhoubi-ridao-cesuan.jpg` | 1.97 MB | 1.62 MB | 18.0% | image/avif |
| `projects/portfolio/zhoubi-xingsu-zhoudu.jpg` | 1.83 MB | 1.50 MB | 17.7% | image/avif |
| `projects/task3_clio/clio_phone_02.png` | 1.42 MB | 200.3 KB | 85.9% | image/webp |
| `projects/task3_clio/clio_phone_03.png` | 1.26 MB | 230.2 KB | 81.8% | image/webp |
| `projects/portfolio/niteoff-devices-transparent.png` | 1.24 MB | 218.4 KB | 82.3% | image/webp |
| `projects/portfolio/campus-plus-phones-transparent.png` | 1.17 MB | 225.7 KB | 80.8% | image/webp |
| `projects/task3_clio/clio_phone_01.png` | 1.17 MB | 161.2 KB | 86.2% | image/webp |
| `projects/portfolio/zhoubi-qiheng-siji.jpg` | 1.15 MB | 888.1 KB | 22.8% | image/avif |
| `projects/task3_clio/clio_phone_05.png` | 1.03 MB | 131.8 KB | 87.2% | image/webp |
| `projects/task3_clio/clio_phone_04.png` | 983.9 KB | 128.7 KB | 86.9% | image/webp |
| `projects/roomieboard/roomieboard-overview.png` | 770.8 KB | 237.8 KB | 69.2% | image/webp |
| `projects/campus-board-1.webp` | 645.7 KB | 645.7 KB | 0.0% | image/webp |
| `projects/campus-board-2.webp` | 526.4 KB | 526.4 KB | 0.0% | image/webp |
| `projects/task2_taxmind/taxmind-official-and-mini-program-qr.png` | 504.2 KB | 273.3 KB | 45.8% | image/webp |
| `projects/campus-board-3.webp` | 491.4 KB | 491.4 KB | 0.0% | image/webp |
| `projects/task1_valorant/valorant_character_cutout_from_reference.png` | 428.1 KB | 267.9 KB | 37.4% | image/webp |
| `projects/graphic/clio-02.webp` | 392.0 KB | 392.0 KB | 0.0% | image/webp |
| `projects/task2_taxmind/taxmind_official_account_post.jpg` | 342.5 KB | 294.8 KB | 13.9% | image/webp |
| `photography/architectural-detail.webp` | 302.8 KB | 302.8 KB | 0.0% | image/webp |
| `projects/motion/falling-blossoms-poster.webp` | 271.1 KB | 271.1 KB | 0.0% | image/webp |
| `projects/task2_taxmind/taxmind_mini_program_home.jpg` | 270.2 KB | 171.9 KB | 36.4% | image/webp |
| `projects/campus-cover.webp` | 258.8 KB | 258.8 KB | 0.0% | image/webp |
| `projects/task2_taxmind/taxmind_official_account_home.jpg` | 237.4 KB | 188.1 KB | 20.8% | image/webp |
| `photography/bus-and-crosswalk.webp` | 236.8 KB | 236.8 KB | 0.0% | image/webp |
| `projects/graphic/golden-03.webp` | 221.5 KB | 221.5 KB | 0.0% | image/webp |
| `projects/graphic/clio-01.webp` | 220.7 KB | 220.7 KB | 0.0% | image/webp |
| `projects/graphic/golden-02.webp` | 214.6 KB | 214.6 KB | 0.0% | image/webp |
| `photography/brick-facade.webp` | 205.7 KB | 205.7 KB | 0.0% | image/webp |
| `projects/graphic/golden-01.webp` | 204.4 KB | 204.4 KB | 0.0% | image/webp |
| `projects/graphic/packaging-02.webp` | 191.0 KB | 191.0 KB | 0.0% | image/webp |
| `photography/street-and-gate.webp` | 189.3 KB | 189.3 KB | 0.0% | image/webp |
| `projects/task2_taxmind/taxmind_mini_program_learning.jpg` | 186.4 KB | 148.0 KB | 20.6% | image/webp |
| `projects/task1_valorant/stickers/05_blue_hair.png` | 183.0 KB | 108.6 KB | 40.7% | image/webp |
| `photography/flag-and-sky.webp` | 171.9 KB | 171.9 KB | 0.0% | image/webp |
| `projects/task1_valorant/stickers/01_rose.png` | 170.0 KB | 100.1 KB | 41.1% | image/webp |
| `projects/portfolio/smart-campus-cover.jpg` | 166.4 KB | 161.3 KB | 3.1% | image/webp |
| `projects/task1_valorant/stickers/03_green_hat.png` | 165.0 KB | 95.5 KB | 42.1% | image/webp |
| `projects/task1_valorant/stickers/04_surprised.png` | 164.6 KB | 97.4 KB | 40.8% | image/webp |
| `projects/task1_valorant/stickers/02_joy.png` | 162.7 KB | 94.6 KB | 41.8% | image/webp |
| `projects/task1_valorant/stickers/07_yellow.png` | 153.7 KB | 89.0 KB | 42.1% | image/webp |
| `projects/task1_valorant/stickers/08_confused.png` | 149.8 KB | 87.8 KB | 41.4% | image/webp |
| `projects/task1_valorant/stickers/06_crying.png` | 136.5 KB | 80.5 KB | 41.0% | image/webp |
| `signal.webp` | 119.8 KB | 119.8 KB | 0.0% | image/webp |
| `projects/motion/water-ripples-poster.webp` | 117.2 KB | 117.2 KB | 0.0% | image/webp |
| `projects/motion/cosmetics-lipstick.webp` | 116.4 KB | 116.4 KB | 0.0% | image/webp |
| `projects/graphic/packaging-01.webp` | 105.1 KB | 105.1 KB | 0.0% | image/webp |
| `projects/motion/loft-interior.webp` | 96.2 KB | 96.2 KB | 0.0% | image/webp |
| `iris-badge.webp` | 91.9 KB | 91.9 KB | 0.0% | image/webp |
| `projects/niteoff-cover.webp` | 90.6 KB | 90.6 KB | 0.0% | image/webp |
| `afterimage.webp` | 70.9 KB | 70.9 KB | 0.0% | image/webp |
| `projects/motion/cosmetics-cream.webp` | 66.4 KB | 66.4 KB | 0.0% | image/webp |
| `projects/motion/cosmetics-foundation.webp` | 64.0 KB | 64.0 KB | 0.0% | image/webp |
| `projects/roomieboard/roomieboard-collaboration.png` | 63.4 KB | 34.4 KB | 45.7% | image/webp |
| `fieldnotes-zh.svg` | 57.9 KB | 57.9 KB | 0.0% | svg |
| `projects/motion/mountain-drive-poster.webp` | 51.5 KB | 51.5 KB | 0.0% | image/webp |
| `projects/graphic/valorant-03.webp` | 36.8 KB | 36.8 KB | 0.0% | image/webp |
| `projects/graphic/valorant-04.webp` | 27.8 KB | 27.8 KB | 0.0% | image/webp |
| `matter.webp` | 23.4 KB | 23.4 KB | 0.0% | image/webp |
| `projects/graphic/valorant-02.webp` | 17.2 KB | 17.2 KB | 0.0% | image/webp |
| `toolkit/axure-rp.webp` | 12.3 KB | 12.3 KB | 0.0% | image/webp |
| `projects/graphic/valorant-01.webp` | 10.1 KB | 10.1 KB | 0.0% | image/webp |
| `common-zh.svg` | 9.2 KB | 9.2 KB | 0.0% | svg |
| `toolkit/procreate.webp` | 7.0 KB | 7.0 KB | 0.0% | image/webp |
| `toolkit/goview.webp` | 4.7 KB | 4.7 KB | 0.0% | image/webp |
| `toolkit/photoshop.svg` | 2.9 KB | 2.9 KB | 0.0% | svg |
| `toolkit/cinema-4d.svg` | 2.7 KB | 2.7 KB | 0.0% | svg |
| `toolkit/after-effects.svg` | 2.5 KB | 2.5 KB | 0.0% | svg |
| `profile-graphic.svg` | 2.4 KB | 2.4 KB | 0.0% | svg |
| `toolkit/animate.svg` | 2.1 KB | 2.1 KB | 0.0% | svg |
| `toolkit/premiere-pro.svg` | 2.0 KB | 2.0 KB | 0.0% | svg |
| `toolkit/3ds-max.svg` | 2.0 KB | 2.0 KB | 0.0% | svg |
| `toolkit/illustrator.svg` | 1.7 KB | 1.7 KB | 0.0% | svg |
| `form-zh.svg` | 1.6 KB | 1.6 KB | 0.0% | svg |
| `toolkit/maya.svg` | 1.5 KB | 1.5 KB | 0.0% | svg |
| `toolkit/unity.svg` | 0.9 KB | 0.9 KB | 0.0% | svg |
| `toolkit/figma.svg` | 0.8 KB | 0.8 KB | 0.0% | svg |
| `toolkit/hbuilderx.webp` | 0.6 KB | 0.6 KB | 0.0% | image/webp |
| `mark.svg` | 0.4 KB | 0.4 KB | 0.0% | svg |

## 构建与后续维护

- `node build.mjs`：生成现有 `dist/index.html` 和案例页。只需 Node.js，无新增运行依赖。
- `node scripts/check-image-assets.mjs`：核对 manifest、原图、派生图、优先级和页面路径。
- `python scripts/optimize-images.py`：手动为新增图片生成派生资源，需要支持 WebP/AVIF 的 Pillow；生成文件已提交，Vercel 无需安装 Python 或在线转换。
- 新增图片后运行图片脚本，再运行构建并提交。派生资源清单在 `dist/assets/image-manifest.json`。
- 旧资源不删除、不重命名；原始高清链接保持不变。
