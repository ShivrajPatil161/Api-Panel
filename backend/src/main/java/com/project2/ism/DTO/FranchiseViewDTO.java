package com.project2.ism.DTO;

import org.springframework.web.multipart.MultipartFile;

public class FranchiseViewDTO {


    private String franchiseName;
    private String legalName;
    private String businessType;
    private String gstNumber;
    private String panNumber;
    private String registrationNumber;
    private String businessAddress;

    private String primaryContactName;
    private String primaryContactMobile;
    private String alternateContactMobile;
    private String primaryContactEmail;
    private String landlineNumber;

    private String bankName;
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
    private String branchName;
    private String accountType;

    // Files
    private String panCardDocument;
    private String gstCertificate;
    private String addressProof;
    private String bankProof;
    private String franchiseAgreement;

    // Getters & Setters
    // (Generate in IntelliJ)


    public String getFranchiseName() {
        return franchiseName;
    }

    public void setFranchiseName(String franchiseName) {
        this.franchiseName = franchiseName;
    }

    public FranchiseViewDTO(String franchiseName,    String legalName, String businessType, String gstNumber, String panNumber, String registrationNumber, String businessAddress, String primaryContactName, String primaryContactMobile, String alternateContactMobile, String primaryContactEmail, String landlineNumber, String bankName, String accountHolderName, String accountNumber, String ifscCode, String branchName, String accountType, String panCardDocument, String gstCertificate, String addressProof, String bankProof, String franchiseAgreement) {

        this.legalName = legalName;
        this.businessType = businessType;
        this.gstNumber = gstNumber;
        this.franchiseName = franchiseName;
        this.panNumber = panNumber;
        this.registrationNumber = registrationNumber;
        this.businessAddress = businessAddress;
        this.primaryContactName = primaryContactName;
        this.primaryContactMobile = primaryContactMobile;
        this.alternateContactMobile = alternateContactMobile;
        this.primaryContactEmail = primaryContactEmail;
        this.landlineNumber = landlineNumber;
        this.bankName = bankName;
        this.accountHolderName = accountHolderName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.branchName = branchName;
        this.accountType = accountType;
        this.panCardDocument = panCardDocument;
        this.gstCertificate = gstCertificate;
        this.addressProof = addressProof;
        this.bankProof = bankProof;
        this.franchiseAgreement = franchiseAgreement;
    }



    public String getLegalName() {
        return legalName;
    }

    public void setLegalName(String legalName) {
        this.legalName = legalName;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getBusinessAddress() {
        return businessAddress;
    }

    public void setBusinessAddress(String businessAddress) {
        this.businessAddress = businessAddress;
    }

    public String getPrimaryContactName() {
        return primaryContactName;
    }

    public void setPrimaryContactName(String primaryContactName) {
        this.primaryContactName = primaryContactName;
    }

    public String getPrimaryContactMobile() {
        return primaryContactMobile;
    }

    public void setPrimaryContactMobile(String primaryContactMobile) {
        this.primaryContactMobile = primaryContactMobile;
    }

    public String getAlternateContactMobile() {
        return alternateContactMobile;
    }

    public void setAlternateContactMobile(String alternateContactMobile) {
        this.alternateContactMobile = alternateContactMobile;
    }

    public String getPrimaryContactEmail() {
        return primaryContactEmail;
    }

    public void setPrimaryContactEmail(String primaryContactEmail) {
        this.primaryContactEmail = primaryContactEmail;
    }

    public String getLandlineNumber() {
        return landlineNumber;
    }

    public void setLandlineNumber(String landlineNumber) {
        this.landlineNumber = landlineNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
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

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getPanCardDocument() {
        return panCardDocument;
    }

    public void setPanCardDocument(String panCardDocument) {
        this.panCardDocument = panCardDocument;
    }

    public String getGstCertificate() {
        return gstCertificate;
    }

    public void setGstCertificate(String gstCertificate) {
        this.gstCertificate = gstCertificate;
    }

    public String getAddressProof() {
        return addressProof;
    }

    public void setAddressProof(String addressProof) {
        this.addressProof = addressProof;
    }

    public String getBankProof() {
        return bankProof;
    }

    public void setBankProof(String bankProof) {
        this.bankProof = bankProof;
    }

    public String getFranchiseAgreement() {
        return franchiseAgreement;
    }

    public void setFranchiseAgreement(String franchiseAgreement) {
        this.franchiseAgreement = franchiseAgreement;
    }
}
