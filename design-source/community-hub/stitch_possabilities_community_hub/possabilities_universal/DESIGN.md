---
name: PossAbilities Universal
colors:
  surface: '#fff8f8'
  surface-dim: '#e1d8d9'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf1f2'
  surface-container: '#f5eced'
  surface-container-high: '#efe6e7'
  surface-container-highest: '#e9e0e1'
  on-surface: '#1e1b1c'
  on-surface-variant: '#4e434e'
  inverse-surface: '#342f30'
  inverse-on-surface: '#f8efef'
  outline: '#80737f'
  outline-variant: '#d1c2cf'
  surface-tint: '#844594'
  primary: '#290036'
  on-primary: '#ffffff'
  primary-container: '#48065a'
  on-primary-container: '#bb77ca'
  inverse-primary: '#f2afff'
  secondary: '#b30069'
  on-secondary: '#ffffff'
  secondary-container: '#e00085'
  on-secondary-container: '#fffbff'
  tertiary: '#001819'
  on-tertiary: '#ffffff'
  tertiary-container: '#002f2f'
  on-tertiary-container: '#319f9f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fcd7ff'
  primary-fixed-dim: '#f2afff'
  on-primary-fixed: '#340043'
  on-primary-fixed-variant: '#6a2c7a'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#ffb0cc'
  on-secondary-fixed: '#3e0021'
  on-secondary-fixed-variant: '#8d0051'
  tertiary-fixed: '#8ef3f3'
  tertiary-fixed-dim: '#71d6d6'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f50'
  background: '#fff8f8'
  on-background: '#1e1b1c'
  surface-variant: '#e9e0e1'
  brand-purple: '#48065a'
  brand-pink: '#ec008c'
  brand-teal: '#66cccc'
  surface-white: '#ffffff'
  text-rich-black: '#231f20'
  status-muted-pink: '#bc437d'
typography:
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '900'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  statement-text:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-side: 2.5rem
  gutter: 1.5rem
  stack-lg: 4rem
  stack-md: 2rem
  stack-sm: 1rem
  touch-target-min: 3rem
---

## Brand & Style

The design system for this platform is rooted in the "Easy Read" philosophy, specifically engineered for adults with learning disabilities. The brand personality is **Passionate, Person-Centred, and Happy**, manifesting as a UI that is vibrant yet exceptionally clear.

The design style is a blend of **Corporate Modernism** and **Tactile Inclusivity**. It leverages the high-contrast, geometric clarity of modern SaaS interfaces but softens them with large, approachable touch targets and a "Generous Alignment" model. Every decision is filtered through the lens of cognitive accessibility: minimizing distraction, maximizing legibility, and providing clear visual cues for every interaction. The result is an environment that feels empowering, creative, and safe, echoing the mission to "Live The Life You Choose."

## Colors

The palette is designed for high-contrast accessibility. **Brand Purple** serves as the primary anchor for structural elements and headers, providing a stable, authoritative base. **Brand Pink** is used for secondary accents and emotional highlights, while **Brand Teal** is reserved for icons and graphic callouts that require distinct visual separation.

To ensure WCAG AAA compliance for users with learning disabilities:
- **Text:** Always use **Rich Black** on **White** or **White** on **Brand Purple** for maximum contrast.
- **Backgrounds:** Keep primary content areas strictly white to reduce cognitive load and visual "noise."
- **Interactive States:** Use saturation and brightness shifts of the primary palette to indicate focus, never relying on color alone (supplement with thick borders or icons).

## Typography

While the brand manual specifies Avenir, for a digital-first accessible portal, we utilize **Atkinson Hyperlegible Next** for all body and instructional text. This font is specifically designed to increase character recognition and reduce fatigue for users with learning disabilities. **Montserrat** is used for headings to maintain the geometric, modern "Avenir-like" aesthetic while ensuring web-optimized weights.

**Key Typography Rules:**
- **Line Length:** Keep body text to a maximum of 60-70 characters per line to aid tracking.
- **Weights:** Avoid "Light" weights for body copy. Stick to Regular (400) and Medium (500) for better visibility.
- **Hierarchy:** Use massive scale for section headers (Headline LG) to provide clear landmarks for navigation.

## Layout & Spacing

This design system uses a **Fixed Grid** on desktop (max-width 1280px) and a **Fluid Grid** on mobile. The "Generous Alignment" philosophy is executed through a wide left margin that acts as a visual anchor.

- **Vertical Rhythm:** A strict 8px base unit is used, but spacing between major sections is exaggerated (Stack LG) to clearly separate different topics and tasks.
- **Safe Zones:** Every interactive element must be surrounded by a minimum of 16px of whitespace to prevent accidental clicks.
- **Touch Targets:** All interactive components have a minimum height of 48px (3rem) to support users with limited fine motor skills.
- **Breakpoints:**
  - **Mobile:** 0 - 599px (1 column, 20px margins)
  - **Tablet:** 600px - 1023px (6 columns, 32px margins)
  - **Desktop:** 1024px+ (12 columns, 40px margins)

## Elevation & Depth

To maintain the "Easy Read" aesthetic, the system avoids complex shadows and blurs which can cause visual distortion. Instead, it uses **Tonal Layers** and **Bold Outlines**.

- **Surfaces:** Use high-contrast containers. Content is typically placed on a white surface with a 2px solid border (using the Neutral or Primary color) to define the edge clearly.
- **Z-Axis:** Instead of shadows, use "stacking." Elements that are active or in focus are outlined with a thicker 4px Brand Teal border.
- **No Transparency:** Avoid semi-transparent layers or glassmorphism, as these can reduce text contrast and cause confusion for users with visual processing difficulties.

## Shapes

The shape language is **Rounded**, creating a soft and welcoming environment. The default 0.5rem corner radius for UI elements provides a friendly, non-threatening feel while maintaining enough structure to look professional.

- **Icons:** Should always be enclosed in a circular container (rounded-xl) or a rounded square to give them a "button-like" physical presence.
- **Imagery:** Large images should use the standard roundedness (0.5rem) to integrate seamlessly with the UI containers.

## Components

### Buttons
Buttons are large and high-contrast. The primary button uses the **Brand Purple** background with White text and a minimum height of 56px. Hover and focus states must be unmistakable—a 4px **Brand Teal** border should appear on focus to provide a clear visual cue.

### Input Fields
Inputs must have a permanent label (no floating labels). Use a 2px solid border in **Rich Black**. Error states should use a 4px Red border and include an "X" icon to ensure the error is communicated via both color and symbol.

### Cards
Cards are the primary container for information. They feature a 1px border in a light grey or Brand Purple, with a large, 24px internal padding. Every card should be a single "idea" to keep cognitive load low.

### Chips/Labels
Used for categorization. These use the **Brand Teal** or **Brand Pink** at low opacity (10%) with high-saturation text of the same color to ensure they are distinct but don't compete with primary actions.

### Easy-Read Lists
Lists should include large icons or bullet points (min 24px) in Brand Purple to help guide the eye down the page. Increase line-height in lists to 1.8 for maximum readability.