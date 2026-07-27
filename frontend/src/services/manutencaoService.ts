import { api } from './api';
import { Manutencao } from '../types/manutencao';

export async function fetchManutencoes(): Promise<Manutencao[]> {
  const response = await api.get('/api/manutencoes');
  return response.data as Manutencao[];
}
