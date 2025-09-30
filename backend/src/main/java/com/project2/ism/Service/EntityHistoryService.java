package com.project2.ism.Service;

import com.project2.ism.Model.EntityHistory;
import com.project2.ism.Repository.EntityHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EntityHistoryService {

    @Autowired
    private EntityHistoryRepository historyRepository;

    // Get history with filters
    public Page<EntityHistory> getHistory(String entityName, String entityId,
                                          String parentEntityName, String parentEntityId,
                                          String changedBy, LocalDateTime startDate,
                                          LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return historyRepository.findWithFilters(
                entityName, entityId, parentEntityName, parentEntityId,
                changedBy, startDate, endDate, pageable
        );
    }

    // Get entity history including its children
    public Map<String, Object> getEntityWithChildrenHistory(String entityName, String entityId) {
        List<EntityHistory> combined = historyRepository.findByEntityOrParent(entityName, entityId);

        Map<String, Object> result = new HashMap<>();
        result.put("entityName", entityName);
        result.put("entityId", entityId);
        result.put("totalChanges", combined.size());

        // Separate parent changes from child changes
        List<EntityHistory> parentChanges = combined.stream()
                .filter(h -> h.getEntityName().equals(entityName) && h.getEntityId().equals(entityId))
                .collect(Collectors.toList());

        List<EntityHistory> childChanges = combined.stream()
                .filter(h -> entityName.equals(h.getParentEntityName()) && entityId.equals(h.getParentEntityId()))
                .collect(Collectors.toList());

        result.put("parentChanges", parentChanges);
        result.put("childChanges", childChanges);
        result.put("allChanges", combined);

        return result;
    }

    // Get history grouped by timestamp (changes in same transaction)
    public List<Map<String, Object>> getGroupedHistory(String entityName, String entityId,
                                                       String parentEntityName, String parentEntityId) {
        List<EntityHistory> history;

        if (entityName != null && entityId != null) {
            history = historyRepository.findByEntityOrParent(entityName, entityId);
        } else if (parentEntityName != null && parentEntityId != null) {
            history = historyRepository.findByParentEntityNameAndParentEntityIdOrderByChangedAtDesc(
                    parentEntityName, parentEntityId
            );
        } else {
            history = historyRepository.findAll();
        }

        // Group by timestamp (rounded to second to catch same-transaction changes)
        Map<String, List<EntityHistory>> grouped = history.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getChangedAt().withNano(0).toString() + "_" + h.getChangedBy(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((key, changes) -> {
            Map<String, Object> group = new HashMap<>();
            group.put("timestamp", changes.get(0).getChangedAt());
            group.put("changedBy", changes.get(0).getChangedBy());
            group.put("changes", changes);
            group.put("changeCount", changes.size());
            result.add(group);
        });

        return result;
    }

    // Get recent history
    public List<EntityHistory> getRecentHistory(int limit) {
        return historyRepository.findTop50ByOrderByChangedAtDesc();
    }

    // Get history by user
    public List<EntityHistory> getHistoryByUser(String username, int limit) {
        return historyRepository.findByChangedByOrderByChangedAtDesc(username);
    }
}