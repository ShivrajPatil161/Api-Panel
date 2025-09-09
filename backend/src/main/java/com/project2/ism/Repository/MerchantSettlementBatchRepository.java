package com.project2.ism.Repository;

import com.project2.ism.Model.FranchiseSettlementBatch;
import com.project2.ism.Model.MerchantSettlementBatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.net.ContentHandler;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MerchantSettlementBatchRepository extends JpaRepository<MerchantSettlementBatch, Long> {
    //List<MerchantSettlementBatch> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);

    List<MerchantSettlementBatch> findAllById(Long merchantId);

    Optional<MerchantSettlementBatch> findTopByMerchantIdAndStatusOrderByWindowEndDesc(Long merchantId, String status);

    List<MerchantSettlementBatch> findByMerchantId(Long merchantId);



    @Query("SELECT m FROM MerchantSettlementBatch m WHERE m.merchantId = :merchantId AND m.cycleKey = :cycleKey AND m.status IN :statuses")
    Optional<MerchantSettlementBatch> findByMerchantIdAndCycleKeyAndStatusIn(
            @Param("merchantId") Long merchantId,
            @Param("cycleKey") String cycleKey,
            @Param("statuses") List<String> statuses);

    Page<MerchantSettlementBatch> findByMerchantIdOrderByCreatedAtDesc(Long merchantId, Pageable pageable);

    // MerchantSettlementBatchRepository
    Optional<MerchantSettlementBatch> findByMerchantIdAndCycleKeyAndProductIdAndStatusIn(
            Long merchantId, String cycleKey, Long productId, List<String> statuses);

    @Modifying
    @Query("UPDATE MerchantSettlementBatch b SET b.status = :status WHERE b.id = :id")
    int updateStatusById(@Param("id") Long id, @Param("status") String status);

    Long countByStatus(String processing);

    Long countByStatusAndProcessingCompletedAtBetween(String completed, LocalDateTime startOfDay, LocalDateTime endOfDay);

}

