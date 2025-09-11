package com.project2.ism.Controller;

import com.project2.ism.DTO.FranchiseStatsDTO;
import com.project2.ism.DTO.InventoryTransactionStatsDTO;
import com.project2.ism.DTO.MerchantStatsDTO;
import com.project2.ism.DTO.ReportDTO.FranchiseReportsDTO;
import com.project2.ism.DTO.ReportDTO.VendorReportsDTO;
import com.project2.ism.Service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/franchises/{id}")
    public ResponseEntity<FranchiseStatsDTO> getFranchiseStats(@PathVariable Long id) {
        return ResponseEntity.ok(statsService.getFranchiseStats(id));
    }

    @GetMapping("/merchants/{id}")
    public ResponseEntity<MerchantStatsDTO> getMerchantStats(@PathVariable Long id) {
        return ResponseEntity.ok(statsService.getMerchantStats(id));
    }
    @GetMapping("/transactions-stats")
    public ResponseEntity<InventoryTransactionStatsDTO> getTransactionStats() {
        return ResponseEntity.ok(statsService.getTransactionStats());
    }

    @GetMapping("/vendor-reports")
    public ResponseEntity<VendorReportsDTO> getVendorReports() {
        return ResponseEntity.ok(statsService.getVendorReports());
    }

    @GetMapping("/franchise-reports")
    public ResponseEntity<List<FranchiseReportsDTO>> getFranchiseReports() {
        List<FranchiseReportsDTO> reports = statsService.getFranchiseReports();
        return ResponseEntity.ok(reports);
    }

}

