package com.challenge.viagensbackend.application.service;

import java.util.List;
import java.math.BigDecimal;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.challenge.viagensbackend.application.dto.ManutencaoRequestDTO;
import com.challenge.viagensbackend.application.dto.ManutencaoResponseDTO;
import com.challenge.viagensbackend.application.model.Manutencao;
import com.challenge.viagensbackend.application.model.ManutencaoStatus;
import com.challenge.viagensbackend.application.model.Vehicle;
import com.challenge.viagensbackend.application.repository.ManutencaoRepository;

@Service
public class ManutencaoService {

    private final ManutencaoRepository manutencaoRepository;
    private final VehicleService vehicleService;

    public ManutencaoService(ManutencaoRepository manutencaoRepository, VehicleService vehicleService) {
        this.manutencaoRepository = manutencaoRepository;
        this.vehicleService = vehicleService;
    }

    @Transactional
    public ManutencaoResponseDTO create(ManutencaoRequestDTO dto) {
        Vehicle vehicle = vehicleService.getVehicle(dto.veiculoId());
        Manutencao manutencao = new Manutencao();
        copyFields(dto, manutencao, vehicle);
        return toDto(manutencaoRepository.save(manutencao));
    }

    @Transactional
    public ManutencaoResponseDTO update(Integer id, ManutencaoRequestDTO dto) {
        Manutencao existing = manutencaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Manutenção não encontrada"));
        Vehicle vehicle = vehicleService.getVehicle(dto.veiculoId());
        copyFields(dto, existing, vehicle);
        return toDto(manutencaoRepository.save(existing));
    }

    public List<ManutencaoResponseDTO> list() {
        return manutencaoRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ManutencaoResponseDTO getById(Integer id) {
        return manutencaoRepository.findById(id).map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Manutenção não encontrada"));
    }

    @Transactional
    public void delete(Integer id) {
        if (!manutencaoRepository.existsById(id)) {
            throw new IllegalArgumentException("Manutenção não encontrada");
        }
        manutencaoRepository.deleteById(id);
    }

    private void copyFields(ManutencaoRequestDTO dto, Manutencao manutencao, Vehicle vehicle) {
        manutencao.setVehicle(vehicle);
        manutencao.setDataInicio(dto.dataInicio());
        manutencao.setDataFinalizacao(dto.dataFinalizacao());
        manutencao.setTipoServico(dto.tipoServico());
        manutencao.setCustoEstimado(dto.custoEstimado() == null ? null : BigDecimal.valueOf(dto.custoEstimado()));
        manutencao.setStatus(dto.status() == null ? ManutencaoStatus.PENDENTE : dto.status());
    }

    private ManutencaoResponseDTO toDto(Manutencao manutencao) {
        return new ManutencaoResponseDTO(
                manutencao.getId(),
                manutencao.getVehicle().getId(),
                manutencao.getVehicle().getPlaca(),
                manutencao.getVehicle().getModel(),
                manutencao.getDataInicio(),
                manutencao.getDataFinalizacao(),
                manutencao.getTipoServico(),
                manutencao.getCustoEstimado() == null ? null : manutencao.getCustoEstimado().doubleValue(),
                manutencao.getStatus());
    }
}
