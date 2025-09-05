////package com.project2.ism.Controller;
////
////import com.project2.ism.DTO.TempDTOs.BatchCreatedResponse;
////import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
////import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
////import com.project2.ism.DTO.TempDTOs.FranchiseMerchantOption;
////import com.project2.ism.Model.FranchiseSettlementBatch;
////import com.project2.ism.Service.FranchiseBulkSettlementService;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.List;
////import java.util.Map;
////import java.util.stream.Collectors;
////
////@RestController
////@RequestMapping("/franchises/{franchiseId}/bulk-settlement")
////public class FranchiseBulkSettlementController {
////
////    private final FranchiseBulkSettlementService franchiseBulkSettlementService;
////
////    public FranchiseBulkSettlementController(FranchiseBulkSettlementService franchiseBulkSettlementService) {
////        this.franchiseBulkSettlementService = franchiseBulkSettlementService;
////    }
////
////    /**
////     * Get available merchants under franchise for given cycle
////     */
////    @GetMapping("/merchants/available")
////    public ResponseEntity<List<FranchiseMerchantOption>> getAvailableMerchants(
////            @PathVariable Long franchiseId,
////            @RequestParam String cycleKey) {
////        try {
////            List<FranchiseMerchantOption> merchants =
////                    franchiseBulkSettlementService.getAvailableMerchantsForFranchise(franchiseId, cycleKey);
////            return ResponseEntity.ok(merchants);
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().build();
////        }
////    }
////
////    /**
////     * Create batch with selective merchants
////     */
////    @PostMapping("/batches/selective")
////    public ResponseEntity<BatchCreatedResponse> createSelectiveBatch(
////            @PathVariable Long franchiseId,
////            @RequestParam String cycleKey,
////            @RequestParam String createdBy,
////            @RequestBody List<Long> merchantIds) {
////        try {
////            FranchiseSettlementBatch batch = franchiseBulkSettlementService
////                    .createSelectiveFranchiseBatch(franchiseId, cycleKey, merchantIds, createdBy);
////            return ResponseEntity.ok(new BatchCreatedResponse(batch));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
////        }
////    }
////
////    /**
////     * Create batch with all merchants
////     */
////    @PostMapping("/batches/full")
////    public ResponseEntity<BatchCreatedResponse> createFullBatch(
////            @PathVariable Long franchiseId,
////            @RequestParam String cycleKey,
////            @RequestParam String createdBy) {
////        try {
////            FranchiseSettlementBatch batch =
////                    franchiseBulkSettlementService.createFullFranchiseBatch(franchiseId, cycleKey, createdBy);
////            return ResponseEntity.ok(new BatchCreatedResponse(batch));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
////        }
////    }
////
////    /**
////     * Update merchant selection inside batch
////     */
////    @PutMapping("/batches/{batchId}/merchants")
////    public ResponseEntity<BatchCreatedResponse> updateMerchantSelection(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId,
////            @RequestBody List<Long> merchantIds) {
////        try {
////            FranchiseSettlementBatch batch =
////                    franchiseBulkSettlementService.updateMerchantSelection(batchId, merchantIds);
////            return ResponseEntity.ok(new BatchCreatedResponse(batch));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
////        }
////    }
////
////    /**
////     * Get candidates (transactions) for a specific merchant inside franchise batch
////     */
////    @GetMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
////    public ResponseEntity<List<SettlementCandidateDTO>> getMerchantCandidates(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId,
////            @PathVariable Long merchantId,
////            @RequestParam String cycleKey) {
////        try {
////            List<SettlementCandidateDTO> candidates =
////                    franchiseBulkSettlementService.listSettlementCandidatesForMerchant(franchiseId, batchId, merchantId, cycleKey);
////            return ResponseEntity.ok(candidates);
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().build();
////        }
////    }
////
////    /**
////     * Update candidates (transactions) for a specific merchant inside batch
////     */
////    @PutMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
////    public ResponseEntity<Map<String, Object>> updateMerchantCandidates(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId,
////            @PathVariable Long merchantId,
////            @RequestBody List<String> vendorTxIds) {
////        try {
////            franchiseBulkSettlementService.updateMerchantCandidates(franchiseId, batchId, merchantId, vendorTxIds);
////            return ResponseEntity.ok(Map.of(
////                    "batchId", batchId,
////                    "merchantId", merchantId,
////                    "message", "Merchant candidates updated successfully"
////            ));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
////        }
////    }
////
////    /**
////     * Process entire franchise batch
////     */
////    @PostMapping("/batches/{batchId}/process")
////    public ResponseEntity<Map<String, Object>> processBatch(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId) {
////        try {
////            franchiseBulkSettlementService.processSelectedMerchants(batchId);
////            return ResponseEntity.accepted().body(Map.of(
////                    "batchId", batchId,
////                    "status", "PROCESSING",
////                    "message", "Franchise batch processing started"
////            ));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
////        }
////    }
////
////    /**
////     * Get batch progress
////     */
////    @GetMapping("/batches/{batchId}/progress")
////    public ResponseEntity<BatchProgressDTO> getBatchProgress(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId) {
////        try {
////            BatchProgressDTO progress = franchiseBulkSettlementService.getBatchProgress(batchId);
////            return ResponseEntity.ok(progress);
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().build();
////        }
////    }
////
////    /**
////     * Get batch details
////     */
////    @GetMapping("/batches/{batchId}")
////    public ResponseEntity<BatchCreatedResponse> getBatchDetails(
////            @PathVariable Long franchiseId,
////            @PathVariable Long batchId) {
////        try {
////            FranchiseSettlementBatch batch = franchiseBulkSettlementService.getBatchById(batchId);
////            return ResponseEntity.ok(new BatchCreatedResponse(batch));
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
////        }
////    }
////
////    /**
////     * Get all batches for franchise
////     */
////    @GetMapping("/batches")
////    public ResponseEntity<List<BatchCreatedResponse>> getAllBatches(
////            @PathVariable Long franchiseId) {
////        try {
////            List<FranchiseSettlementBatch> batches = franchiseBulkSettlementService.getAllBatches(franchiseId);
////            List<BatchCreatedResponse> responses = batches.stream()
////                    .map(BatchCreatedResponse::new)
////                    .collect(Collectors.toList());
////            return ResponseEntity.ok(responses);
////        } catch (Exception e) {
////            return ResponseEntity.badRequest().build();
////        }
////    }
////
////    private BatchCreatedResponse createErrorResponse(String errorMessage) {
////        BatchCreatedResponse errorResponse = new BatchCreatedResponse();
////        errorResponse.errorMessage = errorMessage;
////        return errorResponse;
////    }
////}
//
//
//
//
//
//
//package com.project2.ism.Controller;
//
//import com.project2.ism.DTO.TempDTOs.BatchCreatedResponse;
//import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
//import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
//import com.project2.ism.DTO.TempDTOs.FranchiseMerchantOption;
//import com.project2.ism.DTO.TempDTOs.FranchiseBatchResponse;
//import com.project2.ism.Model.FranchiseSettlementBatch;
//import com.project2.ism.Service.FranchiseBulkSettlementService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/franchises/{franchiseId}/bulk-settlement")
//public class FranchiseBulkSettlementController {
//
//    private final FranchiseBulkSettlementService franchiseBulkSettlementService;
//
//    public FranchiseBulkSettlementController(FranchiseBulkSettlementService franchiseBulkSettlementService) {
//        this.franchiseBulkSettlementService = franchiseBulkSettlementService;
//    }
//
//    /**
//     * Get available merchants under franchise for given cycle
//     */
//    @GetMapping("/merchants/available")
//    public ResponseEntity<List<FranchiseMerchantOption>> getAvailableMerchants(
//            @PathVariable Long franchiseId,
//            @RequestParam String cycleKey) {
//        try {
//            List<FranchiseMerchantOption> merchants =
//                    franchiseBulkSettlementService.getAvailableMerchantsForFranchise(franchiseId, cycleKey);
//            return ResponseEntity.ok(merchants);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    /**
//     * Create batch with selective merchants
//     */
//    @PostMapping("/batches/selective")
//    public ResponseEntity<FranchiseBatchResponse> createSelectiveBatch(
//            @PathVariable Long franchiseId,
//            @RequestParam String cycleKey,
//            @RequestParam String createdBy,
//            @RequestBody List<Long> merchantIds) {
//        try {
//            FranchiseSettlementBatch batch = franchiseBulkSettlementService
//                    .createSelectiveFranchiseBatch(franchiseId, cycleKey, merchantIds, createdBy);
//            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Create batch with all merchants
//     */
//    @PostMapping("/batches/full")
//    public ResponseEntity<FranchiseBatchResponse> createFullBatch(
//            @PathVariable Long franchiseId,
//            @RequestParam String cycleKey,
//            @RequestParam String createdBy) {
//        try {
//            FranchiseSettlementBatch batch =
//                    franchiseBulkSettlementService.createFullFranchiseBatch(franchiseId, cycleKey, createdBy);
//            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Update merchant selection inside batch
//     */
//    @PutMapping("/batches/{batchId}/merchants")
//    public ResponseEntity<FranchiseBatchResponse> updateMerchantSelection(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId,
//            @RequestBody List<Long> merchantIds) {
//        try {
//            FranchiseSettlementBatch batch =
//                    franchiseBulkSettlementService.updateMerchantSelection(batchId, merchantIds);
//            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Get candidates (transactions) for a specific merchant inside franchise batch
//     */
//    @GetMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
//    public ResponseEntity<List<SettlementCandidateDTO>> getMerchantCandidates(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId,
//            @PathVariable Long merchantId,
//            @RequestParam String cycleKey) {
//        try {
//            List<SettlementCandidateDTO> candidates =
//                    franchiseBulkSettlementService.listSettlementCandidatesForMerchant(franchiseId, batchId, merchantId, cycleKey);
//            return ResponseEntity.ok(candidates);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    /**
//     * Update candidates (transactions) for a specific merchant inside batch
//     */
//    @PutMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
//    public ResponseEntity<Map<String, Object>> updateMerchantCandidates(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId,
//            @PathVariable Long merchantId,
//            @RequestBody List<String> vendorTxIds) {
//        try {
//            franchiseBulkSettlementService.updateMerchantCandidates(franchiseId, batchId, merchantId, vendorTxIds);
//            return ResponseEntity.ok(Map.of(
//                    "batchId", batchId,
//                    "merchantId", merchantId,
//                    "message", "Merchant candidates updated successfully"
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//
//    /**
//     * Process entire franchise batch
//     */
//    @PostMapping("/batches/{batchId}/process")
//    public ResponseEntity<Map<String, Object>> processBatch(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId) {
//        try {
//            franchiseBulkSettlementService.processSelectedMerchants(batchId);
//            return ResponseEntity.accepted().body(Map.of(
//                    "batchId", batchId,
//                    "status", "PROCESSING",
//                    "message", "Franchise batch processing started"
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//
//    /**
//     * Get batch progress
//     */
//    @GetMapping("/batches/{batchId}/progress")
//    public ResponseEntity<BatchProgressDTO> getBatchProgress(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId) {
//        try {
//            BatchProgressDTO progress = franchiseBulkSettlementService.getBatchProgress(batchId);
//            return ResponseEntity.ok(progress);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    /**
//     * Get batch details
//     */
//    @GetMapping("/batches/{batchId}")
//    public ResponseEntity<FranchiseBatchResponse> getBatchDetails(
//            @PathVariable Long franchiseId,
//            @PathVariable Long batchId) {
//        try {
//            FranchiseSettlementBatch batch = franchiseBulkSettlementService.getBatchById(batchId);
//            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
//        }
//    }
//
//    /**
//     * Get all batches for franchise
//     */
//    @GetMapping("/batches")
//    public ResponseEntity<List<FranchiseBatchResponse>> getAllBatches(
//            @PathVariable Long franchiseId) {
//        try {
//            List<FranchiseSettlementBatch> batches = franchiseBulkSettlementService.getAllBatches(franchiseId);
//            List<FranchiseBatchResponse> responses = batches.stream()
//                    .map(FranchiseBatchResponse::new)
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(responses);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
//
//    private FranchiseBatchResponse createErrorFranchiseResponse(String errorMessage) {
//        FranchiseBatchResponse errorResponse = new FranchiseBatchResponse();
//        errorResponse.setErrorMessage(errorMessage);
//        return errorResponse;
//    }
//}



package com.project2.ism.Controller;

import com.project2.ism.DTO.TempDTOs.*;
import com.project2.ism.Model.FranchiseSettlementBatch;
import com.project2.ism.Service.FranchiseBulkSettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/franchises/{franchiseId}/bulk-settlement")
public class FranchiseBulkSettlementController {

    private final FranchiseBulkSettlementService franchiseBulkSettlementService;

    public FranchiseBulkSettlementController(FranchiseBulkSettlementService franchiseBulkSettlementService) {
        this.franchiseBulkSettlementService = franchiseBulkSettlementService;
    }

    /**
     * Get available merchants under franchise for given cycle and product
     */
    @GetMapping("/merchants/available")
    public ResponseEntity<List<FranchiseMerchantOption>> getAvailableMerchants(
            @PathVariable Long franchiseId,
            @RequestParam String cycleKey,
            @RequestParam Long productId) { // NEW: Required product_id parameter
        try {
            List<FranchiseMerchantOption> merchants = franchiseBulkSettlementService
                    .getAvailableMerchantsForFranchise(franchiseId, cycleKey, productId);
            return ResponseEntity.ok(merchants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Create batch with selective merchants
     */
    @PostMapping("/batches/selective")
    public ResponseEntity<FranchiseBatchResponse> createSelectiveBatch(
            @PathVariable Long franchiseId,
            @RequestParam String cycleKey,
            @RequestParam String createdBy,
            @RequestParam Long productId, // NEW: Required product_id parameter
            @RequestBody List<Long> merchantIds) {
        try {
            FranchiseSettlementBatch batch = franchiseBulkSettlementService
                    .createSelectiveFranchiseBatch(franchiseId,productId, cycleKey, merchantIds, createdBy);
            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
        }
    }

    /**
     * Create batch with all merchants
     */
    @PostMapping("/batches/full")
    public ResponseEntity<FranchiseBatchResponse> createFullBatch(
            @PathVariable Long franchiseId,
            @RequestParam String cycleKey,
            @RequestParam String createdBy,
            @RequestParam Long productId) { // NEW: Required product_id parameter
        try {
            FranchiseSettlementBatch batch = franchiseBulkSettlementService
                    .createFullFranchiseBatch(franchiseId,productId, cycleKey, createdBy);
            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
        }
    }

    /**
     * Update merchant selection inside batch
     */
    @PutMapping("/batches/{batchId}/merchants")
    public ResponseEntity<FranchiseBatchResponse> updateMerchantSelection(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId,
            @RequestBody List<Long> merchantIds) {
        try {
            FranchiseSettlementBatch batch = franchiseBulkSettlementService
                    .updateMerchantSelection(batchId, merchantIds);
            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
        }
    }

    /**
     * Get candidates (transactions) for a specific merchant inside franchise batch
     */
    @GetMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
    public ResponseEntity<List<SettlementCandidateDTO>> getMerchantCandidates(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId,
            @PathVariable Long merchantId,
            @RequestParam String cycleKey,
            @RequestParam Long productId) { // NEW: Required product_id parameter
        try {
            List<SettlementCandidateDTO> candidates = franchiseBulkSettlementService
                    .listSettlementCandidatesForMerchant(franchiseId, batchId, merchantId, cycleKey, productId);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DEPRECATED: Update candidates for specific merchant inside batch
     * Use processWithTransactions instead for better control
     */
    @PutMapping("/batches/{batchId}/merchants/{merchantId}/candidates")
    @Deprecated
    public ResponseEntity<Map<String, Object>> updateMerchantCandidates(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId,
            @PathVariable Long merchantId,
            @RequestBody List<String> vendorTxIds) {
        try {
            franchiseBulkSettlementService.updateMerchantCandidates(franchiseId, batchId, merchantId, vendorTxIds);
            return ResponseEntity.ok(Map.of(
                    "batchId", batchId,
                    "merchantId", merchantId,
                    "message", "Merchant candidates updated successfully (deprecated method)"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * NEW: Process franchise batch with merchant-specific transactions
     * Body format: { "merchantId1": ["tx1", "tx2"], "merchantId2": ["tx3", "tx4"] }
     */
    @PostMapping("/batches/{batchId}/process-with-transactions")
    public ResponseEntity<Map<String, Object>> processWithTransactions(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId,
            @RequestBody Map<Long, List<String>> merchantTransactionsMap) {
        try {
            franchiseBulkSettlementService.processSelectedMerchantsWithTransactions(batchId, merchantTransactionsMap);

            return ResponseEntity.accepted().body(Map.of(
                    "batchId", batchId,
                    "status", "PROCESSING",
                    "merchants", merchantTransactionsMap.size(),
                    "totalTransactions", merchantTransactionsMap.values().stream()
                            .mapToInt(List::size).sum(),
                    "message", "Franchise batch processing started with custom transactions"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * OLD: Process entire franchise batch with all available transactions
     * Kept for backward compatibility
     */
    @PostMapping("/batches/{batchId}/process")
    public ResponseEntity<Map<String, Object>> processBatch(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId) {
        try {
            franchiseBulkSettlementService.processSelectedMerchants(batchId);
            return ResponseEntity.accepted().body(Map.of(
                    "batchId", batchId,
                    "status", "PROCESSING",
                    "message", "Franchise batch processing started with all available transactions"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get batch progress
     */
    @GetMapping("/batches/{batchId}/progress")
    public ResponseEntity<BatchProgressDTO> getBatchProgress(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId) {
        try {
            BatchProgressDTO progress = franchiseBulkSettlementService.getBatchProgress(batchId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get batch details
     */
    @GetMapping("/batches/{batchId}")
    public ResponseEntity<FranchiseBatchResponse> getBatchDetails(
            @PathVariable Long franchiseId,
            @PathVariable Long batchId) {
        try {
            FranchiseSettlementBatch batch = franchiseBulkSettlementService.getBatchById(batchId);
            return ResponseEntity.ok(new FranchiseBatchResponse(batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorFranchiseResponse(e.getMessage()));
        }
    }

    /**
     * Get all batches for franchise
     */
    @GetMapping("/batches")
    public ResponseEntity<List<FranchiseBatchResponse>> getAllBatches(
            @PathVariable Long franchiseId) {
        try {
            List<FranchiseSettlementBatch> batches = franchiseBulkSettlementService.getAllBatches(franchiseId);
            List<FranchiseBatchResponse> responses = batches.stream()
                    .map(FranchiseBatchResponse::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private FranchiseBatchResponse createErrorFranchiseResponse(String errorMessage) {
        FranchiseBatchResponse errorResponse = new FranchiseBatchResponse();
        errorResponse.setErrorMessage(errorMessage);
        return errorResponse;
    }
}