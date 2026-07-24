package com.challenge.viagensbackend.application.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.challenge.viagensbackend.application.dto.DashboardCategoryVolumeDTO;
import com.challenge.viagensbackend.application.dto.DashboardIndicatorsDTO;
import com.challenge.viagensbackend.application.dto.DashboardKmResponseDTO;
import com.challenge.viagensbackend.application.dto.DashboardRankingDTO;
import com.challenge.viagensbackend.application.dto.ViagemResponseDTO;
import com.challenge.viagensbackend.application.service.DashboardService;

@Validated
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardIndicatorsDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getIndicators());
    }

    @GetMapping("/km")
    public ResponseEntity<DashboardKmResponseDTO> getKmSummary() {
        return ResponseEntity.ok(dashboardService.getKmSummary());
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<DashboardCategoryVolumeDTO>> getVolumeByCategory() {
        return ResponseEntity.ok(dashboardService.getVolumeByCategory());
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<DashboardRankingDTO>> getRanking() {
        return ResponseEntity.ok(dashboardService.getVehicleRanking());
    }

    @GetMapping("/proximas")
    public ResponseEntity<List<ViagemResponseDTO>> getUpcomingTrips() {
        return ResponseEntity.ok(dashboardService.getUpcomingTrips(10));
    }
}
