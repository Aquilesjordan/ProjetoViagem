package com.challenge.viagensbackend.application.repository;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.challenge.viagensbackend.application.model.Manutencao;
import com.challenge.viagensbackend.application.model.ManutencaoStatus;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Integer> {
    long countByStatus(ManutencaoStatus status);

    @Query("SELECT COALESCE(SUM(m.custoEstimado), 0) FROM Manutencao m")
    BigDecimal sumCustoTotal();

    @Query(value = "SELECT COALESCE(SUM(custo_estimado), 0) FROM manutencoes " +
            "WHERE EXTRACT(YEAR FROM data_inicio) = EXTRACT(YEAR FROM CURRENT_DATE) " +
            "AND EXTRACT(MONTH FROM data_inicio) = EXTRACT(MONTH FROM CURRENT_DATE)",
            nativeQuery = true)
    BigDecimal sumCustoMesAtual();

    @Query("SELECT m.status, COUNT(m) FROM Manutencao m GROUP BY m.status")
    List<Object[]> countByStatusGroup();

    @Query("SELECT m FROM Manutencao m WHERE m.status <> :status ORDER BY m.dataInicio ASC")
    List<Manutencao> findProximasManutencoes(@Param("status") ManutencaoStatus status, Pageable pageable);
}