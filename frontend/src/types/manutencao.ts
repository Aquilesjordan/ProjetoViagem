export type ManutencaoStatus = 'PENDENTE' | 'EM_REALIZACAO' | 'CONCLUIDA';

export type Manutencao = {
  id: number;
  veiculoId: number;
  veiculoPlaca: string;
  veiculoModelo: string;
  dataInicio: string;
  dataFinalizacao: string | null;
  tipoServico: string;
  custoEstimado: number | null;
  status: ManutencaoStatus;
};
