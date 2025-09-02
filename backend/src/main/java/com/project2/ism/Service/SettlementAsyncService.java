package com.project2.ism.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettlementAsyncService {

    private static final Logger log = LoggerFactory.getLogger(SettlementAsyncService.class);

    private final SettlementService settlementService;

    public SettlementAsyncService(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    /**
     * Run the whole batch asynchronously. Each item is an independent transaction
     * (REQUIRES_NEW inside settleOne).
     */
    @Async("settlementExecutor")
    public void processBatchAsync(Long batchId, Long merchantId, List<String> vendorTxIds) {
        try {
            settlementService.markBatchProcessing(batchId);
            for (String vendorTxId : vendorTxIds) {
                try {
                    settlementService.settleOne(merchantId, batchId, vendorTxId);
                } catch (Exception e) {
                    // Log and continue: one failure does not stop the batch
                    log.error("Failed to settle txId={} in batch={} merchant={}: {}",
                            vendorTxId, batchId, merchantId, e.getMessage(), e);
                }
            }
        } finally {
            // Always attempt to close the batch (even if some items failed)
            try {
                settlementService.markBatchClosed(batchId);
            } catch (Exception e) {
                log.error("Failed to close batch {}: {}", batchId, e.getMessage(), e);
            }
        }
    }

    /**
     * Optional: settle a single item asynchronously (rarely needed if you use processBatchAsync).
     */
    @Async("settlementExecutor")
    public void settleOneAsync(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
        try {
            settlementService.settleOne(merchantId, batchId, vendorTxPrimaryKey);
        } catch (Exception e) {
            log.error("Failed to settle single tx {} in batch {}: {}", vendorTxPrimaryKey, batchId, e.getMessage(), e);
        }
    }
}
