import { Cart } from "./Cart";
import { CartItem } from "./CartItem";
import { Product } from "./Product";

export type RootStackParamList = {
  Maintabs: undefined;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Details: Product | undefined;
  Cart: Cart | undefined;
  Checkout: CartItem | undefined;
};
