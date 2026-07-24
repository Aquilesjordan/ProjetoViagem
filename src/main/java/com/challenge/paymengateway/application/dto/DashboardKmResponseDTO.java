package com.challenge.viagensbackend.application.dto;

import java.util.List;

public record DashboardKmResponseDTO(
        Double totalFleetKm,
        List<DashboardVehicleKmDTO> vehicleKm) {
}
