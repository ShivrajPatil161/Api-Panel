package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.PricingScheme.CardRate;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
public class SettlementService {

    private final ProductSerialsRepository serialRepo;
    private final VendorTransactionsRepository vendorRepo;
    private final MerchantSettlementBatchRepository batchRepo;
    private final MerchantWalletRepository walletRepo;
    private final MerchantTransDetRepository merchantTxnRepo;
    private final ProductSchemeAssignmentRepository schemeAssignRepo;
    private final CardRateRepository cardRateRepo;
    private final Executor taskExecutor; // configured bean for async

    public SettlementService(ProductSerialsRepository serialRepo,
                             VendorTransactionsRepository vendorRepo,
                             MerchantSettlementBatchRepository batchRepo,
                             MerchantWalletRepository walletRepo,
                             MerchantTransDetRepository merchantTxnRepo,
                             ProductSchemeAssignmentRepository schemeAssignRepo,
                             CardRateRepository cardRateRepo,
                             @Qualifier("settlementExecutor") Executor taskExecutor) {
        this.serialRepo = serialRepo;
        this.vendorRepo = vendorRepo;
        this.batchRepo = batchRepo;
        this.walletRepo = walletRepo;
        this.merchantTxnRepo = merchantTxnRepo;
        this.schemeAssignRepo = schemeAssignRepo;
        this.cardRateRepo = cardRateRepo;
        this.taskExecutor = taskExecutor;
    }

    /* ---------- candidates listing ---------- */
    public List<VendorTransactions> listSettlementCandidates(Long merchantId, LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = serialRepo.findIdentifiersByMerchant(merchantId);
        Set<String> mids = new HashSet<>(), tids = new HashSet<>(), sids = new HashSet<>();//, vps = new HashSet<>();
        for (Object[] r : rows) {
            if (r[0] != null) mids.add((String) r[0]);
            if (r[1] != null) tids.add((String) r[1]);
            if (r[2] != null) sids.add((String) r[2]);
           // if (r[3] != null) vps.add((String) r[3]);
        }
        return vendorRepo.findCandidates(
                from, to,
                mids.isEmpty() ? List.of("") : new ArrayList<>(mids), mids.size(),
                tids.isEmpty() ? List.of("") : new ArrayList<>(tids), tids.size(),
                sids.isEmpty() ? List.of("") : new ArrayList<>(sids), sids.size()
                //vps.isEmpty() ? List.of("") : new ArrayList<>(vps), vps.size()
        );
    }

    /* ---------- batch creation ---------- */
    public MerchantSettlementBatch createBatch(Long merchantId, LocalDateTime from, LocalDateTime to, String cycleKey, String createdBy) {
        MerchantSettlementBatch batch = new MerchantSettlementBatch();
        batch.setMerchantId(merchantId);
        batch.setWindowStart(from);
        batch.setWindowEnd(to);
        batch.setCycleKey(cycleKey);
        batch.setCreatedBy(createdBy);
        batch.setStatus("OPEN");
        return batchRepo.save(batch);
    }

    /* ---------- async processing entrypoint ---------- */
    public void processBatchAsync(Long batchId, List<String> vendorTxIds) {
        // submit a background task — do not block caller
        CompletableFuture.runAsync(() -> processBatch(batchId, vendorTxIds), taskExecutor)
                .exceptionally(ex -> {
                    // mark batch failed and log
                    MerchantSettlementBatch b = batchRepo.findById(batchId).orElse(null);
                    if (b != null) {
                        b.setStatus("FAILED");
                        batchRepo.save(b);
                    }
                    // log
                    ex.printStackTrace();
                    return null;
                });
        // return immediately
    }

    /* ---------- batch processor (runs in background) ---------- */
    public void processBatch(Long batchId, List<String> vendorTxIds) {
        MerchantSettlementBatch batch = batchRepo.findById(batchId)
                .orElseThrow(() -> new IllegalStateException("Batch not found: " + batchId));
        batch.setStatus("PROCESSING");
        batchRepo.save(batch);

        for (String vendorTxId : vendorTxIds) {
            try {
                SettlementResultDTO res = settleOne(batch.getMerchantId(), batchId, vendorTxId);
                // you might want to persist per-item results in DB for audit
            } catch (Exception ex) {
                // log and continue — optionally mark individual failure details
                ex.printStackTrace();
            }
        }

        batch.setStatus("CLOSED");
        batchRepo.save(batch);
    }

    /* ---------- single transaction settlement (atomic) ---------- */
    @Transactional
    public SettlementResultDTO settleOne(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
        // 1) locate and lock vendor transaction (PESSIMISTIC)
        Long vtId;
        try {
            vtId = Long.valueOf(vendorTxPrimaryKey);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid vendorTx id: " + vendorTxPrimaryKey);
        }

        VendorTransactions vt = vendorRepo.lockById(vtId)
                .orElseThrow(() -> new IllegalStateException("Vendor tx not found: " + vtId));

        if (Boolean.TRUE.equals(vt.getSettled())) {
            return SettlementResultDTO.alreadySettled(vtId);
        }

        // 2) determine active scheme for merchant (by current date or vt.date)
        LocalDate onDate = vt.getDate() != null ? vt.getDate().toLocalDate() : LocalDate.now();
        ProductSchemeAssignment assign = schemeAssignRepo.findActiveScheme(merchantId, onDate)
                .orElseThrow(() -> new IllegalStateException("No active pricing scheme for merchant " + merchantId));

        // 3) lookup card rate (fallback to DEFAULT)
        String cardName = Optional.ofNullable(vt.getCardType()).orElse("DEFAULT");
        CardRate cr = cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(assign.getScheme().getId(), cardName)
                .or(() -> cardRateRepo.findByPricingScheme_IdAndCardNameIgnoreCase(assign.getScheme().getId(), "DEFAULT"))
                .orElseThrow(() -> new IllegalStateException("No card rate found"));

        BigDecimal amount = vt.getAmount() == null ? BigDecimal.ZERO : vt.getAmount();
        BigDecimal feePct = BigDecimal.valueOf(cr.getRate()).movePointLeft(2); // e.g., 2.5 -> 0.025
        BigDecimal fee = amount.multiply(feePct).setScale(2, RoundingMode.HALF_UP);
        BigDecimal net = amount.subtract(fee);

        // 4) update merchant wallet (pessimistic)
        Merchant merchantRef = new Merchant();
        merchantRef.setId(merchantId);


        MerchantWallet wallet = walletRepo.findByMerchantIdForUpdate(merchantId)
                .orElseGet(() -> {
                    MerchantWallet w = new MerchantWallet();
                    w.setMerchant(merchantRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    return walletRepo.save(w);
                });

        BigDecimal before = wallet.getAvailableBalance() == null ? BigDecimal.ZERO : wallet.getAvailableBalance();
        BigDecimal after = before.add(net);
        wallet.setAvailableBalance(after);
        wallet.setLastUpdatedAmount(net);
        wallet.setLastUpdatedAt(LocalDateTime.now());
        wallet.setTotalCash(wallet.getTotalCash() == null ? amount : wallet.getTotalCash().add(amount));
        wallet.setCutOfAmount(wallet.getCutOfAmount() == null ? fee : wallet.getCutOfAmount().add(fee));
        // version will be handled by @Version on save
        walletRepo.save(wallet);

        // 5) insert merchant transaction details (idempotent by vendor_transaction_id)
        MerchantTransactionDetails mtd = new MerchantTransactionDetails();
        mtd.setMerchant(merchantRef);
        mtd.setVendorTransactionId(vt.getInternalId().toString()); // vendor primary key or external id
        mtd.setDateAndTimeOfTransaction(vt.getDate());
        mtd.setAmount(amount);
        mtd.setFinalBalance(after);
        mtd.setBalBeforeTran(before);
        mtd.setBalAfterTran(after);
        mtd.setCardType(vt.getCardType());
        mtd.setTranStatus("SETTLED");
        mtd.setRemarks("Batch " + batchId + " fee=" + fee);
        // transactionId generator can be set or use DB auto-increment id
        merchantTxnRepo.save(mtd);

        // 6) mark vendor tx as settled
        vt.setSettled(true);
        vt.setSettledAt(LocalDateTime.now());
        vt.setSettlementBatchId(batchId);
        vendorRepo.save(vt);

        return SettlementResultDTO.ok(vtId, amount, fee, net, after);
    }
}

