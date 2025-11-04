//package com.project2.ism.Model;
//
//import jakarta.persistence.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "payout_banks",
//        indexes = @Index(name = "idx_customer", columnList = "customer_type, customer_id"))
//public class PayoutBanks {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "customer_type", nullable = false)
//    private String customerType; // FRANCHISE, MERCHANT
//
//    @Column(name = "customer_id", nullable = false)
//    private Long customerId;
//
//    @Column(name = "holder_name", nullable = false)
//    private String holderName;
//
//    @Column(name = "bank_name", nullable = false)
//    private String bankName;
//
//    @Column(name = "account_number", nullable = false)
//    private String accountNumber;
//
//    @Column(name = "ifsc_code", nullable = false)
//    private String ifscCode;
//
//    @Column(name = "verified", nullable = false)
//    private boolean verified = false;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "updated_at")
//    private LocalDateTime updatedAt;
//
//    // Constructors
//    public PayoutBanks() {
//        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    public PayoutBanks(String customerType, Long customerId, String holderName,
//                       String bankName, String accountNumber, String ifscCode) {
//        this();
//        this.customerType = customerType;
//        this.customerId = customerId;
//        this.holderName = holderName;
//        this.bankName = bankName;
//        this.accountNumber = accountNumber;
//        this.ifscCode = ifscCode;
//    }
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCustomerType() {
//        return customerType;
//    }
//
//    public void setCustomerType(String customerType) {
//        this.customerType = customerType;
//    }
//
//    public Long getPartnerId() {
//        return customerId;
//    }
//
//    public void setPartnerId(Long customerId) {
//        this.customerId = customerId;
//    }
//
//    public String getHolderName() {
//        return holderName;
//    }
//
//    public void setHolderName(String holderName) {
//        this.holderName = holderName;
//    }
//
//    public String getBankName() {
//        return bankName;
//    }
//
//    public void setBankName(String bankName) {
//        this.bankName = bankName;
//    }
//
//    public String getAccountNumber() {
//        return accountNumber;
//    }
//
//    public void setAccountNumber(String accountNumber) {
//        this.accountNumber = accountNumber;
//    }
//
//    public String getIfscCode() {
//        return ifscCode;
//    }
//
//    public void setIfscCode(String ifscCode) {
//        this.ifscCode = ifscCode;
//    }
//
//    public boolean isVerified() {
//        return verified;
//    }
//
//    public void setVerified(boolean verified) {
//        this.verified = verified;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
//
//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//
//    @PreUpdate
//    public void preUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//}
//
