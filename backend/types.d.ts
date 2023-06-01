export interface IUser {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName?: string;
  image: string | null;
}
