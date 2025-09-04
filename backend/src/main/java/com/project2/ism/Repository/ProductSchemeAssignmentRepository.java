


package com.project2.ism.Repository;

        import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
        import com.project2.ism.Model.ProductSchemeAssignment;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;
        import org.springframework.data.repository.query.Param;

        import java.time.LocalDate;
        import java.util.List;
        import java.util.Optional;

public interface ProductSchemeAssignmentRepository extends JpaRepository<ProductSchemeAssignment, Long> {
    List<ProductSchemeAssignment> findByCustomerIdAndCustomerType(Long customerId, String customerType);


    @Query("""
    SELECT a FROM ProductSchemeAssignment a
    WHERE a.customerType = 'merchant'
      AND a.customerId = :merchantId
      AND a.effectiveDate <= :onDate
      AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
""")
    Optional<ProductSchemeAssignment> findActiveScheme(@Param("merchantId") Long merchantId,
                                                       @Param("onDate") LocalDate onDate);


    /**
     * Find pricing scheme for an outward transaction (device dispatch)
     */
    @Query("""
        SELECT psa FROM ProductSchemeAssignment psa 
        WHERE psa.outwardTransaction.id = :outwardTransactionId
        """)
    Optional<ProductSchemeAssignment> findByOutwardTransaction(@Param("outwardTransactionId") Long outwardTransactionId);

    // Alternative if you pass the entity directly
    Optional<ProductSchemeAssignment> findByOutwardTransaction(OutwardTransactions outwardTransaction);

    /**
     * Find active scheme for merchant on specific date (if you want to support this approach too)
     */
    @Query("""
        SELECT psa FROM ProductSchemeAssignment psa 
        WHERE psa.customerId = :merchantId 
        AND psa.customerType = 'MERCHANT'
        AND psa.effectiveDate <= :onDate 
        AND (psa.expiryDate IS NULL OR psa.expiryDate >= :onDate)
        ORDER BY psa.effectiveDate DESC
        """)
    Optional<ProductSchemeAssignment> findActiveSchemeForMerchant(
            @Param("merchantId") Long merchantId,
            @Param("onDate") LocalDate onDate);

}
