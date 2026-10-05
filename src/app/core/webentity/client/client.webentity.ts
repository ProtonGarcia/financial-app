export interface CreateClientWebEntity {
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  gender: string;
  status: string;
  documentNumber: string;
  email: string;
  phone: string;
  ipAddresses: { ipAddress: string }[];
}

export interface ClientWebEntity extends CreateClientWebEntity {
  id?: number;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
}
