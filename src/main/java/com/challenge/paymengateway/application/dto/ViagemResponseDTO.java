package com.challenge.viagensbackend.application.dto;

import java.time.LocalDateTime;

import com.challenge.viagensbackend.application.model.VehicleCategory;

public record ViagemResponseDTO(
        Integer id,
        Integer veiculoId,
        String veiculoPlaca,
        String veiculoModelo,
        VehicleCategory veiculoTipo,
        LocalDateTime dataSaida,
        LocalDateTime dataChegada,
        String origem,
        String destino,
        Double kmPercorrida) {
}
