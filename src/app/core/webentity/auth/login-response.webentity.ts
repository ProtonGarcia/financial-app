import { ApiResponse } from '../../models/http/api-response.model';

export interface LoginDataWebEntity {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export type LoginResponseWebEntity = ApiResponse<LoginDataWebEntity | null>;
