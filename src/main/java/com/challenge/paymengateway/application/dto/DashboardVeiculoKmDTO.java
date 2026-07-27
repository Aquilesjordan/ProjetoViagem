package com.challenge.viagensbackend.application.dto;

public record DashboardVeiculoKmDTO(
        Integer veiculoId,
        String placa,
        String modelo,
        Double totalKm) {
}
