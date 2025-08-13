package com.project2.ism.Controller;

import com.project2.ism.Model.Product;
import com.project2.ism.Model.ProductCategory;
import com.project2.ism.Service.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*") // Configure as needed for your frontend
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Create a new product with auto-generated product code
     * The product code will be automatically generated based on the category
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody Product product) {
        logger.info("REST request to create Product: {}", product.getProductName());

        try {
            Product createdProduct = productService.createProduct(product);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product created successfully");
            response.put("product", createdProduct);
            response.put("generatedProductCode", createdProduct.getProductCode());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create product: " + e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all products with pagination and sorting
     */
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.debug("REST request to get all Products - page: {}, size: {}, sortBy: {}, sortDir: {}",
                page, size, sortBy, sortDir);

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getAllProducts(pageable);

        return ResponseEntity.ok(products);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.debug("REST request to get Product by ID: {}", id);
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Get product by product code
     */
    @GetMapping("/code/{productCode}")
    public ResponseEntity<Product> getProductByCode(@PathVariable String productCode) {
        logger.debug("REST request to get Product by code: {}", productCode);
        Product product = productService.getProductByCode(productCode);
        return ResponseEntity.ok(product);
    }

    /**
     * Update product
     * Note: Product code and category cannot be changed after creation
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id,
                                                             @Valid @RequestBody Product productDetails) {
        logger.info("REST request to update Product ID: {}", id);

        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product updated successfully");
            response.put("product", updatedProduct);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update product: " + e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Delete product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        logger.info("REST request to delete Product ID: {}", id);
        productService.deleteProduct(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Search products
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.debug("REST request to search Products with query: {}", q);

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.searchProducts(q, pageable);

        return ResponseEntity.ok(products);
    }

    /**
     * Get products by vendor
     */
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Product>> getProductsByVendor(@PathVariable Long vendorId) {
        logger.debug("REST request to get Products by vendor: {}", vendorId);
        List<Product> products = productService.getProductsByVendor(vendorId);
        return ResponseEntity.ok(products);
    }

    /**
     * Get products by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        logger.debug("REST request to get Products by category: {}", categoryId);
        List<Product> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * Advanced filtering with pagination
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> getProductsByCriteria(
            @RequestParam(required = false) Long vendorId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.debug("REST request to filter Products with criteria");

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProductsByCriteria(vendorId, brand, categoryId, pageable);

        return ResponseEntity.ok(products);
    }

    /**
     * Check if product code exists
     */
    @GetMapping("/exists/{productCode}")
    public ResponseEntity<Map<String, Boolean>> checkProductCodeExists(@PathVariable String productCode) {
        logger.debug("REST request to check if product code exists: {}", productCode);
        boolean exists = productService.productCodeExists(productCode);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all product categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        logger.debug("REST request to get all product categories");
        List<ProductCategory> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category statistics (categories with product counts)
     */
    @GetMapping("/categories/stats")
    public ResponseEntity<List<ProductCategory>> getCategoryStats() {
        logger.debug("REST request to get category statistics");
        List<ProductCategory> categoryStats = productService.getCategoryStats();
        return ResponseEntity.ok(categoryStats);
    }

    /**
     * Get product dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        logger.debug("REST request to get product statistics");

        List<ProductCategory> categories = productService.getAllCategories();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", productService.getAllProducts(Pageable.unpaged()).getTotalElements());
        stats.put("totalCategories", categories.size());
        stats.put("categoriesWithProducts", categories.stream()
                .filter(cat -> cat.getProductCount() > 0)
                .count());
        stats.put("categoryBreakdown", categories);

        return ResponseEntity.ok(stats);
    }
}