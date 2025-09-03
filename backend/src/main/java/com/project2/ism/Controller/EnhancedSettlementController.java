package com.project2.ism.Controller;

import com.project2.ism.DTO.TempDTOs.BatchCreatedResponse;
import com.project2.ism.DTO.TempDTOs.BatchProgressDTO;
import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
import com.project2.ism.DTO.TempDTOs.SettlementRequest;
import com.project2.ism.Model.MerchantSettlementBatch;
import com.project2.ism.Service.EnhancedSettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/merchants/{merchantId}/settlement")
public class EnhancedSettlementController {

    private final EnhancedSettlementService enhancedSettlementService;

    public EnhancedSettlementController(EnhancedSettlementService enhancedSettlementService) {
        this.enhancedSettlementService = enhancedSettlementService;
    }

    /**
     * Get or create active batch for direct merchant settlement
     */
    @PostMapping("/batches")
    public ResponseEntity<BatchCreatedResponse> getOrCreateActiveBatch(
            @PathVariable Long merchantId,
            @RequestParam String cycleKey,
            @RequestParam String createdBy) {

        try {
            MerchantSettlementBatch batch = enhancedSettlementService.getOrCreateActiveBatch(merchantId, cycleKey, createdBy);

            BatchCreatedResponse response = new BatchCreatedResponse(batch);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Get settlement candidates for a batch
     */
    @GetMapping("/batches/{batchId}/candidates")
    public ResponseEntity<List<SettlementCandidateDTO>> getSettlementCandidates(
            @PathVariable Long merchantId,
            @PathVariable Long batchId) {

        try {
            MerchantSettlementBatch batch = enhancedSettlementService.getBatchById(batchId);

            // Validate merchant ownership
            if (!merchantId.equals(batch.getMerchantId())) {
                return ResponseEntity.badRequest().build();
            }

            List<SettlementCandidateDTO> candidates = enhancedSettlementService.listSettlementCandidates(
                    merchantId, batch.getWindowStart(), batch.getWindowEnd());

            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update batch candidates (for selective settlement)
     */
    @PostMapping("/batches/{batchId}/candidates")
    public ResponseEntity<Map<String, Object>> updateBatchCandidates(
            @PathVariable Long merchantId,
            @PathVariable Long batchId,
            @RequestBody SettlementRequest request) {

        try {
            List<String> vendorTxIds = request.vendorTxIds;
            MerchantSettlementBatch batch = enhancedSettlementService.updateBatchCandidates(batchId, vendorTxIds);
            return ResponseEntity.ok(Map.of(
                    "batchId", batch.getId(),
                    "status", batch.getStatus(),
                    "totalTransactions", batch.getTotalTransactions(),
                    "totalAmount", batch.getTotalAmount(),
                    "totalFees", batch.getTotalFees(),
                    "totalNetAmount", batch.getTotalNetAmount(),
                    "message", "Batch candidates updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Process batch with detailed tracking
     */
    @PostMapping("/batches/{batchId}/process")
    public ResponseEntity<Map<String, Object>> processBatchWithTracking(
            @PathVariable Long merchantId,
            @PathVariable Long batchId) {

        try {
            // Validate batch belongs to merchant
            MerchantSettlementBatch batch = enhancedSettlementService.getBatchById(batchId);
            if (!merchantId.equals(batch.getMerchantId())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Batch does not belong to specified merchant"
                ));
            }

            // Start async processing
            enhancedSettlementService.processBatchWithTracking(batchId);

            return ResponseEntity.accepted().body(Map.of(
                    "batchId", batchId,
                    "status", "PROCESSING",
                    "message", "Batch processing started with detailed tracking"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Resume failed batch
     */
    @PostMapping("/batches/{batchId}/resume")
    public ResponseEntity<Map<String, Object>> resumeBatch(
            @PathVariable Long merchantId,
            @PathVariable Long batchId) {

        try {
            // Validate batch belongs to merchant
            MerchantSettlementBatch batch = enhancedSettlementService.getBatchById(batchId);
            if (!merchantId.equals(batch.getMerchantId())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Batch does not belong to specified merchant"
                ));
            }

            enhancedSettlementService.resumeBatch(batchId);
            return ResponseEntity.accepted().body(Map.of(
                    "batchId", batchId,
                    "status", "RESUMING",
                    "message", "Batch resume initiated"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * Get batch progress with detailed tracking
     */
    @GetMapping("/batches/{batchId}/progress")
    public ResponseEntity<BatchProgressDTO> getBatchProgress(
            @PathVariable Long merchantId,
            @PathVariable Long batchId) {

        try {
            // Validate batch belongs to merchant
            MerchantSettlementBatch batch = enhancedSettlementService.getBatchById(batchId);
            if (!merchantId.equals(batch.getMerchantId())) {
                return ResponseEntity.badRequest().build();
            }

            BatchProgressDTO progress = enhancedSettlementService.getBatchProgress(batchId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get batch details
     */
    @GetMapping("/batches/{batchId}")
    public ResponseEntity<BatchCreatedResponse> getBatchDetails(
            @PathVariable Long merchantId,
            @PathVariable Long batchId) {

        try {
            MerchantSettlementBatch batch = enhancedSettlementService.getBatchById(batchId);

            // Validate batch belongs to merchant
            if (!merchantId.equals(batch.getMerchantId())) {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok(new BatchCreatedResponse(batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all batches for merchant
     */
    @GetMapping("/batches")
    public ResponseEntity<List<BatchCreatedResponse>> getAllBatches(
            @PathVariable Long merchantId,
            @RequestParam(defaultValue = "10") int limit) {

        try {
            List<MerchantSettlementBatch> batches = enhancedSettlementService.getAllBatchesByMerchant(merchantId, limit);
            List<BatchCreatedResponse> responses = batches.stream()
                    .map(BatchCreatedResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get settlement candidates by cycle (without creating batch)
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<SettlementCandidateDTO>> getSettlementCandidatesByCycle(
            @PathVariable Long merchantId,
            @RequestParam String cycleKey) {

        try {
            List<SettlementCandidateDTO> candidates = enhancedSettlementService
                    .listSettlementCandidatesForFranchise(merchantId, cycleKey);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private BatchCreatedResponse createErrorResponse(String errorMessage) {
        BatchCreatedResponse errorResponse = new BatchCreatedResponse();
        errorResponse.errorMessage = errorMessage;
        return errorResponse;
    }
}