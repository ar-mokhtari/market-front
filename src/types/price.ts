export interface Price {
  date: string;
  time: string;
  symbol: string;
  price: number;
  type: string;
  unit: string;
  change_percent: number;
  calories?: number;
  weight?: number;
}

export interface PriceResponse {
  data: Price[];
}
