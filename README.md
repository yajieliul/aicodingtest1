# 贪吃蛇 · Snake (Web)

一个使用 Vite + 原生 JavaScript + Canvas 2D 实现的休闲贪吃蛇小游戏，纯前端、无后端依赖。

## 功能

- 🎮 键盘（方向键 / WASD）与触控方向键双操控
- 🏆 实时计分与速度档位显示
- ⏸️ 空格 / Enter / P 暂停与继续
- 🔄 撞墙或撞自身结束，可一键重开
- 📱 移动端触控适配（方向键布局 + 响应式画布）

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器
npm run test       # 运行单元测试
npm run build      # 生产构建（输出到 dist/）
npm run preview    # 预览生产构建
```

## 项目结构

```
├── index.html            # 页面骨架（画布 + HUD + 方向键）
├── vite.config.js        # 构建 / 开发配置
├── styles/
│   └── main.css          # 页面布局与主题样式
├── src/
│   ├── main.js           # 应用入口：组装游戏、输入、UI
│   ├── config.js         # 配置常量（网格、速度、方向、状态）
│   ├── game.js           # 游戏进程：组合逻辑与渲染、驱动循环
│   ├── input.js          # 键盘 / 触控输入映射
│   ├── renderer.js       # Canvas 绘制（仅展示，无逻辑）
│   └── logic/
│       └── snake.js      # 纯逻辑：移动 / 碰撞 / 进食 / 重置
└── tests/
    └── snake.test.js     # 纯逻辑单元测试（Vitest）
```

## 架构说明

核心游戏逻辑位于 `src/logic/snake.js`，全部为**纯函数**，不依赖 DOM，可被单元测试直接验证。页面模块（`game.js`、`renderer.js`、`input.js`）负责将状态渲染到画布、绑定输入并驱动循环，实现「状态 → 渲染」的单向数据流。

## 技术栈

- [Vite](https://vitejs.dev/) — 构建与开发服务器
- 原生 JavaScript (ES Modules)
- Canvas 2D — 游戏画面渲染
- [Vitest](https://vitest.dev/) — 单元测试

## License

MIT
