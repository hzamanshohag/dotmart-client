export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
};

export type OrderUser = {
  _id: string;
  name: string;
  email: string;
};

export type Order = {
  _id: string;
  user: OrderUser;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;

};
