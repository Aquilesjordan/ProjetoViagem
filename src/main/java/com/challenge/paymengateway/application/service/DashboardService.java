package com.challenge.viagensbackend.application.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.challenge.viagensbackend.application.dto.DashboardManutencaoStatusDTO;
import com.challenge.viagensbackend.application.dto.DashboardProximaManutencaoDTO;
import com.challenge.viagensbackend.application.dto.DashboardResponseDTO;
import com.challenge.viagensbackend.application.dto.DashboardTipoVeiculoDTO;
import com.challenge.viagensbackend.application.dto.DashboardVeiculoKmDTO;
import com.challenge.viagensbackend.application.dto.VehicleResponseDTO;
import com.challenge.viagensbackend.application.model.Manutencao;
import com.challenge.viagensbackend.application.model.ManutencaoStatus;
import com.challenge.viagensbackend.application.repository.ManutencaoRepository;
import com.challenge.viagensbackend.application.repository.ViagemRepository;

@Service
public class DashboardService {

    private final ViagemRepository viagemRepository;
    private final VehicleService vehicleService;
    private final ManutencaoRepository manutencaoRepository;

    public DashboardService(
            ViagemRepository viagemRepository,
            VehicleService vehicleService,
            ManutencaoRepository manutencaoRepository) {
        this.viagemRepository = viagemRepository;
        this.vehicleService = vehicleService;
        this.manutencaoRepository = manutencaoRepository;
    }

    public DashboardResponseDTO getDashboard() {
        BigDecimal totalKm = viagemRepository.sumTotalKm();
        Long totalViagens = viagemRepository.count();
        List<VehicleResponseDTO> veiculos = vehicleService.listVehicles();
        Long totalVeiculos = (long) veiculos.size();
        Long manutencoesPendentes = manutencaoRepository.countByStatus(ManutencaoStatus.PENDENTE);
        BigDecimal custoTotalManutencao = manutencaoRepository.sumCustoTotal();
        BigDecimal custoMesAtual = manutencaoRepository.sumCustoMesAtual();

        List<DashboardVeiculoKmDTO> quilometrosPorVeiculo = buildQuilometrosPorVeiculo(veiculos);
        List<DashboardTipoVeiculoDTO> viagensPorTipoVeiculo = viagemRepository.countViagensByTipoVeiculo().stream()
                .map(result -> new DashboardTipoVeiculoDTO(((Enum<?>) result[0]).name(), ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
        List<DashboardManutencaoStatusDTO> manutencoesPorStatus = buildManutencoesPorStatus();
        List<DashboardProximaManutencaoDTO> proximasManutencoes = buildProximasManutencoes();

        return new DashboardResponseDTO(
                totalKm == null ? 0d : totalKm.doubleValue(),
                totalViagens,
                totalVeiculos,
                manutencoesPendentes,
                custoTotalManutencao == null ? 0d : custoTotalManutencao.doubleValue(),
                custoMesAtual == null ? 0d : custoMesAtual.doubleValue(),
                quilometrosPorVeiculo,
                viagensPorTipoVeiculo,
                manutencoesPorStatus,
                proximasManutencoes);
    }

    private List<DashboardVeiculoKmDTO> buildQuilometrosPorVeiculo(List<VehicleResponseDTO> veiculos) {
        Map<Integer, DashboardVeiculoKmDTO> kmByVeiculo = viagemRepository.sumKmByVeiculo().stream()
                .map(result -> new DashboardVeiculoKmDTO(
                        (Integer) result[0],
                        (String) result[1],
                        (String) result[2],
                        ((Number) result[3]).doubleValue()))
                .collect(Collectors.toMap(DashboardVeiculoKmDTO::veiculoId, Function.identity()));

        List<DashboardVeiculoKmDTO> series = new ArrayList<>();
        for (VehicleResponseDTO veiculo : veiculos) {
            DashboardVeiculoKmDTO km = kmByVeiculo.get(veiculo.id());
            if (km == null) {
                series.add(new DashboardVeiculoKmDTO(veiculo.id(), veiculo.placa(), veiculo.model(), 0d));
            } else {
                series.add(km);
            }
        }
        series.sort(Comparator.comparing(DashboardVeiculoKmDTO::totalKm).reversed());
        return series;
    }

    private List<DashboardManutencaoStatusDTO> buildManutencoesPorStatus() {
        Map<String, Long> totais = manutencaoRepository.countByStatusGroup().stream()
                .collect(Collectors.toMap(
                        result -> ((Enum<?>) result[0]).name(),
                        result -> ((Number) result[1]).longValue()));

        List<DashboardManutencaoStatusDTO> series = new ArrayList<>();
        for (ManutencaoStatus status : ManutencaoStatus.values()) {
            series.add(new DashboardManutencaoStatusDTO(status.name(), totais.getOrDefault(status.name(), 0L)));
        }
        return series;
    }

    private List<DashboardProximaManutencaoDTO> buildProximasManutencoes() {
        return manutencaoRepository
                .findProximasManutencoes(ManutencaoStatus.CONCLUIDA, PageRequest.of(0, 5))
                .stream()
                .map(this::toProximaManutencaoDTO)
                .collect(Collectors.toList());
    }

    private DashboardProximaManutencaoDTO toProximaManutencaoDTO(Manutencao m) {
        return new DashboardProximaManutencaoDTO(
                m.getId(),
                m.getVehicle().getModel(),
                m.getVehicle().getPlaca(),
                m.getTipoServico(),
                m.getDataInicio().toString(),
                m.getStatus().name());
    }
}