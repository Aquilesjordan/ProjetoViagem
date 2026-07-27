package com.challenge.viagensbackend.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.challenge.viagensbackend.application.model.VehicleCategory;

public record VehicleRequestDTO(
        @NotBlank(message = "Placa é obrigatória") String placa,
        @NotBlank(message = "Modelo é obrigatório") String model,
        @NotNull(message = "Tipo é obrigatório") VehicleCategory tipo,
        Integer ano) {
}
