import { ClientModel, CreateClientModel } from '../../models/client/client.model';
import { ClientWebEntity, CreateClientWebEntity } from '../../webentity/client/client.webentity';

export class ClientMapper {
  static toWebEntity(model: CreateClientModel): CreateClientWebEntity {
    return {
      firstName: model.firstName,
      lastName: model.lastName,
      address: model.address,
      birthDate: model.birthDate,
      gender: model.gender,
      status: model.status,
      documentNumber: model.documentNumber,
      email: model.email,
      phone: model.phone,
      ipAddresses: model.ipAddresses.map(ip => ({ ipAddress: ip.ipAddress }))
    };
  }

  static toModel(entity: ClientWebEntity): ClientModel {
    return { ...entity };
  }
}
