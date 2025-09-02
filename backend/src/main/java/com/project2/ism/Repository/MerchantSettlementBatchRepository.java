package com.project2.ism.Repository;

import com.project2.ism.Model.MerchantSettlementBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MerchantSettlementBatchRepository extends JpaRepository<MerchantSettlementBatch, Long> {
    List<MerchantSettlementBatch> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);

    List<MerchantSettlementBatch> findAllById(Long merchantId);

    Optional<MerchantSettlementBatch> findTopByMerchantIdAndStatusOrderByWindowEndDesc(Long merchantId, String status);

    List<MerchantSettlementBatch> findByMerchantId(Long merchantId);

}

