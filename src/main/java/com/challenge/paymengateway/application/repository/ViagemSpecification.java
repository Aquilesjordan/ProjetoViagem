package com.challenge.viagensbackend.application.repository;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.challenge.viagensbackend.application.model.Viagem;

public class ViagemSpecification {

    public static Specification<Viagem> filter(
            Integer vehicleId,
            String originCity,
            String destinationCity,
            LocalDateTime departureStart,
            LocalDateTime departureEnd,
            Double minDistanceKm,
            Double maxDistanceKm) {

        return Specification.where(hasVehicleId(vehicleId))
                .and(hasOriginCity(originCity))
                .and(hasDestinationCity(destinationCity))
                .and(hasDepartureAfter(departureStart))
                .and(hasDepartureBefore(departureEnd))
                .and(hasMinDistance(minDistanceKm))
                .and(hasMaxDistance(maxDistanceKm));
    }

    private static Specification<Viagem> hasVehicleId(Integer vehicleId) {
        return (root, query, builder) -> vehicleId == null ? null
                : builder.equal(root.get("vehicle").get("id"), vehicleId);
    }

    private static Specification<Viagem> hasOriginCity(String originCity) {
        return (root, query, builder) -> originCity == null || originCity.isBlank() ? null
                : builder.like(builder.lower(root.get("origem")), "%" + originCity.toLowerCase() + "%");
    }

    private static Specification<Viagem> hasDestinationCity(String destinationCity) {
        return (root, query, builder) -> destinationCity == null || destinationCity.isBlank() ? null
                : builder.like(builder.lower(root.get("destino")), "%" + destinationCity.toLowerCase() + "%");
    }

    private static Specification<Viagem> hasDepartureAfter(LocalDateTime departureStart) {
        return (root, query, builder) -> departureStart == null ? null
                : builder.greaterThanOrEqualTo(root.get("dataSaida"), departureStart);
    }

    private static Specification<Viagem> hasDepartureBefore(LocalDateTime departureEnd) {
        return (root, query, builder) -> departureEnd == null ? null
                : builder.lessThanOrEqualTo(root.get("dataSaida"), departureEnd);
    }

    private static Specification<Viagem> hasMinDistance(Double minDistanceKm) {
        return (root, query, builder) -> minDistanceKm == null ? null
                : builder.greaterThanOrEqualTo(root.get("kmPercorrida"), BigDecimal.valueOf(minDistanceKm));
    }

    private static Specification<Viagem> hasMaxDistance(Double maxDistanceKm) {
        return (root, query, builder) -> maxDistanceKm == null ? null
                : builder.lessThanOrEqualTo(root.get("kmPercorrida"), BigDecimal.valueOf(maxDistanceKm));
    }
}
