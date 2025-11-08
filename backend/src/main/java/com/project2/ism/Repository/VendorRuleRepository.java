package com.project2.ism.Repository;


import com.project2.ism.Model.Vendor.VendorRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRuleRepository extends JpaRepository<VendorRule, Long> {

    List<VendorRule> findByVendorRoutingId(Long vendorRoutingId);

    List<VendorRule> findByVendorId(Long vendorId);

    void deleteByVendorRoutingId(Long vendorRoutingId);
}
