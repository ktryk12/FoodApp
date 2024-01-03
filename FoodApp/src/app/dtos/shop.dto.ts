export class Shop {
  id!: number;
  name!: string;
  location!: string;
  type!: ShopType;
}

  export enum ShopType {
  Resturant,
  FoodStand,
  CandyStore
}



