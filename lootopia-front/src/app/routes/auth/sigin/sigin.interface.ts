export interface SiginRequestInterface {
  nickname: string;
  email: string;
  password: string;
  roles: string[];
}

export interface SiginResponsInterface {
  nickname: string;
  email: string;
  roles: string[];
}

export class VerifyTokenRequest {
  token?: string;
}

export interface VerifyTokenResponse {
  isVerified: boolean;
}
