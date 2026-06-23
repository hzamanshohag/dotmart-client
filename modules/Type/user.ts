
export interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  role?: string;
  userStatus?: string;
  cart: [];
  orderHistory: [];
  createdAt: number;
  updatedAt: number;
  __v: number;
}

export interface IUser {
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}
