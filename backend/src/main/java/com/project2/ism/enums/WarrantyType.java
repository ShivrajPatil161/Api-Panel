package com.project2.ism.enums;

public enum WarrantyType {
    MANUFACTURER("Manufacturer Warranty"),
    VENDOR("Vendor Warranty"),
    NONE("No Warranty");

    private final String displayName;

    WarrantyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
