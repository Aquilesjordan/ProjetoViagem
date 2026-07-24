package com.challenge.viagensbackend.application.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.challenge.viagensbackend.application.model.Viagem;
import com.challenge.viagensbackend.application.model.Vehicle;

@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Integer>, JpaSpecificationExecutor<Viagem> {

    @Query("SELECT SUM(v.distanceKm) FROM Viagem v")
    Double findTotalDistance();

    @Query("SELECT v.vehicle.id, v.vehicle.plate, SUM(v.distanceKm) FROM Viagem v GROUP BY v.vehicle.id, v.vehicle.plate ORDER BY SUM(v.distanceKm) DESC")
    List<Object[]> findTotalDistanceByVehicle();

    @Query("SELECT v.vehicle.category, COUNT(v) FROM Viagem v GROUP BY v.vehicle.category")
    List<Object[]> countByVehicleCategory();

    @Query("SELECT v.vehicle, SUM(v.distanceKm) FROM Viagem v GROUP BY v.vehicle ORDER BY SUM(v.distanceKm) DESC")
    List<Object[]> findVehicleDistanceRanking();

    List<Viagem> findByDepartureTimeAfterOrderByDepartureTimeAsc(LocalDateTime now, Pageable pageable);
}
