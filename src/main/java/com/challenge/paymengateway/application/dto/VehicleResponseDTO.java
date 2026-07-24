package com.challenge.viagensbackend.application.dto;

import com.challenge.viagensbackend.application.model.VehicleCategory;

public record VehicleResponseDTO(
        Integer id,
        String plate,
        String model,
        VehicleCategory category) {
}
