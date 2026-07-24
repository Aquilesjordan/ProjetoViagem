package com.challenge.viagensbackend.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.challenge.viagensbackend.application.dto.VehicleRequestDTO;
import com.challenge.viagensbackend.application.dto.VehicleResponseDTO;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.model.VehicleCategory;
import com.challenge.viagensbackend.application.repository.VehicleRepository;

class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleService = new VehicleService(vehicleRepository);
    }

    @Test
    void shouldCreateVehicle() {
        VehicleRequestDTO dto = new VehicleRequestDTO("ABC1234", "Model 1", VehicleCategory.LEVE);
        Vehicle saved = new Vehicle();
        saved.setId(1);
        saved.setPlate(dto.plate());
        saved.setModel(dto.model());
        saved.setCategory(dto.category());

        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(saved);

        VehicleResponseDTO result = vehicleService.createVehicle(dto);

        assertEquals(1, result.id());
        assertEquals("ABC1234", result.plate());
        assertEquals("Model 1", result.model());
        assertEquals(VehicleCategory.LEVE, result.category());
    }

    @Test
    void shouldListVehicles() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1);
        vehicle.setPlate("ABC1234");
        vehicle.setModel("Model 1");
        vehicle.setCategory(VehicleCategory.LEVE);

        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle));

        List<VehicleResponseDTO> result = vehicleService.listVehicles();

        assertEquals(1, result.size());
        assertEquals("ABC1234", result.get(0).plate());
    }
}
