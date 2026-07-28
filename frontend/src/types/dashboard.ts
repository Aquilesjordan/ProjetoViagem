export type ProximaManutencao = {
  id: number;
  veiculoModelo: string;
  veiculoPlaca: string;
  tipoServico: string;
  dataInicio: string;
  status: string;
};

export type DashboardResponse = {
  totalQuilometros: number;
  totalViagens: number;
  totalVeiculos: number;
  manutencoesPendentes: number;
  custoTotalManutencao: number;
  projecaoFinanceiraMesAtual: number;
  quilometrosPorVeiculo: Array<{
    veiculoId: number;
    placa: string;
    modelo: string;
    totalKm: number;
  }>;
  viagensPorTipoVeiculo: Array<{
    tipo: string;
    quantidadeViagens: number;
  }>;
  manutencoesPorStatus: Array<{
    status: string;
    quantidade: number;
  }>;
  proximasManutencoes: ProximaManutencao[];
};
