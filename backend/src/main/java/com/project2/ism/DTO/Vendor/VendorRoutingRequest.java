package com.project2.ism.DTO.Vendor;


import java.util.List;

public class VendorRoutingRequest {

    private Long productId;
    private Long vendor1Id;
    private Long vendor2Id;
    private Long vendor3Id;
    private List<VendorRuleRequest> vendorRules;

    // Constructor, Getters and Setters needed

    public VendorRoutingRequest() {
    }

    public VendorRoutingRequest(Long productId, Long vendor1Id, Long vendor2Id, Long vendor3Id, List<VendorRuleRequest> vendorRules) {
        this.productId = productId;
        this.vendor1Id = vendor1Id;
        this.vendor2Id = vendor2Id;
        this.vendor3Id = vendor3Id;
        this.vendorRules = vendorRules;
    }

    public VendorRoutingRequest(Long productId, List<VendorRuleRequest> vendorRules) {
        this.productId = productId;
        this.vendorRules = vendorRules;
    }

    public Long getVendor1Id() {
        return vendor1Id;
    }

    public void setVendor1Id(Long vendor1Id) {
        this.vendor1Id = vendor1Id;
    }

    public Long getVendor2Id() {
        return vendor2Id;
    }

    public void setVendor2Id(Long vendor2Id) {
        this.vendor2Id = vendor2Id;
    }

    public Long getVendor3Id() {
        return vendor3Id;
    }

    public void setVendor3Id(Long vendor3Id) {
        this.vendor3Id = vendor3Id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public List<VendorRuleRequest> getVendorRules() {
        return vendorRules;
    }

    public void setVendorRules(List<VendorRuleRequest> vendorRules) {
        this.vendorRules = vendorRules;
    }
}