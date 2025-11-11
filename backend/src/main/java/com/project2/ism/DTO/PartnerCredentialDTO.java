package com.project2.ism.DTO;

import java.time.LocalDateTime;

public class PartnerCredentialDTO {

    private long id;
    private Long partnerId;
    private Long productId;

    private String tokenUrlUat;
    private String tokenUrlProd;

    private String baseUrlUat;
    private String baseUrlProd;

    private String callbackUrl;

    private Boolean isActive;
    private LocalDateTime createdOn;
    private String createdBy;
    private LocalDateTime editedOn;
    private String editedBy;



    public PartnerCredentialDTO(long id, Long partnerId, Long productId, String tokenUrlUat, String tokenUrlProd, String baseUrlUat, String baseUrlProd, String callbackUrl, Boolean isActive, LocalDateTime createdOn, String createdBy, LocalDateTime editedOn, String editedBy) {
        this.id = id;
        this.partnerId = partnerId;
        this.productId = productId;
        this.tokenUrlUat = tokenUrlUat;
        this.tokenUrlProd = tokenUrlProd;
        this.baseUrlUat = baseUrlUat;
        this.baseUrlProd = baseUrlProd;
        this.callbackUrl = callbackUrl;
        this.isActive = isActive;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.editedOn = editedOn;
        this.editedBy = editedBy;
    }

    public PartnerCredentialDTO() {
    }

    public PartnerCredentialDTO(long id, Long partnerId, Long productId, String tokenUrlUat, String tokenUrlProd, String baseUrlUat, String baseUrlProd, String callbackUrl, Boolean isActive) {
        this.id = id;
        this.partnerId = partnerId;
        this.productId = productId;
        this.tokenUrlUat = tokenUrlUat;
        this.tokenUrlProd = tokenUrlProd;
        this.baseUrlUat = baseUrlUat;
        this.baseUrlProd = baseUrlProd;
        this.callbackUrl = callbackUrl;
        this.isActive = isActive;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
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

    public String getBaseUrlUat() {
        return baseUrlUat;
    }

    public void setBaseUrlUat(String baseUrlUat) {
        this.baseUrlUat = baseUrlUat;
    }

    public String getBaseUrlProd() {
        return baseUrlProd;
    }

    public void setBaseUrlProd(String baseUrlProd) {
        this.baseUrlProd = baseUrlProd;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
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

    public LocalDateTime getEditedOn() {
        return editedOn;
    }

    public void setEditedOn(LocalDateTime editedOn) {
        this.editedOn = editedOn;
    }
}
