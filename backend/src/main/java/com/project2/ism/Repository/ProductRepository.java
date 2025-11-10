package com.project2.ism.Repository;

import com.project2.ism.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

//    boolean existsByNameIgnoreCase(Product product);
    /**
     * Find product by product code
     */
    Optional<Product> findByProductCode(String productCode);

    /**
     * Check if product code exists
     */
    boolean existsByProductCode(String productCode);

    /**
     * Find products by category ID
     */
    List<Product> findByProductCategoryId(Long categoryId);

    /**
     * Find products by status
     */
    List<Product> findByStatusOrderByProductNameAsc(Boolean status);


    /**
     * Search products by multiple fields
     */
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +

            "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> searchProducts(@Param("searchTerm") String searchTerm, Pageable pageable);


    /**
     * Count products by category
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.productCategory.id = :categoryId")
    Long countByProductCategoryId(@Param("categoryId") Long categoryId);


    /**
     * Count active products
     */
    Long countByStatus(Boolean status);


    /**
     * Find products created in a date range
     */
    @Query("SELECT p FROM Product p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Product> findByCreatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate,
                                         @Param("endDate") java.time.LocalDateTime endDate);



}