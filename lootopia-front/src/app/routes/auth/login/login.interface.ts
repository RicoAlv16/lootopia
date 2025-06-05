export interface LoginRequestInterface {
  email: string;
  password: string;
  isVerified: boolean;
  rgpd: string;
}

export interface LoginResponseInterface {
  id: number;
  access_token: string;
  nickname: string;
  email: string;
  roles: string[];
}