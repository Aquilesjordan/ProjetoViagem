package com.challenge.viagensbackend.application.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.challenge.viagensbackend.application.dto.VehicleRequestDTO;
import com.challenge.viagensbackend.application.dto.VehicleResponseDTO;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.repository.VeiculoRepository;

@Service
public class VehicleService {

    private final VeiculoRepository vehicleRepository;

    public VehicleService(VeiculoRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public VehicleResponseDTO createVehicle(VehicleRequestDTO dto) {
        if (vehicleRepository.existsByPlaca(dto.placa())) {
            throw new IllegalArgumentException("Já existe veículo cadastrado com esta placa");
        }
        Vehicle vehicle = new Vehicle();
        vehicle.setPlaca(dto.placa());
        vehicle.setModel(dto.model());
        vehicle.setTipo(dto.tipo());
        vehicle.setAno(dto.ano());
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDto(saved);
    }

    @Transactional
    public VehicleResponseDTO updateVehicle(Integer id, VehicleRequestDTO dto) {
        Vehicle existing = getVehicle(id);
        if (!existing.getPlaca().equals(dto.placa()) && vehicleRepository.existsByPlaca(dto.placa())) {
            throw new IllegalArgumentException("Já existe veículo cadastrado com esta placa");
        }
        existing.setPlaca(dto.placa());
        existing.setModel(dto.model());
        existing.setTipo(dto.tipo());
        existing.setAno(dto.ano());
        return toDto(vehicleRepository.save(existing));
    }

    public List<VehicleResponseDTO> listVehicles() {
        return vehicleRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public VehicleResponseDTO getVehicleById(Integer id) {
        return toDto(getVehicle(id));
    }

    @Transactional
    public void deleteVehicle(Integer id) {
        if (!vehicleRepository.existsById(id)) {
            throw new IllegalArgumentException("Veículo não encontrado");
        }
        vehicleRepository.deleteById(id);
    }

    public Vehicle getVehicle(Integer id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Veículo não encontrado"));
    }

    private VehicleResponseDTO toDto(Vehicle vehicle) {
        return new VehicleResponseDTO(
                vehicle.getId(),
                vehicle.getPlaca(),
                vehicle.getModel(),
                vehicle.getTipo(),
                vehicle.getAno());
    }
}
