package com.project2.ism.DTO.Vendor;

import java.time.LocalDateTime;
import java.util.List;

public class VendorRoutingDTO {

    private Long id;
    private Long productId;
    private String productName;
    private List<VendorRuleDTO> vendorRules;
    private Boolean status;
    private LocalDateTime createdAt;

    // Constructor, Getters and Setters needed

    public VendorRoutingDTO() {
    }

    public VendorRoutingDTO(Long id, Long productId, String productName, List<VendorRuleDTO> vendorRules, Boolean status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.vendorRules = vendorRules;
        this.status = status;
        this.createdAt= createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public List<VendorRuleDTO> getVendorRules() {
        return vendorRules;
    }

    public void setVendorRules(List<VendorRuleDTO> vendorRules) {
        this.vendorRules = vendorRules;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
