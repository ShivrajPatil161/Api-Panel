package com.project2.ism.Model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "prefund_request")

public class PrefundRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @Column(name = "mobile_number", nullable = false)
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number format")
    private String mobileNumber;

    @Column(name = "deposit_amount", nullable = false)
    @NotNull(message = "Deposit amount is required")
    @DecimalMin(value = "0.1", inclusive = true, message = "Deposit amount must be greater than zero")
    private Double depositAmount;

    @Column(name = "deposit_image")
    private String depositImage;

    @Column(nullable = false)
    private String status = "Pending";

    @CreationTimestamp
    @Column(name = "created_datetime", nullable = false, updatable = false)
    private LocalDateTime createDateTime;

    @Column(name = "bank_holder_name")
    @NotBlank(message = "Bank holder name is required")
    @Size(min = 2, max = 100, message = "Bank holder name must be between 2 and 100 characters")
    private String bankHolderName;

    @Column(name = "bank_account_name")
    @NotBlank(message = "Bank account name is required")
    @Size(min = 2, max = 100, message = "Bank account name must be between 2 and 100 characters")
    private String bankAccountName;

    @Column(name = "bank_account_number")
    @NotBlank(message = "Bank account number is required")
    @Pattern(regexp = "\\d{9,18}", message = "Bank account number must be between 9 to 18 digits")
    private String bankAccountNumber;

    @Column(name = "bank_tran_id")
    @NotBlank(message = "Bank transaction ID is required")
    @Size(min = 5, max = 50, message = "Bank transaction ID must be between 5 and 50 characters")
    private String bankTranId;

    @Column(name = "deposit_date")
    private LocalDate depositDate;

    @Column(name = "narration", length = 500)
    private String narration;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "ip_address")
    @NotBlank(message = "IP address is required")
//    @Pattern(
//            regexp = "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
//            message = "Invalid IP address format"
//    )
    private String ipAddress;

    @Column(name = "approve_or_reject_date")
    private LocalDate approveOrRejectDate;

    @Column(name = "approve_or_reject_time")
    private LocalTime approveOrRejectTime;

    @Column(name = "remarks")
    private String remarks = "-";

    @Column(name = "deposit_type")
    private String depositType;

    public PrefundRequest() {
    }

    public PrefundRequest(Long id, String requestedBy, String mobileNumber, Double depositAmount, String depositImage, String status, LocalDateTime createDateTime, String bankHolderName, String bankAccountName, String bankAccountNumber, String bankTranId, LocalDate depositDate, String narration, String paymentMode, String ipAddress, LocalDate approveOrRejectDate, LocalTime approveOrRejectTime, String remarks, String depositType) {
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

