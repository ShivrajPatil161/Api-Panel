package com.project2.ism.enums;

public enum ProductCategory {
        POS("Point of Sale System"),
        QR_SCANNER("QR Code Scanner"),
        CARD_READER("Card Reader"),
        PRINTER("Printer"),
        ACCESSORIES("Accessories");

        private final String displayName;

        ProductCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

