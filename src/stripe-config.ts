export const formatPrice = (price: number | undefined): string => {
  if (!price) return '$0.00';
  return `$${price.toFixed(2)}`;
};