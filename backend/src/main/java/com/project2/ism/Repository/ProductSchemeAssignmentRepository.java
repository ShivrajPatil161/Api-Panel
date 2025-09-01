


package com.project2.ism.Repository;

        import com.project2.ism.Model.ProductSchemeAssignment;
        import org.springframework.data.jpa.repository.JpaRepository;
        import org.springframework.data.jpa.repository.Query;
        import org.springframework.data.repository.query.Param;

        import java.time.LocalDate;
        import java.util.List;
        import java.util.Optional;

public interface ProductSchemeAssignmentRepository extends JpaRepository<ProductSchemeAssignment, Long> {
    List<ProductSchemeAssignment> findByCustomerIdAndCustomerType(Long customerId, String customerType);
    List<ProductSchemeAssignment> findByOutwardTransaction_Id(Long outwardTransactionId);


    @Query("""
        SELECT a FROM ProductSchemeAssignment a
        WHERE a.customerType = 'MERCHANT'
          AND a.customerId = :merchantId
          AND a.effectiveDate <= :onDate
          AND (a.expiryDate IS NULL OR a.expiryDate >= :onDate)
        """)
    Optional<ProductSchemeAssignment> findActiveScheme(@Param("merchantId") Long merchantId,
                                                       @Param("onDate") LocalDate onDate);
}
