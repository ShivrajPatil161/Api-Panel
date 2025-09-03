//package com.project2.ism.Service;
//
//import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
//import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
//import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
//import com.project2.ism.Model.*;
//import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
//import com.project2.ism.Model.PricingScheme.CardRate;
//import com.project2.ism.Model.Users.Franchise;
//import com.project2.ism.Model.Users.Merchant;
//import com.project2.ism.Repository.*;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Propagation;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.math.RoundingMode;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class EnhancedSettlementService {
//
//    private static final Logger log = LoggerFactory.getLogger(EnhancedSettlementService.class);
//
//    private final ProductSerialsRepository serialRepo;
//    private final VendorTransactionsRepository vendorRepo;
//    private final MerchantSettlementBatchRepository batchRepo;
//    private final MerchantWalletRepository walletRepo;
//    private final MerchantRepository merchantRepository;
//    private final MerchantTransDetRepository merchantTxnRepo;
//    private final ProductSchemeAssignmentRepository schemeAssignRepo;
//    private final CardRateRepository cardRateRepo;
//    private final FranchiseWalletRepository franchiseWalletRepo;
//    private final FranchiseTransDetRepository franchiseTxnRepo;
//    private final SettlementBatchCandidateRepository candidateRepo;
//
//    public EnhancedSettlementService(ProductSerialsRepository serialRepo,
//                                     VendorTransactionsRepository vendorRepo,
//                                     MerchantSettlementBatchRepository batchRepo,
//                                     MerchantWalletRepository walletRepo,
//                                     MerchantRepository merchantRepository,
//                                     MerchantTransDetRepository merchantTxnRepo,
//                                     ProductSchemeAssignmentRepository schemeAssignRepo,
//                                     CardRateRepository cardRateRepo,
//                                     FranchiseWalletRepository franchiseWalletRepo,
//                                     FranchiseTransDetRepository franchiseTxnRepo,
//                                     SettlementBatchCandidateRepository candidateRepo) {
//        this.serialRepo = serialRepo;
//        this.vendorRepo = vendorRepo;
//        this.batchRepo = batchRepo;
//        this.walletRepo = walletRepo;
//        this.merchantRepository = merchantRepository;
//        this.merchantTxnRepo = merchantTxnRepo;
//        this.schemeAssignRepo = schemeAssignRepo;
//        this.cardRateRepo = cardRateRepo;
//        this.franchiseWalletRepo = franchiseWalletRepo;
//        this.franchiseTxnRepo = franchiseTxnRepo;
//        this.candidateRepo = candidateRepo;
//    }
//
//    @Transactional
//    public MerchantSettlementBatch getOrCreateActiveBatch(Long merchantId, String cycleKey, String createdBy) {
//        Optional<MerchantSettlementBatch> existing = batchRepo
//                .findByMerchantIdAndCycleKeyAndStatusIn(
//                        merchantId,
//                        cycleKey,
//                        Arrays.asList("DRAFT", "OPEN")
//                );
//
//        return existing.orElseGet(() -> createBatch(merchantId, cycleKey, createdBy));
//
//    }
//
//    public MerchantSettlementBatch createBatch(Long merchantId, String cycleKey, String createdBy) {
//        LocalDateTime windowEnd = switch (cycleKey == null ? "" : cycleKey.toUpperCase()) {
//            case "T0" -> LocalDateTime.now();
//            case "T1" -> LocalDate.now().atTime(23, 59, 59);
//            case "T2" -> LocalDate.now().plusDays(1).atTime(23, 59, 59);
//            default -> throw new IllegalArgumentException("Unknown cycleKey: " + cycleKey);
//        };
//
//        List<Object[]> rows = serialRepo.findDeviceIdentifiersByMerchant(merchantId);
//        Set<String> mids = new HashSet<>();
//        for (Object[] r : rows) if (r[0] != null) mids.add((String) r[0]);
//
//        LocalDateTime fallbackStart = merchantRepository.findById(merchantId)
//                .map(m -> m.getCreatedAt() != null ? m.getCreatedAt() : LocalDateTime.now())
//                .orElse(LocalDateTime.now());
//
//        LocalDateTime windowStart = mids.isEmpty()
//                ? fallbackStart
//                : vendorRepo.findEarliestUnsettledDateByMids(new ArrayList<>(mids)).orElse(fallbackStart);
//
//        MerchantSettlementBatch batch = new MerchantSettlementBatch();
//        batch.setMerchantId(merchantId);
//        batch.setWindowStart(windowStart);
//        batch.setWindowEnd(windowEnd);
//        batch.setCycleKey(cycleKey);
//        batch.setCreatedBy(createdBy);
//        batch.setStatus("OPEN");
//        return batchRepo.save(batch);
//    }
//
//    @Transactional
//    public MerchantSettlementBatch updateBatchCandidates(Long batchId, List<String> vendorTxIds) {
//        MerchantSettlementBatch batch = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));
//
//        if (!"DRAFT".equals(batch.getStatus()) && !"OPEN".equals(batch.getStatus())) {
//            throw new IllegalStateException("Cannot modify batch in " + batch.getStatus() + " state");
//        }
//
//        candidateRepo.deleteByBatchId(batchId);
//
//        int validCandidates = 0;
//        BigDecimal totalAmount = BigDecimal.ZERO;
//        BigDecimal totalFees = BigDecimal.ZERO;
//        BigDecimal totalNet = BigDecimal.ZERO;
//
//        for (String vendorTxId : vendorTxIds) {
//            VendorTransactions vt = vendorRepo.findByTransactionReferenceId(vendorTxId)
//                    .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + vendorTxId));
//
//            SettlementCandidateDTO dto = mapToSettlementCandidate(vt, batch.getMerchantId());
//            if (dto.getError() == null) {
//                SettlementBatchCandidate candidate = new SettlementBatchCandidate(
//                        batchId, vendorTxId, dto.getAmount(), dto.getFee(), dto.getNetAmount());
//                candidateRepo.save(candidate);
//
//                validCandidates++;
//                totalAmount = totalAmount.add(dto.getAmount());
//                totalFees = totalFees.add(dto.getFee());
//                totalNet = totalNet.add(dto.getNetAmount());
//            }
//        }
//
//        batch.setTotalTransactions(validCandidates);
//        batch.setTotalAmount(totalAmount);
//        batch.setTotalFees(totalFees);
//        batch.setTotalNetAmount(totalNet);
//        batch.setStatus("OPEN");
//        processBatchWithTracking(batch.getId());
//        return batchRepo.save(batch);
//    }
//
//    @Async("settlementExecutor")
//    public void processBatchWithTracking(Long batchId) {
//        MerchantSettlementBatch batch = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
//
//        try {
//            batch.setStatus("PROCESSING");
//            batch.setProcessingStartedAt(LocalDateTime.now());
//            batchRepo.save(batch);
//
//            List<SettlementBatchCandidate> candidates = candidateRepo.findByBatchIdAndStatus(
//                    batchId, SettlementBatchCandidate.CandidateStatus.SELECTED);
//
//            int processed = 0, failed = 0;
//
//            for (SettlementBatchCandidate candidate : candidates) {
//                try {
//                    candidate.setStatus(SettlementBatchCandidate.CandidateStatus.PROCESSING);
//                    candidateRepo.save(candidate);
//
//                    SettlementResultDTO result = settleOneEnhanced(batch.getMerchantId(), batchId, candidate.getVendorTxId());
//
//                    if ("OK".equals(result.getStatus())) {
//                        candidate.setStatus(SettlementBatchCandidate.CandidateStatus.COMPLETED);
//                        processed++;
//                    } else {
//                        candidate.setStatus(SettlementBatchCandidate.CandidateStatus.FAILED);
//                        failed++;
//                    }
//                    candidateRepo.save(candidate);
//
//                } catch (Exception e) {
//                    log.error("Failed to settle candidate {} in batch {}", candidate.getVendorTxId(), batchId, e);
//                    candidate.setStatus(SettlementBatchCandidate.CandidateStatus.FAILED);
//                    candidateRepo.save(candidate);
//                    failed++;
//                }
//            }
//
//            batch.setProcessedTransactions(processed);
//            batch.setFailedTransactions(failed);
//            batch.setProcessingCompletedAt(LocalDateTime.now());
//
//            if (failed == 0 && processed > 0) {
//                batch.setStatus("COMPLETED");
//            } else if (processed > 0 && failed > 0) {
//                batch.setStatus("PARTIALLY_COMPLETED");
//            } else if (failed > 0 && processed == 0) {
//                batch.setStatus("FAILED");
//                batch.setErrorMessage("All transactions failed to process");
//            } else {
//                batch.setStatus("COMPLETED");
//            }
//
//            batchRepo.save(batch);
//
//        } catch (Exception e) {
//            log.error("Batch processing failed for batch {}", batchId, e);
//            batch.setStatus("FAILED");
//            batch.setErrorMessage(e.getMessage());
//            batch.setProcessingCompletedAt(LocalDateTime.now());
//            batchRepo.save(batch);
//        }
//    }
//
//    @Async("settlementExecutor")
//    public void resumeBatch(Long batchId) {
//        MerchantSettlementBatch batch = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
//
//        if (!"PARTIALLY_COMPLETED".equals(batch.getStatus()) && !"FAILED".equals(batch.getStatus())) {
//            throw new IllegalStateException("Batch cannot be resumed. Current status: " + batch.getStatus());
//        }
//
//        candidateRepo.updateFailedCandidatesToSelected(batchId);
//        processBatchWithTracking(batchId);
//    }
//
//    @Transactional(propagation = Propagation.REQUIRES_NEW)
//    public SettlementResultDTO settleOneEnhanced(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
//        if (vendorTxPrimaryKey == null || vendorTxPrimaryKey.isBlank()) {
//            throw new IllegalArgumentException("vendorTxPrimaryKey is blank");
//        }
//
//        VendorTransactions vt = vendorRepo.findByTransactionReferenceId(vendorTxPrimaryKey)
//                .orElseThrow(() -> new IllegalStateException("Vendor tx not found: " + vendorTxPrimaryKey));
//
//        if (Boolean.TRUE.equals(vt.getSettled())) {
//            log.info("Vendor tx {} already settled. Skipping.", vt.getTransactionReferenceId());
//            return SettlementResultDTO.alreadySettled(vt.getTransactionReferenceId());
//        }
//
//        Merchant merchant = merchantRepository.findById(merchantId)
//                .orElseThrow(() -> new IllegalStateException("Merchant not found: " + merchantId));
//
//        ProductSerialNumbers device = findDeviceForTransaction(vt)
//                .orElseThrow(() -> new IllegalStateException("Device not found for transaction: " + vendorTxPrimaryKey));
//
//        if (!merchantId.equals(device.getMerchant().getId())) {
//            throw new IllegalStateException("Transaction belongs to different merchant");
//        }
//
//        ProductSchemeAssignment schemeAssignment = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction())
//                .orElseThrow(() -> new IllegalStateException("No pricing scheme found"));
//
//        String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
//        CardRate cr = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
//                        schemeAssignment.getScheme().getId(), cardName)
//                .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
//                        schemeAssignment.getScheme().getId(), "DEFAULT"))
//                .orElseThrow(() -> new IllegalStateException("No card rate found"));
//
//        BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
//        boolean isFranchiseMerchant = merchant.getFranchise() != null;
//
//        if (isFranchiseMerchant) {
//            return processFranchiseMerchantSettlement(merchant, vt, cr, amount, batchId, device);
//        } else {
//            return processDirectMerchantSettlement(merchant, vt, cr, amount, batchId, device);
//        }
//    }
//
//    private SettlementResultDTO processDirectMerchantSettlement(Merchant merchant, VendorTransactions vt,
//                                                                CardRate cr, BigDecimal amount, Long batchId, ProductSerialNumbers device) {
//
//        BigDecimal feePct = amount.signum() > 0
//                ? BigDecimal.valueOf(cr.getRate()).movePointLeft(2)
//                : BigDecimal.ZERO;
//        BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
//        if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
//        BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);
//
//        MerchantWallet wallet = updateMerchantWallet(merchant.getId(), net, amount);
//        createMerchantTransactionDetails(merchant, vt, amount, fee, wallet.getAvailableBalance(), batchId);
//        markTransactionSettled(vt, batchId);
//
//        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, fee, net, wallet.getAvailableBalance());
//    }
//
//    private SettlementResultDTO processFranchiseMerchantSettlement(Merchant merchant, VendorTransactions vt,
//                                                                   CardRate cr, BigDecimal amount, Long batchId, ProductSerialNumbers device) {
//
//        Franchise franchise = merchant.getFranchise();
//        if (franchise == null) {
//            throw new IllegalStateException("Merchant does not belong to a franchise");
//        }
//
//        Double merchantRatePercent = cr.getMerchantRate();
//        Double franchiseRatePercent = cr.getFranchiseRate();
//
//        if (merchantRatePercent == null || franchiseRatePercent == null) {
//            log.warn("Dual rates not configured for card: {}. Using single rate.", cr.getCardName());
//            return processDirectMerchantSettlement(merchant, vt, cr, amount, batchId, device);
//        }
//
//        BigDecimal merchantRate = BigDecimal.valueOf(merchantRatePercent).movePointLeft(2);
//        BigDecimal franchiseRate = BigDecimal.valueOf(franchiseRatePercent).movePointLeft(2);
//
//        BigDecimal merchantFee = amount.multiply(merchantRate).setScale(2, RoundingMode.HALF_UP);
//        BigDecimal franchiseFee = amount.multiply(franchiseRate).setScale(2, RoundingMode.HALF_UP);
//        BigDecimal franchiseCommission = merchantFee.subtract(franchiseFee).setScale(2, RoundingMode.HALF_UP);
//
//        BigDecimal merchantNet = amount.subtract(merchantFee);
//
//        MerchantWallet merchantWallet = updateMerchantWallet(merchant.getId(), merchantNet, amount);
//        FranchiseWallet franchiseWallet = updateFranchiseWallet(franchise.getId(), franchiseCommission);
//
//        createMerchantTransactionDetails(merchant, vt, amount, merchantFee, merchantWallet.getAvailableBalance(), batchId);
//        createFranchiseTransactionDetails(franchise, vt, amount, franchiseCommission,
//                franchiseWallet != null ? franchiseWallet.getAvailableBalance() : BigDecimal.ZERO, batchId);
//
//        markTransactionSettled(vt, batchId);
//
//        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, merchantFee, merchantNet, merchantWallet.getAvailableBalance());
//    }
//
//    private MerchantWallet updateMerchantWallet(Long merchantId, BigDecimal net, BigDecimal amount) {
//        MerchantWallet wallet = walletRepo.findByMerchantIdForUpdate(merchantId).orElseGet(() -> {
//            MerchantWallet w = new MerchantWallet();
//            Merchant mRef = new Merchant();
//            mRef.setId(merchantId);
//            w.setMerchant(mRef);
//            w.setAvailableBalance(BigDecimal.ZERO);
//            w.setLastUpdatedAmount(BigDecimal.ZERO);
//            w.setLastUpdatedAt(LocalDateTime.now());
//            w.setTotalCash(BigDecimal.ZERO);
//            w.setCutOfAmount(BigDecimal.ZERO);
//            return walletRepo.save(w);
//        });
//
//        BigDecimal before = nvl(wallet.getAvailableBalance());
//        BigDecimal after = before.add(net);
//        wallet.setAvailableBalance(after);
//        wallet.setLastUpdatedAmount(net);
//        wallet.setLastUpdatedAt(LocalDateTime.now());
//        wallet.setTotalCash(nvl(wallet.getTotalCash()).add(amount.max(BigDecimal.ZERO)));
//
//        return walletRepo.save(wallet);
//    }
//
//    private FranchiseWallet updateFranchiseWallet(Long franchiseId, BigDecimal commission) {
//        if (commission.compareTo(BigDecimal.ZERO) <= 0) {
//            return null;
//        }
//
//        FranchiseWallet wallet = franchiseWalletRepo.findByFranchiseIdForUpdate(franchiseId)
//                .orElseGet(() -> {
//                    FranchiseWallet w = new FranchiseWallet();
//                    Franchise fRef = new Franchise();
//                    fRef.setId(franchiseId);
//                    w.setFranchise(fRef);
//                    w.setAvailableBalance(BigDecimal.ZERO);
//                    w.setLastUpdatedAmount(BigDecimal.ZERO);
//                    w.setLastUpdatedAt(LocalDateTime.now());
//                    w.setTotalCash(BigDecimal.ZERO);
//                    w.setCutOfAmount(BigDecimal.ZERO);
//                    return franchiseWalletRepo.save(w);
//                });
//
//        BigDecimal before = nvl(wallet.getAvailableBalance());
//        BigDecimal after = before.add(commission);
//        wallet.setAvailableBalance(after);
//        wallet.setLastUpdatedAmount(commission);
//        wallet.setLastUpdatedAt(LocalDateTime.now());
//
//        return franchiseWalletRepo.save(wallet);
//    }
//
//    private void createMerchantTransactionDetails(Merchant merchant, VendorTransactions vt,
//                                                  BigDecimal amount, BigDecimal fee, BigDecimal balanceAfter, Long batchId) {
//
//        if (!merchantTxnRepo.existsByVendorTransactionId(vt.getInternalId().toString())) {
//            MerchantTransactionDetails mtd = new MerchantTransactionDetails();
//            mtd.setMerchant(merchant);
//            mtd.setCharge(fee);
//            mtd.setVendorTransactionId(vt.getInternalId().toString());
//            mtd.setDateAndTimeOfTransaction(vt.getDate());
//            mtd.setAmount(amount);
//            mtd.setFinalBalance(balanceAfter);
//            mtd.setBalAfterTran(balanceAfter);
//            mtd.setTranStatus("SETTLED");
//            mtd.setTransactionType("SETTLEMENT");
//            mtd.setRemarks("Batch " + batchId + " settlement");
//            merchantTxnRepo.save(mtd);
//        }
//    }
//
//    private void createFranchiseTransactionDetails(Franchise franchise, VendorTransactions vt,
//                                                   BigDecimal amount, BigDecimal commission, BigDecimal balanceAfter, Long batchId) {
//
//        if (commission.compareTo(BigDecimal.ZERO) <= 0) {
//            return;
//        }
//
//        String vendorTxKey = vt.getInternalId().toString() + "_FRANCHISE";
//        if (!franchiseTxnRepo.existsByVendorTransactionId(vendorTxKey)) {
//            FranchiseTransactionDetails ftd = new FranchiseTransactionDetails();
//            ftd.setFranchise(franchise);
//            ftd.setVendorTransactionId(vendorTxKey);
//            ftd.setDateAndTimeOfTransaction(vt.getDate());
//            ftd.setAmount(commission);
//            ftd.setFinalBalance(balanceAfter);
//            ftd.setBalAfterTran(balanceAfter);
//            ftd.setTranStatus("SETTLED");
//            ftd.setTransactionType("COMMISSION");
//            ftd.setRemarks("Batch " + batchId + " commission from merchant transaction " + vt.getTransactionReferenceId());
//            franchiseTxnRepo.save(ftd);
//        }
//    }
//
//    private void markTransactionSettled(VendorTransactions vt, Long batchId) {
//        vt.setSettled(true);
//        vt.setSettledAt(LocalDateTime.now());
//        vt.setSettlementBatchId(batchId);
//        vendorRepo.save(vt);
//    }
//
//    public List<SettlementCandidateDTO> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
//        List<Object[]> deviceData = serialRepo.findDeviceIdentifiersByMerchant(merchantId);
//
//        if (deviceData.isEmpty()) {
//            log.warn("No devices found for merchant {}", merchantId);
//            return Collections.emptyList();
//        }
//
//        Set<String> mids = new HashSet<>(), tids = new HashSet<>();
//        for (Object[] row : deviceData) {
//            if (row[0] != null) mids.add((String) row[0]);
//            if (row[1] != null) tids.add((String) row[1]);
//        }
//
//        List<VendorTransactions> candidates = vendorRepo.findCandidates(
//                from, to,
//                mids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(mids),
//                tids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(tids)
//        );
//
//        return candidates.stream().map(vt -> mapToSettlementCandidate(vt, merchantId))
//                .collect(Collectors.toList());
//    }
//
//    public List<SettlementCandidateDTO> listSettlementCandidatesForFranchise(Long merchantId, String cycleKey) {
//        MerchantSettlementBatch tempBatch = createBatch(merchantId, cycleKey, "TEMP");
//        LocalDateTime windowStart = tempBatch.getWindowStart();
//        LocalDateTime windowEnd = tempBatch.getWindowEnd();
//
//        batchRepo.delete(tempBatch);
//
//        return listSettlementCandidates(merchantId, windowStart, windowEnd);
//    }
//
//    private SettlementCandidateDTO mapToSettlementCandidate(VendorTransactions vt, Long expectedMerchantId) {
//        try {
//            Optional<ProductSerialNumbers> deviceOpt = findDeviceForTransaction(vt);
//            if (deviceOpt.isEmpty()) {
//                return SettlementCandidateDTO.notFound(vt, "DEVICE_NOT_FOUND");
//            }
//
//            ProductSerialNumbers device = deviceOpt.get();
//
//            if (!expectedMerchantId.equals(device.getMerchant().getId())) {
//                return SettlementCandidateDTO.notFound(vt, "WRONG_MERCHANT");
//            }
//
//            Optional<ProductSchemeAssignment> schemeOpt = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction());
//            if (schemeOpt.isEmpty()) {
//                return SettlementCandidateDTO.notFound(vt, "NO_PRICING_SCHEME");
//            }
//
//            ProductSchemeAssignment scheme = schemeOpt.get();
//
//            LocalDate txnDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
//            if (scheme.getExpiryDate() != null && txnDate.isAfter(scheme.getExpiryDate())) {
//                return SettlementCandidateDTO.notFound(vt, "SCHEME_EXPIRED");
//            }
//
//            String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
//            Optional<CardRate> crOpt = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
//                            scheme.getScheme().getId(), cardName)
//                    .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
//                            scheme.getScheme().getId(), "DEFAULT"));
//
//            if (crOpt.isEmpty()) {
//                return SettlementCandidateDTO.notFound(vt, "NO_CARD_RATE");
//            }
//
//            CardRate cr = crOpt.get();
//
//            BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
//            BigDecimal feePct = amount.signum() > 0
//                    ? BigDecimal.valueOf(cr.getRate()).movePointLeft(2)
//                    : BigDecimal.ZERO;
//            BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
//            if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
//            BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);
//
//            return new SettlementCandidateDTO(
//                    vt.getInternalId(),
//                    vt.getTransactionReferenceId(),
//                    vt.getDate(),
//                    amount,
//                    vt.getCardType(),
//                    vt.getBrandType(),
//                    cardName,
//                    cr.getRate(),
//                    fee,
//                    net,
//                    null
//            );
//
//        } catch (Exception ex) {
//            log.error("Error mapping vendor transaction {}", vt.getInternalId(), ex);
//            return SettlementCandidateDTO.notFound(vt, "MAPPING_ERROR: " + ex.getMessage());
//        }
//    }
//
//    private Optional<ProductSerialNumbers> findDeviceForTransaction(VendorTransactions vt) {
//        if (vt.getMid() != null && vt.getTid() != null) {
//            List<ProductSerialNumbers> devices = serialRepo.findByMidAndTid(vt.getMid(), vt.getTid());
//            if (!devices.isEmpty()) {
//                return Optional.of(devices.get(0));
//            }
//        }
//
//        if (vt.getMid() != null) {
//            Optional<ProductSerialNumbers> device = serialRepo.findByMid(vt.getMid());
//            if (device.isPresent()) {
//                return device;
//            }
//        }
//
//        if (vt.getTid() != null) {
//            Optional<ProductSerialNumbers> device = serialRepo.findByTid(vt.getTid());
//            if (device.isPresent()) {
//                return device;
//            }
//        }
//
//        return Optional.empty();
//    }
//
//    @Transactional(readOnly = true)
//    public MerchantSettlementBatch getBatchById(Long batchId) {
//        return batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));
//    }
//
//    @Transactional(readOnly = true)
//    public BatchProgressDTO getBatchProgress(Long batchId) {
//        MerchantSettlementBatch batch = getBatchById(batchId);
//
//        BatchProgressDTO progress = new BatchProgressDTO();
//        progress.setBatchId(batchId);
//        progress.setStatus(batch.getStatus());
//        progress.setTotalTransactions(batch.getTotalTransactions());
//        progress.setProcessedTransactions(batch.getProcessedTransactions());
//        progress.setFailedTransactions(batch.getFailedTransactions());
//        progress.setTotalAmount(batch.getTotalAmount());
//        progress.setTotalFees(batch.getTotalFees());
//        progress.setTotalNetAmount(batch.getTotalNetAmount());
//        progress.setProcessingStartedAt(batch.getProcessingStartedAt());
//        progress.setProcessingCompletedAt(batch.getProcessingCompletedAt());
//        progress.setErrorMessage(batch.getErrorMessage());
//
//        if (batch.getTotalTransactions() != null && batch.getTotalTransactions() > 0) {
//            int totalProcessed = (batch.getProcessedTransactions() != null ? batch.getProcessedTransactions() : 0) +
//                    (batch.getFailedTransactions() != null ? batch.getFailedTransactions() : 0);
//            progress.setProgressPercentage((totalProcessed * 100.0) / batch.getTotalTransactions());
//        } else {
//            progress.setProgressPercentage(0.0);
//        }
//
//        return progress;
//    }
//
//    @Transactional(readOnly = true)
//    public List<MerchantSettlementBatch> getAllBatchesByMerchant(Long merchantId, int limit) {
//        return batchRepo.findByMerchantIdOrderByCreatedAtDesc(merchantId, PageRequest.of(0, limit)).getContent();
//    }
//
//    @Transactional
//    public void markBatchProcessing(Long batchId) {
//        MerchantSettlementBatch b = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
//        b.setStatus("PROCESSING");
//        batchRepo.save(b);
//    }
//
//    @Transactional
//    public void markBatchClosed(Long batchId) {
//        MerchantSettlementBatch b = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
//        b.setStatus("CLOSED");
//        batchRepo.save(b);
//    }
//
//    private BigDecimal nvl(BigDecimal value) {
//        return value == null ? BigDecimal.ZERO : value;
//    }
//
//    private String normalizeCardName(String brandType, String cardType) {
//        if (brandType == null) brandType = "";
//        if (cardType == null) cardType = "";
//        return (brandType + " " + cardType).trim();
//    }
//}


package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.PricingScheme.CardRate;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnhancedSettlementService {

    private static final Logger log = LoggerFactory.getLogger(EnhancedSettlementService.class);

    private final ProductSerialsRepository serialRepo;
    private final VendorTransactionsRepository vendorRepo;
    private final MerchantSettlementBatchRepository batchRepo;
    private final MerchantWalletRepository walletRepo;
    private final MerchantRepository merchantRepository;
    private final MerchantTransDetRepository merchantTxnRepo;
    private final ProductSchemeAssignmentRepository schemeAssignRepo;
    private final CardRateRepository cardRateRepo;
    private final FranchiseWalletRepository franchiseWalletRepo;
    private final FranchiseTransDetRepository franchiseTxnRepo;
    private final SettlementBatchCandidateRepository candidateRepo;

    public EnhancedSettlementService(ProductSerialsRepository serialRepo,
                                     VendorTransactionsRepository vendorRepo,
                                     MerchantSettlementBatchRepository batchRepo,
                                     MerchantWalletRepository walletRepo,
                                     MerchantRepository merchantRepository,
                                     MerchantTransDetRepository merchantTxnRepo,
                                     ProductSchemeAssignmentRepository schemeAssignRepo,
                                     CardRateRepository cardRateRepo,
                                     FranchiseWalletRepository franchiseWalletRepo,
                                     FranchiseTransDetRepository franchiseTxnRepo,
                                     SettlementBatchCandidateRepository candidateRepo) {
        this.serialRepo = serialRepo;
        this.vendorRepo = vendorRepo;
        this.batchRepo = batchRepo;
        this.walletRepo = walletRepo;
        this.merchantRepository = merchantRepository;
        this.merchantTxnRepo = merchantTxnRepo;
        this.schemeAssignRepo = schemeAssignRepo;
        this.cardRateRepo = cardRateRepo;
        this.franchiseWalletRepo = franchiseWalletRepo;
        this.franchiseTxnRepo = franchiseTxnRepo;
        this.candidateRepo = candidateRepo;
    }

    @Transactional
    public MerchantSettlementBatch getOrCreateActiveBatch(Long merchantId, String cycleKey, String createdBy) {
        // For direct merchants, reuse existing batches
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        if (merchant.getFranchise() == null) {
            // Direct merchant - reuse existing batch
            Optional<MerchantSettlementBatch> existing = batchRepo
                    .findByMerchantIdAndCycleKeyAndStatusIn(
                            merchantId,
                            cycleKey,
                            Arrays.asList("DRAFT", "OPEN")
                    );
            return existing.orElseGet(() -> createBatch(merchantId, cycleKey, createdBy));
        } else {
            // Franchise merchant - always create new batch for bulk processing
            return createBatch(merchantId, cycleKey, createdBy);
        }
    }

    public MerchantSettlementBatch createBatch(Long merchantId, String cycleKey, String createdBy) {
        LocalDateTime windowEnd = switch (cycleKey == null ? "" : cycleKey.toUpperCase()) {
            case "T0" -> LocalDateTime.now();
            case "T1" -> LocalDate.now().atTime(23, 59, 59);
            case "T2" -> LocalDate.now().plusDays(1).atTime(23, 59, 59);
            default -> throw new IllegalArgumentException("Unknown cycleKey: " + cycleKey);
        };

        List<Object[]> rows = serialRepo.findDeviceIdentifiersByMerchant(merchantId);
        Set<String> mids = new HashSet<>();
        for (Object[] r : rows) if (r[0] != null) mids.add((String) r[0]);

        LocalDateTime fallbackStart = merchantRepository.findById(merchantId)
                .map(m -> m.getCreatedAt() != null ? m.getCreatedAt() : LocalDateTime.now())
                .orElse(LocalDateTime.now());

        LocalDateTime windowStart = mids.isEmpty()
                ? fallbackStart
                : vendorRepo.findEarliestUnsettledDateByMids(new ArrayList<>(mids)).orElse(fallbackStart);

        MerchantSettlementBatch batch = new MerchantSettlementBatch();
        batch.setMerchantId(merchantId);
        batch.setWindowStart(windowStart);
        batch.setWindowEnd(windowEnd);
        batch.setCycleKey(cycleKey);
        batch.setCreatedBy(createdBy);
        batch.setStatus("OPEN");
        return batchRepo.save(batch);
    }

    @Transactional
    public MerchantSettlementBatch updateBatchCandidates(Long batchId, List<String> vendorTxIds) {
        MerchantSettlementBatch batch = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        if (!"DRAFT".equals(batch.getStatus()) && !"OPEN".equals(batch.getStatus())) {
            throw new IllegalStateException("Cannot modify batch in " + batch.getStatus() + " state");
        }

        candidateRepo.deleteByBatchId(batchId);

        int validCandidates = 0;
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalFees = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;

        for (String vendorTxId : vendorTxIds) {
            VendorTransactions vt = vendorRepo.findByTransactionReferenceId(vendorTxId)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + vendorTxId));

            SettlementCandidateDTO dto = mapToSettlementCandidate(vt, batch.getMerchantId());
            if (dto.getError() == null) {
                SettlementBatchCandidate candidate = new SettlementBatchCandidate(
                        batchId, vendorTxId, dto.getAmount(), dto.getFee(), dto.getNetAmount());
                candidateRepo.save(candidate);

                validCandidates++;
                totalAmount = totalAmount.add(dto.getAmount());
                totalFees = totalFees.add(dto.getFee());
                totalNet = totalNet.add(dto.getNetAmount());
            }
        }

        batch.setTotalTransactions(validCandidates);
        batch.setTotalAmount(totalAmount);
        batch.setTotalFees(totalFees);
        batch.setTotalNetAmount(totalNet);
        batch.setStatus("OPEN");
        processBatchWithTracking(batch.getId());
        return batchRepo.save(batch);
    }

    @Async("settlementExecutor")
    public void processBatchWithTracking(Long batchId) {
        MerchantSettlementBatch batch = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));

        try {
            batch.setStatus("PROCESSING");
            batch.setProcessingStartedAt(LocalDateTime.now());
            batchRepo.save(batch);

            List<SettlementBatchCandidate> candidates = candidateRepo.findByBatchIdAndStatus(
                    batchId, SettlementBatchCandidate.CandidateStatus.SELECTED);

            int processed = 0, failed = 0;

            for (SettlementBatchCandidate candidate : candidates) {
                try {
                    candidate.setStatus(SettlementBatchCandidate.CandidateStatus.PROCESSING);
                    candidateRepo.save(candidate);

                    SettlementResultDTO result = settleOneEnhanced(batch.getMerchantId(), batchId, candidate.getVendorTxId());

                    if ("OK".equals(result.getStatus())) {
                        candidate.setStatus(SettlementBatchCandidate.CandidateStatus.COMPLETED);
                        processed++;
                    } else {
                        candidate.setStatus(SettlementBatchCandidate.CandidateStatus.FAILED);
                        failed++;
                    }
                    candidateRepo.save(candidate);

                } catch (Exception e) {
                    log.error("Failed to settle candidate {} in batch {}", candidate.getVendorTxId(), batchId, e);
                    candidate.setStatus(SettlementBatchCandidate.CandidateStatus.FAILED);
                    candidateRepo.save(candidate);
                    failed++;
                }
            }

            batch.setProcessedTransactions(processed);
            batch.setFailedTransactions(failed);
            batch.setProcessingCompletedAt(LocalDateTime.now());

            if (failed == 0 && processed > 0) {
                batch.setStatus("COMPLETED");
            } else if (processed > 0 && failed > 0) {
                batch.setStatus("PARTIALLY_COMPLETED");
            } else if (failed > 0 && processed == 0) {
                batch.setStatus("FAILED");
                batch.setErrorMessage("All transactions failed to process");
            } else {
                batch.setStatus("COMPLETED");
            }

            batchRepo.save(batch);

        } catch (Exception e) {
            log.error("Batch processing failed for batch {}", batchId, e);
            batch.setStatus("FAILED");
            batch.setErrorMessage(e.getMessage());
            batch.setProcessingCompletedAt(LocalDateTime.now());
            batchRepo.save(batch);
        }
    }

    @Async("settlementExecutor")
    public void resumeBatch(Long batchId) {
        MerchantSettlementBatch batch = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));

        if (!"PARTIALLY_COMPLETED".equals(batch.getStatus()) && !"FAILED".equals(batch.getStatus())) {
            throw new IllegalStateException("Batch cannot be resumed. Current status: " + batch.getStatus());
        }

        candidateRepo.updateFailedCandidatesToSelected(batchId);
        processBatchWithTracking(batchId);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SettlementResultDTO settleOneEnhanced(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
        if (vendorTxPrimaryKey == null || vendorTxPrimaryKey.isBlank()) {
            throw new IllegalArgumentException("vendorTxPrimaryKey is blank");
        }

        VendorTransactions vt = vendorRepo.findByTransactionReferenceId(vendorTxPrimaryKey)
                .orElseThrow(() -> new IllegalStateException("Vendor tx not found: " + vendorTxPrimaryKey));

        if (Boolean.TRUE.equals(vt.getSettled())) {
            log.info("Vendor tx {} already settled. Skipping.", vt.getTransactionReferenceId());
            return SettlementResultDTO.alreadySettled(vt.getTransactionReferenceId());
        }

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalStateException("Merchant not found: " + merchantId));

        ProductSerialNumbers device = findDeviceForTransaction(vt)
                .orElseThrow(() -> new IllegalStateException("Device not found for transaction: " + vendorTxPrimaryKey));

        if (!merchantId.equals(device.getMerchant().getId())) {
            throw new IllegalStateException("Transaction belongs to different merchant");
        }

        ProductSchemeAssignment schemeAssignment = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction())
                .orElseThrow(() -> new IllegalStateException("No pricing scheme found"));

        String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
        CardRate cr = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                        schemeAssignment.getScheme().getId(), cardName)
                .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                        schemeAssignment.getScheme().getId(), "DEFAULT"))
                .orElseThrow(() -> new IllegalStateException("No card rate found"));

        BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
        boolean isFranchiseMerchant = merchant.getFranchise() != null;

        if (isFranchiseMerchant) {
            return processFranchiseMerchantSettlement(merchant, vt, cr, amount, batchId, device);
        } else {
            return processDirectMerchantSettlement(merchant, vt, cr, amount, batchId, device);
        }
    }

    private SettlementResultDTO processDirectMerchantSettlement(Merchant merchant, VendorTransactions vt,
                                                                CardRate cr, BigDecimal amount, Long batchId, ProductSerialNumbers device) {

        // For direct merchants, use the single 'rate' field
        Double rateValue = cr.getRate();
        if (rateValue == null) {
            throw new IllegalStateException("No rate configured for card: " + cr.getCardName());
        }

        BigDecimal feePct = amount.signum() > 0
                ? BigDecimal.valueOf(rateValue).movePointLeft(2)
                : BigDecimal.ZERO;
        BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
        if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
        BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);

        MerchantWallet wallet = updateMerchantWallet(merchant.getId(), net, amount);
        createMerchantTransactionDetails(merchant, vt, amount, fee, wallet.getAvailableBalance(), batchId);
        markTransactionSettled(vt, batchId);

        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, fee, net, wallet.getAvailableBalance());
    }

    private SettlementResultDTO processFranchiseMerchantSettlement(Merchant merchant, VendorTransactions vt,
                                                                   CardRate cr, BigDecimal amount, Long batchId, ProductSerialNumbers device) {

        Franchise franchise = merchant.getFranchise();
        if (franchise == null) {
            throw new IllegalStateException("Merchant does not belong to a franchise");
        }

        Double merchantRatePercent = cr.getMerchantRate();
        Double franchiseRatePercent = cr.getFranchiseRate();

        // If dual rates are not configured, fall back to single rate for direct processing
        if (merchantRatePercent == null || franchiseRatePercent == null) {
            log.warn("Dual rates not configured for card: {}. Using single rate.", cr.getCardName());
            return processDirectMerchantSettlement(merchant, vt, cr, amount, batchId, device);
        }

        // Validate dual rates
        if (merchantRatePercent < franchiseRatePercent) {
            log.warn("Merchant rate ({}) is less than franchise rate ({}) for card: {}. This may cause negative commission.",
                    merchantRatePercent, franchiseRatePercent, cr.getCardName());
        }

        BigDecimal merchantRate = BigDecimal.valueOf(merchantRatePercent).movePointLeft(2);
        BigDecimal franchiseRate = BigDecimal.valueOf(franchiseRatePercent).movePointLeft(2);

        BigDecimal merchantFee = amount.multiply(merchantRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal franchiseFee = amount.multiply(franchiseRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal franchiseCommission = merchantFee.subtract(franchiseFee).setScale(2, RoundingMode.HALF_UP);

        // Merchant gets: amount - merchantFee
        BigDecimal merchantNet = amount.subtract(merchantFee);

        MerchantWallet merchantWallet = updateMerchantWallet(merchant.getId(), merchantNet, amount);
        FranchiseWallet franchiseWallet = updateFranchiseWallet(franchise.getId(), franchiseCommission);

        createMerchantTransactionDetails(merchant, vt, amount, merchantFee, merchantWallet.getAvailableBalance(), batchId);
        createFranchiseTransactionDetails(franchise, vt, amount, franchiseCommission,
                franchiseWallet != null ? franchiseWallet.getAvailableBalance() : BigDecimal.ZERO, batchId);

        markTransactionSettled(vt, batchId);

        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, merchantFee, merchantNet, merchantWallet.getAvailableBalance());
    }

    private MerchantWallet updateMerchantWallet(Long merchantId, BigDecimal net, BigDecimal amount) {
        MerchantWallet wallet = walletRepo.findByMerchantIdForUpdate(merchantId).orElseGet(() -> {
            MerchantWallet w = new MerchantWallet();
            Merchant mRef = new Merchant();
            mRef.setId(merchantId);
            w.setMerchant(mRef);
            w.setAvailableBalance(BigDecimal.ZERO);
            w.setLastUpdatedAmount(BigDecimal.ZERO);
            w.setLastUpdatedAt(LocalDateTime.now());
            w.setTotalCash(BigDecimal.ZERO);
            w.setCutOfAmount(BigDecimal.ZERO);
            return walletRepo.save(w);
        });

        BigDecimal before = nvl(wallet.getAvailableBalance());
        BigDecimal after = before.add(net);
        wallet.setAvailableBalance(after);
        wallet.setLastUpdatedAmount(net);
        wallet.setLastUpdatedAt(LocalDateTime.now());
        wallet.setTotalCash(nvl(wallet.getTotalCash()).add(amount.max(BigDecimal.ZERO)));

        return walletRepo.save(wallet);
    }

    private FranchiseWallet updateFranchiseWallet(Long franchiseId, BigDecimal commission) {
        if (commission.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        FranchiseWallet wallet = franchiseWalletRepo.findByFranchiseIdForUpdate(franchiseId)
                .orElseGet(() -> {
                    FranchiseWallet w = new FranchiseWallet();
                    Franchise fRef = new Franchise();
                    fRef.setId(franchiseId);
                    w.setFranchise(fRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    w.setLastUpdatedAmount(BigDecimal.ZERO);
                    w.setLastUpdatedAt(LocalDateTime.now());
                    w.setTotalCash(BigDecimal.ZERO);
                    w.setCutOfAmount(BigDecimal.ZERO);
                    return franchiseWalletRepo.save(w);
                });

        BigDecimal before = nvl(wallet.getAvailableBalance());
        BigDecimal after = before.add(commission);
        wallet.setAvailableBalance(after);
        wallet.setLastUpdatedAmount(commission);
        wallet.setLastUpdatedAt(LocalDateTime.now());

        return franchiseWalletRepo.save(wallet);
    }

    private void createMerchantTransactionDetails(Merchant merchant, VendorTransactions vt,
                                                  BigDecimal amount, BigDecimal fee, BigDecimal balanceAfter, Long batchId) {

        if (!merchantTxnRepo.existsByVendorTransactionId(vt.getInternalId().toString())) {
            MerchantTransactionDetails mtd = new MerchantTransactionDetails();
            mtd.setMerchant(merchant);
            mtd.setCharge(fee);
            mtd.setVendorTransactionId(vt.getInternalId().toString());
            mtd.setDateAndTimeOfTransaction(vt.getDate());
            mtd.setAmount(amount);
            mtd.setFinalBalance(balanceAfter);
            mtd.setBalAfterTran(balanceAfter);
            mtd.setTranStatus("SETTLED");
            mtd.setTransactionType("SETTLEMENT");
            mtd.setRemarks("Batch " + batchId + " settlement");
            merchantTxnRepo.save(mtd);
        }
    }

    private void createFranchiseTransactionDetails(Franchise franchise, VendorTransactions vt,
                                                   BigDecimal amount, BigDecimal commission, BigDecimal balanceAfter, Long batchId) {

        if (commission.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        String vendorTxKey = vt.getInternalId().toString() + "_FRANCHISE";
        if (!franchiseTxnRepo.existsByVendorTransactionId(vendorTxKey)) {
            FranchiseTransactionDetails ftd = new FranchiseTransactionDetails();
            ftd.setFranchise(franchise);
            ftd.setVendorTransactionId(vendorTxKey);
            ftd.setDateAndTimeOfTransaction(vt.getDate());
            ftd.setAmount(commission);
            ftd.setFinalBalance(balanceAfter);
            ftd.setBalAfterTran(balanceAfter);
            ftd.setTranStatus("SETTLED");
            ftd.setTransactionType("COMMISSION");
            ftd.setRemarks("Batch " + batchId + " commission from merchant transaction " + vt.getTransactionReferenceId());
            franchiseTxnRepo.save(ftd);
        }
    }

    private void markTransactionSettled(VendorTransactions vt, Long batchId) {
        vt.setSettled(true);
        vt.setSettledAt(LocalDateTime.now());
        vt.setSettlementBatchId(batchId);
        vendorRepo.save(vt);
    }

    public List<SettlementCandidateDTO> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
        // Validate merchant exists
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        List<Object[]> deviceData = serialRepo.findDeviceIdentifiersByMerchant(merchantId);

        if (deviceData.isEmpty()) {
            log.warn("No devices found for merchant {}", merchantId);
            return Collections.emptyList();
        }

        Set<String> mids = new HashSet<>(), tids = new HashSet<>();
        for (Object[] row : deviceData) {
            if (row[0] != null) mids.add((String) row[0]);
            if (row[1] != null) tids.add((String) row[1]);
        }

        List<VendorTransactions> candidates = vendorRepo.findCandidates(
                from, to,
                mids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(mids),
                tids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(tids)
        );

        return candidates.stream().map(vt -> mapToSettlementCandidate(vt, merchantId))
                .collect(Collectors.toList());
    }

    public List<SettlementCandidateDTO> listSettlementCandidatesForFranchise(Long merchantId, String cycleKey) {
        // Validate merchant exists and get franchise info
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        MerchantSettlementBatch tempBatch = createBatch(merchantId, cycleKey, "TEMP");
        LocalDateTime windowStart = tempBatch.getWindowStart();
        LocalDateTime windowEnd = tempBatch.getWindowEnd();

        batchRepo.delete(tempBatch);

        return listSettlementCandidates(merchantId, windowStart, windowEnd);
    }

    private SettlementCandidateDTO mapToSettlementCandidate(VendorTransactions vt, Long expectedMerchantId) {
        try {
            Optional<ProductSerialNumbers> deviceOpt = findDeviceForTransaction(vt);
            if (deviceOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "DEVICE_NOT_FOUND");
            }

            ProductSerialNumbers device = deviceOpt.get();

            if (!expectedMerchantId.equals(device.getMerchant().getId())) {
                return SettlementCandidateDTO.notFound(vt, "WRONG_MERCHANT");
            }

            Optional<ProductSchemeAssignment> schemeOpt = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction());
            if (schemeOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "NO_PRICING_SCHEME");
            }

            ProductSchemeAssignment scheme = schemeOpt.get();

            LocalDate txnDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
            if (scheme.getExpiryDate() != null && txnDate.isAfter(scheme.getExpiryDate())) {
                return SettlementCandidateDTO.notFound(vt, "SCHEME_EXPIRED");
            }

            String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
            Optional<CardRate> crOpt = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                            scheme.getScheme().getId(), cardName)
                    .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                            scheme.getScheme().getId(), "DEFAULT"));

            if (crOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "NO_CARD_RATE");
            }

            CardRate cr = crOpt.get();

            BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();

            // Check if merchant is franchise merchant and use appropriate rate
            Merchant merchant = device.getMerchant();
            boolean isFranchiseMerchant = merchant.getFranchise() != null;

            Double rateToUse;
            if (isFranchiseMerchant && cr.getMerchantRate() != null) {
                rateToUse = cr.getMerchantRate(); // Use merchant rate for franchise merchants
            } else {
                rateToUse = cr.getRate(); // Use standard rate for direct merchants
            }

            if (rateToUse == null) {
                return SettlementCandidateDTO.notFound(vt, "NO_RATE_CONFIGURED");
            }

            BigDecimal feePct = amount.signum() > 0
                    ? BigDecimal.valueOf(rateToUse).movePointLeft(2)
                    : BigDecimal.ZERO;
            BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
            if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
            BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);

            return new SettlementCandidateDTO(
                    vt.getInternalId(),
                    vt.getTransactionReferenceId(),
                    vt.getDate(),
                    amount,
                    vt.getCardType(),
                    vt.getBrandType(),
                    cardName,
                    rateToUse,
                    fee,
                    net,
                    null
            );

        } catch (Exception ex) {
            log.error("Error mapping vendor transaction {}", vt.getInternalId(), ex);
            return SettlementCandidateDTO.notFound(vt, "MAPPING_ERROR: " + ex.getMessage());
        }
    }

    private Optional<ProductSerialNumbers> findDeviceForTransaction(VendorTransactions vt) {
        if (vt.getMid() != null && vt.getTid() != null) {
            List<ProductSerialNumbers> devices = serialRepo.findByMidAndTid(vt.getMid(), vt.getTid());
            if (!devices.isEmpty()) {
                return Optional.of(devices.get(0));
            }
        }

        if (vt.getMid() != null) {
            Optional<ProductSerialNumbers> device = serialRepo.findByMid(vt.getMid());
            if (device.isPresent()) {
                return device;
            }
        }

        if (vt.getTid() != null) {
            Optional<ProductSerialNumbers> device = serialRepo.findByTid(vt.getTid());
            if (device.isPresent()) {
                return device;
            }
        }

        return Optional.empty();
    }

    @Transactional(readOnly = true)
    public MerchantSettlementBatch getBatchById(Long batchId) {
        return batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));
    }

    @Transactional(readOnly = true)
    public BatchProgressDTO getBatchProgress(Long batchId) {
        MerchantSettlementBatch batch = getBatchById(batchId);

        BatchProgressDTO progress = new BatchProgressDTO();
        progress.setBatchId(batchId);
        progress.setStatus(batch.getStatus());
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

    @Transactional(readOnly = true)
    public List<MerchantSettlementBatch> getAllBatchesByMerchant(Long merchantId, int limit) {
        return batchRepo.findByMerchantIdOrderByCreatedAtDesc(merchantId, PageRequest.of(0, limit)).getContent();
    }

    @Transactional
    public void markBatchProcessing(Long batchId) {
        MerchantSettlementBatch b = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
        b.setStatus("PROCESSING");
        batchRepo.save(b);
    }

    @Transactional
    public void markBatchClosed(Long batchId) {
        MerchantSettlementBatch b = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
        b.setStatus("CLOSED");
        batchRepo.save(b);
    }

    private BigDecimal nvl(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalizeCardName(String brandType, String cardType) {
        if (brandType == null) brandType = "";
        if (cardType == null) cardType = "";
        return (brandType + " " + cardType).trim();
    }
}