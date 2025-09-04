//package com.project2.ism.Controller;
//
//import com.project2.ism.DTO.TempDTOs.BatchCreatedResponse;
//
//import com.project2.ism.DTO.TempDTOs.SettlementCandidateDTO;
//import com.project2.ism.DTO.TempDTOs.SettlementRequest;
//import com.project2.ism.Model.MerchantSettlementBatch;
//import com.project2.ism.Model.VendorTransactions;
//import com.project2.ism.Repository.MerchantSettlementBatchRepository;
//import com.project2.ism.Service.SettlementAsyncService;
//import com.project2.ism.Service.SettlementService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/merchants/{merchantId}/settlement")
//public class SettlementController {
//
//    private final SettlementService settlementService;
//    private final MerchantSettlementBatchRepository batchRepo;
//
//    private final SettlementAsyncService settlementAsyncService;
//
//
//    public SettlementController(SettlementService settlementService,
//                                MerchantSettlementBatchRepository batchRepo, SettlementAsyncService settlementAsyncService) {
//        this.settlementService = settlementService;
//        this.batchRepo = batchRepo;
//        this.settlementAsyncService = settlementAsyncService;
//    }
//
//    /**
//     * Get settlement candidates for a given batch.
//     */
//    @GetMapping("/batches/{batchId}/candidates")
//    public ResponseEntity<List<SettlementCandidateDTO>> candidates(
//            @PathVariable Long merchantId,
//            @PathVariable Long batchId) {
//        MerchantSettlementBatch batch = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));
//
//        return ResponseEntity.ok(
//                settlementService.listSettlementCandidates(merchantId, batch.getWindowStart(), batch.getWindowEnd())
//        );
//    }
//
//    /**
//     * Get all batches for a merchant.
//     */
//    @GetMapping("/batches")
//    public ResponseEntity<List<MerchantSettlementBatch>> getBatches(@PathVariable Long merchantId) {
//        List<MerchantSettlementBatch> batches = settlementService.getAllBatches(merchantId);
//        return ResponseEntity.ok(batches);
//    }
//
//    /**
//     * Create a new settlement batch.
//     */
//    @PostMapping("/batches")
//    public ResponseEntity<BatchCreatedResponse> createBatch(
//            @PathVariable Long merchantId,
//            @RequestParam String cycleKey,
//            @RequestParam String createdBy) {
//
//        MerchantSettlementBatch batch = settlementService.createBatch(merchantId, cycleKey, createdBy);
//
//        BatchCreatedResponse resp = new BatchCreatedResponse();
//        resp.batchId = batch.getId();
//        resp.status = batch.getStatus();
//        resp.windowStart = batch.getWindowStart();
//        resp.windowEnd = batch.getWindowEnd();
//
//        return ResponseEntity.ok(resp);
//    }
//
//    /**
//     * Trigger settlement for a batch asynchronously.
//     */
//    @PostMapping("/batches/{batchId}/settle")
//    public ResponseEntity<Map<String, Object>> settleBatch(
//            @PathVariable Long merchantId,
//            @PathVariable Long batchId,
//            @RequestBody SettlementRequest request) {
//
//        // optionally validate merchantId == batch.merchantId here
//        settlementAsyncService.processBatchAsync(batchId, merchantId,request.vendorTxIds);
//
//        return ResponseEntity.accepted().body(Map.of(
//                "batchId", batchId,
//                "status", "PROCESSING"
//        ));
//    }
//
//    /**
//     * Get current status of a batch.
//     */
//    @GetMapping("/batches/{batchId}/status")
//    public ResponseEntity<MerchantSettlementBatch> batchStatus(@PathVariable Long batchId) {
//        MerchantSettlementBatch batch = batchRepo.findById(batchId)
//                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));
//
//        return ResponseEntity.ok(batch);
//    }
//}
