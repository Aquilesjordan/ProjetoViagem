package com.challenge.viagensbackend.application.dto;

public record DashboardProximaManutencaoDTO(
        Integer id,
        String veiculoModelo,
        String veiculoPlaca,
        String tipoServico,
        String dataInicio,
        String status) {
}