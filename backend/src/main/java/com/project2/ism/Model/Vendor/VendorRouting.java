package com.project2.ism.Model.Vendor;


import com.project2.ism.Model.Product;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendor_routing")
public class VendorRouting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor1_id", nullable = false)
    private Vendor vendor1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor2_id", nullable = false)
    private Vendor vendor2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor3_id", nullable = false)
    private Vendor vendor3;

    @OneToMany(mappedBy = "vendorRouting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VendorRule> vendorRules = new ArrayList<>();

    @Column(name = "status")
    private Boolean status = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    // Helper methods for bidirectional relationship
    public void addVendorRule(VendorRule rule) {
        vendorRules.add(rule);
        rule.setVendorRouting(this);
    }

    public void removeVendorRule(VendorRule rule) {
        vendorRules.remove(rule);
        rule.setVendorRouting(null);
    }

    // Constructor, Getters and Setters needed

    public Vendor getVendor1() {
        return vendor1;
    }

    public void setVendor1(Vendor vendor1) {
        this.vendor1 = vendor1;
    }

    public Vendor getVendor2() {
        return vendor2;
    }

    public void setVendor2(Vendor vendor2) {
        this.vendor2 = vendor2;
    }

    public Vendor getVendor3() {
        return vendor3;
    }

    public void setVendor3(Vendor vendor3) {
        this.vendor3 = vendor3;
    }

    public VendorRouting() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public List<VendorRule> getVendorRules() {
        return vendorRules;
    }

    public void setVendorRules(List<VendorRule> vendorRules) {
        this.vendorRules = vendorRules;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}