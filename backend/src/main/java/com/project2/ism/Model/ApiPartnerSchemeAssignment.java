package com.project2.ism.Model;


import com.project2.ism.Model.PricingScheme.PricingScheme;

import com.project2.ism.Model.Users.ApiPartner;
import jakarta.persistence.*;

import java.time.LocalDate;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "api_partner_scheme_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_api_partner_product_scheme_date_range",
                        columnNames = {"partner_id", "product_id", "scheme_id", "effective_date", "expiry_date"}
                )
        }
)
public class ApiPartnerSchemeAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Pricing Scheme
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private PricingScheme scheme;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id")
    private ApiPartner apiPartner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private String remarks;

    // Automatic timestamps
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;



    // Getters and setters...


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PricingScheme getScheme() {
        return scheme;
    }

    public void setScheme(PricingScheme scheme) {
        this.scheme = scheme;
    }

    public ApiPartner getApiPartner() {
        return apiPartner;
    }

    public void setApiPartner(ApiPartner apiPartner) {
        this.apiPartner = apiPartner;
    }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }



    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
