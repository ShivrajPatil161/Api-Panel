package com.project2.ism.DTO;

// dto/TransactionUploadRequest.java

import com.project2.ism.Model.Transaction;
import java.util.List;

public class TransactionUploadRequest {
    private String vendorName;
    private String product;
    private List<Transaction> transactions;

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
}
