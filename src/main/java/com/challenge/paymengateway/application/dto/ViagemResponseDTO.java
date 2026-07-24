package com.challenge.viagensbackend.application.dto;

import java.time.LocalDateTime;

import com.challenge.viagensbackend.application.model.VehicleCategory;

public record ViagemResponseDTO(
        Integer id,
        Integer vehicleId,
        String vehiclePlate,
        String vehicleModel,
        VehicleCategory vehicleCategory,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String originCity,
        String destinationCity,
        Double distanceKm) {
}
