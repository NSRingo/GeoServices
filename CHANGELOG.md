### 🆕 New Features
  * 新增 Cloudflare Pages 部署支持，并为网络默认配置、公告与 `Geo Manifest` 提供统一服务路径；重写模块现支持通过 `endpoint` 参数切换正式版、开发版或 Worker 服务端点。 @001ProMax
  * 重构 `Geo Manifest` 地图瓦片样式合成，按基础地图、地图、2D/3D 卫星、交通、兴趣点、四处看看、道路、地球与公共交通等类别，根据源地区及设置选取中国大陆或国际版资源。 @patrickyanxxxxx

### 🛠️ Bug Fixes
  * 修正 `Geo Manifest` 合成时源地区、目标地区与国家代码的处理方向，补充美国地区映射，并修复资源、数据集、显示文本、URL 配置、Munin 分桶及位置偏移等内容在中国大陆版与国际版之间的选择逻辑。
  * 修正高德自动导航数据调度器的 URL 属性，并仅在 PEP 地区码存在时传递对应查询参数。
  * 修正 Pages、Workers 与 Vercel 请求适配，统一使用 HTTPS 与标准端口，并按统一服务路径还原 Apple Maps 上游域名；同时补充服务端错误响应，便于定位处理失败。 @001ProMax

### 🔣 Dependencies
  * 更新 `@nsnanocat/util` 至 `2.7.0`，新增 `@nsringo/mapkit` `1.1.3` 与 `@nsnanocat/xml` `0.4.4`，并以 npm 包替代原有 MapKit Proto 与 XML Git 子模块。 @001ProMax
  * 将 Hono 入口迁移至 `hono/tiny`，并补充 TypeScript `6.0.3` 开发依赖。 @001ProMax

### ‼️ Breaking Changes
  * 重写模块由 `iRingo.Maps.Workers.*` 更名为 `iRingo.MapKit.Rewrite.*`，原有模块订阅需要更新到新文件路径。
  * 默认重写服务端点由按 Apple 上游域名拆分的 `*.nanocat.cloud` 地址迁移至统一的 `mapkit.pages.dev`；Worker 端点改为 `mapkit.nanocat.cloud`。

### 🔄 Other Changes
  * 统一项目、Worker 与重写模块中的 `MapKit` 命名，并拆分 Cloudflare Pages 与 Workers 的 Wrangler 配置及部署脚本。 @001ProMax
  * 新增 `Geo Manifest` 地区合成、瓦片样式选择及 Worker 路由还原测试。
