package com.project2.ism.DTO.Vendor;


import java.util.List;

public class VendorRoutingRequest {

    private Long productId;
    private List<VendorRuleRequest> vendorRules;

    // Constructor, Getters and Setters needed

    public VendorRoutingRequest() {
    }

    public VendorRoutingRequest(Long productId, List<VendorRuleRequest> vendorRules) {
        this.productId = productId;
        this.vendorRules = vendorRules;
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