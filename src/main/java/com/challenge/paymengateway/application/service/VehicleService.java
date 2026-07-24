package com.challenge.viagensbackend.application.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.challenge.viagensbackend.application.dto.VehicleRequestDTO;
import com.challenge.viagensbackend.application.dto.VehicleResponseDTO;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public VehicleResponseDTO createVehicle(VehicleRequestDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setPlate(dto.plate());
        vehicle.setModel(dto.model());
        vehicle.setCategory(dto.category());
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDto(saved);
    }

    public List<VehicleResponseDTO> listVehicles() {
        return vehicleRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Vehicle getVehicle(Integer id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado"));
    }

    private VehicleResponseDTO toDto(Vehicle vehicle) {
        return new VehicleResponseDTO(vehicle.getId(), vehicle.getPlate(), vehicle.getModel(), vehicle.getCategory());
    }
}
