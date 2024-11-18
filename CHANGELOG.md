### 🆕 New Features
  * 现在可以为 `⌚️ Watch` 单独设置`[URL信息集] 定位漂移`了

### 🛠️ Bug Fixes
  * 修复`苹果版`地图中整合`高德版`地图功能时的错误

### 🔣 Dependencies
  * 升级了 `@nsnanocat/util`
    * `util` 由 `submodule` 更改为 `package`
    * `$platform` 改为 `$app`

### ‼️ Breaking Changes
  * 从脚本中移除了 `@nsnanocat/url` polyfill
    * 由于 `@nsnanocat/url` 已经被移除，所以`🛰️ GeoServices`项目已完全不再支持 `ShadowRocket`
  * 从 `🗺️ Maps` 中分离了 `⌚️ Watch` 的 `🧰 BoxJs` 设置
    * 如果您曾经使用过 `🗺️ Maps` 的 `🧰 BoxJs` 设置面板，请重新进行设置方能生效
    * 如果您曾经使用过 `⌚️ Watch` 的 `🧰 BoxJs` 设置面板，请重新进行设置方能生效

### 🔄 Other Changes
  * 打包器由 `rollup` 更改为 `rspack`
