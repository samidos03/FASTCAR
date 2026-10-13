
export enum CarStatus {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  MAINTENANCE = 'Maintenance'
}

export interface Car {
  id: string;
  registration: string;
  brand: string;
  model: string;
  dailyPrice: number;
  image: string;
  condition: string;
  status: CarStatus;
  mileage: number;
  agentId?: string; // Assigned agent
}

export interface Client {
  id: string;
  nationalId: string;
  lastName: string;
  firstName: string;
  address: string;
  phone: string;
  email: string;
}

export interface Agent {
  id: string;
  lastName: string;
  firstName: string;
  photo?: string;
}

export interface Contract {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'Transfer';
  clientId: string;
  carId: string;
  agentId: string;
}

export interface AgencySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  currency: string;
}
