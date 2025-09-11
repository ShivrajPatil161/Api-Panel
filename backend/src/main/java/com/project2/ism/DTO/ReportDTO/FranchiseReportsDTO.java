package com.project2.ism.DTO.ReportDTO;

import java.math.BigDecimal;

public class FranchiseReportsDTO {
    private String franchiseName;
    private Long totalMerchants;
    private BigDecimal walletBalance;
    private Long totalProducts;
    private Long totalDevices;
    public FranchiseReportsDTO(String franchiseName, Long totalMerchants, BigDecimal walletBalance, Long totalDevices,Long totalProducts) {
        this.franchiseName = franchiseName;
        this.totalMerchants = totalMerchants;
        this.walletBalance = walletBalance;
        this.totalDevices = totalDevices;
        this.totalProducts = totalProducts;
    }
    // getters + setters

    public String getFranchiseName() {
        return franchiseName;
    }

    public void setFranchiseName(String franchiseName) {
        this.franchiseName = franchiseName;
    }

    public Long getTotalMerchants() {
        return totalMerchants;
    }

    public void setTotalMerchants(Long totalMerchants) {
        this.totalMerchants = totalMerchants;
    }

    public BigDecimal getWalletBalance() {
        return walletBalance;
    }

    public void setWalletBalance(BigDecimal walletBalance) {
        this.walletBalance = walletBalance;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalDevices() {
        return totalDevices;
    }

    public void setTotalDevices(Long totalDevices) {
        this.totalDevices = totalDevices;
    }
}

