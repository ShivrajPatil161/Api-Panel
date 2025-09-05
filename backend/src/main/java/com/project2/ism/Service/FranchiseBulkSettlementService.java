//package com.project2.ism.Service;
//
//import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
//import com.project2.ism.DTO.TempDTOs.FranchiseMerchantOption;
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
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.concurrent.CompletableFuture;
//import java.util.stream.Collectors;
//
//@Service
//public class FranchiseBulkSettlementService {
//
//    private static final Logger log = LoggerFactory.getLogger(FranchiseBulkSettlementService.class);
//
//    private final FranchiseSettlementBatchRepository franchiseBatchRepo;
//    private final FranchiseBatchMerchantRepository batchMerchantRepo;
//    private final EnhancedSettlementService settlementService;
//    private final MerchantRepository merchantRepo;
//
//    private final FranchiseMerchantProcessor franchiseMerchantProcessor;
//
//    public FranchiseBulkSettlementService(
//            FranchiseSettlementBatchRepository franchiseBatchRepo,
//            FranchiseBatchMerchantRepository batchMerchantRepo,
//            EnhancedSettlementService settlementService,
//            MerchantRepository merchantRepo, FranchiseMerchantProcessor franchiseMerchantProcessor) {
//        this.franchiseBatchRepo = franchiseBatchRepo;
//        this.batchMerchantRepo = batchMerchantRepo;
//        this.settlementService = settlementService;
//        this.merchantRepo = merchantRepo;
//        this.franchiseMerchantProcessor = franchiseMerchantProcessor;
//    }
//
//    @Transactional
//    public FranchiseSettlementBatch createSelectiveFranchiseBatch(Long franchiseId, String cycleKey,
//                                                                  List<Long> selectedMerchantIds, String createdBy) {
//
//        // Validate selected merchants belong to franchise
//        List<Merchant> selectedMerchants = merchantRepo.findAllById(selectedMerchantIds);
//        for (Merchant merchant : selectedMerchants) {
//            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
//                throw new IllegalArgumentException("Merchant " + merchant.getId() + " does not belong to franchise " + franchiseId);
//            }
//        }
//
//        // Validate all merchants were found
//        if (selectedMerchants.size() != selectedMerchantIds.size()) {
//            throw new IllegalArgumentException("Some merchants in the selection were not found");
//        }
//
//        // Create franchise batch
//        FranchiseSettlementBatch batch = new FranchiseSettlementBatch(franchiseId, cycleKey, createdBy);
//        batch.setTotalMerchants(selectedMerchantIds.size());
//        batch.setStatus(FranchiseSettlementBatch.BatchStatus.DRAFT);
//        batch = franchiseBatchRepo.save(batch);
//
//        // Add selected merchants to batch
//        for (Long merchantId : selectedMerchantIds) {
//            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(batch.getId(), merchantId);
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
//            batchMerchantRepo.save(batchMerchant);
//        }
//
//        return batch;
//    }
//
//    @Transactional
//    public FranchiseSettlementBatch createFullFranchiseBatch(Long franchiseId, String cycleKey, String createdBy) {
//        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);
//        if (allMerchants.isEmpty()) {
//            throw new IllegalStateException("No merchants found for franchise: " + franchiseId);
//        }
//
//        List<Long> allMerchantIds = allMerchants.stream()
//                .map(Merchant::getId)
//                .collect(Collectors.toList());
//
//        return createSelectiveFranchiseBatch(franchiseId, cycleKey, allMerchantIds, createdBy);
//    }
//
//    @Transactional
//    public FranchiseSettlementBatch updateMerchantSelection(Long franchiseBatchId, List<Long> newSelectedMerchantIds) {
//        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId)
//                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found"));
//
//        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
//            throw new IllegalStateException("Cannot modify merchant selection after batch is finalized. Current status: " + batch.getStatus());
//        }
//
//        // Validate merchants belong to franchise
//        List<Merchant> merchants = merchantRepo.findAllById(newSelectedMerchantIds);
//        for (Merchant merchant : merchants) {
//            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(batch.getFranchiseId())) {
//                throw new IllegalArgumentException("Merchant " + merchant.getId() + " does not belong to franchise " + batch.getFranchiseId());
//            }
//        }
//
//        // Validate all merchants were found
//        if (merchants.size() != newSelectedMerchantIds.size()) {
//            throw new IllegalArgumentException("Some merchants in the selection were not found");
//        }
//
//        // Remove existing selections
//        batchMerchantRepo.deleteByFranchiseBatchId(franchiseBatchId);
//
//        // Add new selections
//        for (Long merchantId : newSelectedMerchantIds) {
//            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(franchiseBatchId, merchantId);
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
//            batchMerchantRepo.save(batchMerchant);
//        }
//
//        batch.setTotalMerchants(newSelectedMerchantIds.size());
//        return franchiseBatchRepo.save(batch);
//    }
//
//    public List<FranchiseMerchantOption> getAvailableMerchantsForFranchise(Long franchiseId, String cycleKey) {
//        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);
//
//        return allMerchants.stream().map(merchant -> {
//            try {
//                // Validate merchant still belongs to franchise
//                if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
//                    log.warn("Merchant {} no longer belongs to franchise {}", merchant.getId(), franchiseId);
//                    String contactPersonName = merchant.getContactPerson() != null ?
//                            merchant.getContactPerson().getName() : "N/A";
//                    return new FranchiseMerchantOption(
//                            merchant.getId(),
//                            merchant.getBusinessName(),
//                            contactPersonName,
//                            0,
//                            BigDecimal.ZERO
//                    );
//                }
//
//                List<SettlementCandidateDTO> candidates = settlementService.listSettlementCandidatesForFranchise(
//                        merchant.getId(), cycleKey);
//
//                int validCandidates = (int) candidates.stream()
//                        .filter(c -> c.getError() == null)
//                        .count();
//
//                BigDecimal totalAmount = candidates.stream()
//                        .filter(c -> c.getError() == null)
//                        .map(SettlementCandidateDTO::getAmount)
//                        .reduce(BigDecimal.ZERO, BigDecimal::add);
//
//                String contactPersonName = merchant.getContactPerson() != null ?
//                        merchant.getContactPerson().getName() : "N/A";
//
//                return new FranchiseMerchantOption(
//                        merchant.getId(),
//                        merchant.getBusinessName(),
//                        contactPersonName,
//                        validCandidates,
//                        totalAmount
//                );
//            } catch (Exception e) {
//                log.error("Error getting candidates for merchant {}", merchant.getId(), e);
//                String contactPersonName = merchant.getContactPerson() != null ?
//                        merchant.getContactPerson().getName() : "N/A";
//                return new FranchiseMerchantOption(
//                        merchant.getId(),
//                        merchant.getBusinessName(),
//                        contactPersonName,
//                        0,
//                        BigDecimal.ZERO
//                );
//            }
//        }).collect(Collectors.toList());
//    }
//
//    @Async("franchiseSettlementExecutor")
//    public void processSelectedMerchants(Long franchiseBatchId) {
//        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId)
//                .orElseThrow(() -> new IllegalStateException("Franchise batch not found"));
//
//        try {
//            batch.setStatus(FranchiseSettlementBatch.BatchStatus.PROCESSING);
//            batch.setProcessingStartedAt(LocalDateTime.now());
//            franchiseBatchRepo.save(batch);
//
//            List<FranchiseBatchMerchant> selectedMerchants = batchMerchantRepo
//                    .findByFranchiseBatchIdAndStatus(franchiseBatchId, FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
//
//            if (selectedMerchants.isEmpty()) {
//                throw new IllegalStateException("No merchants selected for processing");
//            }
//
//            // Launch per-merchant tasks in parallel via the dedicated processor bean
//            List<CompletableFuture<MerchantBatchResult>> futures = selectedMerchants.stream()
//                    .map(bm -> franchiseMerchantProcessor.processOne(bm.getId(), batch.getCycleKey()))
//                    .collect(Collectors.toList());
//
//            // Wait for all to complete (will block this franchise executor thread while waiting)
//            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
//
//            // Collect results (safely)
//            List<MerchantBatchResult> results = futures.stream()
//                    .map(f -> {
//                        try {
//                            return f.get(); // should be immediate after allOf().join()
//                        } catch (Exception e) {
//                            MerchantBatchResult r = new MerchantBatchResult(null);
//                            r.setError("Future failed: " + e.getMessage());
//                            return r;
//                        }
//                    }).collect(Collectors.toList());
//
//            // Aggregate and persist summary
//            updateFranchiseBatchResults(franchiseBatchId, results);
//
//        } catch (Exception e) {
//            log.error("Franchise batch processing failed for batch {}", franchiseBatchId, e);
//            batch.setStatus(FranchiseSettlementBatch.BatchStatus.FAILED);
//            batch.setErrorMessage(e.getMessage());
//            batch.setProcessingCompletedAt(LocalDateTime.now());
//            franchiseBatchRepo.save(batch);
//        }
//    }
//
//
//    // @Transactional(propagation = REQUIRES_NEW) -- required
//    private MerchantBatchResult processMerchantSync(FranchiseBatchMerchant batchMerchant, String cycleKey) {
//        MerchantBatchResult result = new MerchantBatchResult(batchMerchant.getMerchantId());
//
//        try {
//            // Validate merchant still belongs to franchise
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
//            // Update merchant status to processing
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.PROCESSING);
//            batchMerchant.setProcessingStartedAt(LocalDateTime.now());
//            batchMerchantRepo.save(batchMerchant);
//
//            // Create a merchant batch for tracking (always new for franchise processing)
//            MerchantSettlementBatch merchantBatch = settlementService.createBatch(
//                    batchMerchant.getMerchantId(), cycleKey, "FRANCHISE_BULK");
//
//            // Get settlement candidates for this merchant
//            List<SettlementCandidateDTO> candidates = settlementService.listSettlementCandidates(
//                    batchMerchant.getMerchantId(),
//                    merchantBatch.getWindowStart(),
//                    merchantBatch.getWindowEnd());
//
//            List<SettlementCandidateDTO> validCandidates = candidates.stream()
//                    .filter(c -> c.getError() == null)
//                    .collect(Collectors.toList());
//
//            result.setTotalTransactions(validCandidates.size());
//
//            if (validCandidates.isEmpty()) {
//                log.info("No valid candidates found for merchant {}", batchMerchant.getMerchantId());
//                batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED);
//                batchMerchant.setProcessedCount(0);
//                batchMerchant.setFailedCount(0);
//                batchMerchant.setTotalAmount(BigDecimal.ZERO);
//                batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//                batchMerchantRepo.save(batchMerchant);
//                settlementService.markBatchClosed(merchantBatch.getId());
//                return result;
//            }
//
//            // Update merchant batch with valid candidates
//            List<String> vendorTxIds = validCandidates.stream()
//                    .map(SettlementCandidateDTO::getTransactionReferenceId)
//                    .collect(Collectors.toList());
//
//            settlementService.updateBatchCandidates(merchantBatch.getId(), vendorTxIds);
//
//            // Process each transaction
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
//
//                        // Calculate franchise commission for tracking
//                        // This would be the difference between merchantRate and franchiseRate
//                        if (candidate.getAppliedRate() != null) {
//                            // Note: This is an approximation since we don't have direct access to franchise rate here
//                            // The actual commission is properly calculated and stored in the settlement process
//                            BigDecimal estimatedCommission = candidate.getAmount()
//                                    .multiply(BigDecimal.valueOf(0.5)) // Rough estimate - adjust based on your business logic
//                                    .movePointLeft(2);
//                            totalFranchiseCommission = totalFranchiseCommission.add(estimatedCommission);
//                        }
//                    } else {
//                        result.addFailure();
//                        log.warn("Settlement failed for transaction {}: {}",
//                                candidate.getTransactionReferenceId(), settlementResult.getMessage());
//                    }
//                } catch (Exception e) {
//                    log.error("Failed to settle transaction {} for merchant {}",
//                            candidate.getTransactionReferenceId(), batchMerchant.getMerchantId(), e);
//                    result.addFailure();
//                }
//            }
//
//            // Close merchant batch
//            settlementService.markBatchClosed(merchantBatch.getId());
//
//            // Update merchant processing result
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.COMPLETED);
//            batchMerchant.setProcessedCount(result.getProcessedTransactions());
//            batchMerchant.setFailedCount(result.getFailedTransactions());
//            batchMerchant.setTotalAmount(result.getTotalAmount());
//            batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//            batchMerchantRepo.save(batchMerchant);
//
//            result.setFranchiseCommission(totalFranchiseCommission);
//
//        } catch (Exception e) {
//            log.error("Merchant processing failed for merchant {}", batchMerchant.getMerchantId(), e);
//            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.FAILED);
//            batchMerchant.setErrorMessage(e.getMessage());
//            batchMerchant.setProcessingCompletedAt(LocalDateTime.now());
//            batchMerchantRepo.save(batchMerchant);
//            result.setError(e.getMessage());
//        }
//
//        return result;
//    }
//
//    private void updateFranchiseBatchResults(Long franchiseBatchId, List<MerchantBatchResult> results) {
//        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(franchiseBatchId).orElse(null);
//        if (batch == null) return;
//
//        int completed = 0, failed = 0;
//        int totalTransactions = 0, processedTransactions = 0, failedTransactions = 0;
//        BigDecimal totalCommission = BigDecimal.ZERO;
//
//        for (MerchantBatchResult result : results) {
//            if (result.getError() == null) {
//                completed++;
//            } else {
//                failed++;
//            }
//            totalTransactions += result.getTotalTransactions();
//            processedTransactions += result.getProcessedTransactions();
//            failedTransactions += result.getFailedTransactions();
//            if (result.getFranchiseCommission() != null) {
//                totalCommission = totalCommission.add(result.getFranchiseCommission());
//            }
//        }
//
//        batch.setCompletedMerchants(completed);
//        batch.setFailedMerchants(failed);
//        batch.setTotalTransactions(totalTransactions);
//        batch.setProcessedTransactions(processedTransactions);
//        //batch.setFailedTransactions(failedTransactions);
//        batch.setTotalFranchiseCommission(totalCommission);
//        batch.setProcessingCompletedAt(LocalDateTime.now());
//
//        // Set final status
//        if (failed == 0 && completed > 0) {
//            batch.setStatus(FranchiseSettlementBatch.BatchStatus.COMPLETED);
//        } else if (completed > 0 && failed > 0) {
//            batch.setStatus(FranchiseSettlementBatch.BatchStatus.PARTIALLY_COMPLETED);
//        } else {
//            batch.setStatus(FranchiseSettlementBatch.BatchStatus.FAILED);
//        }
//
//        franchiseBatchRepo.save(batch);
//    }
//
//    @Transactional(readOnly = true)
//    public FranchiseSettlementBatch getBatchById(Long batchId) {
//        return franchiseBatchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
//    }
//
//    @Transactional(readOnly = true)
//    public List<FranchiseSettlementBatch> getAllBatches(Long franchiseId) {
//        return franchiseBatchRepo.findByFranchiseIdOrderByCreatedAtDesc(franchiseId);
//    }
//
//    /**
//     * Get settlement candidates (transactions) for a specific merchant within a franchise batch
//     */
//    @Transactional(readOnly = false)
//    public List<SettlementCandidateDTO> listSettlementCandidatesForMerchant(Long franchiseId,
//                                                                            Long batchId,
//                                                                            Long merchantId,
//                                                                            String cycleKey) {
//        // Verify batch exists and belongs to franchise
//        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
//        if (!batch.getFranchiseId().equals(franchiseId)) {
//            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
//        }
//
//        // Verify merchant belongs to this batch
//        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
//                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
//        if (batchMerchant == null) {
//            throw new IllegalArgumentException("Merchant " + merchantId + " not part of franchise batch " + batchId);
//        }
//
//        // Verify merchant still belongs to the franchise
//        Merchant merchant = merchantRepo.findById(merchantId)
//                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));
//        if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
//            throw new IllegalArgumentException("Merchant " + merchantId + " does not belong to franchise " + franchiseId);
//        }
//
//        // Use EnhancedSettlementService to calculate candidates
//        return settlementService.listSettlementCandidatesForFranchise(merchantId, cycleKey);
//    }
//
//    /**
//     * Update candidate transactions for a specific merchant inside a franchise batch
//     */
//    @Transactional
//    public void updateMerchantCandidates(Long franchiseId,
//                                         Long batchId,
//                                         Long merchantId,
//                                         List<String> vendorTxIds) {
//        // Verify batch exists and belongs to franchise
//        FranchiseSettlementBatch batch = franchiseBatchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
//        if (!batch.getFranchiseId().equals(franchiseId)) {
//            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
//        }
//
//        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
//            throw new IllegalStateException("Cannot modify candidates after batch is finalized. Current status: " + batch.getStatus());
//        }
//
//        // Verify merchant belongs to this batch
//        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
//                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
//        if (batchMerchant == null) {
//            throw new IllegalArgumentException("Merchant " + merchantId + " not part of franchise batch " + batchId);
//        }
//
//        // Verify merchant still belongs to the franchise
//        Merchant merchant = merchantRepo.findById(merchantId)
//                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));
//        if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
//            throw new IllegalArgumentException("Merchant " + merchantId + " does not belong to franchise " + franchiseId);
//        }
//
//        // Create or reuse merchant settlement batch (per merchant)
//        MerchantSettlementBatch merchantBatch =
//                settlementService.getOrCreateActiveBatch(merchantId, batch.getCycleKey(), "FRANCHISE_BULK");
//
//        // Update candidates in that merchant batch
//        settlementService.updateBatchCandidates(merchantBatch.getId(), vendorTxIds);
//
//        // Link merchant batchId back into FranchiseBatchMerchant (optional, for tracking)
//        // batchMerchant.setMerchantBatchId(merchantBatch.getId());
//        batchMerchantRepo.save(batchMerchant);
//    }
//
//    @Transactional(readOnly = true)
//    public BatchProgressDTO getBatchProgress(Long batchId) {
//        FranchiseSettlementBatch batch = getBatchById(batchId);
//
//        BatchProgressDTO progress = new BatchProgressDTO();
//        progress.setBatchId(batchId);
//        progress.setStatus(batch.getStatus().toString());
//        progress.setTotalTransactions(batch.getTotalTransactions());
//        progress.setProcessedTransactions(batch.getProcessedTransactions());
//       // progress.setFailedTransactions(batch.getFailedTransactions());
//        // Note: FranchiseSettlementBatch doesn't have totalAmount/totalFees fields
//        // You may need to add them or calculate them from merchant batches
//        progress.setProcessingStartedAt(batch.getProcessingStartedAt());
//        progress.setProcessingCompletedAt(batch.getProcessingCompletedAt());
//        progress.setErrorMessage(batch.getErrorMessage());
//
//        if (batch.getTotalTransactions() != null && batch.getTotalTransactions() > 0) {
//            int totalProcessed = (batch.getProcessedTransactions() != null ? batch.getProcessedTransactions() : 0); //+
//                   // (batch.getFailedTransactions() != null ? batch.getFailedTransactions() : 0);
//            progress.setProgressPercentage((totalProcessed * 100.0) / batch.getTotalTransactions());
//        } else {
//            progress.setProgressPercentage(0.0);
//        }
//
//        return progress;
//    }
//
//    // Helper class for batch results
//    public static class MerchantBatchResult {
//        private Long merchantId;
//        private int totalTransactions = 0;
//        private int processedTransactions = 0;
//        private int failedTransactions = 0;
//        private BigDecimal totalAmount = BigDecimal.ZERO;
//        private BigDecimal totalFees = BigDecimal.ZERO;
//        private BigDecimal franchiseCommission = BigDecimal.ZERO;
//        private String error;
//
//        public MerchantBatchResult(Long merchantId) {
//            this.merchantId = merchantId;
//        }
//
//        public void addSuccess(BigDecimal amount, BigDecimal fee) {
//            processedTransactions++;
//            totalAmount = totalAmount.add(amount);
//            totalFees = totalFees.add(fee);
//        }
//
//        public void addFailure() {
//            failedTransactions++;
//        }
//        // Getters and setters
//
//        public Long getMerchantId() {
//            return merchantId;
//        }
//
//        public void setMerchantId(Long merchantId) {
//            this.merchantId = merchantId;
//        }
//
//        public int getTotalTransactions() {
//            return totalTransactions;
//        }
//
//        public void setTotalTransactions(int totalTransactions) {
//            this.totalTransactions = totalTransactions;
//        }
//
//        public int getProcessedTransactions() {
//            return processedTransactions;
//        }
//
//        public void setProcessedTransactions(int processedTransactions) {
//            this.processedTransactions = processedTransactions;
//        }
//
//        public int getFailedTransactions() {
//            return failedTransactions;
//        }
//
//        public void setFailedTransactions(int failedTransactions) {
//            this.failedTransactions = failedTransactions;
//        }
//
//        public BigDecimal getTotalAmount() {
//            return totalAmount;
//        }
//
//        public void setTotalAmount(BigDecimal totalAmount) {
//            this.totalAmount = totalAmount;
//        }
//
//        public BigDecimal getTotalFees() {
//            return totalFees;
//        }
//
//        public void setTotalFees(BigDecimal totalFees) {
//            this.totalFees = totalFees;
//        }
//
//        public BigDecimal getFranchiseCommission() {
//            return franchiseCommission;
//        }
//
//        public void setFranchiseCommission(BigDecimal franchiseCommission) {
//            this.franchiseCommission = franchiseCommission;
//        }
//
//        public String getError() {
//            return error;
//        }
//
//        public void setError(String error) {
//            this.error = error;
//        }
//    }
//}








package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.*;
import com.project2.ism.Model.*;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class FranchiseBulkSettlementService {

    private static final Logger log = LoggerFactory.getLogger(FranchiseBulkSettlementService.class);

    private final FranchiseSettlementBatchRepository franchiseBatchRepo;
    private final FranchiseBatchMerchantRepository batchMerchantRepo;
    private final EnhancedSettlementService2 settlementService;
    private final MerchantRepository merchantRepo;
    private final FranchiseAsyncProcessor franchiseAsyncProcessor;

    public FranchiseBulkSettlementService(
            FranchiseSettlementBatchRepository franchiseBatchRepo,
            FranchiseBatchMerchantRepository batchMerchantRepo,
            EnhancedSettlementService2 settlementService,
            MerchantRepository merchantRepo,
            FranchiseAsyncProcessor franchiseAsyncProcessor) {
        this.franchiseBatchRepo = franchiseBatchRepo;
        this.batchMerchantRepo = batchMerchantRepo;
        this.settlementService = settlementService;
        this.merchantRepo = merchantRepo;
        this.franchiseAsyncProcessor = franchiseAsyncProcessor;
    }

    /**
     * Get available merchants for franchise with product-specific candidate counts
     */
    public List<FranchiseMerchantOption> getAvailableMerchantsForFranchise(Long franchiseId, String cycleKey, Long productId) {
        log.debug("Getting available merchants for franchise={}, cycle={}, product={}", franchiseId, cycleKey, productId);

        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);
        log.debug("Found {} merchants for franchise {}", allMerchants.size(), franchiseId);

        return allMerchants.stream().map(merchant -> {
            try {
                // Re-validate merchant still belongs to franchise
                if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
                    log.warn("Merchant {} no longer belongs to franchise {}", merchant.getId(), franchiseId);
                    return createEmptyMerchantOption(merchant);
                }

                // Get candidates for this merchant and product
                List<SettlementCandidateDTO> candidates = settlementService
                        .listSettlementCandidatesForCycle(merchant.getId(), cycleKey, productId);

                int validCandidates = (int) candidates.stream()
                        .filter(c -> c.getError() == null)
                        .count();

                BigDecimal totalAmount = candidates.stream()
                        .filter(c -> c.getError() == null)
                        .map(SettlementCandidateDTO::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                String contactPersonName = merchant.getContactPerson() != null ?
                        merchant.getContactPerson().getName() : "N/A";

                log.debug("Merchant {} has {} valid candidates worth {}",
                        merchant.getId(), validCandidates, totalAmount);

                return new FranchiseMerchantOption(
                        merchant.getId(),
                        merchant.getBusinessName(),
                        contactPersonName,
                        validCandidates,
                        totalAmount
                );

            } catch (Exception e) {
                log.error("Error getting candidates for merchant {}", merchant.getId(), e);
                return createEmptyMerchantOption(merchant);
            }
        }).collect(Collectors.toList());
    }

    /**
     * Create selective franchise batch
     */
    @Transactional
    public FranchiseSettlementBatch createSelectiveFranchiseBatch(Long franchiseId,Long productId, String cycleKey,
                                                                  List<Long> selectedMerchantIds, String createdBy) {
        log.info("Creating selective franchise batch for franchise={}, cycle={}, merchants={}",
                franchiseId, cycleKey, selectedMerchantIds);

        // Validate all selected merchants belong to franchise
        validateMerchantsBelongToFranchise(franchiseId, selectedMerchantIds);

        // Create franchise batch
        FranchiseSettlementBatch batch = new FranchiseSettlementBatch(franchiseId,productId, cycleKey, createdBy);
        batch.setTotalMerchants(selectedMerchantIds.size());
        batch.setStatus(FranchiseSettlementBatch.BatchStatus.DRAFT);
        batch = franchiseBatchRepo.save(batch);

        // Add selected merchants to batch
        for (Long merchantId : selectedMerchantIds) {
            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(batch.getId(), merchantId);
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
            batchMerchantRepo.save(batchMerchant);
        }

        log.info("Created franchise batch {} with {} merchants", batch.getId(), selectedMerchantIds.size());
        return batch;
    }

    /**
     * Create full franchise batch (all merchants)
     */
    @Transactional
    public FranchiseSettlementBatch createFullFranchiseBatch(Long franchiseId,Long productId, String cycleKey, String createdBy) {
        log.info("Creating full franchise batch for franchise={}, cycle={}", franchiseId, cycleKey);

        List<Merchant> allMerchants = merchantRepo.findByFranchiseId(franchiseId);
        if (allMerchants.isEmpty()) {
            throw new IllegalStateException("No merchants found for franchise: " + franchiseId);
        }

        List<Long> allMerchantIds = allMerchants.stream()
                .map(Merchant::getId)
                .collect(Collectors.toList());

        return createSelectiveFranchiseBatch(franchiseId,productId, cycleKey, allMerchantIds, createdBy);
    }

    /**
     * Update merchant selection in draft batch
     */
    @Transactional
    public FranchiseSettlementBatch updateMerchantSelection(Long franchiseBatchId, List<Long> newSelectedMerchantIds) {
        log.info("Updating merchant selection for batch {} with {} merchants",
                franchiseBatchId, newSelectedMerchantIds.size());

        FranchiseSettlementBatch batch = getBatchById(franchiseBatchId);

        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
            throw new IllegalStateException("Cannot modify merchant selection after batch is finalized. Current status: " + batch.getStatus());
        }

        // Validate new merchants belong to franchise
        validateMerchantsBelongToFranchise(batch.getFranchiseId(), newSelectedMerchantIds);

        // Remove existing selections
        batchMerchantRepo.deleteByFranchiseBatchId(franchiseBatchId);

        // Add new selections
        for (Long merchantId : newSelectedMerchantIds) {
            FranchiseBatchMerchant batchMerchant = new FranchiseBatchMerchant(franchiseBatchId, merchantId);
            batchMerchant.setStatus(FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);
            batchMerchantRepo.save(batchMerchant);
        }

        batch.setTotalMerchants(newSelectedMerchantIds.size());
        FranchiseSettlementBatch savedBatch = franchiseBatchRepo.save(batch);

        log.info("Updated batch {} merchant selection to {} merchants", franchiseBatchId, newSelectedMerchantIds.size());
        return savedBatch;
    }

    /**
     * Get settlement candidates for specific merchant in franchise batch
     */
    @Transactional(readOnly = true)
    public List<SettlementCandidateDTO> listSettlementCandidatesForMerchant(Long franchiseId,
                                                                            Long batchId,
                                                                            Long merchantId,
                                                                            String cycleKey,
                                                                            Long productId) {
        log.debug("Getting candidates for franchise={}, batch={}, merchant={}, product={}",
                franchiseId, batchId, merchantId, productId);

        // Verify batch exists and belongs to franchise
        FranchiseSettlementBatch batch = getBatchById(batchId);
        if (!batch.getFranchiseId().equals(franchiseId)) {
            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
        }

        // Verify merchant belongs to this batch
        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
        if (batchMerchant == null) {
            throw new IllegalArgumentException("Merchant " + merchantId + " not part of franchise batch " + batchId);
        }

        // Verify merchant still belongs to the franchise
        validateMerchantBelongsToFranchise(franchiseId, merchantId);

        // Get candidates using settlement service with product filtering
        return settlementService.listSettlementCandidatesForCycle(merchantId, cycleKey, productId);
    }

    /**
     * Process franchise batch with merchant-specific transactions
     * NEW APPROACH: Frontend sends Map<MerchantId, List<TransactionId>>
     */
    public void processSelectedMerchantsWithTransactions(Long franchiseBatchId,
                                                         Map<Long, List<String>> merchantTransactionsMap) {
        log.info("Processing franchise batch {} with {} merchants and custom transactions",
                franchiseBatchId, merchantTransactionsMap.size());

        FranchiseSettlementBatch batch = getBatchById(franchiseBatchId);

        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
            throw new IllegalStateException("Batch must be in DRAFT status for processing. Current: " + batch.getStatus());
        }

        // Validate all merchants in request belong to this batch
        validateMerchantsInBatch(franchiseBatchId, merchantTransactionsMap.keySet());

        // Update batch status and trigger async processing
        batch.setStatus(FranchiseSettlementBatch.BatchStatus.PROCESSING);
        batch.setProcessingStartedAt(LocalDateTime.now());
        franchiseBatchRepo.save(batch);

        // Trigger async processing with merchant-specific transactions
        franchiseAsyncProcessor.processWithCustomTransactions(franchiseBatchId, merchantTransactionsMap);

        log.info("Started async processing for franchise batch {}", franchiseBatchId);
    }

    /**
     * OLD METHOD: Process all selected merchants (kept for backward compatibility)
     */
    public void processSelectedMerchants(Long franchiseBatchId) {
        log.info("Processing franchise batch {} with all available transactions", franchiseBatchId);

        FranchiseSettlementBatch batch = getBatchById(franchiseBatchId);

        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
            throw new IllegalStateException("Batch must be in DRAFT status for processing. Current: " + batch.getStatus());
        }

        // Get all selected merchants
        List<FranchiseBatchMerchant> selectedMerchants = batchMerchantRepo
                .findByFranchiseBatchIdAndStatus(franchiseBatchId, FranchiseBatchMerchant.MerchantProcessingStatus.SELECTED);

        if (selectedMerchants.isEmpty()) {
            throw new IllegalStateException("No merchants selected for processing in batch " + franchiseBatchId);
        }

        // Update batch status and trigger async processing
        batch.setStatus(FranchiseSettlementBatch.BatchStatus.PROCESSING);
        batch.setProcessingStartedAt(LocalDateTime.now());
        franchiseBatchRepo.save(batch);

        // Trigger async processing with all available transactions
        franchiseAsyncProcessor.processAllAvailableTransactions(franchiseBatchId);

        log.info("Started async processing for franchise batch {} with all transactions", franchiseBatchId);
    }

    /**
     * Update specific merchant's candidates in batch (NOT RECOMMENDED - use processWithTransactions instead)
     * This method exists for backward compatibility but the new flow is preferred
     */
    @Transactional
    @Deprecated
    public void updateMerchantCandidates(Long franchiseId,
                                         Long batchId,
                                         Long merchantId,
                                         List<String> vendorTxIds) {
        log.warn("Using deprecated updateMerchantCandidates method. Consider using processWithTransactions instead.");

        // Validate batch and merchant
        FranchiseSettlementBatch batch = getBatchById(batchId);
        if (!batch.getFranchiseId().equals(franchiseId)) {
            throw new IllegalArgumentException("Batch " + batchId + " does not belong to franchise " + franchiseId);
        }

        if (batch.getStatus() != FranchiseSettlementBatch.BatchStatus.DRAFT) {
            throw new IllegalStateException("Cannot modify candidates after batch is finalized. Current status: " + batch.getStatus());
        }

        validateMerchantInBatch(batchId, merchantId);
        validateMerchantBelongsToFranchise(franchiseId, merchantId);

//        // Create temporary merchant batch for tracking
//        MerchantSettlementBatch merchantBatch = settlementService
//                .getOrCreateActiveBatch(merchantId, batch.getCycleKey(), "FRANCHISE_BULK", batch.getProductId());

        // Update candidates in merchant batch
     //   settlementService.updateBatchCandidates(merchantBatch.getId(), vendorTxIds);

        log.info("Updated candidates for merchant {} in franchise batch {}", merchantId, batchId);
    }

    // ==================== READ-ONLY METHODS ====================

    @Transactional(readOnly = true)
    public FranchiseSettlementBatch getBatchById(Long batchId) {
        return franchiseBatchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Franchise batch not found: " + batchId));
    }

    @Transactional(readOnly = true)
    public List<FranchiseSettlementBatch> getAllBatches(Long franchiseId) {
        return franchiseBatchRepo.findByFranchiseIdOrderByCreatedAtDesc(franchiseId);
    }

    @Transactional(readOnly = true)
    public BatchProgressDTO getBatchProgress(Long batchId) {
        FranchiseSettlementBatch batch = getBatchById(batchId);

        BatchProgressDTO progress = new BatchProgressDTO();
        progress.setBatchId(batchId);
        progress.setStatus(batch.getStatus().toString());
        progress.setTotalTransactions(batch.getTotalTransactions());
        progress.setProcessedTransactions(batch.getProcessedTransactions());
        progress.setFailedTransactions(batch.getFailedTransactions());
        progress.setTotalAmount(batch.getTotalAmount());
        progress.setTotalFees(batch.getTotalFees());
        progress.setTotalNetAmount(batch.getTotalNetAmount());
        progress.setProcessingStartedAt(batch.getProcessingStartedAt());
        progress.setProcessingCompletedAt(batch.getProcessingCompletedAt());
        progress.setErrorMessage(batch.getErrorMessage());

        if (batch.getTotalTransactions() != null && batch.getTotalTransactions() > 0) {
            int totalProcessed = (batch.getProcessedTransactions() != null ? batch.getProcessedTransactions() : 0) +
                    (batch.getFailedTransactions() != null ? batch.getFailedTransactions() : 0);
            progress.setProgressPercentage((totalProcessed * 100.0) / batch.getTotalTransactions());
        } else {
            progress.setProgressPercentage(0.0);
        }

        return progress;
    }

    // ==================== VALIDATION METHODS ====================

    private void validateMerchantsBelongToFranchise(Long franchiseId, List<Long> merchantIds) {
        List<Merchant> merchants = merchantRepo.findAllById(merchantIds);

        // Check all merchants were found
        if (merchants.size() != merchantIds.size()) {
            Set<Long> foundIds = merchants.stream().map(Merchant::getId).collect(Collectors.toSet());
            Set<Long> missingIds = merchantIds.stream().filter(id -> !foundIds.contains(id)).collect(Collectors.toSet());
            throw new IllegalArgumentException("Merchants not found: " + missingIds);
        }

        // Check all merchants belong to franchise
        for (Merchant merchant : merchants) {
            if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
                throw new IllegalArgumentException("Merchant " + merchant.getId() +
                        " does not belong to franchise " + franchiseId);
            }
        }
    }

    private void validateMerchantBelongsToFranchise(Long franchiseId, Long merchantId) {
        Merchant merchant = merchantRepo.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        if (merchant.getFranchise() == null || !merchant.getFranchise().getId().equals(franchiseId)) {
            throw new IllegalArgumentException("Merchant " + merchantId +
                    " does not belong to franchise " + franchiseId);
        }
    }

    private void validateMerchantsInBatch(Long batchId, Set<Long> merchantIds) {
        List<FranchiseBatchMerchant> batchMerchants = batchMerchantRepo.findByFranchiseBatchId(batchId);
        Set<Long> validMerchantIds = batchMerchants.stream()
                .map(FranchiseBatchMerchant::getMerchantId)
                .collect(Collectors.toSet());

        Set<Long> invalidMerchants = merchantIds.stream()
                .filter(id -> !validMerchantIds.contains(id))
                .collect(Collectors.toSet());

        if (!invalidMerchants.isEmpty()) {
            throw new IllegalArgumentException("Merchants not in batch " + batchId + ": " + invalidMerchants);
        }
    }

    private void validateMerchantInBatch(Long batchId, Long merchantId) {
        FranchiseBatchMerchant batchMerchant = batchMerchantRepo
                .findByFranchiseBatchIdAndMerchantId(batchId, merchantId);
        if (batchMerchant == null) {
            throw new IllegalArgumentException("Merchant " + merchantId + " not part of franchise batch " + batchId);
        }
    }

    // ==================== UTILITY METHODS ====================

    private FranchiseMerchantOption createEmptyMerchantOption(Merchant merchant) {
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
}