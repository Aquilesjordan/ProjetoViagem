package com.challenge.viagensbackend.application.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.challenge.viagensbackend.application.model.Viagem;
@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Integer>, JpaSpecificationExecutor<Viagem> {

    @Query("SELECT COALESCE(SUM(v.kmPercorrida), 0) FROM Viagem v")
    BigDecimal sumTotalKm();

    @Query("""
            SELECT v.vehicle.id, v.vehicle.placa, v.vehicle.model, COALESCE(SUM(v.kmPercorrida), 0)
            FROM Viagem v
            GROUP BY v.vehicle.id, v.vehicle.placa, v.vehicle.model
            ORDER BY COALESCE(SUM(v.kmPercorrida), 0) DESC
            """)
    List<Object[]> sumKmByVeiculo();

    @Query("SELECT v.vehicle.tipo, COUNT(v) FROM Viagem v GROUP BY v.vehicle.tipo")
    List<Object[]> countViagensByTipoVeiculo();

    List<Viagem> findByDataSaidaAfterOrderByDataSaidaAsc(LocalDateTime now, Pageable pageable);
}
