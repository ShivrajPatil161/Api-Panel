package com.project2.ism.Service.AdminServices;

import com.project2.ism.Model.AdminWallet;
import com.project2.ism.Repository.AdminWalletRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AdminWalletInitService {


    private final AdminWalletRepository adminWalletRepository;

    public AdminWalletInitService(AdminWalletRepository adminWalletRepository) {
        this.adminWalletRepository = adminWalletRepository;
    }

    @PostConstruct
    @Transactional
    public void ensureAdminWalletExists() {
        if (!adminWalletRepository.existsById(1L)) {
            AdminWallet w = new AdminWallet();
            w.setAvailableBalance(BigDecimal.ZERO);
            w.setCutOfAmount(BigDecimal.ZERO);
            w.setLastUpdatedAmount(BigDecimal.ZERO);
            w.setLastUpdatedAt(LocalDateTime.now());
            w.setTotalCash(BigDecimal.ZERO);
            w.setUsedCash(BigDecimal.ZERO);
            adminWalletRepository.save(w);
        }
    }
}
