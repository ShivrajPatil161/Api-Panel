package com.project2.ism.Repository;

import com.project2.ism.Model.FranchiseTransactionDetails;
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
public interface FranchiseTransDetRepository extends JpaRepository<FranchiseTransactionDetails, Long> {

    boolean existsByVendorTransactionId(String vendorTransactionId);

    Optional<FranchiseTransactionDetails> findByTransactionId(Long transactionId);

    Optional<FranchiseTransactionDetails> findByVendorTransactionId(String vendorTransactionId);

    Long countByTransactionDateBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM FranchiseTransactionDetails m WHERE m.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    Long countByTranStatusAndTransactionDateBetween(String success, LocalDateTime localDateTime, LocalDateTime localDateTime1);



//new for reports lets see if they work

    @Query("SELECT ftd FROM FranchiseTransactionDetails ftd WHERE " +
            "ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND (:status IS NULL OR ftd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR ftd.transactionType = :transactionType) " +
            "ORDER BY ftd.transactionDate DESC")
    Page<FranchiseTransactionDetails> findFranchiseTransactionsByFilters(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId,
            @Param("status") String status,
            @Param("transactionType") String transactionType,
            Pageable pageable);

    @Query("SELECT " +
            "COUNT(ftd) as totalTransactions, " +
            "COALESCE(SUM(ftd.amount), 0) as totalAmount, " +
            "COALESCE(SUM(ftd.netAmount), 0) as totalCommission, " +
            "COALESCE(SUM(ftd.amount - ftd.netAmount), 0) as totalNetAmount, " +
            "COALESCE(AVG(ftd.amount), 0) as averageAmount, " +
            "COUNT(CASE WHEN ftd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
            "COUNT(CASE WHEN ftd.tranStatus != 'SETTLED' THEN 1 END) as failureCount, " +
            "COUNT(DISTINCT CASE WHEN ftd.tranStatus = 'SETTLED' THEN ftd.vendorName END) as activeMerchants " +
            "FROM FranchiseTransactionDetails ftd WHERE " +
            "ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND (:status IS NULL OR ftd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR ftd.transactionType = :transactionType)")
    Map<String, Object> getFranchiseTransactionSummary(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId,
            @Param("status") String status,
            @Param("transactionType") String transactionType);

    @Query("SELECT ftd.vendorName, COUNT(ftd), SUM(ftd.amount), SUM(ftd.netAmount) " +
            "FROM FranchiseTransactionDetails ftd WHERE " +
            "ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND ftd.tranStatus = 'SETTLED' " +
            "GROUP BY ftd.vendorName " +
            "ORDER BY SUM(ftd.amount) DESC")
    List<Object[]> getFranchiseMerchantPerformance(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);



}