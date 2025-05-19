export interface User {
  _id: string;
  _v: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  access: Token;
  refresh: Token;
}

export interface Token {
  token: string;
  expiresAt: string;
}

export interface AuthResponseDto {
  user: User;
  tokens: Tokens;
}

export type RegisterResponseDto = AuthResponseDto;
export type LoginResponseDto = AuthResponseDto;
export type LogoutResponseDto = object;

export interface RefreshTokenResponseDto {
  tokens: Tokens;
}
