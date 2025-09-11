package com.project2.ism.DTO.ReportDTO;

import java.util.List;

public class VendorDetailDTO {
    private Long vendorId;
    private String vendorName;
    private List<ProductDetailDTO> products;

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public List<ProductDetailDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductDetailDTO> products) {
        this.products = products;
    }
}
