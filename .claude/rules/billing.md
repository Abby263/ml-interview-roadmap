# Billing Rules

Load this only if billing, Stripe, subscriptions, paid plans, invoices, or
monetization code is added later.

## Current State

- The current product is non-commercial source-available software.
- No billing provider is configured in this repo today.
- Do not add paid-gating behavior unless the license and product policy are reviewed first.

## Future Billing Requirements

- Use server-side checkout/session creation only.
- Verify webhook signatures before processing events.
- Keep entitlement checks server-side.
- Avoid storing raw payment data.
- Add tests for upgrade, downgrade, cancellation, renewal failure, and webhook replay behavior.
