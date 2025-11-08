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