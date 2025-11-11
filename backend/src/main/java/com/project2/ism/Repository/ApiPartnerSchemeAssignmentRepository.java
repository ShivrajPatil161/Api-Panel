package com.project2.ism.Repository;

import com.project2.ism.DTO.ApiPartnerDTO.ApiPartnerProductsDTO;
import com.project2.ism.Model.ApiPartnerSchemeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ApiPartnerSchemeAssignmentRepository extends JpaRepository<ApiPartnerSchemeAssignment, Long> {


    // Find assignments by merchant
    List<ApiPartnerSchemeAssignment> findByApiPartnerId(Long apiPartnerId);

    // Active scheme for Merchant, specific product, on given date
    @Query("""
        SELECT a FROM ApiPartnerSchemeAssignment a
        WHERE a.apiPartner.id = :apiPartnerId
          AND a.product.id = :productId
          AND a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    Optional<ApiPartnerSchemeAssignment> findActiveSchemeForMerchantAndProduct(
            @Param("apiPartnerId") Long apiPartnerId,
            @Param("productId") Long productId,
            @Param("onDate") LocalDate onDate);

    // Find all active schemes on a given date
    @Query("""
        SELECT a FROM ApiPartnerSchemeAssignment a
        WHERE a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    List<ApiPartnerSchemeAssignment> findAllActiveSchemes(@Param("onDate") LocalDate onDate);

    // Find schemes expiring soon (within specified days)
    @Query("""
        SELECT a FROM ApiPartnerSchemeAssignment a
        WHERE a.expiryDate IS NOT NULL
          AND a.expiryDate BETWEEN :startDate AND :endDate
        ORDER BY a.expiryDate ASC
    """)
    List<ApiPartnerSchemeAssignment> findSchemesExpiringBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);



    @Query("""
        SELECT c FROM ApiPartnerSchemeAssignment c
        WHERE c.product.id = :productId
          AND c.apiPartner.id = :apiPartnerId
          AND (
              (c.effectiveDate <= :expiryDate OR :expiryDate IS NULL)
              AND (c.expiryDate IS NULL OR c.expiryDate >= :effectiveDate)
          )
    """)
    List<ApiPartnerSchemeAssignment> findOverlappingAssignments(
            @Param("apiPartnerId") Long apiPartnerId,
            @Param("productId") Long productId,
            @Param("effectiveDate") LocalDate effectiveDate,
            @Param("expiryDate") LocalDate expiryDate
    );


    List<ApiPartnerSchemeAssignment> findTop5ByExpiryDateGreaterThanEqualOrderByExpiryDateAsc(LocalDate currentDate);

    @Query("""
        SELECT new com.project2.ism.DTO.ApiPartnerProductsDTO(
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


//----------------------------------For ProductScheme Reports------------------------------------------------



//    /**
//     * Fetch all scheme assignments with complete product, scheme, and customer details
//     * This query uses JOIN FETCH to eagerly load all related entities
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.vendor
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllWithCompleteDetails();
//
//    /**
//     * Fetch scheme assignments filtered by customer type
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.vendor
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        WHERE a.customerType = :customerType
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllWithCompleteDetailsByCustomerType(@Param("customerType") String customerType);
//
//    /**
//     * Fetch scheme assignments for a specific product
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.productCategory
//        LEFT JOIN FETCH p.vendor
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        WHERE p.id = :productId
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllWithCompleteDetailsByProduct(@Param("productId") Long productId);
//
//    /**
//     * Fetch scheme assignments for a specific scheme
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.productCategory
//        LEFT JOIN FETCH p.vendor
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        WHERE s.id = :schemeId
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllWithCompleteDetailsByScheme(@Param("schemeId") Long schemeId);
//
//    /**
//     * Fetch active scheme assignments (not expired)
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.productCategory
//        LEFT JOIN FETCH p.vendor
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        WHERE a.effectiveDate <= :currentDate
//        AND (a.expiryDate IS NULL OR a.expiryDate >= :currentDate)
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllActiveWithCompleteDetails(@Param("currentDate") LocalDate currentDate);
//
//    /**
//     * Fetch scheme assignments with filters
//     */
//    @Query("""
//        SELECT DISTINCT a FROM CustomerSchemeAssignment a
//        LEFT JOIN FETCH a.scheme s
//        LEFT JOIN FETCH a.product p
//        LEFT JOIN FETCH p.productCategory pc
//        LEFT JOIN FETCH p.vendor v
//        LEFT JOIN FETCH a.franchise f
//        LEFT JOIN FETCH a.merchant m
//        WHERE (:customerType IS NULL OR a.customerType = :customerType)
//        AND (:productId IS NULL OR p.id = :productId)
//        AND (:schemeId IS NULL OR s.id = :schemeId)
//        AND (:categoryId IS NULL OR pc.id = :categoryId)
//        AND (:activeOnly = false OR (a.effectiveDate <= :currentDate AND (a.expiryDate IS NULL OR a.expiryDate >= :currentDate)))
//        ORDER BY a.createdAt DESC
//    """)
//    List<CustomerSchemeAssignment> findAllWithCompleteDetailsFiltered(
//            @Param("customerType") String customerType,
//            @Param("productId") Long productId,
//            @Param("schemeId") Long schemeId,
//            @Param("categoryId") Long categoryId,
//            @Param("activeOnly") boolean activeOnly,
//            @Param("currentDate") LocalDate currentDate
//    );

}