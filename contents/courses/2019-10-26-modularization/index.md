---
title: 模块化开发
slug: modularization
date: 2019-10-26 15:29:00
cover: cover.png
description: 当下最重要的前端开发范式
categories:
  - 指南
tags:
  - 工程化
  - ES Modules
  - Webpack
sections:
  - title: 模块化概述
    duration: 105
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/5f77ce185285890797593307273/v.f240.m3u8
  - title: 模块化演变过程
    duration: 281
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/764603565285890797590217166/v.f240.m3u8
  - title: 模块化规范的出现
    duration: 420
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/5dc61ec25285890797593298625/v.f240.m3u8
  - title: 模块化标准规范
    duration: 190
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/3fd8703e5285890797460388088/v.f240.m3u8
  - title: ES Module 特性
    duration: 478
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/5dc6919d5285890797593299025/v.f240.m3u8
  - title: ES Module 导出
    duration: 371
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/0c21087e5285890797592097715/v.f240.m3u8
  - title: ES Module 导入导出的注意事项
    duration: 563
    source: https://1251429982.vod2.myqcloud.com/d9cd5ad5vodtranscq1251429982/0dd3e1195285890797592108726/v.f240.m3u8
---

模块化可以说是当下最重要的前端开发范式之一。随着前端应用的日益复杂，我们的项目代码已经逐渐膨胀到了不得不花大量时间去管理的程度了。而模块化就是一种最主流的代码组织方式，它通过把复杂的代码按照功能的不同划分为不同的模块单独维护，从而提高开发效率、降低维护成本。

但是单就「模块化」这个词而言，它仅仅是一个思想或者说是一个理论，并不包含具体的实现。

本课程中我们就一起学习如何在前端项目中去实践模块化思想，以及目前行业中主流的一些方式和工具。

其中 Webpack 算是目前的佼佼者，也是市面上的主流。这两年 Webpack 的使用率直线上升，Vue.js、React、Angular 一类框架的脚手架工具都开始使用 Webpack 来做底层代码的构建。

这里我们会从：

1. 模块化演变过程
2. 前端模块化的一些规范和标准
3. 常用的模块化打包工具
4. 使用技巧

希望大家能够通过以上这几个维度去深入了解模块化以及 Webpack 的具体实践和应用。

## 适用人群

有一些简单前端开发经验，希望深入学习模块化开发及 Webpack 打包工具的同学

**知识储备**：

- 熟练使用 HTML、CSS
- 掌握 JavaScript 语言基础
- 了解 Vue.js 之类的框架更佳

## 学习目标

- 了解模块化思想
- 认识模块化在前端行业中的演变过程
- 掌握 ES Modules 标准以及不同环境的支持情况
- 掌握 Webpack 打包工具的使用
- 理解 Webpack 工作过程的内部原理
- 了解 Rollup、Parcel 工具

## 课程内容

1. 模块化概述
2. 模块化演变过程
3. 模块化规范的出现
4. 模块化标准规范
5. ES Module 特性
6. ES Module 导出
7. ES Module 导入导出的注意事项
8. ES Module 导入用法
9. ES Module 导出导入成员
10. ES Module 浏览器环境 Polyfill
11. ES Module in Node.js - 支持情况
12. ES Module in Node.js - 与 CommonJS 交互
13. ES Module in Node.js - 与 CommonJS 的差异
14. ES Module in Node.js - 新版本进一步支持
15. ES Module in Node.js - Babel 兼容方案
16. 模块打包工具 - 由来
17. 模块打包工具 - 概要
18. Webpack 快速上手
19. Webpack 配置文件
20. Webpack 工作模式
21. Webpack 打包结果运行原理
22. Webpack 资源模块加载
23. Webpack 导入资源模块
24. Webpack 文件资源加载器
25. Webpack URL 加载器
26. Webpack 常用加载器分类
27. Webpack 与 ES2015
28. Webpack 加载资源的方式
29. Webpack 核心工作原理
30. Webpack 开发一个 Loader
31. Webpack 插件机制介绍
32. Webpack 自动清理输出目录插件
33. Webpack 自动生成 HTML 插件（上）
34. Webpack 自动生成 HTML 插件（中）
35. Webpack 自动生成 HTML 插件（下）
36. Webpack 插件使用总结
37. Webpack 开发一个插件
38. Webpack 开发体验问题
39. Webpack 自动编译
40. Webpack 自动刷新浏览器
41. Webpack Dev Server
42. Webpack Dev Server 静态资源访问
43. Webpack Dev Server 代理 API
44. Source Map 介绍
45. Webpack 配置 Source Map
46. Webpack eval 模式的 Source Map
47. Webpack devtool 模式对比（上）
48. Webpack devtool 模式对比（下）
49. Webpack 选择 Source Map 模式
50. Webpack 自动刷新的问题
51. Webpack HMR 体验
52. Webpack 开启 HMR
53. Webpack HMR 的疑问
54. Webpack 使用 HMR API
55. Webpack 处理 JS 模块热替换
56. Webpack 处理图片模块热替换
57. Webpack HMR 注意事项
58. Webpack 生产环境优化
59. Webpack 不同环境下的配置
60. Webpack 不同环境的配置文件
61. Webpack DefinePlugin
62. Webpack 体验 Tree Shaking
63. Webpack 使用 Tree Shaking
64. Webpack 合并模块
65. Webpack Tree Shaking 与 Babel
66. Webpack sideEffects
67. Webpack sideEffects 注意
68. Webpack 代码分割
69. Webpack 多入口打包
70. Webpack 提取公共模块
71. Webpack 动态导入
72. Webpack 魔法注释
73. Webpack MiniCssExtractPlugin
74. Webpack OptimizeCssAssetsWebpackPlugin
75. Webpack 输出文件名 Hash
76. Rollup 概述
77. Rollup 快速上手
78. Rollup 配置文件
79. Rollup 使用插件
80. Rollup 加载 NPM 模块
81. Rollup 加载 CommonJS 模块
82. Rollup 代码拆分
83. Rollup 多入口打包
84. Rollup 选用原则
85. Parcel
