package com.project2.ism.DTO.CallbackDTO;

public class RunPaisaCallback {
    private String status;              // STATUS
    private String statusCode;         // STATUS_CODE
    private String orderId;            // ORDER_ID
    private String txnMode;            // TXN_MODE
    private String txnAmount;          // TXN_AMOUNT
    private String cardCategory;       // CARD_CATEGORY
    private String txnDate;            // TXN_DATE (Consider converting to LocalDateTime if needed)
    private String txnInfo;            // TXN_INFO
    private String customerName;       // CUSTOMER_NAME
    private String customerEmail;      // CUSTOMER_EMAIL
    private String customerPhone;      // CUSTOMER_PHONE
    private String bankTxnId;          // BANK_TXNID
    private String bankCode;           // BANK_CODE
    private String errorId;            // ERROR_ID
    private String errorDesc;          // ERROR_DESC
    private String cardNumber;         // CARD_NUMBER (use masked or last 4 digits only)
    private String cardType;           // CARD_TYPE
    private String unmappedStatus;     // UNMAPPED_STATUS
    private String pgPartner;          // PG_PARTNER
    private String mercUnqRef;         // MERC_UNQ_REF


    public RunPaisaCallback(String status, String statusCode, String orderId, String txnMode, String txnAmount, String cardCategory, String txnDate, String txnInfo, String customerName, String customerEmail, String customerPhone, String bankTxnId, String bankCode, String errorId, String errorDesc, String cardNumber, String cardType, String unmappedStatus, String pgPartner, String mercUnqRef) {
        this.status = status;
        this.statusCode = statusCode;
        this.orderId = orderId;
        this.txnMode = txnMode;
        this.txnAmount = txnAmount;
        this.cardCategory = cardCategory;
        this.txnDate = txnDate;
        this.txnInfo = txnInfo;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.bankTxnId = bankTxnId;
        this.bankCode = bankCode;
        this.errorId = errorId;
        this.errorDesc = errorDesc;
        this.cardNumber = cardNumber;
        this.cardType = cardType;
        this.unmappedStatus = unmappedStatus;
        this.pgPartner = pgPartner;
        this.mercUnqRef = mercUnqRef;
    }

    public RunPaisaCallback() {
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getTxnMode() {
        return txnMode;
    }

    public void setTxnMode(String txnMode) {
        this.txnMode = txnMode;
    }

    public String getTxnAmount() {
        return txnAmount;
    }

    public void setTxnAmount(String txnAmount) {
        this.txnAmount = txnAmount;
    }

    public String getCardCategory() {
        return cardCategory;
    }

    public void setCardCategory(String cardCategory) {
        this.cardCategory = cardCategory;
    }

    public String getTxnDate() {
        return txnDate;
    }

    public void setTxnDate(String txnDate) {
        this.txnDate = txnDate;
    }

    public String getTxnInfo() {
        return txnInfo;
    }

    public void setTxnInfo(String txnInfo) {
        this.txnInfo = txnInfo;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getBankTxnId() {
        return bankTxnId;
    }

    public void setBankTxnId(String bankTxnId) {
        this.bankTxnId = bankTxnId;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getErrorId() {
        return errorId;
    }

    public void setErrorId(String errorId) {
        this.errorId = errorId;
    }

    public String getErrorDesc() {
        return errorDesc;
    }

    public void setErrorDesc(String errorDesc) {
        this.errorDesc = errorDesc;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getUnmappedStatus() {
        return unmappedStatus;
    }

    public void setUnmappedStatus(String unmappedStatus) {
        this.unmappedStatus = unmappedStatus;
    }

    public String getPgPartner() {
        return pgPartner;
    }

    public void setPgPartner(String pgPartner) {
        this.pgPartner = pgPartner;
    }

    public String getMercUnqRef() {
        return mercUnqRef;
    }

    public void setMercUnqRef(String mercUnqRef) {
        this.mercUnqRef = mercUnqRef;
    }

}
