package com.project2.ism.Model.InventoryTransactions;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class ProductSerialNumbers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50, message = "SID cannot exceed 50 characters")
    @Column(unique = true)
    private String sid;

    @Size(max = 50, message = "MID cannot exceed 50 characters")
    @Column(unique = true)
    private String mid;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    @Column(unique = true)
    private String tid;

    @Size(max = 50, message = "VPAID cannot exceed 50 characters")
    @Column(unique = true)
    private String vpaid;


    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String mobNumber;

    @ManyToOne
    @JoinColumn(name = "inward_transaction_id", nullable = false)
    @JsonBackReference
    private InwardTransactions inwardTransaction;

    @ManyToOne
    @JoinColumn(name = "outward_transaction_id")
    private OutwardTransactions outwardTransaction;

    @ManyToOne
    @JoinColumn(name = "return_transaction_id")
    private ReturnTransactions returnTransaction;


    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;


    public ProductSerialNumbers() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public String getMid() {
        return mid;
    }

    public void setMid(String mid) {
        this.mid = mid;
    }

    public String getVpaid() {
        return vpaid;
    }

    public void setVpaid(String vpaid) {
        this.vpaid = vpaid;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getMobNumber() {
        return mobNumber;
    }

    public void setMobNumber(String mobNumber) {
        this.mobNumber = mobNumber;
    }


    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public OutwardTransactions getOutwardTransaction() {
        return outwardTransaction;
    }

    public InwardTransactions getInwardTransaction() {
        return inwardTransaction;
    }

    public void setInwardTransaction(InwardTransactions inwardTransaction) {
      this.inwardTransaction = inwardTransaction;
    }

    public void setOutwardTransaction(OutwardTransactions outwardTransaction) {
        this.outwardTransaction = outwardTransaction;
    }

    public ReturnTransactions getReturnTransaction() {
        return returnTransaction;
    }

    public void setReturnTransaction(ReturnTransactions returnTransaction) {
        this.returnTransaction = returnTransaction;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }
}
