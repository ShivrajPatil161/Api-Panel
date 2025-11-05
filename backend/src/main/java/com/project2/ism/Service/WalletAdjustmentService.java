package com.project2.ism.Service;

import com.project2.ism.Model.*;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class WalletAdjustmentService {


    private final ApiPartnerRepository apiPartnerRepository;
    private final ApiPartnerWalletRepository apiPartnerWalletRepository;
    private final ApiPartnerTransDetRepository apiPartnerTransactionRepository;

    public WalletAdjustmentService(ApiPartnerRepository apiPartnerRepository, ApiPartnerWalletRepository apiPartnerWalletRepository, ApiPartnerTransDetRepository apiPartnerTransactionRepository) {
        this.apiPartnerRepository = apiPartnerRepository;
        this.apiPartnerWalletRepository = apiPartnerWalletRepository;
        this.apiPartnerTransactionRepository = apiPartnerTransactionRepository;
    }



    @Transactional
    public void adjustApiPartnerWallet(Long apiPartnerId, String actionOnBalance, BigDecimal amount, String remark) {
        ApiPartner apiPartner = apiPartnerRepository.findById(apiPartnerId)
                .orElseThrow(() -> new RuntimeException("apiPartner not found"));

        ApiPartnerWallet apiPartnerWallet = apiPartnerWalletRepository.findByApiPartnerIdForUpdate(apiPartner.getId())
                .orElseGet(() -> {
                    ApiPartnerWallet w = new ApiPartnerWallet();
                    ApiPartner mRef = new ApiPartner();
                    mRef.setId(apiPartner.getId());
                    w.setApiPartner(mRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    w.setLastUpdatedAmount(BigDecimal.ZERO);
                    w.setLastUpdatedAt(LocalDateTime.now());
                    w.setTotalCash(BigDecimal.ZERO);
                    w.setCutOfAmount(BigDecimal.ZERO);
                    w.setUsedCash(BigDecimal.ZERO);
                    return apiPartnerWalletRepository.save(w);
                });

        BigDecimal balanceBeforeTran = apiPartnerWallet.getAvailableBalance();
        BigDecimal balanceAfterTran;

        if ("CREDIT".equalsIgnoreCase(actionOnBalance)) {
            balanceAfterTran = balanceBeforeTran.add(amount);
        } else if ("DEBIT".equalsIgnoreCase(actionOnBalance)) {
            if (balanceBeforeTran.compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            balanceAfterTran = balanceBeforeTran.subtract(amount);
        } else {
            throw new RuntimeException("Invalid action on balance");
        }

        LocalDateTime now = LocalDateTime.now();

        ApiPartnerTransactionDetails transaction = new ApiPartnerTransactionDetails();
        transaction.setApiPartner(apiPartner);
        transaction.setAmount(amount);
        transaction.setBalBeforeTran(balanceBeforeTran);
        transaction.setBalAfterTran(balanceAfterTran);
        transaction.setFinalBalance(balanceAfterTran);
        transaction.setRemarks(remark);
        transaction.setActionOnBalance(actionOnBalance);
        transaction.setTransactionType(actionOnBalance);
        transaction.setTransactionDate(now);
        transaction.setUpdatedDateAndTimeOfTransaction(now);
        transaction.setTranStatus("SUCCESS");

        apiPartnerTransactionRepository.save(transaction);

        apiPartnerWallet.setAvailableBalance(balanceAfterTran);
        apiPartnerWallet.setLastUpdatedAmount(amount);
        apiPartnerWallet.setLastUpdatedAt(now);

        apiPartnerWalletRepository.save(apiPartnerWallet);
    }


    public BigDecimal getApiPartnerWalletBalance(Long apiPartnerId) {
        return apiPartnerWalletRepository.findByApiPartnerId(apiPartnerId)
                .map(WalletBase::getAvailableBalance)
                .orElse(BigDecimal.ZERO);
    }

}
