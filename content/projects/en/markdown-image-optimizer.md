---
title: Markdown Image Optimizer
slug: markdown-image-optimizer
summary: A GitHub Action that optimizes images in Markdown files — converts to WebP, generates responsive sizes, and updates references.
date: 2026-03-10
techStack:
  - TypeScript
  - Sharp
  - GitHub Actions
links:
  github: https://github.com
  npm: https://npmjs.com
image: /images/projects/img-opt.png
draft: false
published: true
locale: en
---

# Markdown Image Optimizer

Automated image optimization for your Markdown content. Drop it into any repository, and it optimizes images on every push.

## How It Works

The action scans Markdown files for image references, processes each image through Sharp (converting to WebP/AVIF, generating responsive sizes), and updates the Markdown to use `<picture>` elements with proper `srcset` attributes.

## Results

Typical savings: 60-80% reduction in image payload size.
