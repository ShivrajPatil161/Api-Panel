package com.project2.ism.Repository;



import com.project2.ism.Model.Vendor.VendorRouting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRoutingRepository extends JpaRepository<VendorRouting, Long> {

    Optional<VendorRouting> findByProductId(Long productId);

    Page<VendorRouting> findAll(Pageable pageable);

    @Query("SELECT vr FROM VendorRouting vr LEFT JOIN FETCH vr.vendorRules WHERE vr.id = :id")
    Optional<VendorRouting> findByIdWithRules(Long id);

    @Query("SELECT vr FROM VendorRouting vr LEFT JOIN FETCH vr.product WHERE vr.id = :id")
    Optional<VendorRouting> findByIdWithProduct(Long id);
}
