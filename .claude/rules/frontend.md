# Frontend Rules

Load this when changing `app/**`, `components/**`, `app/globals.css`, Tailwind
config, or visible product UX.

## Product Standard

- Keep the learner's next useful action visible quickly, especially on mobile.
- Do not add decorative UI that competes with study progress, questions, or AI Tutor actions.
- Preserve the dashboard-first information architecture unless the task explicitly changes it.
- Use existing typography, spacing, card, and color patterns before inventing a new visual language.
- Keep desktop and mobile behavior explicit with responsive Tailwind classes.

## Accessibility

- Interactive controls need visible labels or accessible names.
- Do not rely on color alone for status.
- Keep focus states and keyboard navigation usable.
- Prefer semantic HTML before custom div-based widgets.

## Review Checklist

- Mobile width checked at 375px, 390px, and 430px for layout-heavy changes.
- Desktop checked at `md` and larger.
- No duplicate trackers or repeated profile sections.
- AI Tutor chat/voice mode choices are clear to a new user.
- Empty and signed-out states explain what is visible and what requires login.
