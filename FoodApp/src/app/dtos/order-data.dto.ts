export class OrderData {
  id!: number;
  orderNumber!: number;
  datetime!: Date; // Bemærk at vi bruger Date i stedet for DateTime i TypeScript
  total!: number;
  shopId!: number;
}
