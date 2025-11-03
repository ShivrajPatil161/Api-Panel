package com.project2.ism.DTO.PrefunAuth;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * DTO for prefund request response
 * Constructor needed: All fields constructor
 * Getters and Setters needed: All fields
 */
public class PrefundResponseDTO {
    private Long id;
    private String requestedBy;
    private String mobileNumber;
    private Double depositAmount;
    private String depositImage;
    private String status;
    private LocalDateTime createDateTime;
    private String bankHolderName;
    private String bankAccountName;
    private String bankAccountNumber;
    private String bankTranId;
    private LocalDate depositDate;
    private String narration;
    private String paymentMode;
    private String ipAddress;
    private LocalDate approveOrRejectDate;
    private LocalTime approveOrRejectTime;
    private String remarks;
    private String depositType;

    public PrefundResponseDTO() {
    }

    public PrefundResponseDTO(Long id, String requestedBy, String mobileNumber, Double depositAmount, String depositImage, String status, LocalDateTime createDateTime, String bankHolderName, String bankAccountName, String bankAccountNumber, String bankTranId, LocalDate depositDate, String narration, String paymentMode, String ipAddress, LocalDate approveOrRejectDate, LocalTime approveOrRejectTime, String remarks, String depositType) {
        this.id = id;
        this.requestedBy = requestedBy;
        this.mobileNumber = mobileNumber;
        this.depositAmount = depositAmount;
        this.depositImage = depositImage;
        this.status = status;
        this.createDateTime = createDateTime;
        this.bankHolderName = bankHolderName;
        this.bankAccountName = bankAccountName;
        this.bankAccountNumber = bankAccountNumber;
        this.bankTranId = bankTranId;
        this.depositDate = depositDate;
        this.narration = narration;
        this.paymentMode = paymentMode;
        this.ipAddress = ipAddress;
        this.approveOrRejectDate = approveOrRejectDate;
        this.approveOrRejectTime = approveOrRejectTime;
        this.remarks = remarks;
        this.depositType = depositType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreateDateTime() {
        return createDateTime;
    }

    public void setCreateDateTime(LocalDateTime createDateTime) {
        this.createDateTime = createDateTime;
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

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDate getApproveOrRejectDate() {
        return approveOrRejectDate;
    }

    public void setApproveOrRejectDate(LocalDate approveOrRejectDate) {
        this.approveOrRejectDate = approveOrRejectDate;
    }

    public LocalTime getApproveOrRejectTime() {
        return approveOrRejectTime;
    }

    public void setApproveOrRejectTime(LocalTime approveOrRejectTime) {
        this.approveOrRejectTime = approveOrRejectTime;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getDepositType() {
        return depositType;
    }

    public void setDepositType(String depositType) {
        this.depositType = depositType;
    }
}