package com.project2.ism.Controller;

import com.project2.ism.Model.RequestLog;
import com.project2.ism.Service.RequestLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/logs")
public class RequestLogController {

    @Autowired
    private RequestLogService requestLogService;

    @GetMapping
    public ResponseEntity<Page<RequestLog>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RequestLog> logs = requestLogService.findAllLogs(pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestLog> getLogById(@PathVariable Long id) {
        Optional<RequestLog> log = requestLogService.findById(id);
        return log.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<RequestLog>> getLogsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RequestLog> logs = requestLogService.findLogsByUserId(userId, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<List<RequestLog>> getLogsByUsername(@PathVariable String username) {
        List<RequestLog> logs = requestLogService.findLogsByUsername(username);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<List<RequestLog>> getLogsByMethod(@PathVariable String method) {
        List<RequestLog> logs = requestLogService.findLogsByMethod(method);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RequestLog>> getLogsByStatus(@PathVariable Integer status) {
        List<RequestLog> logs = requestLogService.findLogsByStatus(status);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/errors")
    public ResponseEntity<List<RequestLog>> getErrorLogs() {
        List<RequestLog> logs = requestLogService.findErrorLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/slow")
    public ResponseEntity<List<RequestLog>> getSlowRequests(
            @RequestParam(defaultValue = "1000") Long threshold) {
        List<RequestLog> logs = requestLogService.findSlowRequests(threshold);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RequestLog>> searchLogs(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<RequestLog> logs = requestLogService.searchLogs(userId, method, status, startDate, endDate, pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<RequestLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<RequestLog> logs = requestLogService.findLogsByDateRange(startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<List<RequestLog>> getUserLogsByDateRange(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        List<RequestLog> logs = requestLogService.findLogsByUserAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/today")
    public ResponseEntity<List<RequestLog>> getTodaysLogs() {
        List<RequestLog> logs = requestLogService.getTodaysLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/recent-errors")
    public ResponseEntity<List<RequestLog>> getRecentErrors(
            @RequestParam(defaultValue = "24") int hours) {
        List<RequestLog> logs = requestLogService.getRecentErrorLogs(hours);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTotalCount() {
        long count = requestLogService.getTotalRequestCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/user/{userId}/count")
    public ResponseEntity<Long> getUserRequestCount(@PathVariable String userId) {
        Long count = requestLogService.countRequestsByUser(userId);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        requestLogService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<String> cleanupOldLogs(
            @RequestParam(defaultValue = "30") int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        requestLogService.deleteOldLogs(cutoffDate);
        return ResponseEntity.ok("Cleaned up logs older than " + days + " days");
    }

    @GetMapping("/business/logins")
    public ResponseEntity<List<RequestLog>> getLoginLogs() {
        List<RequestLog> logs = requestLogService.getLoginLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/logouts")
    public ResponseEntity<List<RequestLog>> getLogoutLogs() {
        List<RequestLog> logs = requestLogService.getLogoutLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/creates")
    public ResponseEntity<List<RequestLog>> getCreateLogs() {
        List<RequestLog> logs = requestLogService.getCreateLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/edits")
    public ResponseEntity<List<RequestLog>> getEditLogs() {
        List<RequestLog> logs = requestLogService.getEditLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/deletes")
    public ResponseEntity<List<RequestLog>> getDeleteLogs() {
        List<RequestLog> logs = requestLogService.getDeleteLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/failed-attempts")
    public ResponseEntity<List<RequestLog>> getFailedAttempts() {
        List<RequestLog> logs = requestLogService.getFailedAttempts();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/admin-actions")
    public ResponseEntity<List<RequestLog>> getAdminActions() {
        List<RequestLog> logs = requestLogService.getAdminActions();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/user-management")
    public ResponseEntity<List<RequestLog>> getUserManagementLogs() {
        List<RequestLog> logs = requestLogService.getUserManagementLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/business/data-exports")
    public ResponseEntity<List<RequestLog>> getDataExports() {
        List<RequestLog> logs = requestLogService.getDataExports();
        return ResponseEntity.ok(logs);
    }
}