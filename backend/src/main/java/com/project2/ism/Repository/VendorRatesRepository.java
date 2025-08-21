package com.project2.ism.Repository;


import com.project2.ism.Model.Vendor.VendorRates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRatesRepository extends JpaRepository<VendorRates, Long> {
    Optional<VendorRates> findByProductId(Long productId);
}