package com.challenge.viagensbackend.application.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ViagemRequestDTO(
        @NotNull(message = "Veículo é obrigatório") Integer veiculoId,
        @NotNull(message = "Data/hora de saída é obrigatória") LocalDateTime dataSaida,
        LocalDateTime dataChegada,
        @NotBlank(message = "Cidade de origem é obrigatória") String origem,
        @NotBlank(message = "Cidade de destino é obrigatória") String destino,
        @NotNull(message = "Quilometragem é obrigatória") @Positive(message = "Quilometragem deve ser positiva") Double kmPercorrida) {

    @AssertTrue(message = "A chegada deve ser posterior à saída")
    public boolean isArrivalAfterDepartureValid() {
        return dataSaida == null || dataChegada == null || dataChegada.isAfter(dataSaida);
    }
}
