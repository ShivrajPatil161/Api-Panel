package com.project2.ism.Service;

import com.project2.ism.Model.FranchiseTransactionDetails;
import com.project2.ism.Model.FranchiseWallet;
import com.project2.ism.Model.MerchantTransactionDetails;
import com.project2.ism.Model.MerchantWallet;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class WalletAdjustmentService {

    @Autowired
    private FranchiseRepository franchiseRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private FranchiseWalletRepository franchiseWalletRepository;

    @Autowired
    private MerchantWalletRepository merchantWalletRepository;

    @Autowired
    private FranchiseTransDetRepository franchiseTransactionRepository;

    @Autowired
    private MerchantTransDetRepository merchantTransactionRepository;

    @Transactional
    public void adjustFranchiseWallet(Long franchiseId, String actionOnBalance, BigDecimal amount, String remark) {
        Franchise franchise = franchiseRepository.findById(franchiseId)
                .orElseThrow(() -> new RuntimeException("Franchise not found"));

        FranchiseWallet franchiseWallet = franchiseWalletRepository.findByFranchiseIdForUpdate(franchise.getId())
                .orElseGet(() -> {
                    FranchiseWallet w = new FranchiseWallet();
                    Franchise fRef = new Franchise();
                    fRef.setId(franchise.getId());
                    w.setFranchise(fRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    w.setLastUpdatedAmount(BigDecimal.ZERO);
                    w.setLastUpdatedAt(LocalDateTime.now());
                    w.setTotalCash(BigDecimal.ZERO);
                    w.setCutOfAmount(BigDecimal.ZERO);
                    w.setUsedCash(BigDecimal.ZERO);
                    return franchiseWalletRepository.save(w);
                });

        BigDecimal balanceBeforeTran = franchiseWallet.getAvailableBalance();
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

        FranchiseTransactionDetails transaction = new FranchiseTransactionDetails();
        transaction.setFranchise(franchise);
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

        franchiseTransactionRepository.save(transaction);

        franchiseWallet.setAvailableBalance(balanceAfterTran);
        franchiseWallet.setLastUpdatedAmount(amount);
        franchiseWallet.setLastUpdatedAt(now);

        franchiseWalletRepository.save(franchiseWallet);
    }

    @Transactional
    public void adjustMerchantWallet(Long merchantId, String actionOnBalance, BigDecimal amount, String remark) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        MerchantWallet merchantWallet = merchantWalletRepository.findByMerchantIdForUpdate(merchant.getId())
                .orElseGet(() -> {
                    MerchantWallet w = new MerchantWallet();
                    Merchant mRef = new Merchant();
                    mRef.setId(merchant.getId());
                    w.setMerchant(mRef);
                    w.setAvailableBalance(BigDecimal.ZERO);
                    w.setLastUpdatedAmount(BigDecimal.ZERO);
                    w.setLastUpdatedAt(LocalDateTime.now());
                    w.setTotalCash(BigDecimal.ZERO);
                    w.setCutOfAmount(BigDecimal.ZERO);
                    w.setUsedCash(BigDecimal.ZERO);
                    return merchantWalletRepository.save(w);
                });

        BigDecimal balanceBeforeTran = merchantWallet.getAvailableBalance();
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

        MerchantTransactionDetails transaction = new MerchantTransactionDetails();
        transaction.setMerchant(merchant);
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

        merchantTransactionRepository.save(transaction);

        merchantWallet.setAvailableBalance(balanceAfterTran);
        merchantWallet.setLastUpdatedAmount(amount);
        merchantWallet.setLastUpdatedAt(now);

        merchantWalletRepository.save(merchantWallet);
    }
}
