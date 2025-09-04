package com.project2.ism.Repository;

import com.project2.ism.Model.FranchiseSettlementBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FranchiseSettlementBatchRepository extends JpaRepository<FranchiseSettlementBatch, Long> {

    List<FranchiseSettlementBatch> findByFranchiseIdOrderByCreatedAtDesc(Long franchiseId);

    @Query("SELECT f FROM FranchiseSettlementBatch f WHERE f.franchiseId = :franchiseId AND f.status IN :statuses")
    Optional<FranchiseSettlementBatch> findByFranchiseIdAndStatusIn(
            @Param("franchiseId") Long franchiseId,
            @Param("statuses") List<FranchiseSettlementBatch.BatchStatus> statuses);

    @Query("SELECT f FROM FranchiseSettlementBatch f WHERE f.franchiseId = :franchiseId AND f.cycleKey = :cycleKey AND f.status IN :statuses")
    Optional<FranchiseSettlementBatch> findByFranchiseIdAndCycleKeyAndStatusIn(
            @Param("franchiseId") Long franchiseId,
            @Param("cycleKey") String cycleKey,
            @Param("statuses") List<FranchiseSettlementBatch.BatchStatus> statuses);
}