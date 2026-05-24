---
title: 2026 年现代 CSS 技术指南
slug: modern-css-2026
description: 容器查询、级联层、:has() 选择器等现代 CSS 特性已经在主流浏览器中稳定可用，本文将带你快速上手这些改变游戏规则的新能力。
date: 2026-05-01
tags:
  - CSS
  - Frontend
  - Web Development
image: /images/og-default.png
draft: false
published: true
locale: zh
---

# 2026 年现代 CSS 技术指南

过去几年，CSS 的进化速度令人惊叹。许多曾经需要 JavaScript 才能实现的功能，现在用几行原生 CSS 就能搞定。本文整理了几个在 2026 年已经可以放心使用的重要特性。

## 容器查询（Container Queries）

如果说响应式设计的第一个十年属于媒体查询，那么下一个十年属于容器查询。它们让我们可以基于**父容器**的尺寸而不是视口尺寸来调整样式：

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

组件现在真正做到了"自带响应式"——无论在哪个页面、哪个布局中使用，它都能根据自己拥有的空间来适应。

## :has() — 父选择器终于来了

`:has()` 被称为"父选择器"，但它的能力远不止于此。它可以基于子元素或后续兄弟元素的状态来选择父级：

```css
/* 包含图片的段落增加间距 */
p:has(img) {
  margin-block: 2rem;
}

/* 有无效输入的表单组 */
.form-group:has(input:invalid) {
  border-left: 3px solid red;
}

/* 暗色模式下包含代码块的区域 */
section:has(pre) {
  background: var(--color-surface);
}
```

## 级联层（Cascade Layers）

管理 CSS 优先级一直是个痛点。级联层提供了一个结构化的方案：

```css
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@layer components {
  .button { /* ... */ }
}

@layer utilities {
  .text-center { text-align: center; }
}
```

层的优先级由声明顺序决定，与选择器特异性无关。组件层的样式永远覆盖基础层，工具类永远覆盖组件层。

## 视图过渡（View Transitions）

单页应用中的页面过渡终于变得简单了：

```css
::view-transition-old(root) {
  animation: fade-out 0.2s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}
```

配合 `document.startViewTransition()`，你可以在 DOM 更新时获得丝滑的过渡效果，而无需引入任何动画库。

## 总结

现代 CSS 正在从一个"描述性的样式语言"变成一个"表达性的设计系统"。容器查询、:has()、级联层和视图过渡这四个特性，每一个都值得花时间去学习——它们会从根本上改变你写 CSS 的方式。
