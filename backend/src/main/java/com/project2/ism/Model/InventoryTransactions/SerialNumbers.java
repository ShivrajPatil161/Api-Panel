package com.project2.ism.Model.InventoryTransactions;

import com.project2.ism.Model.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class SerialNumbers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String sid;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String mid;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String tid;

    private String vpaid;
    @Size(max = 50, message = "TID cannot exceed 50 characters")

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String mobNumber;

    @ManyToOne
    @JoinColumn(name = "inward_transaction_id", nullable = false)
    private InwardTransactions inwardTransaction;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public SerialNumbers() {
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

    public InwardTransactions getInwardTransaction() {
        return inwardTransaction;
    }

    public void setInwardTransaction(InwardTransactions inwardTransaction) {
        this.inwardTransaction = inwardTransaction;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
