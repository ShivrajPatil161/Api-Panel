package com.project2.ism.DTO.TempDTOs;

import java.math.BigDecimal;

public class SettlementResultDTO {
    private String vendorTxId;
    private String status;   // OK, ALREADY_SETTLED, FAILED
    private String message;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal net;

    // ---- factory methods ----
    public static SettlementResultDTO ok(Long vendorTxId, BigDecimal amount, BigDecimal fee, BigDecimal net, BigDecimal after) {
        SettlementResultDTO dto = new SettlementResultDTO();
        dto.vendorTxId = vendorTxId.toString();
        dto.status = "OK";
        dto.message = "Settled successfully. Balance after: " + after;
        dto.amount = amount;
        dto.fee = fee;
        dto.net = net;
        return dto;
    }

    public static SettlementResultDTO alreadySettled(Long vendorTxId) {
        SettlementResultDTO dto = new SettlementResultDTO();
        dto.vendorTxId = vendorTxId.toString();
        dto.status = "ALREADY_SETTLED";
        dto.message = "This transaction was already settled.";
        return dto;
    }

    public static SettlementResultDTO failed(Long vendorTxId, String error) {
        SettlementResultDTO dto = new SettlementResultDTO();
        dto.vendorTxId = vendorTxId.toString();
        dto.status = "FAILED";
        dto.message = error;
        return dto;
    }

    // ---- getters/setters ----
    public String getVendorTxId() { return vendorTxId; }
    public void setVendorTxId(String vendorTxId) { this.vendorTxId = vendorTxId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getFee() { return fee; }
    public void setFee(BigDecimal fee) { this.fee = fee; }

    public BigDecimal getNet() { return net; }
    public void setNet(BigDecimal net) { this.net = net; }
}
