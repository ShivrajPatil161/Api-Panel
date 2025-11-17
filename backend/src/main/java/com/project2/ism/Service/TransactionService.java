package com.project2.ism.Service;

import com.project2.ism.DTO.CallbackDTO.TransactionSchemeDetailsRequestDTO;
import com.project2.ism.Model.AdminTransactionDetails;
import com.project2.ism.Model.AdminWallet;
import com.project2.ism.Model.ApiPartnerTransactionDetails;
import com.project2.ism.Model.ApiPartnerWallet;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Repository.AdminTransactionDetailsRepository;
import com.project2.ism.Repository.AdminWalletRepository;
import com.project2.ism.Repository.ApiPartnerTransDetRepository;
import com.project2.ism.Repository.ApiPartnerWalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class TransactionService {


    private final ApiPartnerWalletRepository apiPartnerWalletRepository;
    private final AdminWalletRepository adminWalletRepository;
    private final ApiPartnerTransDetRepository apiPartnerTransDetRepository;
    private final AdminTransactionDetailsRepository adminTransactionDetailsRepository;

    public TransactionService(ApiPartnerWalletRepository apiPartnerWalletRepository, AdminWalletRepository adminWalletRepository, ApiPartnerTransDetRepository apiPartnerTransDetRepository, AdminTransactionDetailsRepository adminTransactionDetailsRepository) {
        this.apiPartnerWalletRepository = apiPartnerWalletRepository;
        this.adminWalletRepository = adminWalletRepository;
        this.apiPartnerTransDetRepository = apiPartnerTransDetRepository;
        this.adminTransactionDetailsRepository = adminTransactionDetailsRepository;
    }


    @Transactional
    public String processTransaction(TransactionSchemeDetailsRequestDTO dto, String vendorCallbackStatus) {
        String baseTransactionId = dto.getBaseTranxId(); // Single base ID for full flow

        Long apiPartnerId = dto.getApiPartnerId();
        BigDecimal tranxAmount = BigDecimal.valueOf(dto.getAmount());
        ///  we don't have gross in our channel rate they had scheme Rate in that gross , we will have to use Rate itself i think for now
//        BigDecimal grossAmount = BigDecimal.ZERO;// BigDecimal.valueOf(dto.getSchemeRate().getGross());
        String taxValue = dto.getGstValue(); /// this also not yet figured out
        String tranxType = dto.getTransactionType().toString().toLowerCase(); /// same with this

        ApiPartnerWallet wallet = getWalletForApiPartner(apiPartnerId);
            ///  this thing yet to implement as t0 , t1 , t2
//        Boolean isSettlement = productsRepository.findIsSettlementByCode(dto.getProductCode());
//        if (isSettlement == null) {
//            throw new IllegalArgumentException("Invalid Product Code: " + dto.getProductCode());
//        }

        if (tranxType.equals("credit")) {
            // Vendor call BEFORE wallet impact
            /// this was already commented IDK what to do
            //String vendorResponse = callVendor(dto);
/// insertTransaction yet to implement
            if ("PENDING".equalsIgnoreCase(vendorCallbackStatus)) {
                // Just insert transaction with pending, no wallet impact
                insertTransaction(wallet, "PENDING", tranxAmount,
                        wallet.getAvailableBalance(), wallet.getAvailableBalance(),
                        "Vendor Pending - Credit", buildTransactionId("TXN", baseTransactionId), "CREDIT", dto);
                return "Transaction pending - no wallet update";
            }

            if ("FAILURE".equalsIgnoreCase(vendorCallbackStatus)) {
                insertTransaction(wallet, "FAILURE", tranxAmount,
                        wallet.getAvailableBalance(), wallet.getAvailableBalance(),
                        "Vendor Failure - No Credit", buildTransactionId("FLD", baseTransactionId), "CREDIT", dto);
                return "Vendor transaction failed";
            }

            // Vendor SUCCESS, but settlement = true → mark as pending for future processing
//            if (Boolean.TRUE.equals(isSettlement)) {
//                insertTransaction(wallet, "SETTLEMENT PENDING", tranxAmount,
//                        wallet.getAvailableBalance(), wallet.getAvailableBalance(),
//                        "Settlement Pending - Credit ", buildTransactionId("TXN", baseTransactionId), "CREDIT", dto);
//                return "Transaction marked as pending for settlement";
//            }

            // On Success: update wallet, mirror, then process charges/commission
            updateWallet(dto, wallet, tranxAmount, tranxType, baseTransactionId, vendorCallbackStatus, "CREDIT");
            processChargesAndCommission(dto, wallet, taxValue, baseTransactionId, vendorCallbackStatus);
        } else if (tranxType.equals("debit")) {
            // Step 1: Check balance before assuming pending
            // Calculate total deduction needed
            BigDecimal totalDeduction = tranxAmount;

            if (dto.getHasCharge()) {
                // Calculate charge amount
                BigDecimal percentage = BigDecimal.valueOf(dto.getChannelRate().getRate())
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
                BigDecimal grossCharge = tranxAmount.multiply(percentage);
                totalDeduction = totalDeduction.add(grossCharge);
            }
            /// have to calculate charges here first  so that we can check for balance so no -ve balance happens
            if (!hasSufficientBalance(apiPartnerId, totalDeduction)) {
                return "Insufficient balance";
            }

            // Step 2: Assume PENDING - update wallet now
            updateWallet(dto, wallet, tranxAmount, tranxType, baseTransactionId, "PENDING", "DEBIT");

            // Step 3: Call Vendor AFTER debiting
            String vendorResponse = callVendor(dto);

            if ("PENDING".equalsIgnoreCase(vendorResponse)) {
                return "Transaction pending - debit applied";
            }

            if ("FAILURE".equalsIgnoreCase(vendorResponse)) {
                // Reversal logic
                BigDecimal beforeReversal = wallet.getAvailableBalance();
                wallet.setAvailableBalance(beforeReversal.add(tranxAmount));
                wallet.setTotalCash(wallet.getTotalCash().add(tranxAmount));
                BigDecimal afterReversal = wallet.getAvailableBalance();

                updateTransactionStatus("TXN" + baseTransactionId, "FAILURE");

                insertTransaction(wallet, "REVERSAL", tranxAmount,
                        beforeReversal, afterReversal,
                        "Vendor Failed - Debit Reversed", buildTransactionId("REV", baseTransactionId), "DEBIT", dto);
                return "Vendor transaction failed and reversed";
            }

//            if (Boolean.TRUE.equals(isSettlement)) {
//                // Vendor SUCCESS, but settlement = true → mark as pending
//                updateTransactionStatus("TXN" + baseTransactionId, "SETTLEMENT PENDING");
//                return "Transaction marked as pending for settlement";
//            }

            // On Success: update PENDING → SUCCESS status and process mirror + charges
            updateTransactionStatus("TXN" + baseTransactionId, "SUCCESS");


            // Now perform mirroring, charges, commissions
           mirrorTransactionToAdmin(dto.getApiPartnerId(), tranxType, tranxAmount, "TXN" + baseTransactionId, "Credit", "SUCCESS", dto);
            processChargesAndCommission(dto, wallet, taxValue, baseTransactionId, "SUCCESS");
        }

        // Save wallet changes
        saveWallet(wallet);
        return "Transaction Successful";
    }

    @Transactional
    private void mirrorTransactionToAdmin(
            Long apiPartnerId, String txnType, BigDecimal amount, String txnId,
            String action, String tranStatus, TransactionSchemeDetailsRequestDTO request) {

        // Determine mirror type (opposite of partner transaction)
        String mirrorTxnType = txnType.equalsIgnoreCase("CREDIT") ? "DEBIT" : "CREDIT";

        // Get admin wallet with pessimistic lock
        AdminWallet adminWallet = adminWalletRepository.getForUpdate()
                .orElseThrow(() -> new RuntimeException("Admin wallet not found"));

        BigDecimal beforeBalance = adminWallet.getAvailableBalance();

        // Validate balance for DEBIT
        if ("DEBIT".equalsIgnoreCase(mirrorTxnType) && beforeBalance.compareTo(amount) < 0) {
            throw new RuntimeException("Admin wallet has insufficient balance to mirror transaction. Required: "
                    + amount + ", Available: " + beforeBalance);
        }

        // Calculate new balance
        BigDecimal afterBalance = mirrorTxnType.equalsIgnoreCase("CREDIT")
                ? beforeBalance.add(amount)
                : beforeBalance.subtract(amount);

        // Update admin wallet
        adminWallet.setAvailableBalance(afterBalance);

        if (mirrorTxnType.equalsIgnoreCase("CREDIT")) {
            adminWallet.setTotalCash(adminWallet.getTotalCash().add(amount));
        } else {
            adminWallet.setUsedCash(adminWallet.getUsedCash().add(amount));
        }

        adminWallet.setLastUpdatedAmount(amount);
        adminWallet.setLastUpdatedAt(LocalDateTime.now());

        // Save admin wallet
        adminWalletRepository.save(adminWallet);

        // Insert admin transaction
        String actionOnBalance = mirrorTxnType.equalsIgnoreCase("DEBIT")
                ? "Deduct Funds " + action + " - "
                : "Add Funds " + action + " - ";

        insertAdminTransaction(
                apiPartnerId,
                mirrorTxnType,
                amount,
                "Mirror Transaction for " + txnType,
                beforeBalance,
                afterBalance,
                actionOnBalance,
                txnId,
                tranStatus,
                request
        );
    }

    private void insertAdminTransaction(
            Long apiPartnerId,
            String service,
            BigDecimal amount,
            String remarks,
            BigDecimal beforeBalance,
            BigDecimal afterBalance,
            String actionOnBalance,
            String txnId,
            String tranStatus,
            TransactionSchemeDetailsRequestDTO request) {

        AdminTransactionDetails adminTxn = new AdminTransactionDetails();

        // Set transaction ID
        adminTxn.setTransactionId(txnId);

        // Set amounts and balances
        adminTxn.setAmount(amount);
        adminTxn.setBalBeforeTran(beforeBalance);
        adminTxn.setBalAfterTran(afterBalance);
        adminTxn.setFinalBalance(afterBalance);

        // Set status and action
        adminTxn.setTranStatus(tranStatus);
        adminTxn.setService(service);
        adminTxn.setActionOnBalance(actionOnBalance);
        adminTxn.setRemarks(remarks);

        // Set timestamps
        adminTxn.setTransactionDate(LocalDateTime.now());

        // Set API Partner reference
        ApiPartner apiPartnerRef = new ApiPartner();
        apiPartnerRef.setId(apiPartnerId);
        adminTxn.setApiPartner(apiPartnerRef);

        // Set operator name
        adminTxn.setOperatorName(request.getOperatorName());

        // Save transaction
        adminTransactionDetailsRepository.save(adminTxn);
    }

    private BigDecimal getAdminCurrentBalance() {
        return adminWalletRepository.get()
                .map(AdminWallet::getAvailableBalance)
                .orElse(BigDecimal.ZERO);
    }

    private void creditGstToAdmin(
            Long apiPartnerId,
            BigDecimal gstAmount,
            String baseTransactionId,
            String tranStatus,
            TransactionSchemeDetailsRequestDTO request) {

        // Get admin wallet with lock
        AdminWallet adminWallet = adminWalletRepository.getForUpdate()
                .orElseThrow(() -> new RuntimeException("Admin wallet not found"));

        BigDecimal beforeBalance = adminWallet.getAvailableBalance();
        BigDecimal afterBalance = beforeBalance.add(gstAmount);

        // Update admin wallet
        adminWallet.setAvailableBalance(afterBalance);
        adminWallet.setTotalCash(adminWallet.getTotalCash().add(gstAmount));
        adminWallet.setLastUpdatedAmount(gstAmount);
        adminWallet.setLastUpdatedAt(LocalDateTime.now());

        adminWalletRepository.save(adminWallet);

        // Insert GST credit transaction
        String gstTxnId = buildTransactionId("GST", baseTransactionId);

        insertAdminTransaction(
                apiPartnerId,
                "CREDIT",
                gstAmount,
                "GST collected from API Partner",
                beforeBalance,
                afterBalance,
                "Add Funds (GST) - ",
                gstTxnId,
                tranStatus,
                request
        );
    }
    private void creditChargeToAdmin(
            Long apiPartnerId,
            BigDecimal chargeAmount,
            String baseTransactionId,
            String tranStatus,
            TransactionSchemeDetailsRequestDTO request) {

        // Get admin wallet with lock
        AdminWallet adminWallet = adminWalletRepository.getForUpdate()
                .orElseThrow(() -> new RuntimeException("Admin wallet not found"));

        BigDecimal beforeBalance = adminWallet.getAvailableBalance();
        BigDecimal afterBalance = beforeBalance.add(chargeAmount);

        // Update admin wallet
        adminWallet.setAvailableBalance(afterBalance);
        adminWallet.setTotalCash(adminWallet.getTotalCash().add(chargeAmount));
        adminWallet.setLastUpdatedAmount(chargeAmount);
        adminWallet.setLastUpdatedAt(LocalDateTime.now());

        adminWalletRepository.save(adminWallet);

        // Insert charge credit transaction
        String chargeTxnId = buildTransactionId("CHG", baseTransactionId);

        insertAdminTransaction(
                apiPartnerId,
                "CREDIT",
                chargeAmount,
                "Service charge collected from API Partner",
                beforeBalance,
                afterBalance,
                "Add Funds (Charge) - ",
                chargeTxnId,
                tranStatus,
                request
        );
    }

    public boolean hasSufficientBalance(Long apiPartnerId, BigDecimal requestedAmount) {


        BigDecimal availableBalance = getApiPartnerWallet(apiPartnerId);

        return availableBalance != null && availableBalance.compareTo(requestedAmount) >= 0;
    }

    private void updateTransactionStatus(String transactionId, String status) {
        Optional<ApiPartnerTransactionDetails> txnOpt = apiPartnerTransDetRepository.findByTransactionId(transactionId);
        if (txnOpt.isPresent()) {
            ApiPartnerTransactionDetails txn = txnOpt.get();
            txn.setActionOnBalance("Deduct Funds");
            txn.setTranStatus(status);
            apiPartnerTransDetRepository.save(txn);
        } else {
            throw new RuntimeException("Transaction not found in table: " + transactionId);
        }
    }

    private void saveWallet(ApiPartnerWallet wallet) {
        apiPartnerWalletRepository.save(wallet);
    }

    private ApiPartnerWallet getWalletForApiPartner(Long apiPartnerId) {
        return apiPartnerWalletRepository.findByApiPartnerIdForUpdate(apiPartnerId)
                .orElseGet(() -> {
                    ApiPartnerWallet w = new ApiPartnerWallet();
                    ApiPartner mRef = new ApiPartner();
                    mRef.setId(apiPartnerId);
                    w.setApiPartner(mRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    w.setLastUpdatedAmount(BigDecimal.ZERO);
                    w.setLastUpdatedAt(LocalDateTime.now());
                    w.setTotalCash(BigDecimal.ZERO);
                    w.setCutOfAmount(BigDecimal.ZERO);
                    w.setUsedCash(BigDecimal.ZERO);
                    return apiPartnerWalletRepository.save(w);
                });

    }

    private BigDecimal getApiPartnerWallet(Long apiPartnerId) {
        return apiPartnerWalletRepository.findByApiPartnerId(apiPartnerId)
                .map(ApiPartnerWallet::getAvailableBalance)
                .orElse(BigDecimal.ZERO); // if wallet row not present yet
    }

    private String callVendor(TransactionSchemeDetailsRequestDTO dto) {
        // Replace this with actual vendor API integration
        return "SUCCESS"; // or PENDING, FAILURE, SUCCESS
    }

    private void processChargesAndCommission(TransactionSchemeDetailsRequestDTO dto, ApiPartnerWallet wallet,
                                              String gstValue, String baseTransactionId, String tranStatus) {
        if (dto.getHasCharge()) {
            processCharges(dto, wallet, gstValue, baseTransactionId, tranStatus); // GST only
        }

        if (dto.getIsCommission()) {
            processCommission(dto, baseTransactionId, tranStatus, dto); // TDS only
        }
    }
    private void processCommission(TransactionSchemeDetailsRequestDTO dto, String baseTransactionId, String tranStatus, TransactionSchemeDetailsRequestDTO request) {
        BigDecimal tdsRate = new BigDecimal(dto.getTdsRate());

        // 1. Commission to Retailer
//        if (dto.getSchemeRate().getApiPartner() > 0) {
//            BigDecimal apiPartnerCommission = calculateCommissionAmount(
//                    dto.getSchemeRate().getApiPartner(),
//                    BigDecimal.valueOf(dto.getAmount()),
//                    dto.getSchemeRate().getRateType().toString()
//            );
//            distributeCommissionToHierarchy("PT", dto.getApiPartnerId(), apiPartnerCommission, tdsRate, baseTransactionId, tranStatus, request);
//        }

        // 2. Admin-level commission (dynamically fetched)
//        if (dto.getSchemeRate().getAdmin() > 0) {
//            BigDecimal adminCommissionAmt = calculateCommissionAmount(
//                    dto.getSchemeRate().getAdmin(),
//                    BigDecimal.valueOf(dto.getAmount()),
//                    dto.getSchemeRate().getRateType().toString()
//            );
//
//            getAdminHierarchyId(dto.getApiPartnerId()).ifPresent(adminId -> {
//                distributeCommissionToHierarchy("AD", adminId, adminCommissionAmt, tdsRate, baseTransactionId, tranStatus, request);
//            });
//        }
    }

private void processCharges(
        TransactionSchemeDetailsRequestDTO dto,
        ApiPartnerWallet wallet,
        String gstValue,
        String baseTransactionId,
        String tranStatus) {

    // Calculate gross amount from channel rate
    BigDecimal percentage = BigDecimal.valueOf(dto.getChannelRate().getRate())
            .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
    BigDecimal grossAmount = BigDecimal.valueOf(dto.getAmount())
            .multiply(percentage)
            .setScale(4, RoundingMode.HALF_UP);

    // Calculate GST and base amount
    BigDecimal gstRate = new BigDecimal(gstValue)
            .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
    BigDecimal divisor = BigDecimal.ONE.add(gstRate);
    BigDecimal baseAmount = grossAmount.divide(divisor, 10, RoundingMode.HALF_UP);
    BigDecimal gstAmount = grossAmount.subtract(baseAmount).setScale(4, RoundingMode.HALF_UP);

    // === STEP 1: Deduct base charge from API Partner ===
    BigDecimal beforeBase = wallet.getAvailableBalance();
    wallet.setAvailableBalance(beforeBase.subtract(baseAmount));
    BigDecimal afterBase = wallet.getAvailableBalance();

    insertTransaction(wallet, tranStatus, baseAmount, beforeBase, afterBase,
            "Deduct Funds (Charge) - ",
            buildTransactionId("CHG", baseTransactionId), "DEBIT", dto);

    // === STEP 2: Credit base charge to Admin ===
    creditChargeToAdmin(dto.getApiPartnerId(), baseAmount, baseTransactionId, tranStatus, dto);

    // === STEP 3: Deduct GST from API Partner ===
    BigDecimal beforeGst = wallet.getAvailableBalance();
    wallet.setAvailableBalance(beforeGst.subtract(gstAmount));
    BigDecimal afterGst = wallet.getAvailableBalance();

    insertTransaction(wallet, tranStatus, gstAmount, beforeGst, afterGst,
            "Deduct Funds (GST) - ",
            buildTransactionId("GST", baseTransactionId), "DEBIT", dto);

    // === STEP 4: Update wallet metadata ===
    wallet.setUsedCash(wallet.getUsedCash().add(baseAmount.add(gstAmount)));
    wallet.setLastUpdatedAmount(gstAmount);
    wallet.setLastUpdatedAt(LocalDateTime.now());

    // === STEP 5: Credit GST to Admin ===
    creditGstToAdmin(dto.getApiPartnerId(), gstAmount, baseTransactionId, tranStatus, dto);
}


    public void insertTransaction(ApiPartnerWallet wallet, String tranStatus, BigDecimal amount,
                              BigDecimal balanceBeforeTranx, BigDecimal balanceAfterTranx, String actionOnBalance,
                              String tranxId, String service, TransactionSchemeDetailsRequestDTO dto) {

   // log.info("Starting transaction insertion for ID: {}", tranxId);

    ApiPartnerTransactionDetails transactionDetails = new ApiPartnerTransactionDetails();
    transactionDetails.setTransactionId(tranxId);
    transactionDetails.setTransactionDate(LocalDateTime.now());
    transactionDetails.setService(service);
    transactionDetails.setBalBeforeTran(balanceBeforeTranx);
    transactionDetails.setAmount(amount);
    transactionDetails.setBalAfterTran(balanceAfterTranx);
    transactionDetails.setActionOnBalance(actionOnBalance);
    transactionDetails.setTranStatus(tranStatus);
    transactionDetails.setFinalBalance(balanceAfterTranx);


    /// String productName = (wallet).getApiPartner().getProduct().getName(); - can't do this as partner - product not one to one
    String operatorName = dto.getOperatorName();

    transactionDetails.setApiPartner((wallet).getApiPartner());
   /// transactionDetails.setProductName(productName);
    transactionDetails.setOperatorName(operatorName);

    //log.debug("Transaction details prepared: {}", transactionDetails);

    apiPartnerTransDetRepository.save(transactionDetails);

    //log.info("Transaction saved successfully for ID: {}", tranxId);
}


    private void handlePendingTransaction(ApiPartnerWallet wallet,String tranxType,
                                          BigDecimal requestedAmount,String baseTransactionId,String service, TransactionSchemeDetailsRequestDTO request) {
        BigDecimal balanceBefore = wallet.getAvailableBalance();

        if ("debit".equalsIgnoreCase(tranxType)) {
            wallet.setTotalCash(wallet.getTotalCash().subtract(requestedAmount));
            wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(requestedAmount));
        }

        wallet.setLastUpdatedAmount(requestedAmount);
        wallet.setLastUpdatedAt(LocalDateTime.now());

        insertTransaction(wallet, "PENDING", requestedAmount, balanceBefore,
                wallet.getAvailableBalance(), "Vendor Pending - " + tranxType.toUpperCase(),
                buildTransactionId("TXN", baseTransactionId), service, request);
    }


    public String buildTransactionId(String prefix, String baseId) {
    return prefix + baseId;
}

private void updateWallet(
        TransactionSchemeDetailsRequestDTO dto,
        ApiPartnerWallet wallet,
        BigDecimal requestedAmount,
        String tranxType,
        String baseTransactionId,
        String tranStatus,
        String service) {

    String actionOnBalance;

    if ("PENDING".equalsIgnoreCase(tranStatus)) {
        handlePendingTransaction(wallet, tranxType, requestedAmount, baseTransactionId, service, dto);
        return;
    }

    // Credit or Debit Operation
    BigDecimal balanceBefore = wallet.getAvailableBalance();

    if (tranxType.equalsIgnoreCase("credit")) {
        wallet.setTotalCash(wallet.getTotalCash().add(requestedAmount));
        wallet.setAvailableBalance(wallet.getAvailableBalance().add(requestedAmount));
        actionOnBalance = "Add Funds - ";
    } else {
        wallet.setTotalCash(wallet.getTotalCash().subtract(requestedAmount));
        wallet.setAvailableBalance(wallet.getAvailableBalance().subtract(requestedAmount));
        actionOnBalance = "Deduct Funds - ";
    }

    wallet.setLastUpdatedAmount(requestedAmount);
    wallet.setLastUpdatedAt(LocalDateTime.now());

    // Insert transaction for API Partner
    insertTransaction(wallet, tranStatus, requestedAmount, balanceBefore,
            wallet.getAvailableBalance(), actionOnBalance,
            buildTransactionId("TXN", baseTransactionId), service, dto);

    // Mirror transaction to Admin (only if not PENDING)
    if (!"PENDING".equalsIgnoreCase(tranStatus)) {
        mirrorTransactionToAdmin(
                dto.getApiPartnerId(),
                tranxType.toUpperCase(),
                requestedAmount,
                buildTransactionId("TXN", baseTransactionId),
                "Main Transaction",
                tranStatus,
                dto
        );
    }
}


}














//private void distributeCommissionToHierarchy(String hierarchyType, String hierarchyId,
//                                             BigDecimal commissionAmount,
//                                             BigDecimal tdsRate, String baseTransactionId, String tranStatus, TransactionSchemeDetailsRequestDto request) {
//
//    log.info("Processing commission for {} | Hierarchy ID: {} | Amount (Incl. TDS): {} | TDS Rate: {}",
//            hierarchyType, hierarchyId, commissionAmount, tdsRate);
//
//    // === CASE 1: AD — Credit only, no TDS or Mirror ===
//    if ("AD".equals(hierarchyType)) {
//        log.info("{} hierarchy detected. Crediting full commission without TDS or mirror.", hierarchyType);
//
//        String transactionTable = getTransactionTable(hierarchyType);
//        String amountTable = getAmountTable(hierarchyType);
//
//        BigDecimal beforeBalance = getCurrentBalance(hierarchyId);
//        BigDecimal afterBalance = beforeBalance.add(commissionAmount);
//        String txnId = buildTransactionId("COM", baseTransactionId);
//
//        insertTransactionForHierarchy(transactionTable, "CREDIT", commissionAmount,
//                "Commission credited (Direct AD)", hierarchyId,
//                beforeBalance, afterBalance,
//                "Add Funds (Commission) - ", txnId, tranStatus, request);
//
//        updateAmountTable(hierarchyType, hierarchyId, amountTable, commissionAmount);
//
//        return; // Stop further processing (no TDS or mirror)
//    }
//
//    // === CASE 2: All other hierarchies — Credit, Mirror, TDS (if applicable) ===
//    String transactionTable = getTransactionTable(hierarchyType);
//    String amountTable = getAmountTable(hierarchyType);
//
//    BigDecimal beforeBalance = getCurrentBalance(hierarchyId);
//    BigDecimal afterCreditBalance = beforeBalance.add(commissionAmount);
//    String comTxnId = buildTransactionId("COM", baseTransactionId);
//
//    // Credit commission
//    insertTransactionForHierarchy(transactionTable, "CREDIT", commissionAmount,
//            "Commission credited", hierarchyId,
//            beforeBalance, afterCreditBalance,
//            "Add Funds (Commission) - ", comTxnId, tranStatus, request);
//
//    updateAmountTable(hierarchyType, hierarchyId, amountTable, commissionAmount);
//
//    // Mirror commission (DEBIT from Admin)
//    if (!"pending".equalsIgnoreCase(tranStatus)) {
//        mirrorTransactionToAdmin(hierarchyId, hierarchyType, "DEBIT", commissionAmount,
//                comTxnId, "Deduct Funds (Commission) - ", tranStatus, request);
//    }
//
//    // TDS deduction (if applicable)
//    BigDecimal tdsAmount = commissionAmount
//            .multiply(tdsRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
//            .setScale(2, RoundingMode.HALF_UP);
//
//    if (tdsAmount.compareTo(BigDecimal.ZERO) > 0) {
//        BigDecimal afterTdsBalance = afterCreditBalance.subtract(tdsAmount);
//        String tdsTxnId = buildTransactionId("TDS", baseTransactionId);
//
//        insertTransactionForHierarchy(transactionTable, "DEBIT", tdsAmount,
//                "TDS Deduction", hierarchyId,
//                afterCreditBalance, afterTdsBalance,
//                "Deduct Funds (TDS) - ", tdsTxnId, tranStatus, request);
//
//        updateAmountTable(hierarchyType, hierarchyId, amountTable, tdsAmount.negate());
//
//        // Mirror TDS (CREDIT to Admin)
//        if (!"pending".equalsIgnoreCase(tranStatus)) {
//            mirrorTransactionToAdmin(hierarchyId, hierarchyType, "CREDIT", tdsAmount,
//                    tdsTxnId, "Add Funds (TDS) - ", tranStatus, request);
//        }
//    }
//}
//

//


////This method is for commission credit entry
//private void insertTransactionForHierarchy(String transactionTable, String service, BigDecimal amount, String remarks,
//                                           String hierarchyId, BigDecimal beforeTransactionBalance,
//                                           BigDecimal afterTransactionBalance, String actionOnBalance, String tranxId, String tranStatus, TransactionSchemeDetailsRequestDto request) {
//    //GST entry for ADMIN 1st insertTransaction Method
//    log.info("Inserting into {} | Type: {} | Amount: {} | Remarks: {} | Hierarchy ID: {} | Before Balance: {} | After Balance: {} | Action: {}",
//            transactionTable, service, amount, remarks, hierarchyId, beforeTransactionBalance, afterTransactionBalance, actionOnBalance);
//
//    String hierarchyColumnName = getHierarchyColumnName(extractHierarchyType(hierarchyId));
//
//    String sql = "INSERT INTO " + transactionTable +
//            " (" + hierarchyColumnName + ", service, amount, remarks, date_of_transaction, time_of_transaction, " +
//            "bal_before_tran, bal_after_tran, action_on_balance_amount, final_balance, transaction_id, tran_status) " +
//            "VALUES (:hierarchyId, :service, :amount, :remarks, :dateOfTransaction, :timeOfTransaction, " +
//            ":beforeTransactionBalance, :afterTransactionBalance, :actionOnBalance, :finalBalance, :tranxId, :tranStatus)";
//
//    entityManager.createNativeQuery(sql)
//            .setParameter("hierarchyId", hierarchyId)
//            .setParameter("service", service)
//            .setParameter("amount", amount)
//            .setParameter("remarks", remarks)
//            .setParameter("dateOfTransaction", new Date())
//            .setParameter("timeOfTransaction", new Time(System.currentTimeMillis()))
//            .setParameter("beforeTransactionBalance", beforeTransactionBalance)
//            .setParameter("afterTransactionBalance", afterTransactionBalance)
//            .setParameter("actionOnBalance", actionOnBalance)
//            .setParameter("finalBalance", afterTransactionBalance)
//            .setParameter("tranxId", tranxId)
//            .setParameter("tranStatus", tranStatus)
//            .executeUpdate();
//}
//





//
//private BigDecimal calculateCommissionAmount(double rate, BigDecimal transactionAmount, String rateType) {
//    BigDecimal commissionRate = BigDecimal.valueOf(rate);
//    BigDecimal commission;
//
//    if ("PERCENTAGE".equalsIgnoreCase(rateType)) {
//        commissionRate = commissionRate
//                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP); // convert to fraction
//        commission = transactionAmount.multiply(commissionRate);
//    } else {
//        commission = commissionRate;
//    }
//
//    // Cap commission to max of transaction amount
//    if (commission.compareTo(transactionAmount) > 0) {
//        commission = transactionAmount;
//    }
//
//    return commission.setScale(2, RoundingMode.HALF_UP);
//}
