package com.project2.ism.Repository;

import com.project2.ism.Model.CustomerSchemeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CustomerSchemeAssignmentRepository extends JpaRepository<CustomerSchemeAssignment, Long> {

    // Find assignments by franchise
    List<CustomerSchemeAssignment> findByFranchiseId(Long franchiseId);

    // Find assignments by merchant
    List<CustomerSchemeAssignment> findByMerchantId(Long merchantId);

//    // Active scheme for Merchant on given date (without specific product)
//    @Query("""
//        SELECT a FROM CustomerSchemeAssignment a
//        WHERE a.merchant.id = :merchantId
//          AND a.effectiveDate <= :onDate
//          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
//        ORDER BY a.effectiveDate DESC
//    """)
//    Optional<CustomerSchemeAssignment> findActiveSchemeForMerchant(
//            @Param("merchantId") Long merchantId,
//            @Param("onDate") LocalDate onDate);
//
//    // Active scheme for Franchise on given date (without specific product)
//    @Query("""
//        SELECT a FROM CustomerSchemeAssignment a
//        WHERE a.franchise.id = :franchiseId
//          AND a.effectiveDate <= :onDate
//          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
//        ORDER BY a.effectiveDate DESC
//    """)
//    Optional<CustomerSchemeAssignment> findActiveSchemeForFranchise(
//            @Param("franchiseId") Long franchiseId,
//            @Param("onDate") LocalDate onDate);

    // Active scheme for Franchise, specific product, on given date
    @Query("""
        SELECT a FROM CustomerSchemeAssignment a
        WHERE a.franchise.id = :franchiseId
          AND a.product.id = :productId
          AND a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    Optional<CustomerSchemeAssignment> findActiveSchemeForFranchiseAndProduct(
            @Param("franchiseId") Long franchiseId,
            @Param("productId") Long productId,
            @Param("onDate") LocalDate onDate);

    // Active scheme for Merchant, specific product, on given date
    @Query("""
        SELECT a FROM CustomerSchemeAssignment a
        WHERE a.merchant.id = :merchantId
          AND a.product.id = :productId
          AND a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    Optional<CustomerSchemeAssignment> findActiveSchemeForMerchantAndProduct(
            @Param("merchantId") Long merchantId,
            @Param("productId") Long productId,
            @Param("onDate") LocalDate onDate);

    // Find all active schemes on a given date
    @Query("""
        SELECT a FROM CustomerSchemeAssignment a
        WHERE a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    List<CustomerSchemeAssignment> findAllActiveSchemes(@Param("onDate") LocalDate onDate);

    // Find schemes expiring soon (within specified days)
    @Query("""
        SELECT a FROM CustomerSchemeAssignment a
        WHERE a.expiryDate IS NOT NULL
          AND a.expiryDate BETWEEN :startDate AND :endDate
        ORDER BY a.expiryDate ASC
    """)
    List<CustomerSchemeAssignment> findSchemesExpiringBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Find by customer type (using customerType field)
    List<CustomerSchemeAssignment> findByCustomerType(String customerType);

    // Find active schemes by customer type
    @Query("""
        SELECT a FROM CustomerSchemeAssignment a
        WHERE a.customerType = :customerType
          AND a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        ORDER BY a.effectiveDate DESC
    """)
    List<CustomerSchemeAssignment> findActiveSchemesByCustomerType(
            @Param("customerType") String customerType,
            @Param("onDate") LocalDate onDate);
}