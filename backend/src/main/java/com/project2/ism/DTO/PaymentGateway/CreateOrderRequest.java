package com.project2.ism.DTO.PaymentGateway;

public class CreateOrderRequest {

    private String orderId;
    private double amount;
    private String callbackUrl;
    private String merchantRef; // optional
    private Short productId;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String orderId, double amount, String callbackUrl, String merchantRef, Short productId) {
        this.orderId = orderId;
        this.amount = amount;
        this.callbackUrl = callbackUrl;
        this.merchantRef = merchantRef;
        this.productId = productId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getMerchantRef() {
        return merchantRef;
    }

    public void setMerchantRef(String merchantRef) {
        this.merchantRef = merchantRef;
    }

    public Short getProductId() {
        return productId;
    }

    public void setProductId(Short productId) {
        this.productId = productId;
    }
}
