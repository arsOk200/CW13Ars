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
