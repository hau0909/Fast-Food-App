import { Product } from "./Product";

export type RootStackParamList = {
  Auth: undefined;
  MainTabs:
    | {
        screen: keyof TabParamList;
      }
    | undefined;
  Details: { product: Product };
  Orders: any | undefined;
  Checkout: any | undefined;
};

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Profiles: undefined;
};
