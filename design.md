# Design Direction

This file is the source of truth for future frontend design changes. When creating or modifying UI, follow this direction unless a later explicit instruction overrides it.

## Core Mood

The site should feel minimal at rest and expressive on interaction.

- Default state: quiet, black-led, spacious, editorial, almost gallery-like.
- Interaction state: kinetic, tactile, image-driven, with strong color fields and smooth motion.
- The experience should feel designed and intentional, not like a standard SaaS dashboard or card grid.
- Prefer restraint first. Add visual energy only when the user hovers, focuses, opens a panel, or interacts with a featured item.

## Visual References

The preferred reference style has these traits:

- Full black or near-black base background.
- Large white or near-white typography, often oversized and tightly composed.
- Rounded pill navigation buttons in the top corners with soft depth and layered highlights.
- Text that breaks apart, scatters, drifts, rotates, or separates into characters on hover.
- Project/image hover changes the whole background toward the hovered image's dominant color.
- Images appear as large floating planes layered over oversized background typography.
- Open panels, drawers, information cards, and popovers animate smoothly with soft easing.
- The interface is simple when idle, but feels alive under the cursor.

Do not copy the reference site's name, exact content, images, or layout verbatim. Use the interaction language and mood as inspiration.

## Secondary Reference: Soft Glass Product Mode

Another preferred direction is a white, foggy, product-like landing experience:

- A single dominant subject appears immediately on entry: a portrait, avatar, object, or sculptural product-like figure.
- The subject can be centered, oversized, softly blurred at the edges, and partly washed into the background.
- The page can use a very light gray or white atmosphere instead of black when the subject/image needs air.
- A floating glass navigation sits above the content, usually centered near the top.
- Glass UI should feel soft and translucent: blur, low-contrast borders, subtle shadows, and milky surfaces.
- Minimal link chips and small arrow buttons are preferred over heavy CTA blocks.
- Typography should feel refined and quiet: thin-to-regular sans-serif, clean spacing, and restrained line height.
- Below the hero, content can shift into a darker editorial section with table-like rows, numbered labels, thin dividers, and large statements.

This mode is useful for:

- A high-end home hero.
- About/profile introductions with a strong central avatar or portrait.
- Product/project feature pages.
- Structured mission/values/experience sections.

Do not use a generic stock portrait. If a person/figure is needed, use a provided real portrait, a carefully generated/commissioned visual, or an abstract product-like silhouette that fits the site identity.

## Palette

### Default

- Base background: near black, `#000000` to `#050505`.
- Primary text: warm white, `#f5f3ed` or equivalent.
- Muted text on black: `rgba(255, 255, 255, 0.55)`.
- Low-emphasis large background text: `rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.12)`.
- Default pill surface: `rgba(255, 255, 255, 0.10)` with subtle inset highlight.

### Interaction Color

Project and image-heavy sections should support a dynamic "dominant color" mode:

- Default background remains black.
- On hover/focus of a project image, transition the page or section background to that project's dominant color.
- Text color should switch to black or white based on contrast.
- Dominant colors should feel bold and specific: deep green, acid yellow, saturated orange-red, electric cyan, or similar.
- Avoid generic gradients. Use solid fields, subtle radial light, or image-derived color washes.

### Light Glass Mode

- Base background: soft white to light gray, `#f6f6f4` to `#ffffff`.
- Text: charcoal black, `#111111` to `#2a2a2a`.
- Muted text: `rgba(0, 0, 0, 0.42)`.
- Accent: clean electric blue, `#0577ff` to `#1683ff`.
- Glass surface: `rgba(245, 245, 245, 0.72)` with `backdrop-filter: blur(18px)`.
- Glass border: `rgba(255, 255, 255, 0.55)` on light backgrounds, `rgba(255, 255, 255, 0.12)` on dark backgrounds.
- Dark content band: `#171719` to `#1c1c1f` with muted gray text and blue accents.

Use light glass mode sparingly. It should feel like a deliberate scene, not a generic frosted-card layout.

## Typography

- Typography should be the primary visual material.
- Use large, clean sans-serif display text for hero and feature moments.
- Letter spacing should stay neutral or slightly open; avoid decorative fonts.
- Oversized background text can sit behind images and cards.
- Use strong scale contrast: huge hero words, compact nav/footer labels.
- Chinese and English layouts must both feel intentional. Do not let English-only spacing assumptions break Chinese text.
- For the soft glass mode, use thinner weights and wider breathing room. The typography should feel precise, calm, and futuristic without becoming sterile.
- For table-like sections, pair small numbered labels with large clean statements. Keep dividers thin and low contrast.

## Kinetic Text

Interactive text is a key signature.

Use for:

- Hero contact links.
- Large phone/email/social labels.
- Featured navigation words.
- Important project labels.

Behavior:

- At rest, text is readable and aligned.
- On hover/focus, characters may separate, rotate slightly, drift along a curve, or scatter outward.
- The original word should remain inferable; do not make navigation unusable.
- Keep the motion quick and smooth: approximately 350-700ms.
- Use staggered character delays for premium feel.
- Return to the original layout smoothly on pointer leave.

Accessibility:

- Respect `prefers-reduced-motion: reduce`.
- Keyboard focus must trigger an equivalent but calmer effect.
- Do not rely on motion alone to communicate state.

## Hero Subject

Some pages may open with a single dominant visual subject.

Preferred behavior:

- Subject appears before secondary content and becomes the first visual anchor.
- It can be centered, oversized, or slightly lower than center.
- Edges may dissolve into blur or atmospheric fade.
- UI floats above it rather than boxing it in.
- Supporting text can sit low-left or beneath the subject, compact and understated.
- If the subject is a portrait/avatar, the mood should be elegant and calm, not corporate.

Implementation:

- Use stable dimensions and `object-fit: cover` or `contain`.
- Avoid CLS by declaring width, height, or aspect ratio.
- Provide a meaningful alt text unless the image is purely decorative.
- Prefer one strong subject over multiple decorative images.

## Image Interaction

Project imagery should drive the environment.

- Images can overlap large background typography.
- Hovering a project image should raise it above surrounding content with a subtle scale or lift.
- The section/page background should transition to the image's dominant color.
- Labels near images should remain readable after background color changes.
- Images should have stable width, height, and aspect ratio to prevent layout shift.
- Use large image planes rather than small thumbnail cards for featured work.

Implementation preference:

- Add a `dominantColor` or `accentColor` field to project data when useful.
- Use CSS variables such as `--active-accent`, `--active-foreground`, and `--active-muted`.
- Avoid extracting colors at runtime unless there is a strong reason.

## Image-Over-Text Cards

For portfolio, archive, and content previews, an elevated pattern is:

- Image on top, text below.
- The image should be the emotional hook; text should be concise and editorial.
- Captions and metadata should be small, minimal, and aligned.
- Use quiet arrows or simple text links for navigation.
- Avoid heavy card chrome. Let image, spacing, and typography create hierarchy.
- On hover, lift the image slightly, reveal a stronger accent color, or soften the surrounding background.
- Keep image ratios consistent across a list to maintain rhythm.

This pattern is preferred over generic icon-heavy cards for project and essay previews.

## Buttons And Navigation

Top-level buttons should feel tactile and premium.

- Use rounded pill buttons.
- Add soft internal highlight, layered shadow, or subtle stacked ghost layer.
- Rest state should be calm and low contrast on black.
- Hover state may brighten, slide, or reveal a second layer.
- Active state should feel pressed, not just recolored.
- Buttons should preserve strong focus-visible outlines.

Avoid:

- Flat generic blue CTA styling for primary visual moments.
- Overly large button text in compact nav.
- Sharp-cornered nav pills unless the whole section intentionally changes style.

## Glass Navigation

For light hero scenes, navigation may become a centered floating glass bar.

- Use one compact bar for primary links.
- Add a small circular icon button to the left when useful.
- Keep labels short and calm.
- Use `backdrop-filter: blur(...)` with a solid fallback background for browsers that do not support it.
- The bar should feel suspended, not stuck to the page edge.
- Search or utility controls should be visually integrated, not separate heavy widgets.
- On mobile, retain accessibility and focus order even if the bar collapses into a simpler pill menu.

## Panels, Modals, And Drawers

Popups and secondary windows should animate smoothly.

- Use soft scale + fade + slight translate.
- Backdrops should dim or blur without turning the whole UI muddy.
- Cards/panels should feel like floating dark glass or soft black plates.
- Opening duration: about 220-360ms.
- Closing duration: about 160-260ms.
- Use easing similar to `cubic-bezier(0.16, 1, 0.3, 1)`.

Accessibility:

- Dialogs must trap focus.
- Escape closes dismissible overlays.
- Focus returns to the trigger.
- Motion must reduce cleanly when requested.

## Tables And Structured Lists

Structured information can use a dark editorial table/list style.

- Use rows with small section numbers on the left and larger statements on the right.
- Separate rows with thin low-contrast lines.
- Make hover/focus states subtle: text brightens, accent line appears, or row shifts by 1-2px.
- Use blue as a precise accent for active or linked text.
- Keep the layout spacious. Avoid dense spreadsheet visuals.
- This pattern works well for mission, values, experience, services, changelog, or selected achievements.

## Layout

- Prefer full-viewport compositions for high-impact pages.
- Use generous negative space.
- Allow intentional overlaps between type and media.
- Avoid nested cards and dense dashboard layout for public-facing pages.
- Repeated lists can be simple, but featured work should feel spatial and layered.
- Footer/contact links may sit low and quiet, like gallery captions.
- Combine light and dark bands intentionally: a white/glass hero can transition into a dark structured section.
- Avoid abrupt visual language changes unless the section break is clear.

## Home Scroll Experience

The home page should feel like one continuous scene while scrolling, not a stack of unrelated blocks.

Liked / 喜欢:

- A continuous page-level gradient that slowly shifts from the light glass hero into darker editorial colors and then into the next content mood.
- The hero-to-photography transition should read as one long white-to-black gradient, without a hard horizontal boundary between the light subject scene and the dark image showcase.
- Hero, photography, skills, experience, and featured projects should share one continuous background system; do not restart a separate gradient at section boundaries.
- Avoid local hero-bottom masks or overlays that are clipped at the section edge and create a visible horizontal line before photography.
- Photography sections should default to a white-to-black gradient. When hovering/focusing an image, the background should shift to a white-to-image-dominant-color gradient rather than a flat color jump.
- Text that appears as the user scrolls in and softens/disappears when it leaves the viewport.
- Image motion during scroll: subtle float, scale, lift, soft blur-to-sharp, or depth changes.
- ReactBits-style motion language such as Scroll Reveal, Scroll Float, Fade Content, and image trail/parallax ideas, adapted to Vue/Nuxt without adding React-only dependencies.
- Sections that overlap visually through spacing, gradient, and motion instead of hard background bands.
- Motion that is smooth and premium, with text remaining readable at every frame.

Disliked / 不要:

- Homepage sections that look like separate flat bands stacked one after another.
- Abrupt background jumps between white, gray, black, and card grids.
- A visible middle seam where the top of the page is white and the lower image section suddenly turns black.
- A second hard seam where photography ends and the skills/experience/projects color field begins.
- Static image grids with no scroll response.
- Text that simply appears already placed with no entrance/exit rhythm.
- Heavy cards or boxed panels that make the page feel like a dashboard.
- Motion that hides primary content from SSR, breaks keyboard access, or ignores reduced-motion preferences.

## Current Site Adaptation

When applying this direction to this Nuxt personal website:

- Keep the existing content architecture, i18n, SEO, and Cloudflare Pages deployment intact.
- Reuse existing UI primitives where they fit, but do not force generic card styling onto hero/featured sections.
- Preserve Chinese default routes and English `/en/` routes.
- Keep accessibility and SSG output as hard requirements.
- Prefer incremental design passes over large rewrites.

Suggested first design targets:

1. Home hero: convert to black editorial composition with oversized text and kinetic contact/action words.
2. Featured projects: use large overlapping images with project accent background transitions.
3. Header/nav: refine into tactile layered pill buttons.
4. Mobile menu: keep current focus behavior, but improve entrance/exit motion.
5. Project listing: move from ordinary card grid toward a layered visual index for featured items.
6. Alternative home direction: create a light glass hero with one dominant portrait/avatar/subject and a floating glass navigation bar.
7. About or experience section: use dark table-like rows with numbered labels and large clean statements.
8. Blog/project archive previews: use image-over-text cards with minimal arrow links and strong spacing.

## Implementation Notes

- Use CSS variables for dynamic color states.
- Keep dark mode compatible, but this direction prefers black-first surfaces.
- Use `transition-property` narrowly instead of `transition-all` when practical.
- Add `@media (prefers-reduced-motion: reduce)` overrides for transforms, transitions, and character scatter.
- Ensure generated HTML still contains real SSR content; do not move primary content into client-only effects.
- Animation should enhance the content, not hide it.
- For glass UI, always provide a non-blur fallback color.
- For central hero subjects, avoid runtime-only rendering; image and core text must exist in SSR output.

## Do

- Build simple resting screens with high-impact typography.
- Let images and hover states introduce color.
- Make buttons feel physical and polished.
- Make text interactions memorable but readable.
- Use glass UI when it supports a calm high-end hero scene.
- Use structured row layouts for mission, values, experience, and feature comparisons.
- Verify mobile and keyboard behavior.
- Preserve performance and Lighthouse standards.

## Do Not

- Do not turn every section into a card layout.
- Do not use generic gradients, decorative blobs, or stock-like hero illustrations.
- Do not overuse glass panels across the whole site.
- Do not add a central human/figure image unless it improves identity and has a suitable asset.
- Do not let motion break accessibility or readability.
- Do not ship links that only work with JavaScript.
- Do not sacrifice SSG, SEO, or i18n for animation.
- Do not copy the reference site's exact identity or content.
