package com.project2.ism.Repository;

import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface ProductSerialsRepository extends JpaRepository<ProductSerialNumbers,Long> {
    boolean existsBySid(String sid);
    boolean existsByMid(String mid);
    boolean existsByTid(String tid);
    boolean existsByVpaid(String vpaid);
    boolean existsByMobNumber(String mobNumber);

    List<ProductSerialNumbers> findByProduct_IdAndMerchantIsNullAndOutwardTransactionIsNull(Long productId);


    List<ProductSerialNumbers> findByOutwardTransaction_IdAndMerchantIsNotNullAndReceivedDateIsNull(Long outwardID);

    List<ProductSerialNumbers> findByOutwardTransaction_IdAndMerchantIsNullAndReceivedDateIsNull(Long outwardID);

    List<ProductSerialNumbers> findByMerchant_Id(Long merchantId);
    @Modifying
    @Query("UPDATE ProductSerialNumbers ps SET ps.merchant.id = :merchantId, ps.productDistribution.id = :distributionId WHERE ps.id IN :serialIds")
    int assignMerchantToSerials(@Param("merchantId") Long merchantId,
                                @Param("serialIds") List<Long> serialIds,
                                @Param("distributionId") Long distributionId);

    @Query("SELECT " +
            "CASE " +
            "WHEN psn.returnTransaction IS NOT NULL THEN 'RETURNED' " +
            "WHEN psn.outwardTransaction IS NOT NULL THEN 'ALLOCATED' " +
            "ELSE 'AVAILABLE' END, COUNT(psn) " +
            "FROM ProductSerialNumbers psn " +
            "GROUP BY CASE " +
            "WHEN psn.returnTransaction IS NOT NULL THEN 'RETURNED' " +
            "WHEN psn.outwardTransaction IS NOT NULL THEN 'ALLOCATED' " +
            "ELSE 'AVAILABLE' END")
    List<Object[]> groupByStatus();

    default Map<String, Long> countByStatus() {
        return groupByStatus().stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));
    }

    // ProductSerialsRepository
    @Query("SELECT COUNT(psn) FROM ProductSerialNumbers psn WHERE psn.merchant.id = :merchantId")
    Long countByMerchantId(@Param("merchantId") Long merchantId);

    List<ProductSerialNumbers> findByProduct_Id(Long id);

    @Query("select psn.mid, psn.tid, psn.sid, psn.vpaid from ProductSerialNumbers psn where psn.merchant.id = :merchantId")
    List<Object[]> findIdentifiersByMerchant(@Param("merchantId") Long merchantId);



    /**
     * Get device identifiers for a specific merchant
     */
    @Query("""
        SELECT psn.mid, psn.tid, psn.sid , psn.vpaid
        FROM ProductSerialNumbers psn 
        WHERE psn.merchant.id = :merchantId 
        AND psn.outwardTransaction IS NOT NULL
        """)
    List<Object[]> findDeviceIdentifiersByMerchant(@Param("merchantId") Long merchantId);

    /**
     * Find device by MID and TID combination (most reliable)
     */
//    @Query("""
//        SELECT psn FROM ProductSerialNumbers psn
//        WHERE psn.mid = :mid AND psn.tid = :tid
//        AND psn.outwardTransaction IS NOT NULL
//        """)
//    Optional<ProductSerialNumbers> findByMidAndTid(@Param("mid") String mid, @Param("tid") String tid);

    List<ProductSerialNumbers> findByMidAndTid(String mid, String tid);


    /**
     * Find device by MID only
     */
    @Query("""
        SELECT psn FROM ProductSerialNumbers psn 
        WHERE psn.mid = :mid 
        AND psn.outwardTransaction IS NOT NULL
        ORDER BY psn.id DESC
        """)
    Optional<ProductSerialNumbers> findByMid(@Param("mid") String mid);

    /**
     * Find device by TID only
     */
    @Query("""
        SELECT psn FROM ProductSerialNumbers psn 
        WHERE psn.tid = :tid 
        AND psn.outwardTransaction IS NOT NULL
        ORDER BY psn.id DESC
        """)
    Optional<ProductSerialNumbers> findByTid(@Param("tid") String tid);

    // ProductSerialsRepository
    List<ProductSerialNumbers> findByMerchantAndProduct(Merchant merchant, Product product);


    @Modifying
    @Query("UPDATE ProductSerialNumbers ps SET ps.productDistribution = NULL WHERE ps.productDistribution.id = :distributionId")
    void clearDistributionFromSerials(@Param("distributionId") Long distributionId);

}
