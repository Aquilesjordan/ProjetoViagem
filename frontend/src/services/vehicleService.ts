// services/vehicleService.ts
import { api } from './api'; // ajuste o caminho/nome se o seu cliente axios tiver outro nome
import { Vehicle } from '../types/trip';

export async function fetchVeiculos(): Promise<Vehicle[]> {
  const { data } = await api.get<Vehicle[]>('/api/veiculos');
  return data;
}

export interface CreateVeiculoPayload {
  placa: string;
  model: string;
  tipo: string;
  ano: number;
}

export async function createVeiculo(payload: CreateVeiculoPayload): Promise<Vehicle> {
  const { data } = await api.post<Vehicle>('/api/veiculos', payload);
  return data;
}

export interface UpdateVeiculoPayload extends CreateVeiculoPayload {
  id: number;
}

export async function updateVeiculo({ id, ...payload }: UpdateVeiculoPayload): Promise<Vehicle> {
  const { data } = await api.put<Vehicle>(`/api/veiculos/${id}`, payload);
  return data;
}

export async function deleteVeiculo(id: number): Promise<void> {
  await api.delete(`/api/veiculos/${id}`);
}