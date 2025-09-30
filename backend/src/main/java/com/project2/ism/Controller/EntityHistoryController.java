package com.project2.ism.Controller;

import com.project2.ism.Model.EntityHistory;
import com.project2.ism.Service.EntityHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/history")
public class EntityHistoryController {

    @Autowired
    private EntityHistoryService historyService;

    // 1. Get ALL history (with optional filters)
    @GetMapping
    public ResponseEntity<Page<EntityHistory>> getHistory(
            @RequestParam(required = false) String entityName,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String parentEntityName,
            @RequestParam(required = false) String parentEntityId,
            @RequestParam(required = false) String changedBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Page<EntityHistory> history = historyService.getHistory(
                entityName, entityId, parentEntityName, parentEntityId,
                changedBy, startDate, endDate, page, size
        );
        return ResponseEntity.ok(history);
    }
    // 2. Get history for a specific entity and its children
    @GetMapping("/entity/{entityName}/{entityId}")
    public ResponseEntity<Map<String, Object>> getEntityHistory(
            @PathVariable String entityName,
            @PathVariable String entityId
    ) {
        Map<String, Object> result = historyService.getEntityWithChildrenHistory(entityName, entityId);
        return ResponseEntity.ok(result);
    }

    // 3. Get history grouped by timestamp (all changes in one transaction)
    @GetMapping("/grouped")
    public ResponseEntity<List<Map<String, Object>>> getGroupedHistory(
            @RequestParam(required = false) String entityName,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String parentEntityName,
            @RequestParam(required = false) String parentEntityId
    ) {
        List<Map<String, Object>> grouped = historyService.getGroupedHistory(
                entityName, entityId, parentEntityName, parentEntityId
        );
        return ResponseEntity.ok(grouped);
    }

    // 4. Get recent activity (last N changes)
    @GetMapping("/recent")
    public ResponseEntity<List<EntityHistory>> getRecentActivity(
            @RequestParam(defaultValue = "50") int limit
    ) {
        List<EntityHistory> recent = historyService.getRecentHistory(limit);
        return ResponseEntity.ok(recent);
    }

    // 5. Get activity by user
    @GetMapping("/user/{username}")
    public ResponseEntity<List<EntityHistory>> getUserActivity(
            @PathVariable String username,
            @RequestParam(defaultValue = "100") int limit
    ) {
        List<EntityHistory> userActivity = historyService.getHistoryByUser(username, limit);
        return ResponseEntity.ok(userActivity);
    }
}