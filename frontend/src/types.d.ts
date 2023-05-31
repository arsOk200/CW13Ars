export interface User {
  _id: string;
  username: string;
  token: string;
  role: string;
  image: string | null;
  displayName: string;
  googleId?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface GlobalError {
  error: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  image: File | null;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface CategoryList {
  _id: string;
  name: string;
}
export type CategoryMutation = Omit<CategoryList, '_id'>;

export interface ProductList {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: Category;
}

export interface ProductMutation {
  category: string;
  name: string;
  price: string;
  description: string;
  image: File | null | string;
}

export interface Family {
  _id: string;
  name: string;
  users: {
    user: User;
  }[];
}
