package com.project2.ism.DTO.ReportDTO;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class MerchantTransactionReportDTO {
    private String txnId;
    private LocalDateTime txnDate;
    private BigDecimal txnAmount;
    private LocalDateTime settleDate;
    private String authCode;
    private String tid;
    private BigDecimal settlementPercentage;
    private BigDecimal settleAmount;
    private BigDecimal systemFee;
    private BigDecimal merchantRate;      // calculated
    private BigDecimal franchiseRate;     // optional if merchant has franchise
    private BigDecimal commissionRate;    // optional if franchise exists
    private BigDecimal commissionAmount;  // optional if franchise exists
    private String brandType;
    private String cardType;
    private String cardClassification;
    private String merchantName;
    private String franchiseName;         // optional
    private String state;

    // Constructor with raw amounts
    public MerchantTransactionReportDTO(
            String txnId,
            LocalDateTime txnDate,
            BigDecimal txnAmount,
            LocalDateTime settleDate,
            String authCode,
            String tid,
            BigDecimal merchantNetAmount,
            BigDecimal grossCharge,
            BigDecimal franchiseCommission,  // null for direct merchants
            BigDecimal systemFee,
            String brandType,
            String cardType,
            String cardClassification,
            String merchantName,
            String franchiseName,
            String state
    ) {
        // Debug prints - Add these to see what values are coming from query
        System.out.println("=== Constructor Debug for TxnId: " + txnId + " ===");
        System.out.println("txnAmount: " + txnAmount);
        System.out.println("merchantNetAmount: " + merchantNetAmount);
        System.out.println("grossCharge: " + grossCharge);
        System.out.println("franchiseCommission: " + franchiseCommission);
        System.out.println("systemFee: " + systemFee);
        System.out.println("franchiseName: " + franchiseName);

        this.txnId = txnId;
        this.txnDate = txnDate;
        this.txnAmount = txnAmount;
        this.settleDate = settleDate;
        this.authCode = authCode;
        this.tid = tid;
        this.settleAmount = merchantNetAmount;
        this.systemFee = systemFee;
        this.commissionAmount = franchiseCommission;
        this.brandType = brandType;
        this.cardType = cardType;
        this.cardClassification = cardClassification;
        this.merchantName = merchantName;
        this.franchiseName = franchiseName;
        this.state = state;

        if (txnAmount != null && txnAmount.compareTo(BigDecimal.ZERO) > 0) {
            if (franchiseCommission != null) {
                // Dependent merchant (has franchise commission)
                System.out.println("Branch: Dependent merchant (with franchise)");

                this.merchantRate = txnAmount
                        .subtract(settleAmount)
                        .divide(txnAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));

                this.franchiseRate = txnAmount
                        .subtract(settleAmount.add(commissionAmount))
                        .divide(txnAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));

                this.commissionRate = merchantRate.subtract(franchiseRate);
                this.settlementPercentage = this.merchantRate;

                System.out.println("Calculated merchantRate: " + this.merchantRate);
                System.out.println("Calculated franchiseRate: " + this.franchiseRate);
                System.out.println("Calculated commissionRate: " + this.commissionRate);
            } else {
                // Direct merchant (no franchise)
                System.out.println("Branch: Direct merchant (no franchise)");

                this.merchantRate = txnAmount
                        .subtract(settleAmount)
                        .divide(txnAmount, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));

                this.franchiseRate = null;
                this.commissionRate = null;
                this.settlementPercentage = this.merchantRate;

                System.out.println("Calculated merchantRate: " + this.merchantRate);
            }
        } else {
            System.out.println("Branch: Zero or null transaction amount");
            this.merchantRate = BigDecimal.ZERO;
            this.franchiseRate = BigDecimal.ZERO;
            this.commissionRate = BigDecimal.ZERO;
            this.settlementPercentage = BigDecimal.ZERO;
        }

        System.out.println("=== End Debug ===\n");
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public LocalDateTime getTxnDate() {
        return txnDate;
    }

    public void setTxnDate(LocalDateTime txnDate) {
        this.txnDate = txnDate;
    }

    public BigDecimal getTxnAmount() {
        return txnAmount;
    }

    public void setTxnAmount(BigDecimal txnAmount) {
        this.txnAmount = txnAmount;
    }

    public LocalDateTime getSettleDate() {
        return settleDate;
    }

    public void setSettleDate(LocalDateTime settleDate) {
        this.settleDate = settleDate;
    }

    public String getAuthCode() {
        return authCode;
    }

    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public BigDecimal getSettlementPercentage() {
        return settlementPercentage;
    }

    public void setSettlementPercentage(BigDecimal settlementPercentage) {
        this.settlementPercentage = settlementPercentage;
    }

    public BigDecimal getSettleAmount() {
        return settleAmount;
    }

    public void setSettleAmount(BigDecimal settleAmount) {
        this.settleAmount = settleAmount;
    }

    public BigDecimal getSystemFee() {
        return systemFee;
    }

    public void setSystemFee(BigDecimal systemFee) {
        this.systemFee = systemFee;
    }

    public BigDecimal getMerchantRate() {
        return merchantRate;
    }

    public void setMerchantRate(BigDecimal merchantRate) {
        this.merchantRate = merchantRate;
    }

    public BigDecimal getFranchiseRate() {
        return franchiseRate;
    }

    public void setFranchiseRate(BigDecimal franchiseRate) {
        this.franchiseRate = franchiseRate;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }

    public BigDecimal getCommissionAmount() {
        return commissionAmount;
    }

    public void setCommissionAmount(BigDecimal commissionAmount) {
        this.commissionAmount = commissionAmount;
    }

    public String getBrandType() {
        return brandType;
    }

    public void setBrandType(String brandType) {
        this.brandType = brandType;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getCardClassification() {
        return cardClassification;
    }

    public void setCardClassification(String cardClassification) {
        this.cardClassification = cardClassification;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getFranchiseName() {
        return franchiseName;
    }

    public void setFranchiseName(String franchiseName) {
        this.franchiseName = franchiseName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
