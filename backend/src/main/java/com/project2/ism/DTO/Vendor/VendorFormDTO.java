package com.project2.ism.DTO.Vendor;

import java.time.LocalDate;

public class VendorFormDTO {
    private Long productId;
    private String vendorName;
    private String bankType;
    private Boolean status;

    private String contactPersonName;
    private String contactNumber;
    private String contactEmail;

    private String address;
    private String city;
    private String state;
    private String pinCode;

    private String gstNumber;
    private String pan;

    private LocalDate agreementStartDate;
    private LocalDate agreementEndDate;
    private Integer creditPeriod;
    private String paymentTerms;
    private String remark;

    public VendorFormDTO() {
    }

    public VendorFormDTO(Long productId, String vendorName, String bankType, Boolean status, String contactPersonName, String contactNumber, String contactEmail, String address, String city, String state, String pinCOde, String gstNumber, String pan, LocalDate agreementStartDate, LocalDate agreementEndDate, Integer creditPeriod, String paymentTerms, String remark) {
        this.productId = productId;
        this.vendorName = vendorName;
        this.bankType = bankType;
        this.status = status;
        this.contactPersonName = contactPersonName;
        this.contactNumber = contactNumber;
        this.contactEmail = contactEmail;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pinCode = pinCode;
        this.gstNumber = gstNumber;
        this.pan = pan;
        this.agreementStartDate = agreementStartDate;
        this.agreementEndDate = agreementEndDate;
        this.creditPeriod = creditPeriod;
        this.paymentTerms = paymentTerms;
        this.remark = remark;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getBankType() {
        return bankType;
    }

    public void setBankType(String bankType) {
        this.bankType = bankType;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getContactPersonName() {
        return contactPersonName;
    }

    public void setContactPersonName(String contactPersonName) {
        this.contactPersonName = contactPersonName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCOde) {
        this.pinCode = pinCOde;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public LocalDate getAgreementStartDate() {
        return agreementStartDate;
    }

    public void setAgreementStartDate(LocalDate agreementStartDate) {
        this.agreementStartDate = agreementStartDate;
    }

    public LocalDate getAgreementEndDate() {
        return agreementEndDate;
    }

    public void setAgreementEndDate(LocalDate agreementEndDate) {
        this.agreementEndDate = agreementEndDate;
    }

    public Integer getCreditPeriod() {
        return creditPeriod;
    }

    public void setCreditPeriod(Integer creditPeriod) {
        this.creditPeriod = creditPeriod;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
