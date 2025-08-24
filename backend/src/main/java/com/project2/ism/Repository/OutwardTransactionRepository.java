package com.project2.ism.Repository;

import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutwardTransactionRepository extends JpaRepository<OutwardTransactions, Long> {
    Optional<OutwardTransactions> findByDeliveryNumber(String deliveryNumber);

    boolean existsByDeliveryNumber(String deliveryNumber);

    List<OutwardTransactions> findByFranchiseId(@Param("franchiseId") Long franchiseId);

    List<OutwardTransactions> findByMerchantId(Long merchantId);
}