package com.challenge.viagensbackend.application.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.challenge.viagensbackend.application.model.Vehicle;

@Repository
public interface VeiculoRepository extends JpaRepository<Vehicle, Integer> {
    boolean existsByPlaca(String placa);
}
