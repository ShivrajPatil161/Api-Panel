package com.project2.ism.Repository;

import com.project2.ism.DTO.Vendor.VendorProductDTO;
import com.project2.ism.Model.Vendor.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Long countByStatus(boolean status);

    List<Vendor> findByStatusTrue();

    boolean existsByNameIgnoreCase(String name);


    @Query("""
        SELECT new com.project2.ism.DTO.Vendor.VendorProductDTO(
            p.id, 
            p.productName, 
            p.productCode, 
            p.productCategory.categoryName, 
            p.status
        )
        FROM Vendor v 
        JOIN v.product p 
        WHERE v.id = :vendorId
    """)
    List<VendorProductDTO> findProductById(Long vendorId);
}
