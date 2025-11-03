import { Cart } from "../type/Cart";

export const calculateTotalPrice = (cart: Cart | null): number => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return 0;
  }

  return cart.items.reduce((total, currentItem) => {
    const itemPrice = currentItem.product.price * currentItem.quantity;
    return total + itemPrice;
  }, 0);
};
