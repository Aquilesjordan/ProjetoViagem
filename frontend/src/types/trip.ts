export type Trip = {
  id: string;
  vehicle: string;
  vehicleId: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  kilometers: number;
};

export type TripPayload = {
  vehicleId: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  kilometers: number;
};

export type TripQueryParams = {
  page: number;
  size: number;
  search?: string;
  vehicleId?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
};

export type TripPage = {
  items: Trip[];
  total: number;
};

export type Vehicle = {
  id: string;
  name: string;
};
