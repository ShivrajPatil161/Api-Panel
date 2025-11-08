package com.project2.ism.DTO.Vendor;


public class VendorRuleDTO {

    private Long id;
    private Long vendorId;
    private String vendorName;
    private Double minAmount;
    private Double maxAmount;
    private Integer dailyTransactionLimit;
    private Double dailyAmountLimit;

    // Constructor, Getters and Setters needed

    public VendorRuleDTO() {
    }

    public VendorRuleDTO(Long id, Long vendorId, String vendorName, Double minAmount, Double maxAmount, Integer dailyTransactionLimit, Double dailyAmountLimit) {
        this.id = id;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.dailyTransactionLimit = dailyTransactionLimit;
        this.dailyAmountLimit = dailyAmountLimit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
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