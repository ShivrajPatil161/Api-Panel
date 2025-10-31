package com.project2.ism.DTO;


public class PrefundRequestDto {

    private String requestedBy;
    private String mobileNumber;
    private String depositAmount;
    private String confirmAmount;
    private String depositImage;
    private String bankHolderName;
    private String bankAccountName;
    private String bankAccountNumber;
    private String bankTranId;
    private String narration;
    private String paymentMode;
    private String ipAddress;
    private String depositDate;
    private String depositType;

    public PrefundRequestDto() {
    }

    public PrefundRequestDto(String requestedBy, String mobileNumber, String depositAmount, String confirmAmount, String depositImage, String bankHolderName, String bankAccountName, String bankAccountNumber, String bankTranId, String narration, String paymentMode, String ipAddress, String depositDate, String depositType) {
        this.requestedBy = requestedBy;
        this.mobileNumber = mobileNumber;
        this.depositAmount = depositAmount;
        this.confirmAmount = confirmAmount;
        this.depositImage = depositImage;
        this.bankHolderName = bankHolderName;
        this.bankAccountName = bankAccountName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankTranId = bankTranId;
        this.narration = narration;
        this.paymentMode = paymentMode;
        this.ipAddress = ipAddress;
        this.depositDate = depositDate;
        this.depositType = depositType;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(String depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getConfirmAmount() {
        return confirmAmount;
    }

    public void setConfirmAmount(String confirmAmount) {
        this.confirmAmount = confirmAmount;
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

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getDepositDate() {
        return depositDate;
    }

    public void setDepositDate(String depositDate) {
        this.depositDate = depositDate;
    }

    public String getDepositType() {
        return depositType;
    }

    public void setDepositType(String depositType) {
        this.depositType = depositType;
    }
}
