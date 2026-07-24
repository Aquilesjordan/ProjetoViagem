package com.challenge.viagensbackend.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.challenge.viagensbackend.application.dto.ViagemRequestDTO;
import com.challenge.viagensbackend.application.dto.ViagemResponseDTO;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.model.VehicleCategory;
import com.challenge.viagensbackend.application.repository.ViagemRepository;

class ViagemServiceTest {

    @Mock
    private ViagemRepository viagemRepository;

    @Mock
    private VehicleService vehicleService;

    private ViagemService viagemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        viagemService = new ViagemService(viagemRepository, vehicleService);
    }

    @Test
    void shouldCreateTravel() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1);
        vehicle.setPlate("ABC1234");
        vehicle.setModel("Model 1");
        vehicle.setCategory(VehicleCategory.LEVE);

        when(vehicleService.getVehicle(eq(1))).thenReturn(vehicle);

        ViagemRequestDTO request = new ViagemRequestDTO(
                1,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(2),
                "São Paulo",
                "Rio de Janeiro",
                450.0);

        when(viagemRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ViagemResponseDTO response = viagemService.createTravel(request);

        assertEquals(1, response.vehicleId());
        assertEquals("ABC1234", response.vehiclePlate());
        assertEquals("São Paulo", response.originCity());
    }
}
