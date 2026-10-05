export interface IpAddress {
  ipAddress: string;
}

export interface CreateClientModel {
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  gender: string;
  status: string;
  documentNumber: string;
  email: string;
  phone: string;
  ipAddresses: IpAddress[];
}

export interface ClientModel extends CreateClientModel {
  id?: number;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
}
