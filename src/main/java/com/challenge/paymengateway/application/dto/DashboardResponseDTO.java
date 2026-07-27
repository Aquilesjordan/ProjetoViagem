package com.challenge.viagensbackend.application.dto;

import java.util.List;

public record DashboardResponseDTO(
        Double totalQuilometros,
        Long totalViagens,
        Long totalVeiculos,
        Long manutencoesPendentes,
        Double custoTotalManutencao,
        List<DashboardVeiculoKmDTO> quilometrosPorVeiculo,
        List<DashboardTipoVeiculoDTO> viagensPorTipoVeiculo,
        List<DashboardManutencaoStatusDTO> manutencoesPorStatus) {
}
