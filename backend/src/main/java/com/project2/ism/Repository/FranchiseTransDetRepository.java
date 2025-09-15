package com.project2.ism.Repository;

import com.project2.ism.Model.FranchiseTransactionDetails;
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

    // Query based on settlement date instead of transaction date
    @Query("SELECT ftd FROM FranchiseTransactionDetails ftd WHERE " +
            "ftd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND (:status IS NULL OR ftd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR ftd.transactionType = :transactionType) " +
            "ORDER BY ftd.updatedDateAndTimeOfTransaction DESC")
    Page<FranchiseTransactionDetails> findFranchiseTransactionsBySettlementDateFilters(
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



    // Summary based on settlement date
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
            "ftd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND (:status IS NULL OR ftd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR ftd.transactionType = :transactionType)")
    Map<String, Object> getFranchiseTransactionSummaryBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId,
            @Param("status") String status,
            @Param("transactionType") String transactionType);


    // 3. Performance by merchant (via link to MerchantTransactionDetails)
    @Query("SELECT mtd.merchant.id, mtd.merchant.businessName, COUNT(ftd), SUM(ftd.amount), SUM(ftd.netAmount) " +
            "FROM FranchiseTransactionDetails ftd " +
            "JOIN ftd.merchantTransactionDetail mtd " +
            "WHERE ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND ftd.tranStatus = 'SETTLED' " +
            "GROUP BY mtd.merchant.id, mtd.merchant.businessName " +
            "ORDER BY SUM(ftd.netAmount) DESC")
    List<Object[]> getFranchiseMerchantPerformance(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);


    @Query("SELECT mtd.merchant.businessName, SUM(ftd.netAmount) as commission " +
            "FROM FranchiseTransactionDetails ftd " +
            "JOIN ftd.merchantTransactionDetail mtd " +
            "WHERE ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND ftd.tranStatus = 'SETTLED' " +
            "GROUP BY mtd.merchant.businessName " +
            "ORDER BY commission DESC")
    List<Object[]> getTopMerchantsByCommission(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);


    @Query("SELECT DATE(ftd.transactionDate), COUNT(ftd), SUM(ftd.amount), SUM(ftd.netAmount) " +
            "FROM FranchiseTransactionDetails ftd " +
            "WHERE ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "GROUP BY DATE(ftd.transactionDate) " +
            "ORDER BY DATE(ftd.transactionDate)")
    List<Object[]> getFranchiseDailyTrends(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);

    @Query("SELECT ftd.remarks, COUNT(ftd) " +
            "FROM FranchiseTransactionDetails ftd " +
            "WHERE ftd.tranStatus != 'SETTLED' " +
            "AND ftd.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY ftd.remarks " +
            "ORDER BY COUNT(ftd) DESC")
    List<Object[]> getFranchiseFailureReasons(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);



    // NEW QUERIES - Add these to your existing FranchiseTransDetRepository.java



    // Merchant performance based on settlement date
    @Query("SELECT mtd.merchant.id, mtd.merchant.businessName, COUNT(ftd), SUM(ftd.amount), SUM(ftd.netAmount) " +
            "FROM FranchiseTransactionDetails ftd " +
            "JOIN ftd.merchantTransactionDetail mtd " +
            "WHERE ftd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND ftd.tranStatus = 'SETTLED' " +
            "GROUP BY mtd.merchant.id, mtd.merchant.businessName " +
            "ORDER BY SUM(ftd.netAmount) DESC")
    List<Object[]> getFranchiseMerchantPerformanceBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);

    // Top merchants by commission based on settlement date
    @Query("SELECT mtd.merchant.businessName, SUM(ftd.netAmount) as commission " +
            "FROM FranchiseTransactionDetails ftd " +
            "JOIN ftd.merchantTransactionDetail mtd " +
            "WHERE ftd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "AND ftd.tranStatus = 'SETTLED' " +
            "GROUP BY mtd.merchant.businessName " +
            "ORDER BY commission DESC")
    List<Object[]> getTopMerchantsByCommissionBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);

    // Daily trends based on settlement date
    @Query("SELECT DATE(ftd.updatedDateAndTimeOfTransaction), COUNT(ftd), SUM(ftd.amount), SUM(ftd.netAmount) " +
            "FROM FranchiseTransactionDetails ftd " +
            "WHERE ftd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:franchiseId IS NULL OR ftd.franchise.id = :franchiseId) " +
            "GROUP BY DATE(ftd.updatedDateAndTimeOfTransaction) " +
            "ORDER BY DATE(ftd.updatedDateAndTimeOfTransaction)")
    List<Object[]> getFranchiseDailyTrendsBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("franchiseId") Long franchiseId);

//    // Direct merchants (franchise_id is null) - transaction date
//    @Query("SELECT mtd FROM MerchantTransactionDetails mtd WHERE " +
//            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
//            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
//            "ORDER BY mtd.transactionDate DESC")
//    Page<MerchantTransactionDetails> findDirectMerchantTransactionsByFilters(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate,
//            @Param("status") String status,
//            @Param("transactionType") String transactionType,
//            Pageable pageable);
//
//    // Direct merchants summary - transaction date
//    @Query("SELECT " +
//            "COUNT(mtd) as totalTransactions, " +
//            "COALESCE(SUM(mtd.amount), 0) as totalAmount, " +
//            "COALESCE(SUM(mtd.netAmount), 0) as totalNetAmount, " +
//            "COALESCE(SUM(mtd.charge), 0) as totalCharges, " +
//            "COALESCE(AVG(mtd.amount), 0) as averageAmount, " +
//            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
//            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failureCount " +
//            "FROM MerchantTransactionDetails mtd WHERE " +
//            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
//            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType)")
//    Map<String, Object> getDirectMerchantTransactionSummary(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate,
//            @Param("status") String status,
//            @Param("transactionType") String transactionType);
}