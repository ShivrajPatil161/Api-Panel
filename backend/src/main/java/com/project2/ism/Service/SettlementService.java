package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.PricingScheme.CardRate;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SettlementService {

    private static final Logger log = LoggerFactory.getLogger(SettlementService.class);

    private final ProductSerialsRepository serialRepo;
    private final VendorTransactionsRepository vendorRepo;
    private final MerchantSettlementBatchRepository batchRepo;
    private final MerchantWalletRepository walletRepo;
    private final MerchantRepository merchantRepository;
    private final MerchantTransDetRepository merchantTxnRepo;
    private final ProductSchemeAssignmentRepository schemeAssignRepo;
    private final CardRateRepository cardRateRepo;

    public SettlementService(ProductSerialsRepository serialRepo,
                             VendorTransactionsRepository vendorRepo,
                             MerchantSettlementBatchRepository batchRepo,
                             MerchantWalletRepository walletRepo,
                             MerchantRepository merchantRepository,
                             MerchantTransDetRepository merchantTxnRepo,
                             ProductSchemeAssignmentRepository schemeAssignRepo,
                             CardRateRepository cardRateRepo) {
        this.serialRepo = serialRepo;
        this.vendorRepo = vendorRepo;
        this.batchRepo = batchRepo;
        this.walletRepo = walletRepo;
        this.merchantRepository = merchantRepository;
        this.merchantTxnRepo = merchantTxnRepo;
        this.schemeAssignRepo = schemeAssignRepo;
        this.cardRateRepo = cardRateRepo;
    }

    /* ---------- candidates listing (unchanged) ---------- */
//    public List<VendorTransactions> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
//        List<Object[]> rows = serialRepo.findIdentifiersByMerchant(merchantId);
//        Set<String> mids = new HashSet<>(), tids = new HashSet<>(), sids = new HashSet<>();
//        for (Object[] r : rows) {
//            if (r[0] != null) mids.add((String) r[0]);
//            if (r[1] != null) tids.add((String) r[1]);
//            if (r[2] != null) sids.add((String) r[2]);
//        }
//        return vendorRepo.findCandidates(
//                from, to,
//                mids.isEmpty() ? List.of("") : new ArrayList<>(mids), mids.size(),
//                tids.isEmpty() ? List.of("") : new ArrayList<>(tids), tids.size(),
//                sids.isEmpty() ? List.of("") : new ArrayList<>(sids), sids.size()
//        );
//    }
    public List<SettlementCandidateDTO> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = serialRepo.findIdentifiersByMerchant(merchantId);
        Set<String> mids = new HashSet<>(), tids = new HashSet<>(), sids = new HashSet<>();
        for (Object[] r : rows) {
            if (r[0] != null) mids.add((String) r[0]);
            if (r[1] != null) tids.add((String) r[1]);
            if (r[2] != null) sids.add((String) r[2]);
        }

        List<VendorTransactions> candidates = vendorRepo.findCandidates(
                from, to,
                mids.isEmpty() ? List.of("") : new ArrayList<>(mids), mids.size(),
                tids.isEmpty() ? List.of("") : new ArrayList<>(tids), tids.size(),
                sids.isEmpty() ? List.of("") : new ArrayList<>(sids), sids.size()
        );

        return candidates.stream().map(vt -> {
            try {
                // determine scheme
                LocalDate onDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
                Optional<ProductSchemeAssignment> optAssign = schemeAssignRepo.findActiveScheme(merchantId, onDate);
                if (optAssign.isEmpty()) {
                    log.warn("No active pricing scheme for merchant {} on {}", merchantId, onDate);
                    return SettlementCandidateDTO.notFound(vt, "NO_ACTIVE_SCHEME");
                }

                String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());

                Optional<CardRate> optCr = cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(
                        optAssign.get().getScheme().getId(), cardName
                ).or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(
                        optAssign.get().getScheme().getId(), "DEFAULT"
                ));

                if (optCr.isEmpty()) {
                    log.warn("No card rate found for '{}' (or DEFAULT) in scheme {}", cardName, optAssign.get().getScheme().getId());
                    return SettlementCandidateDTO.notFound(vt, "NO_CARD_RATE");
                }

                CardRate cr = optCr.get();

                // money math
                BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
                BigDecimal feePct = amount.signum() > 0
                        ? BigDecimal.valueOf(cr.getRate()).movePointLeft(2)
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
                        cr.getRate(),
                        fee,
                        net,
                        null // no error
                );
            } catch (Exception ex) {
                log.error("Unexpected error while mapping vendor transaction {}", vt.getInternalId(), ex);
                return SettlementCandidateDTO.notFound(vt, "UNEXPECTED_ERROR");
            }
        }).toList();
    }


    /* ---------- batch creation & status control ---------- */
    public MerchantSettlementBatch createBatch(Long merchantId, String cycleKey, String createdBy) {
        LocalDateTime windowEnd = switch (cycleKey == null ? "" : cycleKey.toUpperCase()) {
            case "T0" -> LocalDateTime.now();
            case "T1" -> LocalDate.now().atTime(23, 59, 59);
            case "T2" -> LocalDate.now().plusDays(1).atTime(23, 59, 59);
            default -> throw new IllegalArgumentException("Unknown cycleKey: " + cycleKey);
        };

        List<Object[]> rows = serialRepo.findIdentifiersByMerchant(merchantId);
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

    public List<MerchantSettlementBatch> getAllBatches(Long merchantId) {
        // NOTE: your repository should have a method like: List<MerchantSettlementBatch> findByMerchantId(Long merchantId)
        return batchRepo.findByMerchantId(merchantId);
    }

    /* ---------- single settlement (ATOMIC) ---------- */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SettlementResultDTO settleOne(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
        if (vendorTxPrimaryKey == null || vendorTxPrimaryKey.isBlank()) {
            throw new IllegalArgumentException("vendorTxPrimaryKey is blank");
        }

        VendorTransactions vt = vendorRepo.findByTransactionReferenceId(vendorTxPrimaryKey)
                .orElseThrow(() -> new IllegalStateException("Vendor tx not found: " + vendorTxPrimaryKey));

        if (Boolean.TRUE.equals(vt.getSettled())) {
            log.info("Vendor tx {} already settled. Skipping.", vt.getTransactionReferenceId());
            return SettlementResultDTO.alreadySettled(vt.getTransactionReferenceId());
        }

        // Validate merchant existence (defensive)
        merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalStateException("Merchant not found: " + merchantId));

        LocalDate onDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();

        ProductSchemeAssignment assign = schemeAssignRepo.findActiveScheme(merchantId, onDate)
                .orElseThrow(() -> new IllegalStateException("No active pricing scheme for merchant " + merchantId));

        String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType()); // e.g., "Visa Credit Card"
        CardRate cr = cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(assign.getScheme().getId(), cardName)
                .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(assign.getScheme().getId(), "DEFAULT"))
                .orElseThrow(() -> new IllegalStateException("No card rate found for '" + cardName + "' or DEFAULT"));

        // Money math
        BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
        // If refunds/voids come as <= 0 amounts, do NOT take a fee
        BigDecimal feePct = amount.signum() > 0
                ? BigDecimal.valueOf(((CardRate) cr).getRate()).movePointLeft(2)
                : BigDecimal.ZERO;
        BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
        if (fee.compareTo(amount.abs()) > 0) fee = amount.abs(); // safety: fee never exceeds absolute amount
        BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);

        // Wallet update (row-level lock; requires active TX)
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
        BigDecimal after  = before.add(net);
        wallet.setAvailableBalance(after);
        wallet.setLastUpdatedAmount(net);
        wallet.setLastUpdatedAt(LocalDateTime.now());
        wallet.setTotalCash(nvl(wallet.getTotalCash()).add(amount.max(BigDecimal.ZERO))); // add only positive sales

        walletRepo.save(wallet);

        // Idempotent merchant txn details
        if (!merchantTxnRepo.existsByVendorTransactionId(vt.getInternalId().toString())) {
            MerchantTransactionDetails mtd = new MerchantTransactionDetails();
            Merchant mRef = new Merchant();
            mRef.setId(merchantId);
            mtd.setMerchant(mRef);
            mtd.setCharge(fee);
            mtd.setVendorTransactionId(vt.getInternalId().toString());
            mtd.setDateAndTimeOfTransaction(vt.getDate());
            mtd.setAmount(amount);
            mtd.setFinalBalance(after);
            mtd.setBalBeforeTran(before);
            mtd.setBalAfterTran(after);
            mtd.setCardType(vt.getCardType());
            mtd.setTranStatus("SETTLED");
            mtd.setRemarks("Batch " + batchId + " fee=" + fee);
            merchantTxnRepo.save(mtd);
        } else {
            log.info("MerchantTransactionDetails already exists for vendorTx internalId={}", vt.getInternalId());
        }

        // Mark vendor transaction settled at the very end (idempotent)
        vt.setSettled(true);
        vt.setSettledAt(LocalDateTime.now());
        vt.setSettlementBatchId(batchId);
        vendorRepo.save(vt);

        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, fee, net, after);
    }

    /* ---------- helpers ---------- */

    private static String normalizeCardName(String brandType, String cardType) {
        String brand = Optional.ofNullable(brandType).orElse("").trim();
        String type  = Optional.ofNullable(cardType).orElse("").trim();
        if (brand.isEmpty() && type.isEmpty()) return "DEFAULT";
        // Your table uses “Visa Credit Card” style, query is ignoreCase, but we’ll format anyway.
        return (brand + " " + type + " Card").trim();
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
