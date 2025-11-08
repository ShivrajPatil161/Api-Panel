package com.project2.ism.DTO.Vendor;


public class VendorRuleRequest {

    private Long vendorId;
    private Double minAmount;
    private Double maxAmount;
    private Integer dailyTransactionLimit;
    private Double dailyAmountLimit;

    // Constructor, Getters and Setters needed

    public VendorRuleRequest() {
    }

    public VendorRuleRequest(Long vendorId, Double minAmount, Double maxAmount, Integer dailyTransactionLimit, Double dailyAmountLimit) {
        this.vendorId = vendorId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.dailyTransactionLimit = dailyTransactionLimit;
        this.dailyAmountLimit = dailyAmountLimit;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public Double getMinAmount() {
        return minAmount;
    }

    public void setMinAmount(Double minAmount) {
        this.minAmount = minAmount;
    }

    public Double getMaxAmount() {
        return maxAmount;
    }

    public void setMaxAmount(Double maxAmount) {
        this.maxAmount = maxAmount;
    }

    public Integer getDailyTransactionLimit() {
        return dailyTransactionLimit;
    }

    public void setDailyTransactionLimit(Integer dailyTransactionLimit) {
        this.dailyTransactionLimit = dailyTransactionLimit;
    }

    public Double getDailyAmountLimit() {
        return dailyAmountLimit;
    }

    public void setDailyAmountLimit(Double dailyAmountLimit) {
        this.dailyAmountLimit = dailyAmountLimit;
    }
}