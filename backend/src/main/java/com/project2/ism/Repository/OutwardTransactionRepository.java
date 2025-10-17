package com.project2.ism.Repository;

import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import org.hibernate.usertype.LoggableUserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface OutwardTransactionRepository extends JpaRepository<OutwardTransactions, Long> {

    boolean existsByDeliveryNumber(String deliveryNumber);

    long countByDispatchDate(LocalDate dispatchDate);


    List<OutwardTransactions> findByFranchiseId(@Param("franchiseId") Long franchiseId);
    List<OutwardTransactions> findByFranchiseIdAndReceivedDateIsNotNull(@Param("franchiseId") Long franchiseId);
    List<OutwardTransactions> findByMerchantId(Long merchantId);

    @Query("SELECT CASE " +
            "WHEN ot.franchise.id IS NOT NULL THEN 'FRANCHISE' " +
            "WHEN ot.merchant.id IS NOT NULL THEN 'MERCHANT' " +
            "ELSE 'UNKNOWN' END, COUNT(ot) " +
            "FROM OutwardTransactions ot GROUP BY " +
            "CASE WHEN ot.franchise.id IS NOT NULL THEN 'FRANCHISE' " +
            "WHEN ot.merchant.id IS NOT NULL THEN 'MERCHANT' ELSE 'UNKNOWN' END")
    List<Object[]> groupByCustomerType();

    default Map<String, Long> countByCustomerType() {
        return groupByCustomerType().stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));
    }

    // OutwardTransactionRepository
    @Query("SELECT COUNT(ot) FROM OutwardTransactions ot WHERE ot.franchise.id = :franchiseId")
    Long countByFranchiseId(@Param("franchiseId") Long franchiseId);

    @Query("SELECT COUNT(ot) FROM OutwardTransactions ot WHERE ot.merchant.id = :merchantId")
    Long countByMerchantId(@Param("merchantId") Long merchantId);

    List<OutwardTransactions> findByMerchantIdAndProductId(Long merchantId, Long productId);

    List<OutwardTransactions> findByFranchiseIdAndProductId(Long merchantId, Long productId);
}