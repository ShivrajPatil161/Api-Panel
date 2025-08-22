package com.project2.ism.DTO;

import com.project2.ism.Model.InventoryTransactions.InwardTransactions;
import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.Product;

public class ProductSerialDTO {

    public Long id;
    public String sid;
    public String mid;
    public String tid;
    public String vpaid;
    public String mobNumber;

    // ✅ Mapping from entity → DTO
    public static ProductSerialDTO fromEntity(ProductSerialNumbers entity) {
        ProductSerialDTO dto = new ProductSerialDTO();
        dto.id = entity.getId();
        dto.sid = entity.getSid();
        dto.mid = entity.getMid();
        dto.tid = entity.getTid();
        dto.vpaid = entity.getVpaid();
        dto.mobNumber = entity.getMobNumber();
        return dto;
    }

    // ✅ Mapping from DTO → Entity (for InwardTransactions)
    public ProductSerialNumbers toInwardEntity(InwardTransactions inward, Product product) {
        ProductSerialNumbers sn = new ProductSerialNumbers();
        sn.setId(this.id);
        sn.setSid(this.sid);
        sn.setMid(this.mid);
        sn.setTid(this.tid);
        sn.setVpaid(this.vpaid);
        sn.setMobNumber(this.mobNumber);
        sn.setInwardTransaction(inward);
        sn.setProduct(product);
        return sn;
    }

    // ✅ Mapping from DTO → Entity (for OutwardTransactions)
    public ProductSerialNumbers toOutwardEntity(OutwardTransactions outward, Product product) {
        ProductSerialNumbers sn = new ProductSerialNumbers();
        sn.setId(this.id);
        sn.setSid(this.sid);
        sn.setMid(this.mid);
        sn.setTid(this.tid);
        sn.setVpaid(this.vpaid);
        sn.setMobNumber(this.mobNumber);
        sn.setOutwardTransaction(outward);
        sn.setProduct(product);
        return sn;
    }
}
