package com.project2.ism.Service;



import com.project2.ism.DTO.ReportDTO.FranchiseTransactionReportDTO;
import com.project2.ism.DTO.ReportDTO.MerchantTransactionReportDTO;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionDetailResponse;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionReportRequest;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionReportResponse;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionSummary;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.*;
import com.project2.ism.Exception.BusinessException;
import com.project2.ism.Exception.ValidationException;
import com.project2.ism.Model.FranchiseTransactionDetails;
import com.project2.ism.Model.MerchantTransactionDetails;
import com.project2.ism.Model.VendorTransactions;
import com.project2.ism.Repository.FranchiseTransDetRepository;
import com.project2.ism.Repository.MerchantTransDetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TransactionReportService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionReportService.class);

    private final MerchantTransDetRepository merchantTransactionRepository;
    private final FranchiseTransDetRepository franchiseTransactionRepository;

    private static final int MAX_DATE_RANGE_DAYS = 365;
    private static final int MAX_PAGE_SIZE = 1000;

    public TransactionReportService(MerchantTransDetRepository merchantTransactionRepository,
                                    FranchiseTransDetRepository franchiseTransactionRepository) {
        this.merchantTransactionRepository = merchantTransactionRepository;
        this.franchiseTransactionRepository = franchiseTransactionRepository;
    }


    // Keep all existing methods as they are, ADD these new methods:
// should keep these methods all above remove
    /**
     * Generate merchant transaction report with enhanced filtering
     */
    public TransactionReportResponse generateEnhancedMerchantTransactionReport(TransactionReportRequest request) {
        logger.info("Generating enhanced merchant transaction report...");

        validateReportRequest(request);

        try {
            Pageable pageable = createPageable(request);
            Page<MerchantTransactionReportDTO> transactionPage;

            // Choose query based on date filter type
            if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
                transactionPage = merchantTransactionRepository
                        .findMerchantTransactionsBySettlementDateFilters(
                                request.getStartDate(),
                                request.getEndDate(),
                                request.getMerchantId(),
                                request.getTransactionStatus(),
                                request.getTransactionType(),
                                pageable);
            } else {
                transactionPage = merchantTransactionRepository
                        .findMerchantTransactionsByFilters(
                                request.getStartDate(),
                                request.getEndDate(),
                                request.getMerchantId(),
                                request.getTransactionStatus(),
                                request.getTransactionType(),
                                pageable);
            }

            // Get user role from Security Context
            String userRole = getUserRoleFromSecurityContext();

            // Apply role-based filtering
            List<MerchantTransactionReportDTO> adjustedTransactions = transactionPage.getContent()
                    .stream()
                    .map(dto -> applyRoleBasedFiltering(dto, userRole))
                    .collect(Collectors.toList());

            // Get summary
            TransactionSummary summary = getEnhancedMerchantTransactionSummary(request);

            // Build response
            TransactionReportResponse<MerchantTransactionReportDTO> response = new TransactionReportResponse<>();
            response.setTransactions(adjustedTransactions);
            response.setSummary(summary);
            response.setReportGeneratedAt(LocalDateTime.now());
            response.setReportType("MERCHANT_TRANSACTION_REPORT");
            response.setTotalPages(transactionPage.getTotalPages());
            response.setTotalElements(transactionPage.getTotalElements());
            response.setHasNext(transactionPage.hasNext());
            response.setHasPrevious(transactionPage.hasPrevious());

            logger.info("Successfully generated report with {} transactions", adjustedTransactions.size());
            return response;

        } catch (Exception e) {
            logger.error("Error generating report", e);
            throw new BusinessException("Failed to generate report: " + e.getMessage());
        }
    }

    // Helper method to get role from JWT token in Security Context
    private String getUserRoleFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities() != null) {
            return authentication.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ADMIN");  // Default to ADMIN if no role found
        }
        return "ADMIN";
    }

    // Apply role-based filtering
    private MerchantTransactionReportDTO applyRoleBasedFiltering(MerchantTransactionReportDTO dto, String role) {
        if ("ROLE_MERCHANT".equals(role) || "MERCHANT".equals(role)) {
            // Hide franchise information
            dto.setFranchiseName(null);
            dto.setFranchiseRate(null);
            dto.setCommissionRate(null);
            dto.setCommissionAmount(null);

            // Replace systemFee with grossCharge for merchant view
            if (dto.getGrossCharge() != null) {
                dto.setSystemFee(dto.getGrossCharge());
            }
        }
        // For ADMIN/FRANCHISE roles, show everything as-is
        return dto;
    }
    /**
     * Generate franchise transaction report with enhanced filtering and entity mapping
     */
    public TransactionReportResponse generateEnhancedFranchiseTransactionReport(TransactionReportRequest request) {
        logger.info("Generating enhanced franchise transaction report for date range: {} to {}, dateFilter: {}",
                request.getStartDate(), request.getEndDate(), request.getDateFilterType());

        validateReportRequest(request);

        try {
            Pageable pageable = createPageable(request);

            Page<FranchiseTransactionDetails> entityPage;

            // Choose query based on date filter type
            if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
                entityPage = franchiseTransactionRepository
                        .findFranchiseTransactionsBySettlementDateFilters(
                                request.getStartDate(),
                                request.getEndDate(),
                                request.getFranchiseId(),
                                request.getTransactionStatus(),
                                request.getTransactionType(),
                                pageable);
            } else {
                // Default to transaction date
                entityPage = franchiseTransactionRepository
                        .findFranchiseTransactionsByFilters(
                                request.getStartDate(),
                                request.getEndDate(),
                                request.getFranchiseId(),
                                request.getTransactionStatus(),
                                request.getTransactionType(),
                                pageable);
            }
// After fetching the page
//            System.out.println("Total rows returned: " + entityPage.getNumberOfElements());
//            entityPage.getContent().forEach(ftd -> {
//                System.out.println("FTD ID: " + ftd.getTransactionId() +
//                        ", Date: " + ftd.getTransactionDate() +
//                        ", Amount: " + ftd.getAmount() +
//                        ", MerchantTxnId: " + (ftd.getMerchantTransactionDetail() != null
//                        ? ftd.getMerchantTransactionDetail().getTransactionId()
//                        : "null"));
//            });
            // Collect all vendor transaction IDs for batch fetch
            List<String> vendorTransactionIds = entityPage.getContent().stream()
                    .map(FranchiseTransactionDetails::getMerchantTransactionDetail)
                    .filter(Objects::nonNull)
                    .map(MerchantTransactionDetails::getVendorTransactionId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            // Batch fetch vendor transactions (if any exist)
            Map<String, VendorTransactions> vendorTransactionMap = new HashMap<>();
            if (!vendorTransactionIds.isEmpty()) {
                List<VendorTransactions> vendorTransactions =
                        franchiseTransactionRepository.findByTransactionReferenceIdIn(vendorTransactionIds);
                vendorTransactionMap = vendorTransactions.stream()
                        .collect(Collectors.toMap(
                                VendorTransactions::getTransactionReferenceId,
                                vt -> vt,
                                (existing, replacement) -> existing // Handle duplicates if any
                        ));
            }

            // Map entities to DTOs
            final Map<String, VendorTransactions> finalVendorMap = vendorTransactionMap;
            Page<FranchiseTransactionReportDTO> transactionPage = entityPage.map(ftd ->
                    mapToFranchiseTransactionReportDTO(ftd, finalVendorMap)
            );

            // Get franchise summary with commission data
            FranchiseTransactionSummary summary = getEnhancedFranchiseTransactionSummary(request);

            // Build response
            TransactionReportResponse<FranchiseTransactionReportDTO> response = new TransactionReportResponse<>();
            response.setTransactions(transactionPage.getContent());
            response.setSummary(summary);
            response.setReportGeneratedAt(LocalDateTime.now());
            response.setReportType("ENHANCED_FRANCHISE_TRANSACTION_REPORT");
            response.setTotalPages(transactionPage.getTotalPages());
            response.setTotalElements(transactionPage.getTotalElements());
            response.setHasNext(transactionPage.hasNext());
            response.setHasPrevious(transactionPage.hasPrevious());

            logger.info("Successfully generated enhanced franchise transaction report with {} transactions",
                    transactionPage.getNumberOfElements());
            return response;

        } catch (Exception e) {
            logger.error("Error generating enhanced franchise transaction report", e);
            throw new BusinessException("Failed to generate enhanced franchise transaction report: " + e.getMessage());
        }
    }

    /**
     * Helper method to map FranchiseTransactionDetails entity to DTO
     * Handles NULL merchant and vendor transactions gracefully
     */
    private FranchiseTransactionReportDTO mapToFranchiseTransactionReportDTO(
            FranchiseTransactionDetails ftd,
            Map<String, VendorTransactions> vendorTransactionMap) {

        MerchantTransactionDetails mtd = ftd.getMerchantTransactionDetail();
        VendorTransactions vt = null;

        // Get vendor transaction if merchant transaction exists
        if (mtd != null && mtd.getVendorTransactionId() != null) {
            vt = vendorTransactionMap.get(mtd.getVendorTransactionId());
        }

        // Use your existing DTO constructor - it handles nulls and calculations perfectly!
        return new FranchiseTransactionReportDTO(
                // Vendor transaction ID (null for standalone CREDIT/DEBIT)
                mtd != null ? mtd.getVendorTransactionId() : null,
                ftd.getActionOnBalance(),
                // Transaction date
                ftd.getTransactionDate(),

                // Transaction amount
                ftd.getAmount(),

                // Settlement date
                ftd.getUpdatedDateAndTimeOfTransaction(),

                // Vendor transaction fields (null if no vendor transaction)
                vt != null ? vt.getAuthCode() : null,
                vt != null ? vt.getTid() : null,

                // Merchant transaction fields (null for standalone transactions)
                mtd != null ? mtd.getNetAmount() : null,        // merchantNetAmount
                mtd != null ? mtd.getGrossCharge() : null,      // grossCharge

                // Franchise commission (always present in ftd)
                ftd.getNetAmount(),                              // franchiseCommission

                // System fee
                mtd != null ? mtd.getCharge() : null,            // systemFee

                // Card details (null if no vendor transaction)
                vt != null ? vt.getBrandType() : null,
                vt != null ? vt.getCardType() : null,
                vt != null ? vt.getCardClassification() : null,

                // Business names
                mtd != null && mtd.getMerchant() != null ? mtd.getMerchant().getBusinessName() : null,
                ftd.getFranchise() != null ? ftd.getFranchise().getFranchiseName() : null,

                // Transaction status
                ftd.getTranStatus()
        );
    }
    /**
     * Get enhanced merchant transaction summary
     */
    public TransactionSummary getEnhancedMerchantTransactionSummary(TransactionReportRequest request) {
        validateReportRequest(request);

        Map<String, Object> summaryData;

        if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
            summaryData = merchantTransactionRepository.getMerchantTransactionSummaryBySettlementDate(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getMerchantId(),
                    request.getTransactionStatus(),
                    request.getTransactionType());
        } else {
            summaryData = merchantTransactionRepository.getMerchantTransactionSummary(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getMerchantId(),
                    request.getTransactionStatus(),
                    request.getTransactionType());
        }

        return buildTransactionSummary(summaryData);
    }

    /**
     * Get enhanced franchise transaction summary
     */
    public FranchiseTransactionSummary getEnhancedFranchiseTransactionSummary(TransactionReportRequest request) {
        validateReportRequest(request);

        Map<String, Object> summaryData;

        if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
            summaryData = franchiseTransactionRepository.getFranchiseTransactionSummaryBySettlementDate(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId(),
                    request.getTransactionStatus(),
                    request.getTransactionType());
        } else {
            summaryData = franchiseTransactionRepository.getFranchiseTransactionSummary(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId(),
                    request.getTransactionStatus(),
                    request.getTransactionType());
        }

        FranchiseTransactionSummary summary = new FranchiseTransactionSummary();
        populateBasicSummary(summary, summaryData);

        // Set franchise-specific data
        summary.setTotalCommission(getBigDecimalValue(summaryData, "totalCommission"));
        summary.setActiveMerchants(getLongValue(summaryData, "activeMerchants"));

        // Calculate commission breakdown
        CommissionBreakdown commissionBreakdown = calculateCommissionBreakdown(summaryData);
        summary.setCommissionBreakdown(commissionBreakdown);

        return summary;
    }

    /**
     * Get enhanced franchise merchant performance
     */
    public List<Map<String, Object>> getEnhancedFranchiseMerchantPerformance(TransactionReportRequest request) {
        validateReportRequest(request);

        List<Object[]> performanceData;

        if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
            performanceData = franchiseTransactionRepository.getFranchiseMerchantPerformanceBySettlementDate(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId());
        } else {
            performanceData = franchiseTransactionRepository.getFranchiseMerchantPerformance(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId());
        }

        return performanceData.stream()
                .map(row -> Map.of(
                        "merchantId", row[0],
                        "merchantName", row[1],
                        "transactionCount", row[2],
                        "totalAmount", row[3],
                        "totalCommission", row[4]
                        ))
                .collect(Collectors.toList());
    }



    // more new ones
    /**
     * Get merchant transaction type breakdown
     */
    public List<Map<String, Object>> getEnhancedMerchantTransactionTypeBreakdown(TransactionReportRequest request) {
        validateReportRequest(request);

        List<Object[]> breakdownData;

        if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
            breakdownData = merchantTransactionRepository.getMerchantTransactionTypeBreakdownBySettlementDate(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getMerchantId()
            );
        } else {
            breakdownData = merchantTransactionRepository.getMerchantTransactionTypeBreakdown(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getMerchantId()
            );
        }

        return breakdownData.stream()
                .map(row -> Map.of(
                        "transactionType", row[0],
                        "transactionCount", row[1],
                        "totalAmount", row[2]
                ))
                .collect(Collectors.toList());
    }


    /**
     * Get top merchants by commission for a franchise
     */
    public List<Map<String, Object>> getEnhancedTopMerchantsByCommission(TransactionReportRequest request) {
        validateReportRequest(request);

        List<Object[]> topMerchants;

        if ("SETTLEMENT_DATE".equals(request.getDateFilterType())) {
            topMerchants = franchiseTransactionRepository.getTopMerchantsByCommissionBySettlementDate(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId()
            );
        } else {
            topMerchants = franchiseTransactionRepository.getTopMerchantsByCommission(
                    request.getStartDate(),
                    request.getEndDate(),
                    request.getFranchiseId()
            );
        }

        return topMerchants.stream()
                .map(row -> Map.of(
                        "merchantName", row[0],
                        "commission", row[1]
                ))
                .collect(Collectors.toList());
    }

// Keep all existing private helper methods as they are
    // Private helper methods

    private void validateReportRequest(TransactionReportRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new ValidationException("Start date and end date are required");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new ValidationException("Start date must be before end date");
        }

        long daysBetween = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (daysBetween > MAX_DATE_RANGE_DAYS) {
            throw new ValidationException("Date range cannot exceed " + MAX_DATE_RANGE_DAYS + " days");
        }

        if (request.getSize() > MAX_PAGE_SIZE) {
            throw new ValidationException("Page size cannot exceed " + MAX_PAGE_SIZE);
        }
    }

    private Pageable createPageable(TransactionReportRequest request) {
        return PageRequest.of(
                Math.max(0, request.getPage()),
                Math.min(request.getSize(), MAX_PAGE_SIZE));
    }

    private TransactionDetailResponse mapToTransactionDetailResponse(MerchantTransactionDetails entity) {
        TransactionDetailResponse response = new TransactionDetailResponse();
        response.setTransactionId(entity.getTransactionId());
        response.setTransactionDate(entity.getTransactionDate());
        response.setAmount(entity.getAmount());
        response.setNetAmount(entity.getNetAmount());
        response.setCharge(entity.getCharge());
        response.setVendorName(entity.getVendorName());
        response.setTransactionType(entity.getTransactionType());
        response.setStatus(entity.getTranStatus());
        response.setNarration(entity.getNarration());
        response.setCardHolderName(entity.getCardHolderName());
        response.setMobileNo(entity.getMobileNo());
        response.setBankRefId(entity.getBankRefId());
        response.setOperatorName(entity.getOperatorName());
        response.setRemarks(entity.getRemarks());
        return response;
    }

    private TransactionDetailResponse mapToTransactionDetailResponse(FranchiseTransactionDetails entity) {
        TransactionDetailResponse response = new TransactionDetailResponse();
        response.setTransactionId(entity.getTransactionId());
        response.setTransactionDate(entity.getTransactionDate());
        response.setAmount(entity.getAmount());
        response.setNetAmount(entity.getNetAmount());
        response.setCharge(entity.getAmount().subtract(entity.getNetAmount())); // Commission as charge
        response.setVendorName(entity.getVendorName());
        response.setTransactionType(entity.getTransactionType());
        response.setStatus(entity.getTranStatus());
        response.setNarration(entity.getNarration());
        response.setCardHolderName(entity.getCardHolderName());
        response.setMobileNo(entity.getMobileNo());
        response.setBankRefId(entity.getBankRefId());
        response.setOperatorName(entity.getOperatorName());
        response.setRemarks(entity.getRemarks());
        return response;
    }

    private TransactionSummary buildTransactionSummary(Map<String, Object> summaryData) {
        TransactionSummary summary = new TransactionSummary();
        populateBasicSummary(summary, summaryData);
        return summary;
    }

    private void populateBasicSummary(TransactionSummary summary, Map<String, Object> summaryData) {
        summary.setTotalTransactions(getLongValue(summaryData, "totalTransactions"));
        summary.setTotalAmount(getBigDecimalValue(summaryData, "totalAmount"));
        summary.setTotalNetAmount(getBigDecimalValue(summaryData, "totalNetAmount"));
        summary.setTotalCharges(getBigDecimalValue(summaryData, "totalCharges"));
        summary.setAverageTransactionValue(getBigDecimalValue(summaryData, "averageAmount"));
        summary.setSuccessfulTransactions(getLongValue(summaryData, "successCount"));
        summary.setFailedTransactions(getLongValue(summaryData, "failureCount"));

        // Calculate success rate
        Long totalTxns = summary.getTotalTransactions();
        Long successTxns = summary.getSuccessfulTransactions();
        if (totalTxns > 0) {
            double successRate = (successTxns.doubleValue() / totalTxns.doubleValue()) * 100;
            summary.setSuccessRate(BigDecimal.valueOf(successRate)
                    .setScale(2, RoundingMode.HALF_UP).doubleValue());
        } else {
            summary.setSuccessRate(0.0);
        }
    }

    private CommissionBreakdown calculateCommissionBreakdown(Map<String, Object> summaryData) {
        CommissionBreakdown breakdown = new CommissionBreakdown();

        BigDecimal totalCommission = getBigDecimalValue(summaryData, "totalCommission");
        BigDecimal totalAmount = getBigDecimalValue(summaryData, "totalAmount");
        Long activeMerchants = getLongValue(summaryData, "activeMerchants");

        breakdown.setGrossCommission(totalCommission);
        breakdown.setNetCommission(totalCommission); // Assuming no deductions for simplicity
        breakdown.setMerchantCount(activeMerchants);

        // Calculate commission rate
        if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal rate = totalCommission.multiply(BigDecimal.valueOf(100))
                    .divide(totalAmount, 4, RoundingMode.HALF_UP);
            breakdown.setCommissionRate(rate);
        } else {
            breakdown.setCommissionRate(BigDecimal.ZERO);
        }

        // Calculate average commission per merchant
        if (activeMerchants > 0) {
            BigDecimal avgCommission = totalCommission.divide(
                    BigDecimal.valueOf(activeMerchants), 2, RoundingMode.HALF_UP);
            breakdown.setAverageCommissionPerMerchant(avgCommission);
        } else {
            breakdown.setAverageCommissionPerMerchant(BigDecimal.ZERO);
        }

        return breakdown;
    }

    private BigDecimal getBigDecimalValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return BigDecimal.ZERO;
    }

    private Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return 0L;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        return 0L;
    }


    /**
     * Get comprehensive transaction details report
     */
    public Page<DetailedTransactionReportDTO> getDetailedTransactionReport(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId,
            Long merchantId,
            String status,
            String cardType,
            String brandType,
            Pageable pageable) {

        Page<Object[]> results = franchiseTransactionRepository.getDetailedTransactionReport(
                startDate, endDate, franchiseId, merchantId, status, cardType, brandType, pageable);

        List<DetailedTransactionReportDTO> reportData = results.getContent().stream()
                .map(this::mapToDetailedTransactionDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(reportData, pageable, results.getTotalElements());
    }

    /**
     * Get detailed transaction report based on settlement date
     */
    public Page<DetailedTransactionReportDTO> getDetailedTransactionReportBySettlementDate(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId,
            Long merchantId,
            String status,
            String cardType,
            String brandType,
            Pageable pageable) {

        Page<Object[]> results = franchiseTransactionRepository.getDetailedTransactionReportBySettlementDate(
                startDate, endDate, franchiseId, merchantId, status, cardType, brandType, pageable);

        List<DetailedTransactionReportDTO> reportData = results.getContent().stream()
                .map(this::mapToDetailedTransactionDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(reportData, pageable, results.getTotalElements());
    }

    /**
     * Get card type and brand summary
     */
    public List<CardTypeBrandSummaryDTO> getCardTypeBrandSummary(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId) {

        List<Object[]> results = franchiseTransactionRepository.getCardTypeBrandSummary(
                startDate, endDate, franchiseId);

        return results.stream()
                .map(this::mapToCardTypeBrandSummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get daily transaction summary
     */
    public List<DailySummaryReportDTO> getDailySummaryReport(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId) {

        List<Object[]> results = franchiseTransactionRepository.getDailySummaryReport(
                startDate, endDate, franchiseId);

        return results.stream()
                .map(this::mapToDailySummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant wise detailed performance
     */
    public List<MerchantPerformanceDTO> getMerchantWiseDetailedPerformance(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId) {

        List<Object[]> results = franchiseTransactionRepository.getMerchantWiseDetailedPerformance(
                startDate, endDate, franchiseId);

        return results.stream()
                .map(this::mapToMerchantPerformanceDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get franchise comparison report
     */
    public List<FranchiseComparisonDTO> getFranchiseComparisonReport(
            LocalDateTime startDate,
            LocalDateTime endDate) {

        List<Object[]> results = franchiseTransactionRepository.getFranchiseComparisonReport(
                startDate, endDate);

        return results.stream()
                .map(this::mapToFranchiseComparisonDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get terminal wise analysis
     */
    public List<TerminalAnalysisDTO> getTerminalWiseAnalysis(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId,
            Long merchantId) {

        List<Object[]> results = franchiseTransactionRepository.getTerminalWiseAnalysis(
                startDate, endDate, franchiseId, merchantId);

        return results.stream()
                .map(this::mapToTerminalAnalysisDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get hourly transaction trend
     */
    public List<HourlyTrendDTO> getHourlyTransactionTrend(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId) {

        List<Object[]> results = franchiseTransactionRepository.getHourlyTransactionTrend(
                startDate, endDate, franchiseId);

        return results.stream()
                .map(this::mapToHourlyTrendDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get failed transaction analysis
     */
    public Page<FailedTransactionDTO> getFailedTransactionAnalysis(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId,
            Long merchantId,
            Pageable pageable) {

        Page<Object[]> results = franchiseTransactionRepository.getFailedTransactionAnalysis(
                startDate, endDate, franchiseId, merchantId, pageable);

        List<FailedTransactionDTO> reportData = results.getContent().stream()
                .map(this::mapToFailedTransactionDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(reportData, pageable, results.getTotalElements());
    }

    /**
     * Get settlement delay analysis
     */
    public List<SettlementDelayAnalysisDTO> getSettlementDelayAnalysis(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId) {

        List<Object[]> results = franchiseTransactionRepository.getSettlementDelayAnalysis(
                startDate, endDate, franchiseId);

        return results.stream()
                .map(this::mapToSettlementDelayDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get transaction summary statistics
     */
    public TransactionSummaryDTO getTransactionSummary(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long franchiseId,
            String status,
            String transactionType) {

        Map<String, Object> summaryData = franchiseTransactionRepository.getFranchiseTransactionSummary(
                startDate, endDate, franchiseId, status, transactionType);

        return mapToTransactionSummaryDTO(summaryData);
    }

    //// 22-09-25 - with detailed fields
    /**
     * Get merchant-only transaction details by transaction date
     */
    public Page<DetailedTransactionReportDTO> getMerchantOnlyTransactionDetails(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId,
            String status,
            String cardType,
            String brandType,
            Pageable pageable) {

        Page<Object[]> results = merchantTransactionRepository.getMerchantTransactionReportByTxnDate(
                startDate, endDate, merchantId, status, cardType, brandType, pageable);

        List<DetailedTransactionReportDTO> reportData = results.getContent().stream()
                .map(this::mapMerchantOnlyToDetailedTransactionDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(reportData, pageable, results.getTotalElements());
    }

    /**
     * Get merchant-only transaction details by settlement date
     */
    public Page<DetailedTransactionReportDTO> getMerchantOnlyTransactionDetailsBySettlementDate(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId,
            String status,
            String cardType,
            String brandType,
            Pageable pageable) {

        Page<Object[]> results = merchantTransactionRepository.getMerchantTransactionReportBySettleDate(
                startDate, endDate, merchantId, status, cardType, brandType, pageable);

        List<DetailedTransactionReportDTO> reportData = results.getContent().stream()
                .map(this::mapMerchantOnlyToDetailedTransactionDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(reportData, pageable, results.getTotalElements());
    }

    /**
     * Get merchant-only card type brand summary by transaction date
     */
    public List<CardTypeBrandSummaryDTO> getMerchantOnlyCardTypeBrandSummary(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getMerchantCardTypeBrandSummaryByTxnDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToCardTypeBrandSummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant-only card type brand summary by settlement date
     */
    public List<CardTypeBrandSummaryDTO> getMerchantOnlyCardTypeBrandSummaryBySettlementDate(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getMerchantCardTypeBrandSummaryBySettleDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToCardTypeBrandSummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant-only daily summary by transaction date
     */
    public List<DailySummaryReportDTO> getMerchantOnlyDailySummary(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getMerchantDailySummaryByTxnDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToDailySummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant-only daily summary by settlement date
     */
    public List<DailySummaryReportDTO> getMerchantOnlyDailySummaryBySettlementDate(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getMerchantDailySummaryBySettleDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToDailySummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant-only terminal analysis by transaction date
     */
    public List<TerminalAnalysisDTO> getMerchantOnlyTerminalAnalysis(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getTerminalWiseAnalysisByTxnDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToTerminalAnalysisDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get merchant-only terminal analysis by settlement date
     */
    public List<TerminalAnalysisDTO> getMerchantOnlyTerminalAnalysisBySettlementDate(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Long merchantId) {

        List<Object[]> results = merchantTransactionRepository.getTerminalWiseAnalysisBySettleDate(
                startDate, endDate, merchantId);

        return results.stream()
                .map(this::mapMerchantOnlyToTerminalAnalysisDTO)
                .collect(Collectors.toList());
    }

    // Private mapping methods for merchant-only data
    private DetailedTransactionReportDTO mapMerchantOnlyToDetailedTransactionDTO(Object[] row) {
        DetailedTransactionReportDTO dto = new DetailedTransactionReportDTO();
        dto.setTxnDate((LocalDateTime) row[0]);
        dto.setTxnAmount((BigDecimal) row[1]);
        dto.setSettleDate((LocalDateTime) row[2]);
        dto.setAuthCode((String) row[3]);
        dto.setTid((String) row[4]);
        dto.setSettlementPercentage(row[5] != null ? ((Number) row[5]).doubleValue() : 0.0);
        dto.setSettleAmount((BigDecimal) row[6]);
        dto.setRetailorMDR((BigDecimal) row[7]); // system fee
        dto.setRetailorPercentage(row[8] != null ? ((Number) row[8]).doubleValue() : 0.0);
        dto.setCommissionAmount(BigDecimal.ZERO); // No commission for merchant-only
        dto.setCardType((String) row[9]);
        dto.setBrandType((String) row[10]);
        dto.setCardClassification((String) row[11]);
        dto.setMerchantName((String) row[12]);
        dto.setFranchiseName(null); // No franchise for merchant-only
        dto.setState(null); // State not available in merchant query
        return dto;
    }

    private CardTypeBrandSummaryDTO mapMerchantOnlyToCardTypeBrandSummaryDTO(Object[] row) {
        CardTypeBrandSummaryDTO dto = new CardTypeBrandSummaryDTO();
        dto.setCardType((String) row[0]);
        dto.setBrandType((String) row[1]);
        dto.setTransactionCount(((Number) row[2]).longValue());
        dto.setTotalAmount((BigDecimal) row[3]);
        dto.setTotalSettleAmount((BigDecimal) row[4]);
        dto.setTotalCommission(BigDecimal.ZERO); // No commission for merchant-only
        dto.setTotalMDR((BigDecimal) row[5]);
        dto.setAverageAmount((BigDecimal) row[6]);
        dto.setAverageMDRPercentage(row[7] != null ? ((Number) row[7]).doubleValue() : 0.0);
        return dto;
    }

    private DailySummaryReportDTO mapMerchantOnlyToDailySummaryDTO(Object[] row) {
        DailySummaryReportDTO dto = new DailySummaryReportDTO();
        dto.setTxnDate(((java.sql.Date) row[0]).toLocalDate().atStartOfDay());
        dto.setTotalTransactions(((Number) row[1]).longValue());
        dto.setTotalAmount((BigDecimal) row[2]);
        dto.setTotalSettleAmount((BigDecimal) row[3]);
        dto.setTotalCommission(BigDecimal.ZERO); // No commission for merchant-only
        dto.setTotalMDR((BigDecimal) row[4]);
        dto.setSettledCount(((Number) row[5]).longValue());
        dto.setFailedCount(((Number) row[6]).longValue());
        dto.setAverageAmount((BigDecimal) row[7]);
        dto.setUniqueMerchants(((Number) row[8]).longValue());
        return dto;
    }

    private TerminalAnalysisDTO mapMerchantOnlyToTerminalAnalysisDTO(Object[] row) {
        TerminalAnalysisDTO dto = new TerminalAnalysisDTO();
        dto.setTerminalId((String) row[0]);
        dto.setMerchantName((String) row[1]);
        dto.setFranchiseName(null); // No franchise for merchant-only
        dto.setTransactionCount(((Number) row[2]).longValue());
        dto.setTotalAmount((BigDecimal) row[3]);
        dto.setTotalSettleAmount((BigDecimal) row[4]);
        dto.setTotalCommission(BigDecimal.ZERO); // No commission for merchant-only
        dto.setAverageAmount((BigDecimal) row[6]);
        dto.setSuccessCount(((Number) row[7]).longValue());
        dto.setFailureCount(((Number) row[8]).longValue());
        return dto;
    }
    ////
    // Private mapping methods
    private DetailedTransactionReportDTO mapToDetailedTransactionDTO(Object[] row) {
        DetailedTransactionReportDTO dto = new DetailedTransactionReportDTO();
        dto.setTxnDate((LocalDateTime) row[0]);
        dto.setTxnAmount((BigDecimal) row[1]);
        dto.setSettleDate((LocalDateTime) row[2]);
        dto.setAuthCode((String) row[3]);
        dto.setTid((String) row[4]);
        dto.setSettlementPercentage(row[5] != null ? ((Number) row[5]).doubleValue() : 0.0);
        dto.setSettleAmount((BigDecimal) row[6]);
        dto.setRetailorMDR((BigDecimal) row[7]);
        dto.setRetailorPercentage(row[8] != null ? ((Number) row[8]).doubleValue() : 0.0);
        dto.setCommissionAmount((BigDecimal) row[9]);
        dto.setCardType((String) row[10]);
        dto.setBrandType((String) row[11]);
        dto.setCardClassification((String) row[12]);
        dto.setMerchantName((String) row[13]);
        dto.setFranchiseName((String) row[14]);
        dto.setState((String) row[15]);
        return dto;
    }

    private CardTypeBrandSummaryDTO mapToCardTypeBrandSummaryDTO(Object[] row) {
        CardTypeBrandSummaryDTO dto = new CardTypeBrandSummaryDTO();
        dto.setCardType((String) row[0]);
        dto.setBrandType((String) row[1]);
        dto.setTransactionCount(((Number) row[2]).longValue());
        dto.setTotalAmount((BigDecimal) row[3]);
        dto.setTotalSettleAmount((BigDecimal) row[4]);
        dto.setTotalCommission((BigDecimal) row[5]);
        dto.setTotalMDR((BigDecimal) row[6]);
        dto.setAverageAmount((BigDecimal) row[7]);
        dto.setAverageMDRPercentage(row[8] != null ? ((Number) row[8]).doubleValue() : 0.0);
        return dto;
    }

    private DailySummaryReportDTO mapToDailySummaryDTO(Object[] row) {
        DailySummaryReportDTO dto = new DailySummaryReportDTO();
        dto.setTxnDate(((java.sql.Date) row[0]).toLocalDate().atStartOfDay());
        dto.setTotalTransactions(((Number) row[1]).longValue());
        dto.setTotalAmount((BigDecimal) row[2]);
        dto.setTotalSettleAmount((BigDecimal) row[3]);
        dto.setTotalCommission((BigDecimal) row[4]);
        dto.setTotalMDR((BigDecimal) row[5]);
        dto.setSettledCount(((Number) row[6]).longValue());
        dto.setFailedCount(((Number) row[7]).longValue());
        dto.setAverageAmount((BigDecimal) row[8]);
        dto.setUniqueMerchants(((Number) row[9]).longValue());
        return dto;
    }

    private MerchantPerformanceDTO mapToMerchantPerformanceDTO(Object[] row) {
        MerchantPerformanceDTO dto = new MerchantPerformanceDTO();
        dto.setMerchantId(((Number) row[0]).longValue());
        dto.setMerchantName((String) row[1]);
        dto.setTransactionCount(((Number) row[2]).longValue());
        dto.setTotalAmount((BigDecimal) row[3]);
        dto.setTotalSettleAmount((BigDecimal) row[4]);
        dto.setTotalCommission((BigDecimal) row[5]);
        dto.setTotalMDR((BigDecimal) row[6]);
        dto.setAverageAmount((BigDecimal) row[7]);
        dto.setSuccessCount(((Number) row[8]).longValue());
        dto.setFailureCount(((Number) row[9]).longValue());
        dto.setSuccessRate(row[10] != null ? ((Number) row[10]).doubleValue() : 0.0);
        return dto;
    }

    private FranchiseComparisonDTO mapToFranchiseComparisonDTO(Object[] row) {
        FranchiseComparisonDTO dto = new FranchiseComparisonDTO();
        dto.setFranchiseId(((Number) row[0]).longValue());
        dto.setFranchiseName((String) row[1]);
        dto.setState((String) row[2]);
        dto.setTransactionCount(((Number) row[3]).longValue());
        dto.setTotalAmount((BigDecimal) row[4]);
        dto.setTotalSettleAmount((BigDecimal) row[5]);
        dto.setTotalCommission((BigDecimal) row[6]);
        dto.setUniqueMerchants(((Number) row[7]).longValue());
        dto.setAverageAmount((BigDecimal) row[8]);
        dto.setSuccessCount(((Number) row[9]).longValue());
        dto.setSuccessRate(row[10] != null ? ((Number) row[10]).doubleValue() : 0.0);
        return dto;
    }

    private TerminalAnalysisDTO mapToTerminalAnalysisDTO(Object[] row) {
        TerminalAnalysisDTO dto = new TerminalAnalysisDTO();
        dto.setTerminalId((String) row[0]);
        dto.setMerchantName((String) row[1]);
        dto.setFranchiseName((String) row[2]);
        dto.setTransactionCount(((Number) row[3]).longValue());
        dto.setTotalAmount((BigDecimal) row[4]);
        dto.setTotalSettleAmount((BigDecimal) row[5]);
        dto.setTotalCommission((BigDecimal) row[6]);
        dto.setAverageAmount((BigDecimal) row[7]);
        dto.setSuccessCount(((Number) row[8]).longValue());
        dto.setFailureCount(((Number) row[9]).longValue());
        return dto;
    }

    private HourlyTrendDTO mapToHourlyTrendDTO(Object[] row) {
        HourlyTrendDTO dto = new HourlyTrendDTO();
        dto.setTxnDate(((java.sql.Timestamp) row[0]).toLocalDateTime());
        dto.setTxnHour(((Number) row[1]).intValue());
        dto.setTransactionCount(((Number) row[2]).longValue());
        dto.setTotalAmount((BigDecimal) row[3]);
        dto.setAverageAmount((BigDecimal) row[4]);
        dto.setSuccessCount(((Number) row[5]).longValue());
        return dto;
    }

    private FailedTransactionDTO mapToFailedTransactionDTO(Object[] row) {
        FailedTransactionDTO dto = new FailedTransactionDTO();
        dto.setTransactionDate((LocalDateTime) row[0]);
        dto.setAmount((BigDecimal) row[1]);
        dto.setTranStatus((String) row[2]);
        dto.setFailureRemarks((String) row[3]);
        dto.setErrorCode((String) row[4]);
        dto.setPgErrorMessage((String) row[5]);
        dto.setTid((String) row[6]);
        dto.setCardType((String) row[7]);
        dto.setBrandType((String) row[8]);
        dto.setMerchantName((String) row[9]);
        dto.setFranchiseName((String) row[10]);
        return dto;
    }

    private SettlementDelayAnalysisDTO mapToSettlementDelayDTO(Object[] row) {
        SettlementDelayAnalysisDTO dto = new SettlementDelayAnalysisDTO();
        dto.setTransactionDate((LocalDateTime) row[0]);
        dto.setSettlementDate((LocalDateTime) row[1]);
        dto.setSettlementDelayHours(row[2] != null ? ((Number) row[2]).longValue() : 0L);
        dto.setAmount((BigDecimal) row[3]);
        dto.setNetAmount((BigDecimal) row[4]);
        dto.setTid((String) row[5]);
        dto.setMerchantName((String) row[6]);
        dto.setFranchiseName((String) row[7]);
        return dto;
    }

    private TransactionSummaryDTO mapToTransactionSummaryDTO(Map<String, Object> summaryData) {
        TransactionSummaryDTO dto = new TransactionSummaryDTO();
        dto.setTotalTransactions(((Number) summaryData.get("totalTransactions")).longValue());
        dto.setTotalAmount((BigDecimal) summaryData.get("totalAmount"));
        dto.setTotalCommission((BigDecimal) summaryData.get("totalCommission"));
        dto.setTotalNetAmount((BigDecimal) summaryData.get("totalNetAmount"));
        dto.setAverageAmount((BigDecimal) summaryData.get("averageAmount"));
        dto.setSuccessCount(((Number) summaryData.get("successCount")).longValue());
        dto.setFailureCount(((Number) summaryData.get("failureCount")).longValue());
        dto.setActiveMerchants(((Number) summaryData.get("activeMerchants")).longValue());
        return dto;
    }
}