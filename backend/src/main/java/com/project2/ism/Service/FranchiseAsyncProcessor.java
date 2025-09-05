//package com.project2.ism.Service;
//
//import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
//import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
//import com.project2.ism.Model.FranchiseBatchMerchant;
//import com.project2.ism.Model.FranchiseSettlementBatch;
//import com.project2.ism.Model.MerchantSettlementBatch;
//import com.project2.ism.Model.Users.Merchant;
//import com.project2.ism.Repository.FranchiseBatchMerchantRepository;
//import com.project2.ism.Repository.FranchiseSettlementBatchRepository;
//import com.project2.ism.Repository.MerchantRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Propagation;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.concurrent.CompletableFuture;
//import java.util.stream.Collectors;
//
//@Service
//public class FranchiseMerchantProcessor {
//
//    private static final Logger log = LoggerFactory.getLogger(FranchiseMerchantProcessor.class);
//
//    private final FranchiseBatchMerchantRepository batchMerchantRepo;
//    private final FranchiseSettlementBatchRepository franchiseBatchRepo;
//    private final EnhancedSettlementService settlementService;
//    private final MerchantRepository merchantRepo;
//
//    public FranchiseMerchantProcessor(
//            FranchiseBatchMerchantRepository batchMerchantRepo,
//            FranchiseSettlementBatchRepository franchiseBatchRepo,
//            EnhancedSettlementService settlementService,
//            MerchantRepository merchantRepo) {
//        this.batchMerchantRepo = batchMerchantRepo;
//        this.franchiseBatchRepo = franchiseBatchRepo;
//        this.settlementService = settlementService;
//        this.merchantRepo = merchantRepo;
//    }
//
//    /**
//     * Process a single merchant in a dedicated thread and transaction.
//     * Runs on merchantSettlementExecutor (configured in your AsyncConfig).
//     */
//    @Async("merchantSettlementExecutor")
//    @Transactional(propagation = Propagation.REQUIRES_NEW)
//    public CompletableFuture<FranchiseBulkSettlementService.MerchantBatchResult> processOne(Long batchMerchantId, String cycleKey) {
//        FranchiseBulkSettlementService.MerchantBatchResult result = null;
//
//        // Load the linking row
//        FranchiseBatchMerchant batchMerchant = batchMerchantRepo.findById(batchMerchantId)
//                .orElseThrow(() -> new IllegalStateException("Batch-merchant not found: " + batchMerchantId));
//
//        try {
//            result = new FranchiseBulkSettlementService.MerchantBatchResult(batchMerchant.getMerchantId());
//
//            // Re-validate merchant
//            Merchant merchant = merchantRepo.findById(batchMerchant.getMerchantId())
//                    .orElseThrow(() -> new IllegalStateException("Merchant not found: " + batchMerchant.getMerchantId()));
//
//            FranchiseSettlementBatch franchiseBatch = franchiseBatchRepo.findById(batchMerchant.getFranchiseBatchId())
//                    .orElseThrow(() -> new IllegalStateException("Franchise batch not found"));
//
//            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseBatch.getFranchiseId())) {
//                throw new IllegalStateException("Merchant " + merchant.getId() + " no longer belongs to franchise " + franchiseBatch.getFranchiseId());
//            }
//
//            // Mark merchant as PROCESSING
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.PROCESSING);
//            batchMerchant.setProcessingStartedAt(LocalDateTime.now());
//            batchMerchantRepo.save(batchMerchant);
//
//            // Create merchant-level batch (always new for franchise bulk)
//            MerchantSettlementBatch merchantBatch = settlementService.createBatch(batchMerchant.getMerchantId(), cycleKey, "FRANCHISE_BULK");
//
//            // Get candidates
//            List<SettlementCandidateDTO> candidates = settlementService.listSettlementCandidates(
//                    batchMerchant.getMerchantId(), merchantBatch.getWindowStart(), merchantBatch.getWindowEnd());
//
//            List<SettlementCandidateDTO> validCandidates = candidates.stream()
//                    .filter(c -> c.getError() == null)
//                    .collect(Collectors.toList());
//
//            result.setTotalTransactions(validCandidates.size());
//
//            if (validCandidates.isEmpty()) {
//                log.info("No valid candidates for merchant {} (batchMerchantId={})", batchMerchant.getMerchantId(), batchMerchantId);
//                batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED);
//                batchMerchant.setProcessedCount(0);
//                batchMerchant.setFailedCount(0);
//                batchMerchant.setTotalAmount(BigDecimal.ZERO);
//                batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//                batchMerchantRepo.save(batchMerchant);
//                settlementService.markBatchClosed(merchantBatch.getId());
//                return CompletableFuture.completedFuture(result);
//            }
//
//            // Update merchant batch candidates
//            List<String> vendorTxIds = validCandidates.stream()
//                    .map(SettlementCandidateDTO::getTransactionReferenceId)
//                    .collect(Collectors.toList());
//            settlementService.updateBatchCandidates(merchantBatch.getId(), vendorTxIds);
//
//            // Process transactions sequentially per merchant (keeps DB connections bounded)
//            BigDecimal totalFranchiseCommission = BigDecimal.ZERO;
//            for (SettlementCandidateDTO candidate : validCandidates) {
//                try {
//                    SettlementResultDTO settlementResult = settlementService.settleOneEnhanced(
//                            batchMerchant.getMerchantId(),
//                            merchantBatch.getId(),
//                            candidate.getTransactionReferenceId());
//
//                    if ("OK".equals(settlementResult.getStatus())) {
//                        result.addSuccess(settlementResult.getAmount(), settlementResult.getFee());
//                        if (candidate.getAppliedRate() != null) {
//                            BigDecimal estimatedCommission = candidate.getAmount()
//                                    .multiply(BigDecimal.valueOf(0.5))
//                                    .movePointLeft(2);
//                            totalFranchiseCommission = totalFranchiseCommission.add(estimatedCommission);
//                        }
//                    } else {
//                        result.addFailure();
//                        log.warn("Settlement failed for tx {} (merchant {}) : {}", candidate.getTransactionReferenceId(), batchMerchant.getMerchantId(), settlementResult.getMessage());
//                    }
//                } catch (Exception e) {
//                    log.error("Exception settling tx {} for merchant {}", candidate.getTransactionReferenceId(), batchMerchant.getMerchantId(), e);
//                    result.addFailure();
//                }
//            }
//
//            // Close merchant batch and persist merchant link status
//            settlementService.markBatchClosed(merchantBatch.getId());
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED);
//            batchMerchant.setProcessedCount(result.getProcessedTransactions());
//            batchMerchant.setFailedCount(result.getFailedTransactions());
//            batchMerchant.setTotalAmount(result.getTotalAmount());
//            batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//            batchMerchantRepo.save(batchMerchant);
//            result.setFranchiseCommission(totalFranchiseCommission);
//
//            return CompletableFuture.completedFuture(result);
//        } catch (Exception e) {
//            log.error("Merchant processing failed for batchMerchantId={} merchantId={}", batchMerchantId, batchMerchant.getMerchantId(), e);
//            // Mark failed (in the same REQUIRES_NEW tx so this save is committed even if coordinator fails)
//            try {
//                batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.FAILED);
//                batchMerchant.setErrorMessage(e.getMessage());
//                batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//                batchMerchantRepo.save(batchMerchant);
//            } catch (Exception ex) {
//                log.error("Failed to persist failure state for batchMerchantId={}", batchMerchantId, ex);
//            }
//            if (result == null) result = new FranchiseBulkSettlementService.MerchantBatchResult(batchMerchant.getMerchantId());
//            result.setError(e.getMessage());
//            return CompletableFuture.completedFuture(result);
//        }
//    }
//}







package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Separate async processor for franchise bulk settlements to avoid proxy issues.
 * Handles multi-threaded processing of merchant settlements within franchise batches.
 */
@Service
public class FranchiseAsyncProcessor {

    private static final Logger log = LoggerFactory.getLogger(FranchiseAsyncProcessor.class);

    private final FranchiseSettlementBatchRepository franchiseBatchRepo;
    private final FranchiseBatchMerchantRepository batchMerchantRepo;
    private final EnhancedSettlementService2 settlementService;
    private final MerchantRepository merchantRepo;

    public FranchiseAsyncProcessor(FranchiseSettlementBatchRepository franchiseBatchRepo,
                                   FranchiseBatchMerchantRepository batchMerchantRepo,
                                   EnhancedSettlementService2 settlementService,
                                   MerchantRepository merchantRepo) {
        this.franchiseBatchRepo = franchiseBatchRepo;
        this.batchMerchantRepo = batchMerchantRepo;
        this.settlementService = settlementService;
        this.merchantRepo = merchantRepo;
    }

    /**
     * Process franchise batch with custom merchant-specific transactions
     * This is the NEW preferred approach
     */
    @Async("franchiseSettlementExecutor")
    public void processWithCustomTransactions(Long franchiseBatchId, Map<Long, List<String>> merchantTransactionsMap) {
        log.info("Starting franchise batch {} processing with custom transactions for {} merchants",
                franchiseBatchId, merchantTransactionsMap.size());

        try {
            FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);

            // Validate all merchants in the map belong to this batch and franchise
            validateMerchantsInBatch(batch, merchantTransactionsMap.keySet());

            // Launch parallel processing for each merchant
            List<CompletableFuture<MerchantBatchResult>> futures = merchantTransactionsMap.entrySet().stream()
                    .map(entry -> {
                        Long merchantId = entry.getKey();
                        List<String> transactionIds = entry.getValue();
                        return processOneMerchantWithTransactions(franchiseBatchId, merchantId, transactionIds);
                    })
                    .collect(Collectors.toList());

            // Wait for all merchant processing to complete
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            // Collect all results
            List<MerchantBatchResult> results = futures.stream()
                    .map(future -> {
                        try {
                            return future.get();
                        } catch (Exception e) {
                            log.error("Error getting merchant processing result", e);
                            return MerchantBatchResult.failed("Future failed: " + e.getMessage());
                        }
                    })
                    .collect(Collectors.toList());

            // Update franchise batch with aggregated results
            updateFranchiseBatchResults(franchiseBatchId, results);

            log.info("Completed franchise batch {} processing", franchiseBatchId);

        } catch (Exception e) {
            log.error("Franchise batch processing failed for batch {}", franchiseBatchId, e);
            updateBatchStatusToFailed(franchiseBatchId, e.getMessage());
        }
    }

    /**
     * Process franchise batch with all available transactions (OLD approach - kept for compatibility)
     */
    @Async("franchiseSettlementExecutor")
    public void processAllAvailableTransactions(Long franchiseBatchId) {
        log.info("Starting franchise batch {} processing with all available transactions", franchiseBatchId);

        try {
            FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);

            // Get all selected merchants
            List<FranchiseBatchMerchant> selectedMerchants = batchMerchantRepo
                    .findByFranchiseBatchIdAndStatus(franchiseBatchId, FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);

            if (selectedMerchants.isEmpty()) {
                throw new IllegalStateException("No merchants selected for processing");
            }

            // Launch parallel processing for each merchant (with all their transactions)
            List<CompletableFuture<MerchantBatchResult>> futures = selectedMerchants.stream()
                    .map(bm -> processOneMerchantAllTransactions(franchiseBatchId, bm.getMerchantId(), batch.getCycleKey(), batch.getProductId()))
                    .collect(Collectors.toList());

            // Wait for all merchant processing to complete
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            // Collect all results
            List<MerchantBatchResult> results = futures.stream()
                    .map(future -> {
                        try {
                            return future.get();
                        } catch (Exception e) {
                            log.error("Error getting merchant processing result", e);
                            return MerchantBatchResult.failed("Future failed: " + e.getMessage());
                        }
                    })
                    .collect(Collectors.toList());

            // Update franchise batch with aggregated results
            updateFranchiseBatchResults(franchiseBatchId, results);

            log.info("Completed franchise batch {} processing", franchiseBatchId);

        } catch (Exception e) {
            log.error("Franchise batch processing failed for batch {}", franchiseBatchId, e);
            updateBatchStatusToFailed(franchiseBatchId, e.getMessage());
        }
    }

    /**
     * Process one merchant with specific transactions in separate thread and transaction
     */
    @Async("merchantSettlementExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public CompletableFuture<MerchantBatchResult> processOneMerchantWithTransactions(Long franchiseBatchId,
                                                                                     Long merchantId,
                                                                                     List<String> transactionIds) {
        log.debug("Processing merchant {} with {} custom transactions for franchise batch {}",
                merchantId, transactionIds.size(), franchiseBatchId);

        MerchantBatchResult result = new MerchantBatchResult(merchantId);

        try {
            // Get batch merchant record
            FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                    .findByFranchiseBatchIdAndMerchantId(franchiseBatchId, merchantId);
            if (batchMerchant == null) {
                throw new IllegalStateException("Merchant " + merchantId + " not found in batch " + franchiseBatchId);
            }

            // Update merchant status to PROCESSING
            updateMerchantStatus(batchMerchant, FranchiseBatchMerchant.MerchantProcessingStatus.PROCESSING,
                    LocalDateTime.now(), null, null);

            // Validate merchant still belongs to franchise
            validateMerchantInFranchise(franchiseBatchId, merchantId);

            // Get franchise batch info
            FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);

            // Create merchant-level settlement batch for tracking
            MerchantSettlementBatch merchantBatch = settlementService.createBatch(
                    merchantId, batch.getProductId(), batch.getCycleKey(), "FRANCHISE_BULK");

            result.setTotalTransactions(transactionIds.size());

            if (transactionIds.isEmpty()) {
                log.info("No transactions provided for merchant {}", merchantId);
                updateMerchantStatus(batchMerchant, FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED,
                        null, LocalDateTime.now(), null);
                settlementService.markBatchClosed(merchantBatch.getId());
                return CompletableFuture.completedFuture(result);
            }

            // Process each transaction
            for (String transactionId : transactionIds) {
                try {
                    SettlementResultDTO settlementResult = settlementService.settleOneEnhanced(
                            merchantId, merchantBatch.getId(), transactionId);

                    if ("OK".equals(settlementResult.getStatus())) {
                        result.addSuccess(settlementResult.getAmount(), settlementResult.getFee());
                        log.debug("Successfully settled transaction {} for merchant {}", transactionId, merchantId);
                    } else {
                        result.addFailure();
                        log.warn("Failed to settle transaction {} for merchant {}: {}",
                                transactionId, merchantId, settlementResult.getMessage());
                    }

                } catch (Exception e) {
                    log.error("Exception settling transaction {} for merchant {}", transactionId, merchantId, e);
                    result.addFailure();
                }
            }

            // Close merchant batch and update status
            settlementService.markBatchClosed(merchantBatch.getId());
            updateMerchantStatus(batchMerchant, FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED,
                    null, LocalDateTime.now(), null);

            log.info("Completed processing merchant {} for franchise batch {}: {} succeeded, {} failed",
                    merchantId, franchiseBatchId, result.getProcessedTransactions(), result.getFailedTransactions());

        } catch (Exception e) {
            log.error("Merchant processing failed for merchant {} in franchise batch {}", merchantId, franchiseBatchId, e);
            result.setError(e.getMessage());

            // Update merchant status to FAILED
            try {
                FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                        .findByFranchiseBatchIdAndMerchantId(franchiseBatchId, merchantId);
                if (batchMerchant != null) {
                    updateMerchantStatus(batchMerchant, FranchiseBatchMerchant.MerchantProcessingStatus.FAILED,
                            null, LocalDateTime.now(), e.getMessage());
                }
            } catch (Exception ex) {
                log.error("Failed to update merchant status to FAILED", ex);
            }
        }

        return CompletableFuture.completedFuture(result);
    }

    /**
     * Process one merchant with all available transactions (for backward compatibility)
     */
    @Async("merchantSettlementExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public CompletableFuture<MerchantBatchResult> processOneMerchantAllTransactions(Long franchiseBatchId,
                                                                                    Long merchantId,
                                                                                    String cycleKey,
                                                                                    Long productId) {
        log.debug("Processing merchant {} with all transactions for franchise batch {}", merchantId, franchiseBatchId);

        try {
            // Get all available transactions for this merchant
            List<SettlementCandidateDTO> candidates = settlementService
                    .listSettlementCandidatesForCycle(merchantId, cycleKey, productId);

            List<String> transactionIds = candidates.stream()
                    .filter(c -> c.getError() == null)
                    .map(SettlementCandidateDTO::getTransactionReferenceId)
                    .collect(Collectors.toList());

            // Delegate to the transaction-specific method
            return processOneMerchantWithTransactions(franchiseBatchId, merchantId, transactionIds);

        } catch (Exception e) {
            log.error("Failed to get transactions for merchant {} in franchise batch {}", merchantId, franchiseBatchId, e);
            MerchantBatchResult result = new MerchantBatchResult(merchantId);
            result.setError(e.getMessage());
            return CompletableFuture.completedFuture(result);
        }
    }

    // ==================== HELPER METHODS ====================

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateFranchiseBatchResults(Long franchiseBatchId, List<MerchantBatchResult> results) {
        try {
            FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);

            int completed = 0, failed = 0;
            int totalTransactions = 0, processedTransactions = 0, failedTransactions = 0;
            BigDecimal totalAmount = BigDecimal.ZERO, totalFees = BigDecimal.ZERO;
            BigDecimal totalFranchiseCommission = BigDecimal.ZERO;

            for (MerchantBatchResult result : results) {
                if (result.getError() == null) {
                    completed++;
                } else {
                    failed++;
                }

                totalTransactions += result.getTotalTransactions();
                processedTransactions += result.getProcessedTransactions();
                failedTransactions += result.getFailedTransactions();
                totalAmount = totalAmount.add(result.getTotalAmount());
                totalFees = totalFees.add(result.getTotalFees());

                if (result.getFranchiseCommission() != null) {
                    totalFranchiseCommission = totalFranchiseCommission.add(result.getFranchiseCommission());
                }
            }

            // Update batch totals
            batch.setCompletedMerchants(completed);
            batch.setFailedMerchants(failed);
            batch.setTotalTransactions(totalTransactions);
            batch.setProcessedTransactions(processedTransactions);
            batch.setFailedTransactions(failedTransactions);
            batch.setTotalAmount(totalAmount);
            batch.setTotalFees(totalFees);
            batch.setTotalFranchiseCommission(totalFranchiseCommission);
            batch.setProcessingCompletedAt(LocalDateTime.now());

            // Set final status
            FranchiseSettlementBatch.BatchStatus finalStatus;
            if (failed == 0 && completed > 0) {
                finalStatus = FranchiseSettlementBatch.BatchStatus.COMPLETED;
            } else if (completed > 0 && failed > 0) {
                finalStatus = FranchiseSettlementBatch.BatchStatus.PARTIALLY_COMPLETED;
            } else {
                finalStatus = FranchiseSettlementBatch.BatchStatus.FAILED;
                batch.setErrorMessage("All merchant processing failed");
            }

            batch.setStatus(finalStatus);
            franchiseBatchRepo.save(batch);

            log.info("Updated franchise batch {} results: status={}, completed={}, failed={}, totalTx={}",
                    franchiseBatchId, finalStatus, completed, failed, totalTransactions);

        } catch (Exception e) {
            log.error("Failed to update franchise batch {} results", franchiseBatchId, e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateBatchStatusToFailed(Long franchiseBatchId, String errorMessage) {
        try {
            FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.FAILED);
            batch.setErrorMessage(errorMessage);
            batch.setProcessingCompletedAt(LocalDateTime.now());
            franchiseBatchRepo.save(batch);

            log.info("Updated franchise batch {} status to FAILED: {}", franchiseBatchId, errorMessage);

        } catch (Exception e) {
            log.error("Failed to update franchise batch {} status to FAILED", franchiseBatchId, e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateMerchantStatus(FranchiseBatchMerchant batchMerchant,
                                     FranchiseBatchMerchant.MerchantProcessingStatus status,
                                     LocalDateTime processingStarted,
                                     LocalDateTime processingCompleted,
                                     String errorMessage) {
        try {
            batchMerchant.setStatus(status);
            if (processingStarted != null) {
                batchMerchant.setProcessingStartedAt(processingStarted);
            }
            if (processingCompleted != null) {
                batchMerchant.setProcessingCompletedAt(processingCompleted);
            }
            if (errorMessage != null) {
                batchMerchant.setErrorMessage(errorMessage);
            }

            batchMerchantRepo.save(batchMerchant);

            log.debug("Updated batch merchant {} status to {}", batchMerchant.getId(), status);

        } catch (Exception e) {
            log.error("Failed to update batch merchant {} status to {}", batchMerchant.getId(), status, e);
        }
    }

    // ==================== VALIDATION METHODS ====================

    private FranchiseSettlementBatch getFranchiseBatch(Long batchId) {
        return franchiseBatchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Franchise batch not found: " + batchId));
    }

    private void validateMerchantsInBatch(FranchiseSettlementBatch batch, Set<Long> merchantIds) {
        List<FranchiseBatchMerchant> batchMerchants = batchMerchantRepo.findByFranchiseBatchId(batch.getId());
        Set<Long> validMerchantIds = batchMerchants.stream()
                .map(FranchiseBatchMerchant::getMerchantId)
                .collect(Collectors.toSet());

        Set<Long> invalidMerchants = merchantIds.stream()
                .filter(id -> !validMerchantIds.contains(id))
                .collect(Collectors.toSet());

        if (!invalidMerchants.isEmpty()) {
            throw new IllegalArgumentException("Merchants not in batch " + batch.getId() + ": " + invalidMerchants);
        }
    }

    private void validateMerchantInFranchise(Long franchiseBatchId, Long merchantId) {
        FranchiseSettlementBatch batch = getFranchiseBatch(franchiseBatchId);

        Merchant merchant = merchantRepo.findById(merchantId)
                .orElseThrow(() -> new IllegalStateException("Merchant not found: " + merchantId));

        if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(batch.getFranchiseId())) {
            throw new IllegalStateException("Merchant " + merchantId +
                    " does not belong to franchise " + batch.getFranchiseId());
        }
    }

    // ==================== RESULT CLASS ====================

    public static class MerchantBatchResult {
        private Long merchantId;
        private int totalTransactions = 0;
        private int processedTransactions = 0;
        private int failedTransactions = 0;
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private BigDecimal totalFees = BigDecimal.ZERO;
        private BigDecimal franchiseCommission = BigDecimal.ZERO;
        private String error;

        public MerchantBatchResult(Long merchantId) {
            this.merchantId = merchantId;
        }

        public static MerchantBatchResult failed(String error) {
            MerchantBatchResult result = new MerchantBatchResult(null);
            result.setError(error);
            return result;
        }

        public void addSuccess(BigDecimal amount, BigDecimal fee) {
            processedTransactions++;
            totalAmount = totalAmount.add(amount);
            totalFees = totalFees.add(fee);
        }

        public void addFailure() {
            failedTransactions++;
        }

        // Getters and setters
        public Long getMerchantId() { return merchantId; }
        public void setMerchantId(Long merchantId) { this.merchantId = merchantId; }

        public int getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }

        public int getProcessedTransactions() { return processedTransactions; }
        public void setProcessedTransactions(int processedTransactions) { this.processedTransactions = processedTransactions; }

        public int getFailedTransactions() { return failedTransactions; }
        public void setFailedTransactions(int failedTransactions) { this.failedTransactions = failedTransactions; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public BigDecimal getTotalFees() { return totalFees; }
        public void setTotalFees(BigDecimal totalFees) { this.totalFees = totalFees; }

        public BigDecimal getFranchiseCommission() { return franchiseCommission; }
        public void setFranchiseCommission(BigDecimal franchiseCommission) { this.franchiseCommission = franchiseCommission; }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}