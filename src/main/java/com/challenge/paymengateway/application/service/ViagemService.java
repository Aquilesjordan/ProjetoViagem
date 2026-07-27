package com.challenge.viagensbackend.application.service;

import java.time.LocalDateTime;
import java.math.BigDecimal;
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
        Vehicle vehicle = vehicleService.getVehicle(dto.veiculoId());
        Viagem viagem = mapToEntity(dto, vehicle);
        Viagem saved = viagemRepository.save(viagem);
        return toDto(saved);
    }

    @Transactional
    public ViagemResponseDTO updateTravel(Integer id, ViagemRequestDTO dto) {
        Viagem existing = viagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));

        Vehicle vehicle = vehicleService.getVehicle(dto.veiculoId());
        existing.setVehicle(vehicle);
        existing.setDataSaida(dto.dataSaida());
        existing.setDataChegada(dto.dataChegada());
        existing.setOrigem(dto.origem());
        existing.setDestino(dto.destino());
        existing.setKmPercorrida(BigDecimal.valueOf(dto.kmPercorrida()));

        Viagem updated = viagemRepository.save(existing);
        return toDto(updated);
    }

    public void deleteTravel(Integer id) {
        if (!viagemRepository.existsById(id)) {
            throw new IllegalArgumentException("Viagem não encontrada");
        }
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
        viagem.setDataSaida(dto.dataSaida());
        viagem.setDataChegada(dto.dataChegada());
        viagem.setOrigem(dto.origem());
        viagem.setDestino(dto.destino());
        viagem.setKmPercorrida(BigDecimal.valueOf(dto.kmPercorrida()));
        return viagem;
    }

    private ViagemResponseDTO toDto(Viagem viagem) {
        return new ViagemResponseDTO(
                viagem.getId(),
                viagem.getVehicle().getId(),
                viagem.getVehicle().getPlaca(),
                viagem.getVehicle().getModel(),
                viagem.getVehicle().getTipo(),
                viagem.getDataSaida(),
                viagem.getDataChegada(),
                viagem.getOrigem(),
                viagem.getDestino(),
                viagem.getKmPercorrida() == null ? null : viagem.getKmPercorrida().doubleValue());
    }
}
