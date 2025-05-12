export interface LoginRequestInterface {
  email: string;
  password: string;
}

export interface LoginResponseInterface {
  email: string;
  token: string;
}
