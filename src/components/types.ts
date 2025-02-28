export type StockData = {
    x: Date;
    y: [number, number, number, number];
  }; 

export type Balance = {
  cash: number;
  stock: number;
};

export enum Status {
  Start = 0,
  Playing = 1,
  End = 2,
}
  