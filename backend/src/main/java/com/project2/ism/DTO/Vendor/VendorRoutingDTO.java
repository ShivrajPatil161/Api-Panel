package com.project2.ism.DTO.Vendor;

import java.time.LocalDateTime;
import java.util.List;

public class VendorRoutingDTO {

    private Long id;
    private Long productId;
    private String productName;
    private VendorIDNameDTO vendor1;
    private VendorIDNameDTO vendor2;
    private VendorIDNameDTO vendor3;
    private List<VendorRuleDTO> vendorRules;
    private Boolean status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor, Getters and Setters needed

    public VendorRoutingDTO() {
    }

    public VendorRoutingDTO(Long id, Long productId, String productName, VendorIDNameDTO vendor1, VendorIDNameDTO vendor2, VendorIDNameDTO vendor3, List<VendorRuleDTO> vendorRules, Boolean status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.vendor1 = vendor1;
        this.vendor2 = vendor2;
        this.vendor3 = vendor3;
        this.vendorRules = vendorRules;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public VendorRoutingDTO(Long id, Long productId, String productName, VendorIDNameDTO vendor1, VendorIDNameDTO vendor2, VendorIDNameDTO vendor3, List<VendorRuleDTO> vendorRules, Boolean status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.vendor1 = vendor1;
        this.vendor2 = vendor2;
        this.vendor3 = vendor3;
        this.vendorRules = vendorRules;
        this.status = status;
        this.createdAt = createdAt;
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

    public VendorIDNameDTO getVendor1() {
        return vendor1;
    }

    public void setVendor1(VendorIDNameDTO vendor1) {
        this.vendor1 = vendor1;
    }

    public VendorIDNameDTO getVendor2() {
        return vendor2;
    }

    public void setVendor2(VendorIDNameDTO vendor2) {
        this.vendor2 = vendor2;
    }

    public VendorIDNameDTO getVendor3() {
        return vendor3;
    }

    public void setVendor3(VendorIDNameDTO vendor3) {
        this.vendor3 = vendor3;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
