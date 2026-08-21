### 🆕 New Features
  * 新增 Cloudflare Pages 部署支持，并为网络默认配置、公告与 `Geo Manifest` 提供统一服务路径；重写模块现支持通过 `endpoint` 参数切换正式版、开发版或 Worker 服务端点。 @001ProMax
  * 重构 `Geo Manifest` 地图瓦片样式合成，按基础地图、地图、2D/3D 卫星、交通、兴趣点、四处看看、道路、地球与公共交通等类别，根据源地区及设置选取中国大陆或国际版资源。 @patrickyanxxxxx
  * 新增正式版、完整配置与开发版三套参数构建；正式版仅提供 10 项稳定设置并加入公共交通选项，开发版与 BoxJs 分别提供 18 项和 17 项完整设置。 @VirgilClyne

### 🛠️ Bug Fixes
  * 修正 `Geo Manifest` 合成时源地区、目标地区与国家代码的处理方向，补充美国地区映射，并修复资源、数据集、显示文本、URL 配置、Munin 分桶及位置偏移等内容在中国大陆版与国际版之间的选择逻辑。
  * 修正定位漂移 `AUTO` 模式：根据资源清单请求的 `os` 参数选择服务，`watchos` 使用国际版 Apple 配置，其余系统使用中国版高德配置。
  * 修正高德自动导航数据调度器的 URL 属性，并仅在 PEP 地区码存在时传递对应查询参数。
  * 修正 Pages、Workers 与 Vercel 请求适配，统一使用 HTTPS 与标准端口，并按统一服务路径还原 Apple Maps 上游域名；同时补充服务端错误响应，便于定位处理失败。 @001ProMax
  * 修正地图参数名称、默认值与运行时设置不一致的问题；公告环境默认保留原请求值，瓦片设置统一使用 `CN` 与 `XX` 两种地区版本。 @VirgilClyne
  * 修复 GitHub Actions 缺少 Puppeteer 对应 Chrome 版本时无法生成 Egern 配置的问题。 @VirgilClyne

### 🔣 Dependencies
  * 更新 `@nsnanocat/util` 至 `2.7.0`，新增 `@nsringo/mapkit` `1.1.3` 与 `@nsnanocat/xml` `0.4.4`，并以 npm 包替代原有 MapKit Proto 与 XML Git 子模块。 @001ProMax
  * 将 Hono 入口迁移至 `hono/tiny`，并补充 TypeScript `6.0.3` 开发依赖。 @001ProMax
  * 将 Egern 转换使用的 Puppeteer 固定为 `25.7.0`。 @VirgilClyne

### ‼️ Breaking Changes
  * BoxJs 设置与缓存命名空间由 `Maps` 更名为 `MapKit`；原 `@iRingo.Maps.Settings` 与 `@iRingo.Maps.Caches` 中的数据不会自动迁移。
  * 重写模块由 `iRingo.Maps.Workers.*` 更名为 `iRingo.MapKit.Rewrite.*`，原有模块订阅需要更新到新文件路径。
  * 默认重写服务端点由按 Apple 上游域名拆分的 `*.nanocat.cloud` 地址迁移至统一的 `mapkit.pages.dev`；Worker 端点改为 `mapkit.nanocat.cloud`。
  * 移除所有瓦片设置中的 `HYBRID` 模式，并将旧的 `TileSet.Roads`、`TileSet.Satellite` 参数分别更名为 `TileSet.Road`、`TileSet.Satellite2D`；已有自定义配置需要改用 `CN` 或 `XX`。

### 🔄 Other Changes
  * 统一项目、Worker 与重写模块中的 `MapKit` 命名，并拆分 Cloudflare Pages 与 Workers 的 Wrangler 配置及部署脚本。 @001ProMax
  * 新增 `Geo Manifest` 地区合成、瓦片样式选择及 Worker 路由还原测试。
  * 新增 Surge、Loon、Quantumult X 与 Stash 开发版模块模板及构建流程；开发版脚本与模块只同步到 Gist，GitHub Releases 继续仅发布正式版产物。 @VirgilClyne
