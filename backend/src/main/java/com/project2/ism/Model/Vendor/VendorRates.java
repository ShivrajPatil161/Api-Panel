package com.project2.ism.Model.Vendor;

import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorCardRates;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class VendorRates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank(message = "Product code required")
    private String productCode;

    @NotNull(message = "effective date is required")
    private LocalDate effectiveDate;

    @NotNull(message = "expiry date required")
    private LocalDate expiryDate;


    @NotNull(message = "card rate required ")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent must be greater than zero")
    @Digits(integer = 10, fraction = 2, message = "Monthly rent must be a valid amount")
    private BigDecimal monthlyRent;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @NotNull
    @OneToOne
    private Product product;

    @OneToMany(mappedBy = "vendorRates", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VendorCardRates> vendorCardRates = new ArrayList<>();



    private String remark;

    @PrePersist
    @PreUpdate
    public void validateDates() {
        if (effectiveDate != null && expiryDate != null) {
            if (expiryDate.isBefore(effectiveDate)) {
                throw new IllegalArgumentException("Expiry date must be after effective date");
            }
        }
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public List<VendorCardRates> getVendorCardRates() {
        return vendorCardRates;
    }

    public void setVendorCardRates(List<VendorCardRates> vendorCardRates) {
        this.vendorCardRates = vendorCardRates;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }


    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
