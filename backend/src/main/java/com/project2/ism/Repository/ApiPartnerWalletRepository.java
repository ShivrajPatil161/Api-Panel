package com.project2.ism.Repository;

import com.project2.ism.Model.ApiPartnerWallet;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ApiPartnerWalletRepository extends JpaRepository<ApiPartnerWallet, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select w from ApiPartnerWallet w where w.apiPartner.id = :apiPartnerId")
    Optional<ApiPartnerWallet> findByApiPartnerIdForUpdate(@Param("apiPartnerId") Long apiPartnerId);

    Optional<ApiPartnerWallet> findByApiPartnerId(Long apiPartnerId);

    @Query("""
        SELECT COALESCE(SUM(mw.availableBalance), 0)
        FROM ApiPartnerWallet mw
        JOIN ApiPartner m ON mw.apiPartner.id = m.id
        """)
    BigDecimal getApiPartnerWalletBalance();



    @Query("SELECT m.availableBalance FROM ApiPartnerWallet m WHERE m.apiPartner.id = :apiPartnerId")
    Optional<BigDecimal> findAvailableBalanceById(@Param("apiPartnerId") Long apiPartnerId);
}
