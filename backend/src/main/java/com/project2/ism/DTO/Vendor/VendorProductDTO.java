package com.project2.ism.DTO.Vendor;


public class VendorProductDTO {
    private Long productId;
    private String productName;
    private String productCode;
    private String categoryName;
    private Boolean status;

    public VendorProductDTO() {}

    public VendorProductDTO(Long productId, String productName, String productCode, String categoryName, Boolean status) {
        this.productId = productId;
        this.productName = productName;
        this.productCode = productCode;
        this.categoryName = categoryName;
        this.status = status;
    }

    // Getters & Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
}
