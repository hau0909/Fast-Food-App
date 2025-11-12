import { Product } from "./Product";

export type RootStackParamList = {
  Auth:
    | {
        screen: keyof AuthParamList;
      }
    | undefined;
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

export type AuthParamList = {
  Register: undefined;
  Login: undefined;
};
