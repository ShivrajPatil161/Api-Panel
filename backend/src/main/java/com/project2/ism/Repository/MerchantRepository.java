package com.project2.ism.Repository;

import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    List<Merchant> findByFranchiseId(Long franchiseId); // For filtering by Franchise
    List<Merchant> findByFranchiseIsNull();
    List<Merchant> findByIsApprovedFalse();

    Optional<Merchant> findByContactPerson_Email(String email);
    @Query("SELECT m.franchise FROM Merchant m WHERE m.id = :merchantId")
    Optional<Franchise> findFranchiseByMerchantId(@Param("merchantId") Long merchantId);

    Long countByFranchiseId(Long id);


    //stats

    @Query("SELECT COUNT(m) FROM Merchant m WHERE m.franchise IS NULL")
    Long countDirectMerchants();

    @Query("SELECT COUNT(m) FROM Merchant m WHERE m.franchise IS NOT NULL")
    Long countFranchiseMerchants();

    @Query("SELECT m.franchise.id, COUNT(m) FROM Merchant m WHERE m.franchise IS NOT NULL GROUP BY m.franchise.id")
    List<Object[]> countByFranchise();

    // Sum wallet balance of direct merchants (franchise_id is null)
    @Query("SELECT SUM(m.walletBalance) FROM Merchant m WHERE m.franchise IS NULL")
    BigDecimal sumDirectMerchantWallets();

    // Sum wallet balance of merchants under a franchise (franchise_id not null)
    @Query("SELECT SUM(m.walletBalance) FROM Merchant m WHERE m.franchise IS NOT NULL")
    BigDecimal sumFranchiseMerchantWallets();
}
