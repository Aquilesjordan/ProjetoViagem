package com.challenge.viagensbackend.application.dto;

public record DashboardRankingDTO(
        Integer vehicleId,
        String plate,
        Double totalKm) {
}
