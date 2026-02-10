# Specification

## Summary
**Goal:** Add a frontend-configurable maintenance mode that disables normal app usage and shows a full-page maintenance message.

**Planned changes:**
- Add and document a new frontend environment variable (e.g., `VITE_MAINTENANCE_MODE`) in `frontend/.env.example`, including accepted values.
- Gate the main application UI behind the maintenance-mode flag so that, when enabled, the app renders only a full-page maintenance screen (and hides header/hero/main content/footer and authentication actions).
- Ensure all maintenance screen user-facing text is in English and clearly communicates temporary unavailability.

**User-visible outcome:** When maintenance mode is enabled, users see a full-page “temporarily unavailable” maintenance message instead of the normal app; when disabled or unset, the app behaves exactly as before.
