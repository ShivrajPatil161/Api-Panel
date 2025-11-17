package com.project2.ism.Repository;

import com.project2.ism.Model.AdminWallet;
import com.project2.ism.Model.ApiPartnerWallet;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminWalletRepository extends JpaRepository<AdminWallet, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select w from AdminWallet w where w.id = 1")
    Optional<AdminWallet> getForUpdate();

    @Query("select w from AdminWallet w where w.id = 1")
    Optional<AdminWallet> get();
}

