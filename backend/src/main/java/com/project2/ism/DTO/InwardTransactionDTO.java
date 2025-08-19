package com.project2.ism.DTO;

import com.project2.ism.Model.InventoryTransactions.InwardTransactions;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.ProductCategory;
import com.project2.ism.Model.Vendor.Vendor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class InwardTransactionDTO {

    public Long id;
    public String invoiceNumber;
    public Long vendorId;
    public LocalDate receivedDate;
    public String receivedBy;
    public Long productId;
    public Long productCategoryId;
    public Integer quantity;
    public String batchNumber;
    public Integer warrantyPeriod;
    public String productCondition;
    public List<ProductSerialDTO> serialNumbers;
    public String remark;

    // --- Nested DTO for Serial Numbers ---
    public static class ProductSerialDTO {
        public String sid;
        public String mid;
        public String tid;
        public String vpaid;
        public String mobNumber;

        public static ProductSerialDTO fromEntity(ProductSerialNumbers entity) {
            ProductSerialDTO dto = new ProductSerialDTO();
            dto.sid = entity.getSid();
            dto.mid = entity.getMid();
            dto.tid = entity.getTid();
            dto.vpaid = entity.getVpaid();
            dto.mobNumber = entity.getMobNumber();
            return dto;
        }

        public ProductSerialNumbers toEntity(InwardTransactions inward, Product product) {
            ProductSerialNumbers sn = new ProductSerialNumbers();
            sn.setSid(this.sid);
            sn.setMid(this.mid);
            sn.setTid(this.tid);
            sn.setVpaid(this.vpaid);
            sn.setMobNumber(this.mobNumber);
            sn.setInwardTransaction(inward);
            sn.setProduct(product);
            return sn;
        }
    }

    // --- Mapper Methods ---
    public static InwardTransactionDTO fromEntity(InwardTransactions entity) {
        InwardTransactionDTO dto = new InwardTransactionDTO();
        dto.id = entity.getId();
        dto.invoiceNumber = entity.getInvoiceNumber();
        dto.vendorId = entity.getVendor() != null ? entity.getVendor().getId() : null;
        dto.receivedDate = entity.getReceivedDate();
        dto.receivedBy = entity.getReceivedBy();
        dto.productId = entity.getProduct() != null ? entity.getProduct().getId() : null;
        dto.productCategoryId = entity.getProductCategory() != null ? entity.getProductCategory().getId() : null;
        dto.quantity = entity.getQuantity();
        dto.batchNumber = entity.getBatchNumber();
        dto.warrantyPeriod = entity.getWarrantyPeriod();
        dto.productCondition = entity.getProductCondition();
        dto.remark = entity.getRemark();

        if (entity.getProductSerialNumbers() != null) {
            dto.serialNumbers = entity.getProductSerialNumbers().stream()
                    .map(ProductSerialDTO::fromEntity)
                    .collect(Collectors.toList());
        }
        return dto;
    }

    public InwardTransactions toEntity(Vendor vendor, Product product, ProductCategory category) {
        InwardTransactions inward = new InwardTransactions();
        inward.setId(this.id);
        inward.setInvoiceNumber(this.invoiceNumber);
        inward.setVendor(vendor);
        inward.setReceivedDate(this.receivedDate);
        inward.setReceivedBy(this.receivedBy);
        inward.setProduct(product);
        inward.setProductCategory(category);
        inward.setQuantity(this.quantity);
        inward.setBatchNumber(this.batchNumber);
        inward.setWarrantyPeriod(this.warrantyPeriod);
        inward.setProductCondition(this.productCondition);
        inward.setRemark(this.remark);

        if (this.serialNumbers != null) {
            List<ProductSerialNumbers> serials = this.serialNumbers.stream()
                    .map(sn -> sn.toEntity(inward, product))
                    .collect(Collectors.toList());
            inward.setProductSerialNumbers(serials);
        }

        return inward;
    }
}
