---
title: Modern CSS in 2026 — A Practical Guide
slug: modern-css-2026
description: Container queries, cascade layers, the :has() selector, and other modern CSS features are now stable across all major browsers. Here is how to start using them today.
date: 2026-05-01
tags:
  - CSS
  - Frontend
  - Web Development
image: /images/og-default.png
draft: false
published: true
locale: en
---

# Modern CSS in 2026 — A Practical Guide

The pace of CSS evolution over the past few years has been remarkable. Features that once required JavaScript can now be achieved with a few lines of native CSS. Here are the features you can confidently use in 2026.

## Container Queries

If the first decade of responsive design belonged to media queries, the next belongs to container queries. They let you style elements based on their **parent container's** size rather than the viewport:

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

Components are now truly self-contained — they adapt to the space they're given, regardless of where they appear in the layout.

## :has() — The Parent Selector

Commonly called the "parent selector," `:has()` goes much further. It selects elements based on their children or subsequent siblings:

```css
/* Add spacing to paragraphs that contain images */
p:has(img) {
  margin-block: 2rem;
}

/* Highlight form groups with invalid inputs */
.form-group:has(input:invalid) {
  border-left: 3px solid red;
}

/* Style sections containing code blocks in dark mode */
section:has(pre) {
  background: var(--color-surface);
}
```

## Cascade Layers

Managing CSS specificity has always been painful. Cascade layers offer a structured solution:

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

Layer precedence is determined by declaration order, not selector specificity. Component styles always override base styles; utilities always override components.

## View Transitions

Page transitions in SPAs are finally straightforward:

```css
::view-transition-old(root) {
  animation: fade-out 0.2s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}
```

Paired with `document.startViewTransition()`, you get smooth transitions during DOM updates without any animation library.

## Summary

Modern CSS is evolving from a descriptive styling language into an expressive design system. Container queries, `:has()`, cascade layers, and view transitions each deserve dedicated study — they will fundamentally change how you write CSS.
