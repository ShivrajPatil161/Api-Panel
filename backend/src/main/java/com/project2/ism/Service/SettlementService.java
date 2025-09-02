package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
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
import java.util.stream.Collectors;

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
//    public List<SettlementCandidateDTO> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
//        List<Object[]> rows = serialRepo.findIdentifiersByMerchant(merchantId);
//        Set<String> mids = new HashSet<>(), tids = new HashSet<>(), sids = new HashSet<>();
//        for (Object[] r : rows) {
//            if (r[0] != null) mids.add((String) r[0]);
//            if (r[1] != null) tids.add((String) r[1]);
//            if (r[2] != null) sids.add((String) r[2]);
//        }
//
//        List<VendorTransactions> candidates = vendorRepo.findCandidates(
//                from, to,
//                mids.isEmpty() ? List.of("") : new ArrayList<>(mids), mids.size(),
//                tids.isEmpty() ? List.of("") : new ArrayList<>(tids), tids.size(),
//                sids.isEmpty() ? List.of("") : new ArrayList<>(sids), sids.size()
//        );
//
//        return candidates.stream().map(vt -> {
//            try {
//                // determine scheme
//                LocalDate onDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
//                Optional<ProductSchemeAssignment> optAssign = schemeAssignRepo.findActiveScheme(merchantId, onDate);
//                if (optAssign.isEmpty()) {
//                    log.warn("No active pricing scheme for merchant {} on {}", merchantId, onDate);
//                    return SettlementCandidateDTO.notFound(vt, "NO_ACTIVE_SCHEME");
//                }
//
//                String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
//
//                Optional<CardRate> optCr = cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(
//                        optAssign.get().getScheme().getId(), cardName
//                ).or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(
//                        optAssign.get().getScheme().getId(), "DEFAULT"
//                ));
//
//                if (optCr.isEmpty()) {
//                    log.warn("No card rate found for '{}' (or DEFAULT) in scheme {}", cardName, optAssign.get().getScheme().getId());
//                    return SettlementCandidateDTO.notFound(vt, "NO_CARD_RATE");
//                }
//
//                CardRate cr = optCr.get();
//
//                // money math
//                BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
//                BigDecimal feePct = amount.signum() > 0
//                        ? BigDecimal.valueOf(cr.getRate()).movePointLeft(2)
//                        : BigDecimal.ZERO;
//                BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
//                if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
//                BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);
//
//                return new SettlementCandidateDTO(
//                        vt.getInternalId(),
//                        vt.getTransactionReferenceId(),
//                        vt.getDate(),
//                        amount,
//                        vt.getCardType(),
//                        vt.getBrandType(),
//                        cardName,
//                        cr.getRate(),
//                        fee,
//                        net,
//                        null // no error
//                );
//            } catch (Exception ex) {
//                log.error("Unexpected error while mapping vendor transaction {}", vt.getInternalId(), ex);
//                return SettlementCandidateDTO.notFound(vt, "UNEXPECTED_ERROR");
//            }
//        }).toList();
//    }


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

        // Validate merchant existence
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalStateException("Merchant not found: " + merchantId));

        // FIXED: Find the device that processed this transaction
        ProductSerialNumbers device = findDeviceForTransaction(vt)
                .orElseThrow(() -> new IllegalStateException(
                        "No device found for transaction " + vendorTxPrimaryKey +
                                " (MID:" + vt.getMid() + ", TID:" + vt.getTid() + ", DeviceSerial:" + vt.getDeviceSerial() + ")"));

        // FIXED: Verify the device belongs to the specified merchant
        if (!merchantId.equals(device.getMerchant().getId())) {
            throw new IllegalStateException(
                    "Transaction " + vendorTxPrimaryKey + " belongs to merchant " + device.getMerchant().getId() +
                            ", not " + merchantId);
        }

        // FIXED: Get the pricing scheme from the device's outward transaction
        ProductSchemeAssignment schemeAssignment = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction())
                .orElseThrow(() -> new IllegalStateException(
                        "No pricing scheme found for device " + device.getId() +
                                " from outward transaction " + device.getOutwardTransaction().getId()));

        // Validate scheme is still active for transaction date
        LocalDate txnDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
        if (schemeAssignment.getExpiryDate() != null && txnDate.isAfter(schemeAssignment.getExpiryDate())) {
            throw new IllegalStateException(
                    "Pricing scheme expired on " + schemeAssignment.getExpiryDate() +
                            " but transaction is from " + txnDate);
        }

        // Find card rate
        String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
        CardRate cr = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                        schemeAssignment.getScheme().getId(), cardName)
                .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                        schemeAssignment.getScheme().getId(), "DEFAULT"))
                .orElseThrow(() -> new IllegalStateException(
                        "No card rate found for '" + cardName + "' or DEFAULT in scheme " +
                                schemeAssignment.getScheme().getSchemeCode()));

        // Money calculations
        BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
        BigDecimal feePct = amount.signum() > 0
                ? BigDecimal.valueOf(cr.getRate()).movePointLeft(2)
                : BigDecimal.ZERO;
        BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
        if (fee.compareTo(amount.abs()) > 0) fee = amount.abs();
        BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);

        // Wallet update with proper locking
        MerchantWallet wallet = walletRepo.findByMerchantIdForUpdate(merchantId).orElseGet(() -> {
            MerchantWallet w = new MerchantWallet();
            w.setMerchant(merchant);
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

        walletRepo.save(wallet);

        // Create transaction details
        if (!merchantTxnRepo.existsByVendorTransactionId(vt.getInternalId().toString())) {
            MerchantTransactionDetails mtd = new MerchantTransactionDetails();
            mtd.setMerchant(merchant);
            mtd.setCharge(fee);
            mtd.setVendorTransactionId(vt.getInternalId().toString());
            mtd.setDateAndTimeOfTransaction(vt.getDate());
            mtd.setAmount(amount);
            mtd.setFinalBalance(after);
            mtd.setBalBeforeTran(before);
            mtd.setBalAfterTran(after);
            mtd.setCardType(vt.getCardType());
            mtd.setTranStatus("SETTLED");
            mtd.setRemarks("Batch " + batchId + " fee=" + fee +
                    " scheme=" + schemeAssignment.getScheme().getSchemeCode() +
                    " device=" + device.getId());
            merchantTxnRepo.save(mtd);
        }

        // Mark as settled
        vt.setSettled(true);
        vt.setSettledAt(LocalDateTime.now());
        vt.setSettlementBatchId(batchId);
        vendorRepo.save(vt);

        return SettlementResultDTO.ok(vt.getTransactionReferenceId(), amount, fee, net, after);
    }

    public List<SettlementCandidateDTO> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
        // Get all device identifiers for this merchant
        List<Object[]> deviceData = serialRepo.findDeviceIdentifiersByMerchant(merchantId);

        if (deviceData.isEmpty()) {
            log.warn("No devices found for merchant {}", merchantId);
            return Collections.emptyList();
        }

        Set<String> mids = new HashSet<>(), tids = new HashSet<>(), deviceSerials = new HashSet<>();
        for (Object[] row : deviceData) {
            if (row[0] != null) mids.add((String) row[0]);      // MID
            if (row[1] != null) tids.add((String) row[1]);      // TID
            if (row[2] != null) deviceSerials.add((String) row[2]); // Device Serial
        }

        // Find candidate transactions
        List<VendorTransactions> candidates = vendorRepo.findCandidates(
                from, to,
                mids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(mids),
                tids.isEmpty() ? List.of("__NONE__") : new ArrayList<>(tids)
                //deviceSerials.isEmpty() ? List.of("__NONE__") : new ArrayList<>(deviceSerials)
        );

        return candidates.stream().map(vt -> mapToSettlementCandidate(vt, merchantId))
                .collect(Collectors.toList());
    }

    private SettlementCandidateDTO mapToSettlementCandidate(VendorTransactions vt, Long expectedMerchantId) {
        try {
            // Find the device for this transaction
            Optional<ProductSerialNumbers> deviceOpt = findDeviceForTransaction(vt);
            if (deviceOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "DEVICE_NOT_FOUND");
            }

            ProductSerialNumbers device = deviceOpt.get();

            // Verify merchant ownership
            if (!expectedMerchantId.equals(device.getMerchant().getId())) {
                return SettlementCandidateDTO.notFound(vt, "WRONG_MERCHANT");
            }

            // Get pricing scheme
            Optional<ProductSchemeAssignment> schemeOpt = schemeAssignRepo.findByOutwardTransaction(device.getOutwardTransaction());
            if (schemeOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "NO_PRICING_SCHEME");
            }

            ProductSchemeAssignment scheme = schemeOpt.get();

            // Check if scheme is still valid for transaction date
            LocalDate txnDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
            if (scheme.getExpiryDate() != null && txnDate.isAfter(scheme.getExpiryDate())) {
                return SettlementCandidateDTO.notFound(vt, "SCHEME_EXPIRED");
            }

            // Find card rate
            String cardName = normalizeCardName(vt.getBrandType(), vt.getCardType());
            Optional<CardRate> crOpt = cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                            scheme.getScheme().getId(), cardName)
                    .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameContainingIgnoreCase(
                            scheme.getScheme().getId(), "DEFAULT"));

            if (crOpt.isEmpty()) {
                return SettlementCandidateDTO.notFound(vt, "NO_CARD_RATE");
            }

            CardRate cr = crOpt.get();

            // Calculate fees
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
            log.error("Error mapping vendor transaction {}", vt.getInternalId(), ex);
            return SettlementCandidateDTO.notFound(vt, "MAPPING_ERROR: " + ex.getMessage());
        }
    }

    /**
     * Find the POS device that processed this transaction by matching identifiers
     */
    private Optional<ProductSerialNumbers> findDeviceForTransaction(VendorTransactions vt) {
        // Try to find by multiple identifiers (MID, TID, DeviceSerial)
        // Priority: MID+TID combo, then individual matches

        if (vt.getMid() != null && vt.getTid() != null) {
            List<ProductSerialNumbers> devices = serialRepo.findByMidAndTid(vt.getMid(), vt.getTid());
            if (!devices.isEmpty()) {

                // pick first or decide how to handle multiple
                return Optional.of(devices.get(0));
            }

        }

//    if (vt.getDeviceSerial() != null) {
//        Optional<ProductSerialNumbers> device = serialRepo.findByDeviceSerial(vt.getDeviceSerial());
//        System.out.println("[DEBUG] Checking DeviceSerial -> " + vt.getDeviceSerial() +
//                           " | Found? " + device.isPresent());
//        if (device.isPresent()) return device;
//    }

        if (vt.getMid() != null) {
            Optional<ProductSerialNumbers> device = serialRepo.findByMid(vt.getMid());
            System.out.println("[DEBUG] Checking MID only -> mid=" + vt.getMid() +
                    " | Found? " + device.isPresent());
            if (device.isPresent()) {
                System.out.println("[DEBUG] Device from MID: " + device.get());
                return device;
            }
        }

        if (vt.getTid() != null) {
            Optional<ProductSerialNumbers> device = serialRepo.findByTid(vt.getTid());
            System.out.println("[DEBUG] Checking TID only -> tid=" + vt.getTid() +
                    " | Found? " + device.isPresent());
            if (device.isPresent()) {
                System.out.println("[DEBUG] Device from TID: " + device.get());
                return device;
            }
        }

        System.out.println("[DEBUG] No device found for VendorTransaction id=" + vt.getTransactionReferenceId());
        return Optional.empty();
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
