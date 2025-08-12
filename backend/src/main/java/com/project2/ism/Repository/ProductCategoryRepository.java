package com.project2.ism.Repository;

import com.project2.ism.Model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    boolean existsByCategoryName(String categoryName);
    boolean existsByCategoryCode(Integer categoryCode);
}