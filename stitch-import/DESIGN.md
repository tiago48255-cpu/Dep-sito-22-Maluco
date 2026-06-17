---
name: Nocturnal Pulse
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c5d7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f8fa0'
  outline-variant: '#454654'
  surface-tint: '#bdc2ff'
  primary: '#bdc2ff'
  on-primary: '#00149f'
  primary-container: '#1e2fbf'
  on-primary-container: '#a5aeff'
  inverse-primary: '#3d4dd8'
  secondary: '#ffb4ac'
  on-secondary: '#690006'
  secondary-container: '#a90111'
  on-secondary-container: '#ffb3ab'
  tertiary: '#fabd00'
  on-tertiary: '#3f2e00'
  tertiary-container: '#5a4200'
  on-tertiary-container: '#e3ab00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000965'
  on-primary-fixed-variant: '#1f30c0'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000d'
  tertiary-fixed: '#ffdf9e'
  tertiary-fixed-dim: '#fabd00'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

This design system is engineered for the high-energy, fast-paced world of nocturnal beverage delivery. The brand personality is bold, reliable, and premium, catering to a Brazilian audience that values speed and quality during social moments or late-night cravings. 

The visual style is a fusion of **Modern Corporate** efficiency and **Glassmorphism**. It utilizes a deep, immersive dark theme to minimize eye strain in low-light environments while allowing product photography to "pop" with cinematic intensity. High-contrast accents create a sense of urgency and excitement, mirroring the vibrant nightlife of Brazil. The interface feels high-end through the use of subtle gradients, deep shadows, and generous roundedness, moving away from utility toward an "experience-first" luxury service.

## Colors

The palette is anchored by **Royal Blue**, a color that signals trust and premium service, differentiated from the typical reds of standard food delivery. **Vibrant Red** is used surgically for urgent actions, discounts, and critical status updates.

- **Primary (Royal Blue):** Used for main action buttons, active states, and brand-heavy elements.
- **Secondary (Vibrant Red):** Reserved for promotions, "Live" status, and destructive actions.
- **Neutral Base:** A true deep black (#000000) for the background to maximize OLED efficiency, with a Dark Grey (#111111 and #1A1A1A) used for cards and containers to create depth.
- **Accent (Gold):** A subtle tertiary yellow is included for loyalty status, ratings, and "ice-cold" beverage highlights.

## Typography

This design system uses **Plus Jakarta Sans** across all levels to maintain a modern, friendly, yet authoritative tone. 

The scale emphasizes a heavy weight for headlines to ensure legibility against dark backgrounds. Tight letter-spacing on display styles gives the brand a "compact" and "speedy" feel. Body text maintains a healthy line height for readability when scanning long lists of product descriptions or tracking details. All labels utilize a semi-bold weight to ensure they don't get lost in the high-contrast UI.

## Layout & Spacing

The design system follows a **8pt grid system** to ensure mathematical harmony across all components. 

- **Mobile First:** A fluid 4-column grid is used for mobile, with 20px side margins to ensure content feels contained and premium.
- **Rhythm:** Spacing between cards and sections is typically `md` (16px) to maintain a dense but breathable "app-like" feel. 
- **Touch Targets:** All interactive elements maintain a minimum 44px height to accommodate fast-paced navigation.
- **Reflow:** On larger screens, content is centered within a maximum width container (600px for the primary feed) to maintain the focused mobile-centric experience.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Subtle Glows**. Because the background is pure black, elevation is shown by lightening the surface color of the container rather than just adding a black shadow.

1.  **Level 0 (Base):** #000000 - Background.
2.  **Level 1 (Cards):** #111111 - Standard product cards and list items.
3.  **Level 2 (Modals/Overlays):** #1A1A1A - Bottom sheets and dialogs, accompanied by a 20% opacity Royal Blue ambient shadow to create a "neon underglow" effect.
4.  **Interactive States:** Buttons use a vibrant gradient or solid primary color, appearing to float above the dark interface.

Glassmorphism is applied to the **Bottom Navigation Bar** and **Top App Bar** using a background blur (20px) and a subtle 1px border (#FFFFFF 10%) to maintain context of the content scrolling underneath.

## Shapes

The shape language is defined by **large, friendly radii**. 

- **Standard Containers:** Use a 16px (`rounded-lg`) radius to soften the high-contrast dark theme.
- **Primary Buttons:** Utilize a 12px radius, striking a balance between "pill" shapes and sharp tech aesthetics.
- **Product Images:** Always feature a 12px clip to ensure they integrate seamlessly with the card components.
- **Search Bars:** Use a full pill-shape (999px) to distinguish them from actionable buttons and cards.

## Components

### Buttons
- **Primary:** Royal Blue background, white text, bold weight. Use a subtle horizontal gradient (Primary to a slightly lighter blue) to add depth.
- **Secondary:** Transparent background with a 2px Royal Blue border.
- **Ghost/Tertiary:** White text with no background, used for "See all" or "Cancel".

### Cards
Product cards should have a vertical orientation for grids and horizontal for lists. They must include a clear "Add" (+) button in the bottom right corner, floating over the image or positioned in a dedicated action area. Use a #FFFFFF 5% border to define edges on dark surfaces.

### Chips & Categories
Circular or highly rounded containers with icons. Active state uses the Primary Royal Blue background; inactive state uses #1A1A1A.

### Input Fields
Darker than the card surface (#0A0A0A) with a 1px border that turns Royal Blue on focus. Labels should sit above the field in `label-md`.

### Delivery Tracker
A vertical or horizontal stepper using the Royal Blue for completed states and a pulse animation for the "Live" state. Use the Secondary Red for "Out for Delivery" to capture immediate attention.

### Bottom Sheets
Used for product details and cart summaries. These should have a "grabber" handle at the top and feature a 32px top-corner radius for a modern, tactile feel.