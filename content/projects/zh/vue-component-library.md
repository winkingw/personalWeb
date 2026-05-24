---
title: Vue Component Library
slug: vue-component-library
summary: 一套基于 Radix Vue 的无障碍组件库，支持 Tree Shaking、SSR 和高度可定制的主题系统，适用于 Vue 3 + TypeScript 项目。
date: 2026-02-01
techStack:
  - Vue.js
  - TypeScript
  - Radix Vue
  - Storybook
  - Vite
links:
  github: https://github.com
  npm: https://npmjs.com
  docs: https://docs.example.com
image: /images/og-default.png
draft: false
published: true
locale: zh
---

# Vue Component Library

一套为现代 Vue 3 项目设计的无障碍 UI 组件库。基于 Radix Vue 原语构建，提供开箱即用的无障碍支持、完善的 TypeScript 类型和灵活的主题定制能力。

## 设计理念

市面上已经有很多优秀的 Vue 组件库。这个项目的独特之处在于：

- **无障碍优先** — 每个组件都基于 WAI-ARIA 规范构建，通过 axe-core 测试
- **组合优于配置** — 使用 Radix Vue 的 headless 原语，样式完全由你控制
- **Tree Shaking 友好** — 只引入你实际使用的组件，最小化打包体积

## 组件清单

目前已提供 30+ 组件，覆盖了常见 UI 需求：

- 表单：Input、Select、Checkbox、Radio、Switch、DatePicker
- 布局：Dialog、Sheet、Popover、Tooltip、Tabs
- 反馈：Toast、Alert、Progress、Skeleton
- 导航：Menu、Dropdown、Breadcrumb、Pagination

## 主题系统

使用 CSS 自定义属性实现运行时主题切换：

```css
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --radius-md: 0.375rem;
}

.dark {
  --color-primary: #60a5fa;
  --color-surface: #1e1e2e;
}
```

所有组件使用这些变量，所以改变主题只需要更新 CSS 属性，无需重新编译。
