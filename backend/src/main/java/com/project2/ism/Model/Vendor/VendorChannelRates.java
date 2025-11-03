package com.project2.ism.Model.Vendor;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "vendor_channel_rates")
public class VendorChannelRates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "channel type required")
    private String channelType;

    @NotNull(message = "channel rate required ")
    @DecimalMin(value = "0.0", inclusive = true, message = "Rate must be positive")
    @DecimalMax(value = "100.0", inclusive = true, message = "Rate must be less than or equal to 100")
    private BigDecimal rate;

    @ManyToOne
    @JoinColumn(name = "vendor_channel_id", nullable = false)
    @JsonBackReference
    private VendorRates vendorRates;

    public VendorChannelRates() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChannelType() {
        return channelType;
    }

    public void setChannelType(String channelType) {
        this.channelType = channelType;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public VendorRates getVendorRates() {
        return vendorRates;
    }

    public void setVendorRates(VendorRates vendorRates) {
        this.vendorRates = vendorRates;
    }
}