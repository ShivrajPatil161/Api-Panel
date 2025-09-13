package com.project2.ism.Controller;

import com.project2.ism.DTO.ReportDTO.ApiResponse;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionReportRequest;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionSummary;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.TransactionReportResponse;
import com.project2.ism.DTO.ReportDTO.TransactionReportDTO.FranchiseTransactionSummary;
import com.project2.ism.Service.TransactionReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.access.prepost.PreAuthorize;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("v1/reports/transactions")
@Validated
public class TransactionReportController {

    private static final Logger logger = LoggerFactory.getLogger(TransactionReportController.class);

    private final TransactionReportService transactionReportService;

    public TransactionReportController(TransactionReportService transactionReportService) {
        this.transactionReportService = transactionReportService;
    }

    /**
     * Generate merchant transaction report
     * GET /api/v1/reports/transactions/merchant
     */
    @GetMapping("/merchant")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MERCHANT') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<TransactionReportResponse>> generateMerchantTransactionReport(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "merchantId", required = false) Long merchantId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "transactionType", required = false) String transactionType,
            @RequestParam(value = "page", defaultValue = "0") @Min(0) Integer page,
            @RequestParam(value = "size", defaultValue = "50") @Min(1) @Max(1000) Integer size) {

        logger.info("Received request for merchant transaction report: startDate={}, endDate={}, merchantId={}",
                startDate, endDate, merchantId);

        try {
            TransactionReportRequest request = new TransactionReportRequest();
            request.setStartDate(LocalDateTime.parse(startDate));
            request.setEndDate(LocalDateTime.parse(endDate));
            request.setMerchantId(merchantId);
            request.setTransactionStatus(status);
            request.setTransactionType(transactionType);
            request.setPage(page);
            request.setSize(size);

            TransactionReportResponse report = transactionReportService.generateMerchantTransactionReport(request);

            ApiResponse<TransactionReportResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Merchant transaction report generated successfully");
            response.setData(report);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error generating merchant transaction report", e);
            ApiResponse<TransactionReportResponse> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to generate report: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Generate franchise transaction report with commission details
     * GET /api/v1/reports/transactions/franchise
     */
    @GetMapping("/franchise")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<TransactionReportResponse>> generateFranchiseTransactionReport(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "franchiseId", required = false) Long franchiseId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "transactionType", required = false) String transactionType,
            @RequestParam(value = "page", defaultValue = "0") @Min(0) Integer page,
            @RequestParam(value = "size", defaultValue = "50") @Min(1) @Max(1000) Integer size) {

        logger.info("Received request for franchise transaction report: startDate={}, endDate={}, franchiseId={}",
                startDate, endDate, franchiseId);

        try {
            TransactionReportRequest request = new TransactionReportRequest();
            request.setStartDate(LocalDateTime.parse(startDate));
            request.setEndDate(LocalDateTime.parse(endDate));
            request.setFranchiseId(franchiseId);
            request.setTransactionStatus(status);
            request.setTransactionType(transactionType);
            request.setPage(page);
            request.setSize(size);

            TransactionReportResponse report = transactionReportService.generateFranchiseTransactionReport(request);

            ApiResponse<TransactionReportResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Franchise transaction report generated successfully");
            response.setData(report);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error generating franchise transaction report", e);
            ApiResponse<TransactionReportResponse> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to generate report: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Generate merchant transaction report using POST with request body
     * POST /api/v1/reports/transactions/merchant
     */
    @PostMapping("/merchant")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MERCHANT') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<TransactionReportResponse>> generateMerchantTransactionReportPost(
            @Valid @RequestBody TransactionReportRequest request) {

        logger.info("Received POST request for merchant transaction report: {}", request);

        try {
            TransactionReportResponse report = transactionReportService.generateMerchantTransactionReport(request);

            ApiResponse<TransactionReportResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Merchant transaction report generated successfully");
            response.setData(report);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error generating merchant transaction report", e);
            ApiResponse<TransactionReportResponse> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to generate report: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Generate franchise transaction report using POST with request body
     * POST /api/v1/reports/transactions/franchise
     */
    @PostMapping("/franchise")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<TransactionReportResponse>> generateFranchiseTransactionReportPost(
            @Valid @RequestBody TransactionReportRequest request) {

        logger.info("Received POST request for franchise transaction report: {}", request);

        try {
            TransactionReportResponse report = transactionReportService.generateFranchiseTransactionReport(request);

            ApiResponse<TransactionReportResponse> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Franchise transaction report generated successfully");
            response.setData(report);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error generating franchise transaction report", e);
            ApiResponse<TransactionReportResponse> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to generate report: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get merchant transaction summary only (without detailed transactions)
     * GET /api/v1/reports/transactions/merchant/summary
     */
    @GetMapping("/merchant/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MERCHANT') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<TransactionSummary>> getMerchantTransactionSummary(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "merchantId", required = false) Long merchantId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "transactionType", required = false) String transactionType) {

        logger.info("Received request for merchant transaction summary: startDate={}, endDate={}, merchantId={}",
                startDate, endDate, merchantId);

        try {
            TransactionReportRequest request = new TransactionReportRequest();
            request.setStartDate(LocalDateTime.parse(startDate));
            request.setEndDate(LocalDateTime.parse(endDate));
            request.setMerchantId(merchantId);
            request.setTransactionStatus(status);
            request.setTransactionType(transactionType);

            TransactionSummary summary = transactionReportService.getMerchantTransactionSummary(request);

            ApiResponse<TransactionSummary> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Merchant transaction summary retrieved successfully");
            response.setData(summary);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting merchant transaction summary", e);
            ApiResponse<TransactionSummary> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to get summary: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get franchise transaction summary with commission details
     * GET /api/v1/reports/transactions/franchise/summary
     */
    @GetMapping("/franchise/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<FranchiseTransactionSummary>> getFranchiseTransactionSummary(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "franchiseId", required = false) Long franchiseId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "transactionType", required = false) String transactionType) {

        logger.info("Received request for franchise transaction summary: startDate={}, endDate={}, franchiseId={}",
                startDate, endDate, franchiseId);

        try {
            TransactionReportRequest request = new TransactionReportRequest();
            request.setStartDate(LocalDateTime.parse(startDate));
            request.setEndDate(LocalDateTime.parse(endDate));
            request.setFranchiseId(franchiseId);
            request.setTransactionStatus(status);
            request.setTransactionType(transactionType);

            FranchiseTransactionSummary summary = transactionReportService.getFranchiseTransactionSummary(request);

            ApiResponse<FranchiseTransactionSummary> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Franchise transaction summary retrieved successfully");
            response.setData(summary);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting franchise transaction summary", e);
            ApiResponse<FranchiseTransactionSummary> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to get summary: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get franchise merchant performance breakdown
     * GET /api/v1/reports/transactions/franchise/merchant-performance
     */
    @GetMapping("/franchise/merchant-performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FRANCHISE')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFranchiseMerchantPerformance(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "franchiseId", required = false) Long franchiseId) {

        logger.info("Received request for franchise merchant performance: startDate={}, endDate={}, franchiseId={}",
                startDate, endDate, franchiseId);

        try {
            TransactionReportRequest request = new TransactionReportRequest();
            request.setStartDate(LocalDateTime.parse(startDate));
            request.setEndDate(LocalDateTime.parse(endDate));
            request.setFranchiseId(franchiseId);

            List<Map<String, Object>> performance = transactionReportService.getFranchiseMerchantPerformance(request);

            ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>();
            response.setSuccess(true);
            response.setMessage("Franchise merchant performance retrieved successfully");
            response.setData(performance);
            response.setTimestamp(LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting franchise merchant performance", e);
            ApiResponse<List<Map<String, Object>>> errorResponse = new ApiResponse<>();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Failed to get performance data: " + e.getMessage());
            errorResponse.setTimestamp(LocalDateTime.now());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}