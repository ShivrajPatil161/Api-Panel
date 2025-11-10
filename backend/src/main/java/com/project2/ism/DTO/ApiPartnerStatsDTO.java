// DTO for Merchant Stats
package com.project2.ism.DTO;

import java.util.List;

public class ApiPartnerStatsDTO {
    private Long merchantId;
    private Long outwardTransactions;
    private Long returnTransactions;
    private Long productsAllocated;
 //   private BigDecimal walletBalance;

    private List<ApiPartnerProductsDTO> products;

    public ApiPartnerStatsDTO(Long merchantId, Long outwardTransactions,
                              Long productsAllocated, //BigDecimal walletBalance,
                              List<ApiPartnerProductsDTO> products) {
        this.merchantId = merchantId;
        this.outwardTransactions = outwardTransactions;
        this.productsAllocated = productsAllocated;
        //this.walletBalance = walletBalance;
        this.products = products;
    }

    // getters & setters

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
    }

    public Long getOutwardTransactions() {
        return outwardTransactions;
    }

    public void setOutwardTransactions(Long outwardTransactions) {
        this.outwardTransactions = outwardTransactions;
    }

    public Long getReturnTransactions() {
        return returnTransactions;
    }

    public void setReturnTransactions(Long returnTransactions) {
        this.returnTransactions = returnTransactions;
    }

    public Long getProductsAllocated() {
        return productsAllocated;
    }

    public void setProductsAllocated(Long productsAllocated) {
        this.productsAllocated = productsAllocated;
    }

//    public BigDecimal getWalletBalance() {
//        return walletBalance;
//    }
//
//    public void setWalletBalance(BigDecimal walletBalance) {
//        this.walletBalance = walletBalance;
//    }

    public List<ApiPartnerProductsDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ApiPartnerProductsDTO> products) {
        this.products = products;
    }
}
