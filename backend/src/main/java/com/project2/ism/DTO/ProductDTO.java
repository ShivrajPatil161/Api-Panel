package com.project2.ism.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project2.ism.DTO.Vendor.VendorIDNameDTO;
import com.project2.ism.Enum.TransactionType;

import java.math.BigDecimal;

public class ProductDTO {

    private Long id;
    private String productName;
    private String productCode;

    @JsonProperty("productCategory") // Maps "productCategory" from JSON to "category" field
    private ProductCategoryDTO category;

    private Boolean hasCharges;
    private Boolean isCommission;
    private BigDecimal gstValue;
    private BigDecimal tdsValue;
    private TransactionType transactionType;

    private String description;

    private boolean status;

    private String remarks;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String productName, String productCode, ProductCategoryDTO category, String description, boolean status, String remarks) {
        this.id = id;
        this.productName = productName;
        this.productCode = productCode;
        this.category = category;
        this.description = description;
        this.status = status;
        this.remarks = remarks;
    }

    public ProductDTO(Long id, String productName, String productCode, ProductCategoryDTO category, Boolean hasCharges, Boolean isCommission, BigDecimal gstValue, BigDecimal tdsValue, TransactionType transactionType, String description, boolean status, String remarks) {
        this.id = id;
        this.productName = productName;
        this.productCode = productCode;
        this.category = category;
        this.hasCharges = hasCharges;
        this.isCommission = isCommission;
        this.gstValue = gstValue;
        this.tdsValue = tdsValue;
        this.transactionType = transactionType;
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

    public ProductCategoryDTO getCategory() {
        return category;
    }

    public void setCategory(ProductCategoryDTO category) {
        this.category = category;
    }

    public Boolean getHasCharges() {
        return hasCharges;
    }

    public void setHasCharges(Boolean hasCharges) {
        this.hasCharges = hasCharges;
    }

    public Boolean getIsCommission() {
        return isCommission;
    }

    public void setIsCommission(Boolean commission) {
        isCommission = commission;
    }

    public BigDecimal getGstValue() {
        return gstValue;
    }

    public void setGstValue(BigDecimal gstValue) {
        this.gstValue = gstValue;
    }

    public BigDecimal getTdsValue() {
        return tdsValue;
    }

    public void setTdsValue(BigDecimal tdsValue) {
        this.tdsValue = tdsValue;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
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