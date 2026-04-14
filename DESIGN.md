# Design System Strategy: The Vibrancy of Order

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Editorial Efficiency."** 

We are moving away from the cluttered, line-heavy utility of traditional task managers toward a high-end, magazine-inspired digital workspace. This system balances the "chunky," assertive weight of modern brutalism with the refined, airy softness of an Ivory-based palette. We prioritize intentional asymmetry—where a bold headline might sit off-center against a floating task card—to create a rhythm that feels human and curated, rather than programmed. This is a system where high-contrast typography provides the structure, and tonal layering provides the depth.

---

## 2. Color & Surface Philosophy
The palette is a sophisticated trio: **Ivory (#FFFEEC)** provides a warm, non-clinical foundation; **Indigo (#A88AED)** acts as our authoritative voice for action; and **Pear (#CBD83B)** serves as a high-visibility signal for highlights.

### The "No-Line" Rule
To maintain an editorial feel, **1px solid borders are strictly prohibited** for sectioning or containment. Boundaries must be defined through:
- **Background Shifts:** Using `surface-container-low` (#f5f4e3) against the primary `surface` (#fbfae8).
- **Negative Space:** Relying on the spacing scale to create groupings.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface tiers to create "nested" importance:
- **Level 0 (Base):** `surface` (#fbfae8) — The main canvas.
- **Level 1 (Sections):** `surface-container-low` (#f5f4e3) — Large groupings or sidebars.
- **Level 2 (Cards/Interaction):** `surface-container-lowest` (#ffffff) — Individual tasks or active modules that need to "pop."

### The "Glass & Gradient" Rule
For elements that float above the main flow (like modals or floating action buttons), use **Glassmorphism**. Apply `primary-container` (#a88aed) at 80% opacity with a `24px` backdrop-blur. To add "visual soul," use a subtle linear gradient on primary CTAs: `primary` (#6a4dab) to `primary_container` (#a88aed) at a 135-degree angle.

---

## 3. Typography
Our typography is the backbone of the brand's personality. We pair the aggressive, geometric weight of **Space Grotesk** with the utilitarian clarity of **Manrope**.

| Role | Token | Font | Size | Weight | Character |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Space Grotesk | 3.5rem | Bold | Chunky, impactful "MILK" inspired. |
| **Headline** | `headline-lg` | Space Grotesk | 2rem | Bold | For major category headers. |
| **Title** | `title-lg` | Manrope | 1.375rem | Semi-Bold | For task names and card titles. |
| **Body** | `body-md` | Manrope | 0.875rem | Medium | For notes and descriptions. |
| **Label** | `label-md` | Manrope | 0.75rem | Bold | For metadata and status chips. |

**Hierarchy Note:** Always lead with a `display` or `headline` element. The "chunky" nature of these titles allows them to act as visual anchors, making the Ivory background feel intentional rather than empty.

---

## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.

- **The Layering Principle:** Soft, natural lift is achieved by stacking. A `#ffffff` card sitting on a `#f5f4e3` background provides all the separation required for a "clean" look.
- **Ambient Shadows:** If a floating element (like a mobile FAB) requires a shadow, it must use a `24px` blur with 6% opacity, tinted with the `on-surface` color (#1b1c12). Avoid "dirty" grey shadows.
- **The "Ghost Border" Fallback:** For accessibility in form fields, use the `outline-variant` (#cbc4d3) at 15% opacity. It should be felt, not seen.
- **Glassmorphism:** Use for persistent navigation or high-level overlays to let the vibrant Pear and Indigo accents bleed through the Ivory base, creating a unified color story.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), `full` roundedness, white text.
- **Secondary:** Pear (#CBD83B) background with `on-secondary-container` (#606800) text. Use for "Add Task" or "Complete."
- **Tertiary:** Ghost style. No background, `primary` text weight bold.

### Task Cards
- **Style:** `surface-container-lowest` (#ffffff) background, `xl` (1.5rem) corner radius.
- **Layout:** No dividers. Use `body-sm` metadata in `on-surface-variant` (#494551) positioned with generous 24px padding.

### Chips (Priority/Category)
- **High Priority:** Indigo background with white text.
- **Active Category:** Pear background with dark green text.
- **Shape:** `full` pill shape to contrast with the chunky squareness of Display titles.

### Input Fields
- **Background:** `surface-container-high` (#eae9d8). 
- **Active State:** A `2px` bottom-only highlight in Indigo (#A88AED). Avoid full-box outlines.

### Progress Visuals
Use the **Pear (#CBD83B)** color for progress bars. It represents growth and "Go," providing a vibrant contrast to the Indigo actions.

---

## 6. Do's and Don'ts

### Do
- **Do** use massive "MILK" style titles to break up the page; let the type be the art.
- **Do** use asymmetrical margins (e.g., 48px left, 24px right) to create a modern editorial feel.
- **Do** rely on `surface` color shifts for hierarchy before reaching for a shadow.
- **Do** ensure all Indigo text on Ivory backgrounds meets WCAG AA contrast standards.

### Don't
- **Don't** use 1px lines to separate tasks in a list. Use vertical white space.
- **Don't** use pure black (#000000). Always use `on-surface` (#1b1c12) for text to maintain the warmth of the Ivory.
- **Don't** use sharp corners. This system thrives on the `lg` and `xl` roundedness scale to feel "organic" and premium.
- **Don't** over-use Pear. It is a "highlight" color—if everything is Pear, nothing is important.