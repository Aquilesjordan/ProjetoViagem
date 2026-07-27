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
import com.challenge.viagensbackend.application.repository.VeiculoRepository;

class VehicleServiceTest {

    @Mock
    private VeiculoRepository vehicleRepository;

    private VehicleService vehicleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        vehicleService = new VehicleService(vehicleRepository);
    }

    @Test
    void shouldCreateVehicle() {
        VehicleRequestDTO dto = new VehicleRequestDTO("ABC1234", "Model 1", VehicleCategory.LEVE, 2022);
        Vehicle saved = new Vehicle();
        saved.setId(1);
        saved.setPlaca(dto.placa());
        saved.setModel(dto.model());
        saved.setTipo(dto.tipo());
        saved.setAno(dto.ano());

        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(saved);

        VehicleResponseDTO result = vehicleService.createVehicle(dto);

        assertEquals(1, result.id());
        assertEquals("ABC1234", result.placa());
        assertEquals("Model 1", result.model());
        assertEquals(VehicleCategory.LEVE, result.tipo());
        assertEquals(2022, result.ano());
    }

    @Test
    void shouldListVehicles() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1);
        vehicle.setPlaca("ABC1234");
        vehicle.setModel("Model 1");
        vehicle.setTipo(VehicleCategory.LEVE);
        vehicle.setAno(2023);

        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle));

        List<VehicleResponseDTO> result = vehicleService.listVehicles();

        assertEquals(1, result.size());
        assertEquals("ABC1234", result.get(0).placa());
    }
}
