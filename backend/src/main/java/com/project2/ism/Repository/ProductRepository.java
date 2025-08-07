package com.project2.ism.Repository;



import com.project2.ism.Model.Product.*;

import com.project2.ism.enums.ProductCategory;
import com.project2.ism.enums.ProductStatus;
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

    // Find by product code (unique)
    Optional<Product> findByProductCode(String productCode);

    // Check if product code exists
    boolean existsByProductCode(String productCode);

    // Find by category
    List<Product> findByCategory(ProductCategory category);

    // Find by status
    List<Product> findByStatus(ProductStatus status);

    // Find active products
    List<Product> findByStatusOrderByProductNameAsc(ProductStatus status);

    // Find by vendor ID
    List<Product> findByVendorId(String vendorId);

    // Find by brand
    List<Product> findByBrandIgnoreCase(String brand);

    // Find by category and status
    List<Product> findByCategoryAndStatus(ProductCategory category, ProductStatus status);

    // Search products by name or code (case insensitive)
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> searchProducts(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find products with specifications
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.specifications WHERE p.id = :productId")
    Optional<Product> findByIdWithSpecifications(@Param("productId") Long productId);

    // Find products by multiple criteria
    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR p.category = :category) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:vendorId IS NULL OR p.vendorId = :vendorId) AND " +
            "(:brand IS NULL OR LOWER(p.brand) = LOWER(:brand))")
    Page<Product> findProductsByCriteria(
            @Param("category") ProductCategory category,
            @Param("status") ProductStatus status,
            @Param("vendorId") String vendorId,
            @Param("brand") String brand,
            Pageable pageable
    );

    // Count products by status
    long countByStatus(ProductStatus status);

    // Count products by category
    long countByCategory(ProductCategory category);
}
