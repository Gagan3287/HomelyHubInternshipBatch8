/**
 * Formats a numeric price into Indian Rupee format (e.g. 1500 -> "₹1,500")
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default formatPrice;
