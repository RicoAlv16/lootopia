export interface LoginRequestInterface {
  email: string;
  password: string;
  isVerified: boolean;
}

export interface LoginResponseInterface {
  access_token: string;
  nickname: string;
  email: string;
  roles: string[];
}
