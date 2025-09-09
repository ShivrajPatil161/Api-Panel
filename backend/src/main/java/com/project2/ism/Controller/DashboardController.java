package com.project2.ism.Controller;

import com.project2.ism.DTO.DashboardSummaryDTO;
import com.project2.ism.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        // Default to current month if dates not provided
        if (fromDate == null) {
            fromDate = LocalDate.now().withDayOfMonth(1);
        }
        if (toDate == null) {
            toDate = LocalDate.now();
        }

        DashboardSummaryDTO summary = reportService.getDashboardSummary(fromDate, toDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/charts")
    public ResponseEntity<Map<String, Object>> getDashboardCharts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        // Default to last 7 days if dates not provided
        if (fromDate == null) {
            fromDate = LocalDate.now().minusDays(7);
        }
        if (toDate == null) {
            toDate = LocalDate.now();
        }

        Map<String, Object> charts = reportService.getDashboardCharts(fromDate, toDate);
        return ResponseEntity.ok(charts);
    }

    @GetMapping("/summary/{period}")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummaryByPeriod(@PathVariable String period) {
        LocalDate fromDate;
        LocalDate toDate = LocalDate.now();

        switch (period.toLowerCase()) {
            case "today":
                fromDate = LocalDate.now();
                break;
            case "week":
                fromDate = LocalDate.now().minusDays(7);
                break;
            case "month":
                fromDate = LocalDate.now().withDayOfMonth(1);
                break;
            case "quarter":
                fromDate = LocalDate.now().minusMonths(3);
                break;
            case "year":
                fromDate = LocalDate.now().withDayOfYear(1);
                break;
            default:
                fromDate = LocalDate.now().withDayOfMonth(1);
        }

        DashboardSummaryDTO summary = reportService.getDashboardSummary(fromDate, toDate);
        return ResponseEntity.ok(summary);
    }
}