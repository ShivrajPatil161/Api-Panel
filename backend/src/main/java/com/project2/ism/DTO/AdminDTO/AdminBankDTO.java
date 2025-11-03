package com.project2.ism.DTO.AdminDTO;



import jakarta.validation.constraints.*;

public class AdminBankDTO {

    private Long id;


    private String bankName;

    private String accountNumber;


    private String ifscCode;


    private Boolean charges;

    private String chargesType; // 'percentage' or 'flat'

    private String createdAt;
    private String updatedAt;

    // Constructor
    public AdminBankDTO() {
        this.charges = false;
    }

    public AdminBankDTO(Long id, String bankName, String accountNumber, String ifscCode, Boolean charges, String chargesType, String createdAt, String updatedAt) {
        this.id = id;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.charges = charges;
        this.chargesType = chargesType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
// TODO: Generate getters and setters for all fields
    // id, bankName, accountNumber, ifscCode, charges, chargesType, createdAt, updatedAt

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public Boolean getCharges() {
        return charges;
    }

    public void setCharges(Boolean charges) {
        this.charges = charges;
    }

    public String getChargesType() {
        return chargesType;
    }

    public void setChargesType(String chargesType) {
        this.chargesType = chargesType;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Custom validation method (optional, can be used in service layer)
    public boolean isValid() {
        if (charges != null && charges) {
            return chargesType != null &&
                    (chargesType.equals("percentage") || chargesType.equals("flat"));
        }
        return true;
    }
}
