## MEN OF GRACE Go-Live Checklist

### 1) Technique (must-have)

- Apply Supabase migrations on staging and production.
- Validate checkout end-to-end:
  - guest checkout
  - logged-in checkout
  - sold-out size selection blocked
  - confirmation link with token
- Validate admin:
  - create/edit/delete product
  - image upload/remove cleanup in storage
  - restock alerts list and status update
- Confirm env vars are set in production:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server only)
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_META_PIXEL_ID` (for Meta ads tracking)

### 2) Tracking & Ads (Meta)

- In Meta Events Manager:
  - create/configure Pixel
  - copy pixel ID into `VITE_META_PIXEL_ID`
- Confirm events are received:
  - `PageView`
  - `ViewContent`
  - `AddToCart`
  - `InitiateCheckout`
  - `Purchase`
- Confirm internal analytics events:
  - `checkout_step_view`
  - `checkout_place_order_attempt`
  - `checkout_place_order_success`
  - `checkout_place_order_failed`
  - `checkout_abandoned`
- Verify admin dashboard "Conversion checkout" shows data after traffic.

### 3) Legal / Compliance

- Publish privacy policy (includes analytics + advertising cookies).
- Publish terms & conditions and return/refund policy.
- Confirm cookie consent behavior:
  - no Meta pixel tracking before consent
  - consent stored and respected across pages

### 4) Operations

- Define order processing SOP:
  - payment follow-up
  - production kickoff
  - shipping workflow
- Define support SLA (WhatsApp/email response time).
- Prepare incident response:
  - temporary checkout disable procedure
  - rollback contact and DB backup access

### 5) Launch Sequence

1. Deploy to staging and run full smoke test.
2. Deploy to production.
3. Place one real low-value test order in production.
4. Verify Pixel events + internal analytics.
5. Start Meta ads with low budget (24-48h learning phase).
6. Scale budget only after stable conversion + no critical errors.
