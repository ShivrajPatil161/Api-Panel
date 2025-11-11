package com.project2.ism.DTO.ApiPartnerDTO;

import java.time.LocalDate;

public class ApiPartnerSchemeAssignmentDTO {

    private Long id;
    private Long schemeId;
    private String schemeCode;       // Optional: for API readability
    private Long productId;
    private String productName;      // Optional
    private Long apiPartnerId;         // Either franchiseId or merchantId
    private String apiPartnerName;     // Optional: franchise/merchant name
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private String remarks;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSchemeId() { return schemeId; }
    public void setSchemeId(Long schemeId) { this.schemeId = schemeId; }

    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getApiPartnerId() {
        return apiPartnerId;
    }

    public void setApiPartnerId(Long apiPartnerId) {
        this.apiPartnerId = apiPartnerId;
    }

    public String getApiPartnerName() {
        return apiPartnerName;
    }

    public void setApiPartnerName(String apiPartnerName) {
        this.apiPartnerName = apiPartnerName;
    }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
