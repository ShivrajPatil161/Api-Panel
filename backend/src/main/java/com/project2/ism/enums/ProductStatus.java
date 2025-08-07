package com.project2.ism.enums;

public enum ProductStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive");

    private final String displayName;

    ProductStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
