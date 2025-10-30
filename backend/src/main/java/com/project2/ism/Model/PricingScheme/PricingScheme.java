package com.project2.ism.Model.PricingScheme;


import com.project2.ism.Model.ProductCategory;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pricing_schemes")
public class PricingScheme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheme_code", unique = true, nullable = false)
    private String schemeCode;

    @NotNull(message = "Please select a category")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_category_id", nullable = false)
    private ProductCategory productCategory;

    @Column(name = "rental_by_month", nullable = false)
    private Double rentalByMonth;


    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "pricingScheme", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<ChannelRate> channelRates = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper method to add card rate
    public void addChannelRate(ChannelRate channelRate) {
        channelRates.add(channelRate);
        channelRate.setPricingScheme(this);
    }

    // Helper method to remove card rate
    public void removeCardRate(ChannelRate channelRate) {
        channelRates.remove(channelRate);
        channelRate.setPricingScheme(null);
    }

    public ProductCategory getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(ProductCategory productCategory) {
        this.productCategory = productCategory;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchemeCode() {
        return schemeCode;
    }

    public void setSchemeCode(String schemeCode) {
        this.schemeCode = schemeCode;
    }

    public Double getRentalByMonth() {
        return rentalByMonth;
    }

    public void setRentalByMonth(Double rentalByMonth) {
        this.rentalByMonth = rentalByMonth;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ChannelRate> getChannelRates() {
        return channelRates;
    }

    public void setChannelRates(List<ChannelRate> channelRates) {
        this.channelRates = channelRates;
        if (channelRates != null) {
            channelRates.forEach(cardRate -> cardRate.setPricingScheme(this));
        }
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