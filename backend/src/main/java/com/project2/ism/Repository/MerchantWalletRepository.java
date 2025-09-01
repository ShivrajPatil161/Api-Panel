package com.project2.ism.Repository;

import com.project2.ism.Model.MerchantWallet;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MerchantWalletRepository extends JpaRepository<MerchantWallet, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select w from MerchantWallet w where w.merchant.id = :merchantId")
    Optional<MerchantWallet> findByMerchantIdForUpdate(@Param("merchantId") Long merchantId);

    Optional<MerchantWallet> findByMerchantId(Long merchantId);
}
