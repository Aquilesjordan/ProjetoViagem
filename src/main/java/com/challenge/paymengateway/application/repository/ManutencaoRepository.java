package com.challenge.viagensbackend.application.repository;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.challenge.viagensbackend.application.model.Manutencao;
import com.challenge.viagensbackend.application.model.ManutencaoStatus;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, Integer> {
    long countByStatus(ManutencaoStatus status);

    @Query("SELECT COALESCE(SUM(m.custoEstimado), 0) FROM Manutencao m")
    BigDecimal sumCustoTotal();

    @Query("SELECT m.status, COUNT(m) FROM Manutencao m GROUP BY m.status")
    List<Object[]> countByStatusGroup();
}
