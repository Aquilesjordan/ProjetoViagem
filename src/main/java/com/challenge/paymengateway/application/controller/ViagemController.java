package com.challenge.viagensbackend.application.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.challenge.viagensbackend.application.dto.ViagemRequestDTO;
import com.challenge.viagensbackend.application.dto.ViagemResponseDTO;
import com.challenge.viagensbackend.application.service.ViagemService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @PostMapping
    public ResponseEntity<ViagemResponseDTO> create(@Valid @RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(viagemService.createTravel(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(viagemService.getTravelById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ViagemResponseDTO> update(@PathVariable Integer id, @Valid @RequestBody ViagemRequestDTO dto) {
        return ResponseEntity.ok(viagemService.updateTravel(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        viagemService.deleteTravel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<ViagemResponseDTO>> list(
            @RequestParam Optional<Integer> vehicleId,
            @RequestParam Optional<String> originCity,
            @RequestParam Optional<String> destinationCity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<LocalDateTime> departureStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Optional<LocalDateTime> departureEnd,
            @RequestParam Optional<Double> minDistanceKm,
            @RequestParam Optional<Double> maxDistanceKm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "dataSaida,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 ? Sort.Direction.fromString(sortParams[1]) : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        Page<ViagemResponseDTO> result = viagemService.listTravels(vehicleId, originCity, destinationCity, departureStart, departureEnd,
                minDistanceKm, maxDistanceKm, pageable);
        return ResponseEntity.ok(result);
    }
}
