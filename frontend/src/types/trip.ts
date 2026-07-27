export type Trip = {
  id: number;
  veiculoId: number;
  veiculoPlaca: string;
  veiculoModelo: string;
  veiculoTipo: 'LEVE' | 'PESADO';
  dataSaida: string;
  dataChegada: string | null;
  origem: string;
  destino: string;
  kmPercorrida: number;
};

export type TripPayload = {
  veiculoId: number;
  origem: string;
  destino: string;
  dataSaida: string;
  dataChegada: string | null;
  kmPercorrida: number;
};

export type TripQueryParams = {
  page: number; 
  size: number;
  vehicleId?: number;
  originCity?: string;
  destinationCity?: string;
  departureStart?: string;
  departureEnd?: string;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  sort?: string;
};

export type TripPage = {
  content: Trip[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type Vehicle = {
  id: number;
  placa: string;
  model: string;
  tipo: 'LEVE' | 'PESADO';
  ano: number | null;
};
