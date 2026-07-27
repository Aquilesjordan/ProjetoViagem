package com.challenge.viagensbackend.application.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.challenge.viagensbackend.application.dto.ManutencaoRequestDTO;
import com.challenge.viagensbackend.application.dto.ManutencaoResponseDTO;
import com.challenge.viagensbackend.application.service.ManutencaoService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/manutencoes")
public class ManutencaoController {

    private final ManutencaoService manutencaoService;

    public ManutencaoController(ManutencaoService manutencaoService) {
        this.manutencaoService = manutencaoService;
    }

    @GetMapping
    public ResponseEntity<List<ManutencaoResponseDTO>> list() {
        return ResponseEntity.ok(manutencaoService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManutencaoResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(manutencaoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ManutencaoResponseDTO> create(@Valid @RequestBody ManutencaoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(manutencaoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManutencaoResponseDTO> update(@PathVariable Integer id, @Valid @RequestBody ManutencaoRequestDTO dto) {
        return ResponseEntity.ok(manutencaoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        manutencaoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
