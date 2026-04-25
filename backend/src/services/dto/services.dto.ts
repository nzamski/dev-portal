import type { ServiceContract } from 'src/contracts/domain.types';

export type CreateServiceDto = Omit<ServiceContract, 'id'>;
export type UpdateServiceDto = Omit<ServiceContract, 'id'>;
export type SyncServicesDto = ServiceContract[];
