package com.project2.ism.Controller;

import com.project2.ism.DTO.TempDTOs.BatchCreateRequest;
import com.project2.ism.DTO.TempDTOs.BatchCreatedResponse;
import com.project2.ism.DTO.TempDTOs.SettlementRequest;
import com.project2.ism.Model.MerchantSettlementBatch;
import com.project2.ism.Model.VendorTransactions;
import com.project2.ism.Repository.MerchantSettlementBatchRepository;
import com.project2.ism.Service.SettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/merchants/{merchantId}/settlement")
public class SettlementController {

    private final SettlementService settlementService;
    private final MerchantSettlementBatchRepository batchRepo;

    public SettlementController(SettlementService settlementService,
                                MerchantSettlementBatchRepository batchRepo) {
        this.settlementService = settlementService;
        this.batchRepo = batchRepo;
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<VendorTransactions>> candidates(
            @PathVariable Long merchantId,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {
        return ResponseEntity.ok(settlementService.listSettlementCandidates(merchantId, from, to));
    }

    @PostMapping("/batches")
    public ResponseEntity<BatchCreatedResponse> createBatch(
            @PathVariable Long merchantId,
            @RequestBody BatchCreateRequest req) {
        MerchantSettlementBatch batch = settlementService.createBatch(merchantId, req.windowStart, req.windowEnd, req.cycleKey, req.createdBy);
        BatchCreatedResponse resp = new BatchCreatedResponse();
        resp.batchId = batch.getId();
        resp.status = batch.getStatus();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/batches/{batchId}/settle")
    public ResponseEntity<Map<String,Object>> settleBatch(
            @PathVariable Long merchantId,
            @PathVariable Long batchId,
            @RequestBody SettlementRequest request) {
        // validate merchantId == batch.merchantId optionally
        settlementService.processBatchAsync(batchId, request.vendorTxIds);
        return ResponseEntity.accepted().body(Map.of("batchId", batchId, "status", "PROCESSING"));
    }

    @GetMapping("/batches/{batchId}/status")
    public ResponseEntity<MerchantSettlementBatch> batchStatus(@PathVariable Long batchId) {
        return ResponseEntity.ok(batchRepo.findById(batchId).orElseThrow());
    }
}
