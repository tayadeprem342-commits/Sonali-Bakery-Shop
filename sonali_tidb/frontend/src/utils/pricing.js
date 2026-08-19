// Single source of truth for the price breakdown shown across
// the cart drawer, checkout page, order success page and admin panel.

export const GST_RATE = 0.05;      // 5% GST on food items
export const DELIVERY_FEE = 50;    // flat delivery charge

export const FREE_DELIVERY_THRESHOLD = 999; // optional: waive delivery above this subtotal

/**
 * Given a cart subtotal, returns the full price breakdown.
 * Rounded to the nearest rupee for display + storage consistency.
 */
export function getOrderTotals(subtotal) {
  const safeSubtotal = Number(subtotal) || 0;
  const gstAmount = Math.round(safeSubtotal * GST_RATE);
  const deliveryFee = safeSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = safeSubtotal + gstAmount + deliveryFee;

  return {
    subtotal: safeSubtotal,
    gstRate: GST_RATE,
    gstAmount,
    deliveryFee,
    grandTotal,
  };
}
