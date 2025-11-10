package com.project2.ism.DTO;

public class ApiPartnerProductsDTO {



    private Long productId;
    private String productName;
    private String productCode;
    private String productCategory;


    public ApiPartnerProductsDTO(Long productId, String productName, String productCode,
                                     String productCategory) {

        this.productId = productId;
        this.productName = productName;
        this.productCode = productCode;
        this.productCategory = productCategory;
    }

    // getters + setters


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

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }


}
