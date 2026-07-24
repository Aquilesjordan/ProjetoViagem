package com.challenge.viagensbackend.application.dto;

public record DashboardIndicatorsDTO(
        Long totalTrips,
        Double totalKilometers,
        Double averageDistance,
        Long totalVehicles) {
}
