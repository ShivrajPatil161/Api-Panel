package com.project2.ism.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductDTO {

    private Long id;
    private String productName;
    private String productCode;

    private VendorIDNameDTO vendor;

    @JsonProperty("productCategory") // Maps "productCategory" from JSON to "category" field
    private ProductCategoryDTO category;


    private String description;

    private boolean status;

    private String remarks;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String productName, String productCode, VendorIDNameDTO vendor, ProductCategoryDTO category, String description, boolean status, String remarks) {
        this.id = id;
        this.productName = productName;
        this.productCode = productCode;
        this.vendor = vendor;
        this.category = category;
        this.description = description;
        this.status = status;
        this.remarks = remarks;
    }

    public ProductDTO(Long id, String productCode, String productName) {
        this.id = id;
        this.productCode = productCode;
        this.productName = productName;
    }


    // All getters and setters remain the same
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public VendorIDNameDTO getVendor() {
        return vendor;
    }

    public void setVendor(VendorIDNameDTO vendor) {
        this.vendor = vendor;
    }

    public ProductCategoryDTO getCategory() {
        return category;
    }

    public void setCategory(ProductCategoryDTO category) {
        this.category = category;
    }



    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}