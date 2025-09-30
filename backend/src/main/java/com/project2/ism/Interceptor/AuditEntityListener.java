package com.project2.ism.Interceptor;

import com.project2.ism.Service.AuditService;
import jakarta.persistence.PreUpdate;
import org.hibernate.event.spi.PreUpdateEvent;
import org.hibernate.event.spi.PreUpdateEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class AuditEntityListener implements PreUpdateEventListener {

    private static AuditService auditService;

    @Autowired
    public void setAuditService(AuditService auditService) {
        AuditEntityListener.auditService = auditService;
        System.out.println("AuditEntityListener - Spring injected AuditService");
    }

    @Override
    public boolean onPreUpdate(PreUpdateEvent event) {
        System.out.println("============ AUDIT LISTENER TRIGGERED ============");
        System.out.println("Entity: " + event.getEntity().getClass().getSimpleName());

        try {
            if (auditService == null) {
                System.err.println("ERROR: AuditService is NULL in preUpdate!");
                return false;
            }

            // Get current user from SecurityContext
            String changedBy = getCurrentUser();
            System.out.println("Changed by: " + changedBy);

            if (changedBy == null) {
                changedBy = "SYSTEM";
            }

            Object entity = event.getEntity();
            String entityId = event.getId().toString();
            String entityName = entity.getClass().getSimpleName();

            System.out.println("Entity ID: " + entityId + ", Entity Name: " + entityName);

            // Get property names and indices
            String[] propertyNames = event.getPersister().getPropertyNames();
            Object[] oldState = event.getOldState();
            Object[] newState = event.getState();

            // Compare old and new values
            for (int i = 0; i < propertyNames.length; i++) {
                String fieldName = propertyNames[i];

                if (shouldSkipField(fieldName)) {
                    continue;
                }

                Object oldValue = oldState != null ? oldState[i] : null;
                Object newValue = newState != null ? newState[i] : null;

                // Only log if value actually changed
                if (!areValuesEqual(oldValue, newValue)) {
                    System.out.println("Field: " + fieldName +
                            " changed from [" + oldValue + "] to [" + newValue + "]");

                    // Save audit record
                    auditService.saveHistory(
                            entityName,
                            entityId,
                            fieldName,
                            oldValue != null ? oldValue.toString() : null,
                            newValue != null ? newValue.toString() : null,
                            changedBy
                    );
                }
            }

            System.out.println("============ AUDIT COMPLETE ============");

        } catch (Exception e) {
            System.err.println("Audit logging failed: " + e.getMessage());
            e.printStackTrace();
        }

        return false; // false = don't veto the update
    }

    private boolean areValuesEqual(Object oldValue, Object newValue) {
        if (oldValue == null && newValue == null) {
            return true;
        }
        if (oldValue == null || newValue == null) {
            return false;
        }
        return oldValue.equals(newValue);
    }

    private String getCurrentUser() {
        try {
            org.springframework.security.core.Authentication authentication =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();

            System.out.println("Authentication object: " + authentication);

            if (authentication != null && authentication.isAuthenticated()) {
                String username = authentication.getName();
                System.out.println("Username from SecurityContext: " + username);
                return username;
            }
        } catch (Exception e) {
            System.err.println("Failed to get user from SecurityContext: " + e.getMessage());
            e.printStackTrace();
        }

        return null;
    }

    private boolean shouldSkipField(String fieldName) {
        // Skip these fields from auditing
        return fieldName.equals("id") ||
                fieldName.equals("version") ||
                fieldName.equals("createdAt") ||
                fieldName.equals("updatedAt") ||
                fieldName.equals("createdBy") ||
                fieldName.equals("updatedBy") ||
                fieldName.equals("vendor") ||
                fieldName.equals("productCategory");
    }
}