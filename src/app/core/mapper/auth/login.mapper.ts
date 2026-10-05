import { LoginRequest } from '../../models/auth/login-request.model';
import { LoginResponse } from '../../models/auth/login-response.model';
import { LoginRequestWebEntity } from '../../webentity/auth/login-request.webentity';
import { LoginResponseWebEntity } from '../../webentity/auth/login-response.webentity';

export class LoginMapper {
  static toWebEntity(request: LoginRequest): LoginRequestWebEntity {
    return { documentNumber: request.documentNumber };
  }

  static toModel(entity: LoginResponseWebEntity): LoginResponse {
    if (!entity || typeof entity.code !== 'number') {
      throw new Error('Respuesta de login inválida.');
    }
    if (entity.data && !entity.data.token) {
      throw new Error('Respuesta de login sin token.');
    }

    return {
      code: entity.code,
      message: entity.message,
      data: entity.data
        ? {
            token: entity.data.token,
            tokenType: entity.data.tokenType,
            expiresIn: entity.data.expiresIn
          }
        : null
    };
  }
}
