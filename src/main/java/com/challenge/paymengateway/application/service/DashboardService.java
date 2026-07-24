package com.challenge.viagensbackend.application.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.challenge.viagensbackend.application.dto.DashboardCategoryVolumeDTO;
import com.challenge.viagensbackend.application.dto.DashboardIndicatorsDTO;
import com.challenge.viagensbackend.application.dto.DashboardKmResponseDTO;
import com.challenge.viagensbackend.application.dto.DashboardRankingDTO;
import com.challenge.viagensbackend.application.dto.DashboardVehicleKmDTO;
import com.challenge.viagensbackend.application.dto.ViagemResponseDTO;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.model.Viagem;
import com.challenge.viagensbackend.application.repository.ViagemRepository;

@Service
public class DashboardService {

    private final ViagemRepository viagemRepository;
    private final VehicleService vehicleService;

    public DashboardService(ViagemRepository viagemRepository, VehicleService vehicleService) {
        this.viagemRepository = viagemRepository;
        this.vehicleService = vehicleService;
    }

    public DashboardKmResponseDTO getKmSummary() {
        Double totalKm = viagemRepository.findTotalDistance();
        if (totalKm == null) {
            totalKm = 0d;
        }
        List<DashboardVehicleKmDTO> byVehicle = viagemRepository.findTotalDistanceByVehicle().stream()
                .map(this::toVehicleKm)
                .collect(Collectors.toList());
        return new DashboardKmResponseDTO(totalKm, byVehicle);
    }

    public List<DashboardCategoryVolumeDTO> getVolumeByCategory() {
        return viagemRepository.countByVehicleCategory().stream()
                .map(this::toCategoryVolume)
                .collect(Collectors.toList());
    }

    public List<ViagemResponseDTO> getUpcomingTrips(int maxResults) {
        List<Viagem> trips = viagemRepository.findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime.now(), PageRequest.of(0, maxResults));
        return trips.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<DashboardRankingDTO> getVehicleRanking() {
        return viagemRepository.findVehicleDistanceRanking().stream()
                .map(this::toRanking)
                .collect(Collectors.toList());
    }

    public DashboardIndicatorsDTO getIndicators() {
        Double totalKm = viagemRepository.findTotalDistance();
        if (totalKm == null) {
            totalKm = 0d;
        }
        long totalTrips = viagemRepository.count();
        Double averageDistance = totalTrips == 0 ? 0d : totalKm / totalTrips;
        long totalVehicles = vehicleService.listVehicles().size();

        return new DashboardIndicatorsDTO(totalTrips, totalKm, averageDistance, totalVehicles);
    }

    private DashboardVehicleKmDTO toVehicleKm(Object[] result) {
        Integer vehicleId = (Integer) result[0];
        String plate = (String) result[1];
        Double totalKm = ((Number) result[2]).doubleValue();
        return new DashboardVehicleKmDTO(vehicleId, plate, totalKm);
    }

    private DashboardCategoryVolumeDTO toCategoryVolume(Object[] result) {
        String category = ((Enum<?>) result[0]).name();
        Long count = ((Number) result[1]).longValue();
        return new DashboardCategoryVolumeDTO(category, count);
    }

    private DashboardRankingDTO toRanking(Object[] result) {
        Vehicle vehicle = (Vehicle) result[0];
        Double totalKm = ((Number) result[1]).doubleValue();
        return new DashboardRankingDTO(vehicle.getId(), vehicle.getPlate(), totalKm);
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
