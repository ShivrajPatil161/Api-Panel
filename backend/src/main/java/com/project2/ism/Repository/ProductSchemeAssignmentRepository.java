


package com.project2.ism.Repository;

        import com.project2.ism.Model.ProductSchemeAssignment;
        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.List;

public interface ProductSchemeAssignmentRepository extends JpaRepository<ProductSchemeAssignment, Long> {
    List<ProductSchemeAssignment> findByCustomerIdAndCustomerType(Long customerId, String customerType);
    List<ProductSchemeAssignment> findByOutwardTransaction_Id(Long outwardTransactionId);
}
