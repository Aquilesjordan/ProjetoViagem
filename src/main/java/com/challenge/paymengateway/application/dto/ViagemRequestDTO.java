package com.challenge.viagensbackend.application.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ViagemRequestDTO(
        @NotNull(message = "Veículo é obrigatório") Integer vehicleId,
        @NotNull(message = "Data/hora de saída é obrigatória") LocalDateTime departureTime,
        @NotNull(message = "Data/hora de chegada é obrigatória") LocalDateTime arrivalTime,
        @NotBlank(message = "Cidade de origem é obrigatória") String originCity,
        @NotBlank(message = "Cidade de destino é obrigatória") String destinationCity,
        @NotNull(message = "Quilometragem é obrigatória") @Positive(message = "Quilometragem deve ser positiva") Double distanceKm) {

    @AssertTrue(message = "A chegada deve ser posterior à saída")
    public boolean isArrivalAfterDepartureValid() {
        return departureTime == null || arrivalTime == null || arrivalTime.isAfter(departureTime);
    }
}
