export class Shop {
  id!: number;
  name!: string;
  location!: string;
  type!: ShopType;
  imageUrl?: string;
}

  export enum ShopType {
  Restaurant,
  FoodStand,
  CandyStore
}



