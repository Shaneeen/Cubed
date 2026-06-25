/**
 * Stand-in for real auth/session. There is no Supabase auth wired up yet for
 * merchant login (see LoginModal — it's UI-only), so the Merchant Portal is
 * hardcoded to this one demo merchant until login produces a real session.
 */
export const CURRENT_MERCHANT_ID = "aurelia-jewelry";
