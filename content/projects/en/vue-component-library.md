---
title: Vue Component Library
slug: vue-component-library
summary: An accessible component library built on Radix Vue primitives, with tree-shaking, SSR support, and a highly customizable theming system for Vue 3 + TypeScript projects.
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
locale: en
---

# Vue Component Library

An accessible UI component library designed for modern Vue 3 projects. Built on Radix Vue primitives, it provides out-of-the-box accessibility, comprehensive TypeScript types, and flexible theme customization.

## Design Philosophy

There are many excellent Vue component libraries. This one differentiates itself through:

- **Accessibility first** — every component is built against WAI-ARIA patterns and tested with axe-core
- **Composition over configuration** — uses Radix Vue headless primitives, giving you full control over styling
- **Tree-shaking friendly** — only ship the components you actually use

## Component Inventory

30+ components currently available, covering common UI needs:

- Forms: Input, Select, Checkbox, Radio, Switch, DatePicker
- Layout: Dialog, Sheet, Popover, Tooltip, Tabs
- Feedback: Toast, Alert, Progress, Skeleton
- Navigation: Menu, Dropdown, Breadcrumb, Pagination

## Theming System

Runtime theme switching via CSS custom properties:

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

All components consume these variables, so changing the theme only requires updating CSS properties — no recompilation needed.
