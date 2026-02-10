# Specification

## Summary
**Goal:** Update the app’s default theme foreground text color to neon green across the UI in both light and dark modes.

**Planned changes:**
- Update Tailwind/theme CSS variables so the `foreground` token resolves to a neon-green color in `:root` (light mode) and `.dark` (dark mode).
- Ensure all UI surfaces that use the standard foreground text color (e.g., `text-foreground`) render neon green consistently without per-component overrides.

**User-visible outcome:** All default app text (e.g., header, hero section, tabs, panels, tables, dialogs) appears in neon green across light and dark themes with readable contrast.
