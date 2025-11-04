package com.project2.ism.DTO.Vendor;

import com.project2.ism.Model.Vendor.VendorChannelRates;
import com.project2.ism.Model.Vendor.VendorRates;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record VendorRatesDTO(
        Long id,
        LocalDate effectiveDate,
        LocalDate expiryDate,
        BigDecimal monthlyRent,
        Long vendorId,
        String vendorName,
        Long productId,
        String productName,
        String productCode,
        String remark,
        List<VendorChannelRateDTO> vendorChannelRates
) {
    public static VendorRatesDTO fromEntity(VendorRates entity) {
        return new VendorRatesDTO(
                entity.getId(),
                entity.getEffectiveDate(),
                entity.getExpiryDate(),
                entity.getMonthlyRent(),
                entity.getVendor().getId(),
                entity.getVendor().getName(),
                entity.getProduct().getId(),
                entity.getProduct().getProductName(),
                entity.getProduct().getProductCode(),
                entity.getRemark(),
                entity.getVendorChannelRates().stream()
                        .map(VendorChannelRateDTO::fromEntity)
                        .toList()
        );
    }
}

// Nested record (package-private, no `public` keyword)
record VendorChannelRateDTO(
        Long id,
        String channelType,
        BigDecimal rate
) {
    public static VendorChannelRateDTO fromEntity(VendorChannelRates entity) {
        return new VendorChannelRateDTO(
                entity.getId(),
                entity.getChannelType(),
                entity.getRate()
        );
    }
}
