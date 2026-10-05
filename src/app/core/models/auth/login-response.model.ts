import { ApiResponse } from '../http/api-response.model';

export interface LoginData {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginResponse = ApiResponse<LoginData | null>;
