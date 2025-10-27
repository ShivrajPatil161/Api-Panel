package com.project2.ism.Repository;

import com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO;
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
import java.util.stream.Stream;

@Repository
public interface MerchantTransDetRepository extends JpaRepository<MerchantTransactionDetails,Long> {
    Optional<MerchantTransactionDetails> findByTransactionId(Long transactionId);

    boolean existsByVendorTransactionId(String vendorTransactionId);

    Long countByTransactionDateBetween(LocalDateTime localDateTime, LocalDateTime localDateTime1);

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM MerchantTransactionDetails m WHERE m.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    Long countByTranStatusAndTransactionDateBetween(String success, LocalDateTime localDateTime, LocalDateTime localDateTime1);



//new for reports lets see if they work
//    @Query("SELECT mtd FROM MerchantTransactionDetails mtd WHERE " +
//            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
//            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
//            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
//            "ORDER BY mtd.transactionDate DESC")
//    Page<MerchantTransactionDetails> findMerchantTransactionsByFilters(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate,
//            @Param("merchantId") Long merchantId,
//            @Param("status") String status,
//            @Param("transactionType") String transactionType,
//            Pageable pageable);
//    // Query based on settlement date instead of transaction date
//    @Query("SELECT mtd FROM MerchantTransactionDetails mtd WHERE " +
//            "mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
//            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
//            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
//            "ORDER BY mtd.updatedDateAndTimeOfTransaction DESC")
//    Page<MerchantTransactionDetails> findMerchantTransactionsBySettlementDateFilters(
//            @Param("startDate") LocalDateTime startDate,
//            @Param("endDate") LocalDateTime endDate,
//            @Param("merchantId") Long merchantId,
//            @Param("status") String status,
//            @Param("transactionType") String transactionType,
//            Pageable pageable);

    @Query("SELECT new com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO(" +
            "mtd.transactionId ,mtd.vendorTransactionId, mtd.actionOnBalance,mtd.transactionDate, mtd.amount, " +
            "mtd.updatedDateAndTimeOfTransaction, vt.authCode, vt.tid, " +
            "mtd.netAmount, mtd.grossCharge, ftd.netAmount, mtd.charge, " + // left join ftd for franchise commission
            "vt.brandType, vt.cardType, vt.cardClassification, " +
            "mtd.merchant.businessName, ftd.franchise.franchiseName, mtd.tranStatus) " +
            "FROM MerchantTransactionDetails mtd " +
            "LEFT JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "LEFT JOIN FranchiseTransactionDetails ftd ON ftd.vendorTransactionId = mtd.vendorTransactionId " +
            "AND ftd.franchise.id = mtd.merchant.franchise.id " +
            "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
            "ORDER BY mtd.transactionDate DESC")
    Page<MerchantTransactionReportDTO> findMerchantTransactionsByFilters(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("transactionType") String transactionType,
            Pageable pageable);

    @Query("SELECT new com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO(" +
            "mtd.transactionId, mtd.vendorTransactionId, mtd.actionOnBalance,mtd.transactionDate, mtd.amount, " +
            "mtd.updatedDateAndTimeOfTransaction, vt.authCode, vt.tid, " +
            "mtd.netAmount, mtd.grossCharge, ftd.netAmount, mtd.charge, " +
            "vt.brandType, vt.cardType, vt.cardClassification, " +
            "mtd.merchant.businessName, ftd.franchise.franchiseName, mtd.tranStatus) " +
            "FROM MerchantTransactionDetails mtd " +
            "LEFT JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "LEFT JOIN FranchiseTransactionDetails ftd ON ftd.vendorTransactionId = mtd.vendorTransactionId " +
            "AND ftd.franchise.id = mtd.merchant.franchise.id " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
//            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
            "ORDER BY mtd.updatedDateAndTimeOfTransaction DESC")
    Page<MerchantTransactionReportDTO> findMerchantTransactionsBySettlementDateFilters(
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
            //"AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType)")
    Map<String, Object> getMerchantTransactionSummary(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("transactionType") String transactionType);

    // Summary based on settlement date
    @Query("SELECT " +
            "COUNT(mtd) as totalTransactions, " +
            "COALESCE(SUM(mtd.amount), 0) as totalAmount, " +
            "COALESCE(SUM(mtd.netAmount), 0) as totalNetAmount, " +
            "COALESCE(SUM(mtd.grossCharge), 0) as totalCharges, " +
            "COALESCE(AVG(mtd.amount), 0) as averageAmount, " +
            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failureCount " +
            "FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
           //"AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType)")
    Map<String, Object> getMerchantTransactionSummaryBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("transactionType") String transactionType);


// for export excel
    // In MerchantTransactionRepository

    // Transaction date based - with merchant type filter
    @Query("SELECT new com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO(" +
            "mtd.transactionId, mtd.vendorTransactionId, mtd.actionOnBalance, mtd.transactionDate, mtd.amount, " +
            "mtd.updatedDateAndTimeOfTransaction, vt.authCode, vt.tid, " +
            "mtd.netAmount, mtd.grossCharge, ftd.netAmount, mtd.charge, " +
            "vt.brandType, vt.cardType, vt.cardClassification, " +
            "mtd.merchant.businessName, ftd.franchise.franchiseName, mtd.tranStatus) " +
            "FROM MerchantTransactionDetails mtd " +
            "LEFT JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "LEFT JOIN FranchiseTransactionDetails ftd ON ftd.vendorTransactionId = mtd.vendorTransactionId " +
            "AND ftd.franchise.id = mtd.merchant.franchise.id " +
            "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
            "AND (:merchantType IS NULL OR " +
            "     (:merchantType = 'DIRECT' AND mtd.merchant.franchise IS NULL) OR " +
            "     (:merchantType = 'FRANCHISE' AND mtd.merchant.franchise IS NOT NULL)) " +
            "ORDER BY mtd.transactionDate DESC")
    Stream<MerchantTransactionReportDTO> streamAllMerchantTransactionsByFilters(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("transactionType") String transactionType,
            @Param("merchantType") String merchantType);

    // Settlement date based - with merchant type filter
    @Query("SELECT new com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO(" +
            "mtd.transactionId, mtd.vendorTransactionId, mtd.actionOnBalance, mtd.transactionDate, mtd.amount, " +
            "mtd.updatedDateAndTimeOfTransaction, vt.authCode, vt.tid, " +
            "mtd.netAmount, mtd.grossCharge, ftd.netAmount, mtd.charge, " +
            "vt.brandType, vt.cardType, vt.cardClassification, " +
            "mtd.merchant.businessName, ftd.franchise.franchiseName, mtd.tranStatus) " +
            "FROM MerchantTransactionDetails mtd " +
            "LEFT JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "LEFT JOIN FranchiseTransactionDetails ftd ON ftd.vendorTransactionId = mtd.vendorTransactionId " +
            "AND ftd.franchise.id = mtd.merchant.franchise.id " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:transactionType IS NULL OR mtd.transactionType = :transactionType) " +
            "AND (:merchantType IS NULL OR " +
            "     (:merchantType = 'DIRECT' AND mtd.merchant.franchise IS NULL) OR " +
            "     (:merchantType = 'FRANCHISE' AND mtd.merchant.franchise IS NOT NULL)) " +
            "ORDER BY mtd.updatedDateAndTimeOfTransaction DESC")
    Stream<MerchantTransactionReportDTO> streamAllMerchantTransactionsBySettlementDateFilters(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("transactionType") String transactionType,
            @Param("merchantType") String merchantType);
    /// /-------

    @Query("SELECT mtd.transactionType, COUNT(mtd), SUM(mtd.amount) " +
            "FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY mtd.transactionType")
    List<Object[]> getMerchantTransactionTypeBreakdown(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

    // Transaction type breakdown based on settlement date
    @Query("SELECT mtd.transactionType, COUNT(mtd), SUM(mtd.amount) " +
            "FROM MerchantTransactionDetails mtd WHERE " +
            "mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY mtd.transactionType")
    List<Object[]> getMerchantTransactionTypeBreakdownBySettlementDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

// NEW QUERIES - Add these to your existing MerchantTransDetRepository.java

//1
    // MERCHANT-ONLY TRANSACTION DETAILS REPORT (Transaction Date Based)
    @Query("SELECT " +
            "mtd.transactionDate as txnDate, " +
            "mtd.amount as txnAmount, " +
            "mtd.updatedDateAndTimeOfTransaction as settleDate, " +
            "vt.authCode as authCode, " +
            "vt.tid as tid, " +
            "CASE WHEN mtd.amount > 0 THEN ((mtd.amount - mtd.netAmount) / mtd.amount * 100) ELSE 0 END as settlementPercentage, " +
            "mtd.netAmount as settleAmount, " +
            "COALESCE(mtd.charge, 0) as systemFee, " +
            "CASE WHEN mtd.amount > 0 THEN (COALESCE(mtd.charge,0) / mtd.amount * 100) ELSE 0 END as systemFeePercentage, " +
            "vt.cardType as cardType, " +
            "vt.brandType as brandType, " +
            "vt.cardClassification as cardClassification, " +
            "mtd.merchant.businessName as merchantName " +
            "FROM MerchantTransactionDetails mtd " +
            "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:cardType IS NULL OR vt.cardType = :cardType) " +
            "AND (:brandType IS NULL OR vt.brandType = :brandType) " +
            "ORDER BY mtd.transactionDate DESC")
    Page<Object[]> getMerchantTransactionReportByTxnDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("cardType") String cardType,
            @Param("brandType") String brandType,
            Pageable pageable);

    // MERCHANT-ONLY TRANSACTION DETAILS REPORT (Settlement Date Based)
    @Query("SELECT " +
            "mtd.transactionDate as txnDate, " +
            "mtd.amount as txnAmount, " +
            "mtd.updatedDateAndTimeOfTransaction as settleDate, " +
            "vt.authCode as authCode, " +
            "vt.tid as tid, " +
            "CASE WHEN mtd.amount > 0 THEN ((mtd.amount - mtd.netAmount) / mtd.amount * 100) ELSE 0 END as settlementPercentage, " +
            "mtd.netAmount as settleAmount, " +
            "COALESCE(mtd.charge, 0) as systemFee, " +
            "CASE WHEN mtd.amount > 0 THEN (COALESCE(mtd.charge,0) / mtd.amount * 100) ELSE 0 END as systemFeePercentage, " +
            "vt.cardType as cardType, " +
            "vt.brandType as brandType, " +
            "vt.cardClassification as cardClassification, " +
            "mtd.merchant.businessName as merchantName " +
            "FROM MerchantTransactionDetails mtd " +
            "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND (:status IS NULL OR mtd.tranStatus = :status) " +
            "AND (:cardType IS NULL OR vt.cardType = :cardType) " +
            "AND (:brandType IS NULL OR vt.brandType = :brandType) " +
            "ORDER BY mtd.updatedDateAndTimeOfTransaction DESC")
    Page<Object[]> getMerchantTransactionReportBySettleDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId,
            @Param("status") String status,
            @Param("cardType") String cardType,
            @Param("brandType") String brandType,
            Pageable pageable);

 //2
    // AGGREGATED SUMMARY BY CARD TYPE AND BRAND (Transaction Date)
    @Query("SELECT " +
            "vt.cardType, " +
            "vt.brandType, " +
            "COUNT(mtd) as transactionCount, " +
            "CAST(SUM(mtd.amount) as bigdecimal), " +
            "CAST(SUM(mtd.netAmount) as bigdecimal), " +
            "CAST(SUM(mtd.charge) as bigdecimal), " +
            "CAST(AVG(mtd.amount) as bigdecimal), " +
            "CAST(AVG(CASE WHEN mtd.amount > 0 THEN (mtd.charge / mtd.amount * 100) ELSE 0 END) as bigdecimal) " +
            "FROM MerchantTransactionDetails mtd " +
            "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND mtd.tranStatus = 'SETTLED' " +
            "GROUP BY vt.cardType, vt.brandType " +
            "ORDER BY SUM(mtd.amount) DESC")
    List<Object[]> getMerchantCardTypeBrandSummaryByTxnDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

    // AGGREGATED SUMMARY BY CARD TYPE AND BRAND (Settlement Date)
    @Query("SELECT " +
            "vt.cardType, " +
            "vt.brandType, " +
            "COUNT(mtd) as transactionCount, " +
            "CAST(SUM(mtd.amount) as bigdecimal), " +
            "CAST(SUM(mtd.netAmount) as bigdecimal), " +
            "CAST(SUM(mtd.charge) as bigdecimal), " +
            "CAST(AVG(mtd.amount) as bigdecimal), " +
            "CAST(AVG(CASE WHEN mtd.amount > 0 THEN (mtd.charge / mtd.amount * 100) ELSE 0 END) as bigdecimal) " +
            "FROM MerchantTransactionDetails mtd " +
            "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "AND mtd.tranStatus = 'SETTLED' " +
            "GROUP BY vt.cardType, vt.brandType " +
            "ORDER BY SUM(mtd.amount) DESC")
    List<Object[]> getMerchantCardTypeBrandSummaryBySettleDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

 //3

    // DAILY TRANSACTION SUMMARY (Merchant Only, Transaction Date)
    @Query("SELECT " +
            "DATE(mtd.transactionDate) as txnDate, " +
            "COUNT(mtd) as totalTransactions, " +
            "CAST(SUM(mtd.amount) as bigdecimal) as totalAmount, " +
            "CAST(SUM(mtd.netAmount) as bigdecimal) as totalSettleAmount, " +
            "CAST(SUM(mtd.charge) as bigdecimal) as totalSystemFee, " +
            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as settledCount, " +
            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failedCount, " +
            "CAST(AVG(mtd.amount) as bigdecimal) as averageAmount, " +
            "COUNT(DISTINCT mtd.merchant.id) as uniqueMerchants " +
            "FROM MerchantTransactionDetails mtd " +
            "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY DATE(mtd.transactionDate) " +
            "ORDER BY DATE(mtd.transactionDate) DESC")
    List<Object[]> getMerchantDailySummaryByTxnDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);

    // DAILY TRANSACTION SUMMARY (Merchant Only, Settlement Date)
    @Query("SELECT " +
            "DATE(mtd.updatedDateAndTimeOfTransaction) as settleDate, " +
            "COUNT(mtd) as totalTransactions, " +
            "CAST(SUM(mtd.amount) as bigdecimal) as totalAmount, " +
            "CAST(SUM(mtd.netAmount) as bigdecimal) as totalSettleAmount, " +
            "CAST(SUM(mtd.charge) as bigdecimal) as totalSystemFee, " +
            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as settledCount, " +
            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failedCount, " +
            "CAST(AVG(mtd.amount) as bigdecimal) as averageAmount, " +
            "COUNT(DISTINCT mtd.merchant.id) as uniqueMerchants " +
            "FROM MerchantTransactionDetails mtd " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY DATE(mtd.updatedDateAndTimeOfTransaction) " +
            "ORDER BY DATE(mtd.updatedDateAndTimeOfTransaction) DESC")
    List<Object[]> getMerchantDailySummaryBySettleDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);


//4
  // TERMINAL WISE TRANSACTION ANALYSIS (Merchant Only, Transaction Date)
    @Query("SELECT " +
        "vt.tid as terminalId, " +
        "mtd.merchant.businessName as merchantName, " +
        "COUNT(mtd) as transactionCount, " +
        "CAST(SUM(mtd.amount) as bigdecimal) as totalAmount, " +
        "CAST(SUM(mtd.netAmount) as bigdecimal) as totalSettleAmount, " +
        "CAST(SUM(mtd.charge) as bigdecimal) as totalSystemFee, " +
        "CAST(AVG(mtd.amount) as bigdecimal) as averageAmount, " +
        "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
        "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failureCount " +
        "FROM MerchantTransactionDetails mtd " +
        "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
        "WHERE mtd.transactionDate BETWEEN :startDate AND :endDate " +
        "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
        "GROUP BY vt.tid, mtd.merchant.businessName " +
        "ORDER BY SUM(mtd.amount) DESC")
    List<Object[]> getTerminalWiseAnalysisByTxnDate(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("merchantId") Long merchantId);

    // TERMINAL WISE TRANSACTION ANALYSIS (Merchant Only, Settlement Date)
    @Query("SELECT " +
            "vt.tid as terminalId, " +
            "mtd.merchant.businessName as merchantName, " +
            "COUNT(mtd) as transactionCount, " +
            "CAST(SUM(mtd.amount) as bigdecimal) as totalAmount, " +
            "CAST(SUM(mtd.netAmount) as bigdecimal) as totalSettleAmount, " +
            "CAST(SUM(mtd.charge) as bigdecimal) as totalSystemFee, " +
            "CAST(AVG(mtd.amount) as bigdecimal) as averageAmount, " +
            "COUNT(CASE WHEN mtd.tranStatus = 'SETTLED' THEN 1 END) as successCount, " +
            "COUNT(CASE WHEN mtd.tranStatus != 'SETTLED' THEN 1 END) as failureCount " +
            "FROM MerchantTransactionDetails mtd " +
            "JOIN VendorTransactions vt ON vt.transactionReferenceId = mtd.vendorTransactionId " +
            "WHERE mtd.updatedDateAndTimeOfTransaction BETWEEN :startDate AND :endDate " +
            "AND (:merchantId IS NULL OR mtd.merchant.id = :merchantId) " +
            "GROUP BY vt.tid, mtd.merchant.businessName " +
            "ORDER BY SUM(mtd.amount) DESC")
    List<Object[]> getTerminalWiseAnalysisBySettleDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("merchantId") Long merchantId);



}
