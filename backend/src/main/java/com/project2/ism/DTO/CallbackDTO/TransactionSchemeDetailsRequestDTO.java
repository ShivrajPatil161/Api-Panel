package com.project2.ism.DTO.CallbackDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project2.ism.Enum.TransactionType;
import com.project2.ism.Model.PricingScheme.ChannelRate;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionSchemeDetailsRequestDTO {

    private String mobileNumber;
    private String productCode;
    private Long apiPartnerId;           // Api partnerId
    private Double amount;
    private Double confirmAmount;
    private String operatorCode;
    private String operatorName;

    private ChannelRate channelRate;       //This amount we get from another api for calculation
    private String gstValue;             //gst
    private String tdsRate;             //tds

    private Boolean hasCharge;
    private Boolean isCommission;
    private TransactionType transactionType;        //credit, debit
    private String baseTranxId;              //25041815234800204
    private String callbackUrl;

    public TransactionSchemeDetailsRequestDTO() {
    }

    public TransactionSchemeDetailsRequestDTO(String mobileNumber, String productCode, Long apiPartnerId, Double amount, Double confirmAmount, String operatorCode, String operatorName, String gstValue, String tdsRate, Boolean hasCharge, Boolean isCommission, TransactionType transactionType, String baseTranxId, String callbackUrl) {
        this.mobileNumber = mobileNumber;
        this.productCode = productCode;
        this.apiPartnerId = apiPartnerId;
        this.amount = amount;
        this.confirmAmount = confirmAmount;
        this.operatorCode = operatorCode;
        this.operatorName = operatorName;
        this.gstValue = gstValue;
        this.tdsRate = tdsRate;
        this.hasCharge = hasCharge;
        this.isCommission = isCommission;
        this.transactionType = transactionType;
        this.baseTranxId = baseTranxId;
        this.callbackUrl = callbackUrl;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public Long getApiPartnerId() {
        return apiPartnerId;
    }

    public void setApiPartnerId(Long apiPartnerId) {
        this.apiPartnerId = apiPartnerId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getConfirmAmount() {
        return confirmAmount;
    }

    public void setConfirmAmount(Double confirmAmount) {
        this.confirmAmount = confirmAmount;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public String getGstValue() {
        return gstValue;
    }

    public void setGstValue(String gstValue) {
        this.gstValue = gstValue;
    }

    public String getTdsRate() {
        return tdsRate;
    }

    public void setTdsRate(String tdsRate) {
        this.tdsRate = tdsRate;
    }

    public Boolean getHasCharge() {
        return hasCharge;
    }

    public void setHasCharge(Boolean hasCharge) {
        this.hasCharge = hasCharge;
    }

    public Boolean getIsCommission() {
        return isCommission;
    }

    public void setIsCommission(Boolean commission) {
        isCommission = commission;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public String getBaseTranxId() {
        return baseTranxId;
    }

    public void setBaseTranxId(String baseTranxId) {
        this.baseTranxId = baseTranxId;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public ChannelRate getChannelRate() {
        return channelRate;
    }

    public void setChannelRate(ChannelRate channelRate) {
        this.channelRate = channelRate;
    }
}
