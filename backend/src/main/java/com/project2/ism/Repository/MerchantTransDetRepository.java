package com.project2.ism.Repository;

import com.project2.ism.Model.MerchantTransactionDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface MerchantTransDetRepository extends JpaRepository<MerchantTransactionDetails,Long> {
    Optional<MerchantTransactionDetails> findByTransactionId(Long transactionId);

    boolean existsByVendorTransactionId(String vendorTransactionId);

    Long countByTransactionDateBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM MerchantTransactionDetails m WHERE m.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    Long countByTranStatusAndTransactionDateBetween(String success, LocalDateTime localDateTime, LocalDateTime localDateTime1);



//new for reports lets see if they work
    @Query("SELECT mtd FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
            "ORDER BY mtd.transactionDate DESC")
    Page<MerchantTransactionDetails> findMerchantTransactionsByFilters(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("transactionType") String transactionType,
            Pageable pageable);

    @Query("SELECT " +
            "COUNT(mtd) as totalTransactions, " +
            "COALESCE(SUM(mtd.amount), 0) as totalAmount, " +
            "COALESCE(SUM(mtd.netAmount), 0) as totalNetAmount, " +
            "COALESCE(SUM(mtd.charge), 0) as totalCharges, " +
            "COALESCE(AVG(mtd.amount), 0) as averageAmount, " +
            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failureCount " +
            "FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType)")
    Map<String, Object> getMerchantTransactionSummary(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("transactionType") String transactionType);

    @Query("SELECT mtd.transactionType, COUNT(mtd), SUM(mtd.amount) " +
            "FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY mtd.transactionType")
    List<Object[]> getMerchantTransactionTypeBreakdown(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

}
