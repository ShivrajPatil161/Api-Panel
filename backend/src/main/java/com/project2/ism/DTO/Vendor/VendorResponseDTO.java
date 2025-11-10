package com.project2.ism.DTO.Vendor;

import com.project2.ism.Model.ContactPerson;

import java.time.LocalDate;

public class VendorResponseDTO {
    private Long id;
    private String name;
    private String bankType;
    private Long productId;        // <-- incoming productId
    private ContactPerson contactPerson;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private String gstNumber;
    private String pan;
    private LocalDate agreementStartDate;
    private LocalDate agreementEndDate;
    private Integer creditPeriodDays;
    private String paymentTerms;
    private Boolean status;
    private String remarks;

    // getters / setters ...

    public VendorResponseDTO() {
    }

    public VendorResponseDTO(Long id,String name, String bankType, Long productId, ContactPerson contactPerson, String address, String city, String state, String pinCode, String gstNumber, String pan, LocalDate agreementStartDate, LocalDate agreementEndDate, Integer creditPeriodDays, String paymentTerms, Boolean status, String remarks) {
        this.id = id;
        this.name = name;
        this.bankType = bankType;
        this.productId = productId;
        this.contactPerson = contactPerson;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pinCode = pinCode;
        this.gstNumber = gstNumber;
        this.pan = pan;
        this.agreementStartDate = agreementStartDate;
        this.agreementEndDate = agreementEndDate;
        this.creditPeriodDays = creditPeriodDays;
        this.paymentTerms = paymentTerms;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBankType() {
        return bankType;
    }

    public void setBankType(String bankType) {
        this.bankType = bankType;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public ContactPerson getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(ContactPerson contactPerson) {
        this.contactPerson = contactPerson;
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

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
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

    public Integer getCreditPeriodDays() {
        return creditPeriodDays;
    }

    public void setCreditPeriodDays(Integer creditPeriodDays) {
        this.creditPeriodDays = creditPeriodDays;
    }

    public String getPaymentTerms() {
        return paymentTerms;
    }

    public void setPaymentTerms(String paymentTerms) {
        this.paymentTerms = paymentTerms;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
