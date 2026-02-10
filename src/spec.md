# Specification

## Summary
**Goal:** Make the app’s default/global text color render as green across the entire UI by fixing Tailwind theme token variables and removing hardcoded conflicting text colors in non-immutable components.

**Planned changes:**
- Update `frontend/src/index.css` CSS variable values to the raw OKLCH component format expected by `frontend/tailwind.config.js` (avoid `oklch(...)` inside variables), ensuring `--foreground` and related `*-foreground` tokens are defined as green in both `:root` and `.dark`.
- Audit non-immutable frontend components and replace/remove hardcoded text color utility classes (e.g., `text-black`, `text-white`) so user-facing text follows theme tokens like `text-foreground` / `text-muted-foreground` / `text-primary`.

**User-visible outcome:** After rebuild, default/inherited body text and typical UI text (header, hero, tabs, forms, panels, etc.) appears green in both light and dark mode without needing per-component overrides.
