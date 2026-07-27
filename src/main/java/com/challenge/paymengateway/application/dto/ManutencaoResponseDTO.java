package com.challenge.viagensbackend.application.dto;

import java.time.LocalDate;

import com.challenge.viagensbackend.application.model.ManutencaoStatus;

public record ManutencaoResponseDTO(
        Integer id,
        Integer veiculoId,
        String veiculoPlaca,
        String veiculoModelo,
        LocalDate dataInicio,
        LocalDate dataFinalizacao,
        String tipoServico,
        Double custoEstimado,
        ManutencaoStatus status) {
}
