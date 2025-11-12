package com.project2.ism.Repository;

import com.project2.ism.DTO.ApiPartnerDTO.ApiPartnerProductsDTO;
import com.project2.ism.Model.PartnerProductAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartnerProductAssignmentRepository extends JpaRepository<PartnerProductAssignment, Long> {
    boolean existsByPartnerIdAndProductId(Long partnerId, Long productId);

    Optional<PartnerProductAssignment> findByPartnerIdAndProductId(Long partnerId, Long productId);

    @Query("""
        SELECT new com.project2.ism.DTO.ApiPartnerDTO.ApiPartnerProductsDTO(
            p.id,
            p.productName,
            p.productCode,
            p.productCategory.categoryName
        )
        FROM ApiPartnerSchemeAssignment a
        JOIN a.product p
        WHERE a.apiPartner.id = :apiPartnerId
    """)
    List<ApiPartnerProductsDTO> findAllProductByApiPartnerId(@Param("apiPartnerId") Long apiPartnerId);

}
