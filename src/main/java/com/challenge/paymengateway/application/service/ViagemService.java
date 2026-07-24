package com.challenge.viagensbackend.application.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.challenge.viagensbackend.application.dto.ViagemRequestDTO;
import com.challenge.viagensbackend.application.dto.ViagemResponseDTO;
import com.challenge.viagensbackend.application.model.Viagem;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.repository.ViagemRepository;
import com.challenge.viagensbackend.application.repository.ViagemSpecification;

@Service
public class ViagemService {

    private final ViagemRepository viagemRepository;
    private final VehicleService vehicleService;

    public ViagemService(ViagemRepository viagemRepository, VehicleService vehicleService) {
        this.viagemRepository = viagemRepository;
        this.vehicleService = vehicleService;
    }

    @Transactional
    public ViagemResponseDTO createTravel(ViagemRequestDTO dto) {
        Vehicle vehicle = vehicleService.getVehicle(dto.vehicleId());
        Viagem viagem = mapToEntity(dto, vehicle);
        Viagem saved = viagemRepository.save(viagem);
        return toDto(saved);
    }

    @Transactional
    public ViagemResponseDTO updateTravel(Integer id, ViagemRequestDTO dto) {
        Viagem existing = viagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        Vehicle vehicle = vehicleService.getVehicle(dto.vehicleId());
        existing.setVehicle(vehicle);
        existing.setDepartureTime(dto.departureTime());
        existing.setArrivalTime(dto.arrivalTime());
        existing.setOriginCity(dto.originCity());
        existing.setDestinationCity(dto.destinationCity());
        existing.setDistanceKm(dto.distanceKm());

        Viagem updated = viagemRepository.save(existing);
        return toDto(updated);
    }

    public void deleteTravel(Integer id) {
        viagemRepository.deleteById(id);
    }

    public ViagemResponseDTO getTravelById(Integer id) {
        return viagemRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));
    }

    public Page<ViagemResponseDTO> listTravels(
            Optional<Integer> vehicleId,
            Optional<String> originCity,
            Optional<String> destinationCity,
            Optional<LocalDateTime> departureStart,
            Optional<LocalDateTime> departureEnd,
            Optional<Double> minDistanceKm,
            Optional<Double> maxDistanceKm,
            Pageable pageable) {

        Page<Viagem> page = viagemRepository.findAll(
                ViagemSpecification.filter(
                        vehicleId.orElse(null),
                        originCity.orElse(null),
                        destinationCity.orElse(null),
                        departureStart.orElse(null),
                        departureEnd.orElse(null),
                        minDistanceKm.orElse(null),
                        maxDistanceKm.orElse(null)),
                pageable);

        return page.map(this::toDto);
    }

    private Viagem mapToEntity(ViagemRequestDTO dto, Vehicle vehicle) {
        Viagem viagem = new Viagem();
        viagem.setVehicle(vehicle);
        viagem.setDepartureTime(dto.departureTime());
        viagem.setArrivalTime(dto.arrivalTime());
        viagem.setOriginCity(dto.originCity());
        viagem.setDestinationCity(dto.destinationCity());
        viagem.setDistanceKm(dto.distanceKm());
        return viagem;
    }

    private ViagemResponseDTO toDto(Viagem viagem) {
        return new ViagemResponseDTO(
                viagem.getId(),
                viagem.getVehicle().getId(),
                viagem.getVehicle().getPlate(),
                viagem.getVehicle().getModel(),
                viagem.getVehicle().getCategory(),
                viagem.getDepartureTime(),
                viagem.getArrivalTime(),
                viagem.getOriginCity(),
                viagem.getDestinationCity(),
                viagem.getDistanceKm());
    }
}
