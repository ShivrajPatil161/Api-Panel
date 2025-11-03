package com.project2.ism.DTO.PrefunAuth;


import java.time.LocalDate;

/**
 * DTO for creating a new prefund request
 * Constructor needed: All fields constructor
 * Getters and Setters needed: All fields
 */
public class PrefundRequestDTO {
    private String mobileNumber;
    private Double depositAmount;
    private String depositImage; // Base64 string or file path for now
    private String bankHolderName;
    private String bankAccountName;
    private String bankAccountNumber;
    private String bankTranId;
    private LocalDate depositDate;
    private String narration;
    private String paymentMode;
    private String depositType;

    public PrefundRequestDTO() {
    }

    public PrefundRequestDTO(String mobileNumber, Double depositAmount, String depositImage, String bankHolderName, String bankAccountName, String bankAccountNumber, String bankTranId, LocalDate depositDate, String narration, String paymentMode, String depositType) {
        this.mobileNumber = mobileNumber;
        this.depositAmount = depositAmount;
        this.depositImage = depositImage;
        this.bankHolderName = bankHolderName;
        this.bankAccountName = bankAccountName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankTranId = bankTranId;
        this.depositDate = depositDate;
        this.narration = narration;
        this.paymentMode = paymentMode;
        this.depositType = depositType;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Double getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(Double depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getDepositImage() {
        return depositImage;
    }

    public void setDepositImage(String depositImage) {
        this.depositImage = depositImage;
    }

    public String getBankHolderName() {
        return bankHolderName;
    }

    public void setBankHolderName(String bankHolderName) {
        this.bankHolderName = bankHolderName;
    }

    public String getBankAccountName() {
        return bankAccountName;
    }

    public void setBankAccountName(String bankAccountName) {
        this.bankAccountName = bankAccountName;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankTranId() {
        return bankTranId;
    }

    public void setBankTranId(String bankTranId) {
        this.bankTranId = bankTranId;
    }

    public LocalDate getDepositDate() {
        return depositDate;
    }

    public void setDepositDate(LocalDate depositDate) {
        this.depositDate = depositDate;
    }

    public String getNarration() {
        return narration;
    }

    public void setNarration(String narration) {
        this.narration = narration;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getDepositType() {
        return depositType;
    }

    public void setDepositType(String depositType) {
        this.depositType = depositType;
    }
}
