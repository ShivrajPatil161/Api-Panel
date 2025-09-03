package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
import com.project2.ism.DTO.TempDTOs.FranchiseMerchantOption;
import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.FranchiseBatchMerchant;
import com.project2.ism.Model.FranchiseSettlementBatch;
import com.project2.ism.Model.MerchantSettlementBatch;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.FranchiseBatchMerchantRepository;
import com.project2.ism.Repository.FranchiseSettlementBatchRepository;
import com.project2.ism.Repository.MerchantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class FranchiseBulkSettlementService {

    private static final Logger log = LoggerFactory.getLogger(FranchiseBulkSettlementService.class);

    private final FranchiseSettlementBatchRepository franchiseBatchRepo;
    private final FranchiseBatchMerchantRepository batchMerchantRepo;
    private final EnhancedSettlementService settlementService;
    private final MerchantRepository merchantRepo;

    public FranchiseBulkSettlementService(
            FranchiseSettlementBatchRepository franchiseBatchRepo,
            FranchiseBatchMerchantRepository batchMerchantRepo,
            EnhancedSettlementService settlementService,
            MerchantRepository merchantRepo) {
        this.franchiseBatchRepo = franchiseBatchRepo;
        this.batchMerchantRepo = batchMerchantRepo;
        this.settlementService = settlementService;
        this.merchantRepo = merchantRepo;
    }

    @Transactional
    public FranchiseSettlementBatch createSelectiveFranchiseBatch(Long franchiseId, String cycleKey,
                                                                  List<Long> selectedMerchantIds, String createdBy) {

        // Validate selected merchants belong to franchise
        List<Merchant> selectedMerchants = merchantRepo.findAllById(selectedMerchantIds);
        for (Merchant merchant : selectedMerchants) {
            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
                throw new IllegalArgumentException("Merchant " + merchant.getId() + " does not belong to franchise " + franchiseId);
            }
        }

        // Create franchise batch
        FranchiseSettlementBatch batch = new FranchiseSettlementBatch(franchiseId, cycleKey, createdBy);
        batch.setTotalMerchants(selectedMerchantIds.size());
        batch.setStatus(FranchiseSettlementBatch.BatchStatus.DRAFT);
        batch = franchiseBatchRepo.save(batch);

        // Add selected merchants to batch
        for (Long merchantId : selectedMerchantIds) {
            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(batch.getId(), merchantId);
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
            batchMerchantRepo.save(batchMerchant);
        }

        return batch;
    }

    @Transactional
    public FranchiseSettlementBatch createFullFranchiseBatch(Long franchiseId, String cycleKey, String createdBy) {
        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);
        if (allMerchants.isEmpty()) {
            throw new IllegalStateException("No merchants found for franchise: " + franchiseId);
        }

        List<Long> allMerchantIds = allMerchants.stream()
                .map(Merchant::getId)
                .collect(Collectors.toList());

        return createSelectiveFranchiseBatch(franchiseId, cycleKey, allMerchantIds, createdBy);
    }

    @Transactional
    public FranchiseSettlementBatch updateMerchantSelection(Long franchiseBatchId, List<Long> newSelectedMerchantIds) {
        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId)
                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found"));

        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
            throw new IllegalStateException("Cannot modify merchant selection after batch is finalized. Current status: " + batch.getStatus());
        }

        // Validate merchants belong to franchise
        List<Merchant> merchants = merchantRepo.findAllById(newSelectedMerchantIds);
        for (Merchant merchant : merchants) {
            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(batch.getFranchiseId())) {
                throw new IllegalArgumentException("Merchant " + merchant.getId() + " does not belong to franchise " + batch.getFranchiseId());
            }
        }

        // Remove existing selections
        batchMerchantRepo.deleteByFranchiseBatchId(franchiseBatchId);

        // Add new selections
        for (Long merchantId : newSelectedMerchantIds) {
            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(franchiseBatchId, merchantId);
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
            batchMerchantRepo.save(batchMerchant);
        }

        batch.setTotalMerchants(newSelectedMerchantIds.size());
        return franchiseBatchRepo.save(batch);
    }

    public List<FranchiseMerchantOption> getAvailableMerchantsForFranchise(Long franchiseId, String cycleKey) {
        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);

        return allMerchants.stream().map(merchant -> {
            try {
                List<SettlementCandidateDTO> candidates = settlementService.listSettlementCandidatesForFranchise(
                        merchant.getId(), cycleKey);

                int validCandidates = (int) candidates.stream()
                        .filter(c -> c.getError() == null)
                        .count();

                BigDecimal totalAmount = candidates.stream()
                        .filter(c -> c.getError() == null)
                        .map(SettlementCandidateDTO::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                String contactPersonName = merchant.getContactPerson() != null ?
                        merchant.getContactPerson().getName() : "N/A";

                return new FranchiseMerchantOption(
                        merchant.getId(),
                        merchant.getBusinessName(),
                        contactPersonName,
                        validCandidates,
                        totalAmount
                );
            } catch (Exception e) {
                log.error("Error getting candidates for merchant {}", merchant.getId(), e);
                String contactPersonName = merchant.getContactPerson() != null ?
                        merchant.getContactPerson().getName() : "N/A";
                return new FranchiseMerchantOption(
                        merchant.getId(),
                        merchant.getBusinessName(),
                        contactPersonName,
                        0,
                        BigDecimal.ZERO
                );
            }
        }).collect(Collectors.toList());
    }

    @Async("franchiseSettlementExecutor")
    public void processSelectedMerchants(Long franchiseBatchId) {
        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId)
                .orElseThrow(() -> new IllegalStateException("Franchise batch not found"));

        try {
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.PROCESSING);
            batch.setProcessingStartedAt(LocalDateTime.now());
            franchiseBatchRepo.save(batch);

            List<FranchiseBatchMerchant> selectedMerchants = batchMerchantRepo
                    .findByFranchiseBatchIdAndStatus(franchiseBatchId, FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);

            if (selectedMerchants.isEmpty()) {
                throw new IllegalStateException("No merchants selected for processing");
            }

            // Process each merchant asynchronously
            List<CompletableFuture<MerchantBatchResult>> merchantFutures = selectedMerchants.stream()
                    .map(batchMerchant -> processMerchantAsync(batchMerchant, batch.getCycleKey()))
                    .collect(Collectors.toList());

            // Wait for all merchants to complete
            CompletableFuture<Void> allMerchants = CompletableFuture.allOf(
                    merchantFutures.toArray(new CompletableFuture[0]));
            allMerchants.join();

            // Collect results
            List<MerchantBatchResult> results = merchantFutures.stream()
                    .map(CompletableFuture::join)
                    .collect(Collectors.toList());

            updateFranchiseBatchResults(franchiseBatchId, results);

        } catch (Exception e) {
            log.error("Franchise batch processing failed for batch {}", franchiseBatchId, e);
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.FAILED);
            batch.setErrorMessage(e.getMessage());
            batch.setProcessingCompletedAt(LocalDateTime.now());
            franchiseBatchRepo.save(batch);
        }
    }

    @Async("merchantSettlementExecutor")
    private CompletableFuture<MerchantBatchResult> processMerchantAsync(FranchiseBatchMerchant batchMerchant, String cycleKey) {
        MerchantBatchResult result = new MerchantBatchResult(batchMerchant.getMerchantId());

        try {
            // Update merchant status to processing
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.PROCESSING);
            batchMerchant.setProcessingStartedAt(LocalDateTime.now());
            batchMerchantRepo.save(batchMerchant);

            // Create a merchant batch for tracking
            MerchantSettlementBatch merchantBatch = settlementService.createBatch(
                    batchMerchant.getMerchantId(), cycleKey, "FRANCHISE_BULK");

            // Get settlement candidates for this merchant
            List<SettlementCandidateDTO> candidates = settlementService.listSettlementCandidates(
                    batchMerchant.getMerchantId(),
                    merchantBatch.getWindowStart(),
                    merchantBatch.getWindowEnd());

            result.setTotalTransactions(candidates.size());
            BigDecimal totalFranchiseCommission = BigDecimal.ZERO;

            // Process each transaction
            for (SettlementCandidateDTO candidate : candidates) {
                if (candidate.getError() != null) {
                    result.addFailure();
                    log.warn("Candidate {} has error: {}", candidate.getTransactionReferenceId(), candidate.getError());
                    continue;
                }

                try {
                    SettlementResultDTO settlementResult = settlementService.settleOneEnhanced(
                            batchMerchant.getMerchantId(),
                            merchantBatch.getId(),
                            candidate.getTransactionReferenceId());

                    if ("OK".equals(settlementResult.getStatus())) {
                        result.addSuccess(settlementResult.getAmount(), settlementResult.getFee());
                        // Calculate franchise commission (this would be stored in the franchise transaction details)
                    } else {
                        result.addFailure();
                        log.warn("Settlement failed for transaction {}: {}",
                                candidate.getTransactionReferenceId(), settlementResult.getMessage());
                    }
                } catch (Exception e) {
                    log.error("Failed to settle transaction {} for merchant {}",
                            candidate.getTransactionReferenceId(), batchMerchant.getMerchantId(), e);
                    result.addFailure();
                }
            }

            // Close merchant batch
            settlementService.markBatchClosed(merchantBatch.getId());

            // Update merchant processing result
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED);
            batchMerchant.setProcessedCount(result.getProcessedTransactions());
            batchMerchant.setFailedCount(result.getFailedTransactions());
            batchMerchant.setTotalAmount(result.getTotalAmount());
            batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
            batchMerchantRepo.save(batchMerchant);

        } catch (Exception e) {
            log.error("Merchant processing failed for merchant {}", batchMerchant.getMerchantId(), e);
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.FAILED);
            batchMerchant.setErrorMessage(e.getMessage());
            batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
            batchMerchantRepo.save(batchMerchant);
            result.setError(e.getMessage());
        }

        return CompletableFuture.completedFuture(result);
    }

    private void updateFranchiseBatchResults(Long franchiseBatchId, List<MerchantBatchResult> results) {
        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId).orElse(null);
        if (batch == null) return;

        int completed = 0, failed = 0;
        int totalTransactions = 0, processedTransactions = 0;
        BigDecimal totalCommission = BigDecimal.ZERO;

        for (MerchantBatchResult result : results) {
            if (result.getError() == null) {
                completed++;
            } else {
                failed++;
            }
            totalTransactions += result.getTotalTransactions();
            processedTransactions += result.getProcessedTransactions();
            // totalCommission would be calculated based on franchise commission from settlements
        }

        batch.setCompletedMerchants(completed);
        batch.setFailedMerchants(failed);
        batch.setTotalTransactions(totalTransactions);
        batch.setProcessedTransactions(processedTransactions);
        batch.setTotalFranchiseCommission(totalCommission);
        batch.setProcessingCompletedAt(LocalDateTime.now());

        // Set final status
        if (failed == 0 && completed > 0) {
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.COMPLETED);
        } else if (completed > 0 && failed > 0) {
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.PARTIALLY_COMPLETED);
        } else {
            batch.setStatus(FranchiseSettlementBatch.BatchStatus.FAILED);
        }

        franchiseBatchRepo.save(batch);
    }

    @Transactional(readOnly = true)
    public FranchiseSettlementBatch getBatchById(Long batchId) {
        return franchiseBatchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
    }

    @Transactional(readOnly = true)
    public List<FranchiseSettlementBatch> getAllBatches(Long franchiseId) {
        return franchiseBatchRepo.findByFranchiseIdOrderByCreatedAtDesc(franchiseId);
    }

    /**
     * Get settlement candidates (transactions) for a specific merchant within a franchise batch
     */
    @Transactional(readOnly = false)
    public List<SettlementCandidateDTO> listSettlementCandidatesForMerchant(Long franchiseId,
                                                                            Long batchId,
                                                                            Long merchantId,
                                                                            String cycleKey) {
        // Verify batch exists and belongs to franchise
        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
        if (!batch.getFranchiseId().equals(franchiseId)) {
            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
        }

        // Verify merchant belongs to this batch
        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
//                .orElseThrow(() -> new IllegalArgumentException(
//                        "Merchant " + merchantId + " not part of franchise batch " + batchId));

        // Use EnhancedSettlementService to calculate candidates
        return settlementService.listSettlementCandidatesForFranchise(merchantId, cycleKey);
    }

    /**
     * Update candidate transactions for a specific merchant inside a franchise batch
     */
    @Transactional
    public void updateMerchantCandidates(Long franchiseId,
                                         Long batchId,
                                         Long merchantId,
                                         List<String> vendorTxIds) {
        // Verify batch exists and belongs to franchise
        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
        if (!batch.getFranchiseId().equals(franchiseId)) {
            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
        }

        // Verify merchant belongs to this batch
        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
//                .orElseThrow(() -> new IllegalArgumentException(
//                        "Merchant " + merchantId + " not part of franchise batch " + batchId));

        // Create or reuse merchant settlement batch (per merchant)
        MerchantSettlementBatch merchantBatch =
                settlementService.getOrCreateActiveBatch(merchantId, batch.getCycleKey(), "FRANCHISE_BULK");

        // Update candidates in that merchant batch
        settlementService.updateBatchCandidates(merchantBatch.getId(), vendorTxIds);

        // Link merchant batchId back into FranchiseBatchMerchant (optional, for tracking)
//        batchMerchant.setMerchantBatchId(merchantBatch.getId());
        batchMerchantRepo.save(batchMerchant);
    }

    @Transactional(readOnly = true)
    public BatchProgressDTO getBatchProgress(Long batchId) {
        FranchiseSettlementBatch batch = getBatchById(batchId);

        BatchProgressDTO progress = new BatchProgressDTO();
        progress.setBatchId(batchId);
        progress.setStatus(batch.getStatus().toString());
        progress.setTotalTransactions(batch.getTotalTransactions());
        progress.setProcessedTransactions(batch.getProcessedTransactions());
       // progress.setFailedTransactions(batch.getFailedTransactions());
        //progress.setTotalAmount(batch.getTotalAmount());
        //progress.setTotalFees(batch.getTotalFees());
        //progress.setTotalNetAmount(batch.getTotalNetAmount());
        progress.setProcessingStartedAt(batch.getProcessingStartedAt());
        progress.setProcessingCompletedAt(batch.getProcessingCompletedAt());
        progress.setErrorMessage(batch.getErrorMessage());

        if (batch.getTotalTransactions() != null && batch.getTotalTransactions() > 0) {
            //int totalProcessed = (batch.getProcessedTransactions() != null ? batch.getProcessedTransactions() : 0) +
            //        (batch.getFailedTransactions() != null ? batch.getFailedTransactions() : 0);
            //progress.setProgressPercentage((totalProcessed * 100.0) / batch.getTotalTransactions());
        } else {
            progress.setProgressPercentage(0.0);
        }

        return progress;
    }

    // Helper class for batch results
    public static class MerchantBatchResult {
        private Long merchantId;
        private int totalTransactions = 0;
        private int processedTransactions = 0;
        private int failedTransactions = 0;
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private BigDecimal totalFees = BigDecimal.ZERO;
        private String error;

        public MerchantBatchResult(Long merchantId) {
            this.merchantId = merchantId;
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
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}