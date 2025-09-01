package com.project2.ism.Repository;

import com.project2.ism.Model.MerchantSettlementBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchantSettlementBatchRepository extends JpaRepository<MerchantSettlementBatch, Long> {
    List<MerchantSettlementBatch> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);
}

