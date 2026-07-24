package com.challenge.viagensbackend.application.dto;

public record DashboardVehicleKmDTO(
        Integer vehicleId,
        String plate,
        Double totalKm) {
}
