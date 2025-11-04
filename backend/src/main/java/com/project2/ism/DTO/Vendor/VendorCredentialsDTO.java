package com.project2.ism.DTO.Vendor;

import java.time.LocalDateTime;

public class VendorCredentialsDTO {

    private Long id;
    private VendorIDNameDTO vendorInfo;
    private Long productId;
    private String productName;
    private String baseUrlUat;
    private String token;
    private String baseUrlProd;
    private String tokenUrlUat;
    private String tokenUrlProd;
    private String clientId;
    private String saltKey;
    private String clientSecret;
    private String username;
    private String password;
    private Boolean isActive;

    private String userField1;
    private String userField2;
    private String userField3;
    private String tokenType;
    private String createdBy;
    private LocalDateTime createdAt;
    private String editedBy;
    private LocalDateTime updatedAt;


    public VendorCredentialsDTO() {
    }

    public VendorCredentialsDTO(Long id, VendorIDNameDTO vendorInfo, Long productId, String productName, String baseUrlUat, String token, String baseUrlProd, String tokenUrlUat, String tokenUrlProd, String clientId, String saltKey, String clientSecret, String username, String password, Boolean isActive, String userField1, String userField2, String userField3, String tokenType, String createdBy, LocalDateTime createdAt, String editedBy, LocalDateTime updatedAt) {
        this.id = id;
        this.vendorInfo = vendorInfo;
        this.productId = productId;
        this.productName = productName;
        this.baseUrlUat = baseUrlUat;
        this.token = token;
        this.baseUrlProd = baseUrlProd;
        this.tokenUrlUat = tokenUrlUat;
        this.tokenUrlProd = tokenUrlProd;
        this.clientId = clientId;
        this.saltKey = saltKey;
        this.clientSecret = clientSecret;
        this.username = username;
        this.password = password;
        this.isActive = isActive;
        this.userField1 = userField1;
        this.userField2 = userField2;
        this.userField3 = userField3;
        this.tokenType = tokenType;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.editedBy = editedBy;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public VendorIDNameDTO getVendorInfo() {
        return vendorInfo;
    }

    public void setVendorInfo(VendorIDNameDTO vendorInfo) {
        this.vendorInfo = vendorInfo;
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

    public String getBaseUrlUat() {
        return baseUrlUat;
    }

    public void setBaseUrlUat(String baseUrlUat) {
        this.baseUrlUat = baseUrlUat;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getBaseUrlProd() {
        return baseUrlProd;
    }

    public void setBaseUrlProd(String baseUrlProd) {
        this.baseUrlProd = baseUrlProd;
    }

    public String getTokenUrlUat() {
        return tokenUrlUat;
    }

    public void setTokenUrlUat(String tokenUrlUat) {
        this.tokenUrlUat = tokenUrlUat;
    }

    public String getTokenUrlProd() {
        return tokenUrlProd;
    }

    public void setTokenUrlProd(String tokenUrlProd) {
        this.tokenUrlProd = tokenUrlProd;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getSaltKey() {
        return saltKey;
    }

    public void setSaltKey(String saltKey) {
        this.saltKey = saltKey;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }


    public String getUserField1() {
        return userField1;
    }

    public void setUserField1(String userField1) {
        this.userField1 = userField1;
    }

    public String getUserField2() {
        return userField2;
    }

    public void setUserField2(String userField2) {
        this.userField2 = userField2;
    }

    public String getUserField3() {
        return userField3;
    }

    public void setUserField3(String userField3) {
        this.userField3 = userField3;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getEditedBy() {
        return editedBy;
    }

    public void setEditedBy(String editedBy) {
        this.editedBy = editedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
