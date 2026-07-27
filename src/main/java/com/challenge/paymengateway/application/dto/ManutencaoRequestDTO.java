package com.challenge.viagensbackend.application.dto;

import java.time.LocalDate;

import com.challenge.viagensbackend.application.model.ManutencaoStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ManutencaoRequestDTO(
        @NotNull(message = "Veículo é obrigatório") Integer veiculoId,
        @NotNull(message = "Data de início é obrigatória") LocalDate dataInicio,
        LocalDate dataFinalizacao,
        String tipoServico,
        @PositiveOrZero(message = "Custo deve ser maior ou igual a zero") Double custoEstimado,
        ManutencaoStatus status) {
}
