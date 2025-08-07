package com.project2.ism.Controller;



import com.project2.ism.Model.Product.*;
import com.project2.ism.Service.ProductService;
import com.project2.ism.enums.ProductCategory;
import com.project2.ism.enums.ProductStatus;
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
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Create a new product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        logger.info("REST request to create Product: {}", product.getProductCode());
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
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
     * Get product by ID with specifications
     */
    @GetMapping("/{id}/specifications")
    public ResponseEntity<Product> getProductByIdWithSpecifications(@PathVariable Long id) {
        logger.debug("REST request to get Product with specifications by ID: {}", id);
        Product product = productService.getProductByIdWithSpecifications(id);
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
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @Valid @RequestBody Product productDetails) {
        logger.info("REST request to update Product ID: {}", id);
        Product updatedProduct = productService.updateProduct(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
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
     * Get products by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable ProductCategory category) {
        logger.debug("REST request to get Products by category: {}", category);
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    /**
     * Get products by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Product>> getProductsByStatus(@PathVariable ProductStatus status) {
        logger.debug("REST request to get Products by status: {}", status);
        List<Product> products = productService.getProductsByStatus(status);
        return ResponseEntity.ok(products);
    }

    /**
     * Get products by vendor
     */
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Product>> getProductsByVendor(@PathVariable String vendorId) {
        logger.debug("REST request to get Products by vendor: {}", vendorId);
        List<Product> products = productService.getProductsByVendor(vendorId);
        return ResponseEntity.ok(products);
    }

    /**
     * Advanced filtering with pagination
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> getProductsByCriteria(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(required = false) String vendorId,
            @RequestParam(required = false) String brand,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        logger.debug("REST request to filter Products with criteria");

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProductsByCriteria(category, status, vendorId, brand, pageable);

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
     * Get dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        logger.debug("REST request to get product statistics");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalActive", productService.getProductCountByStatus(ProductStatus.ACTIVE));
        stats.put("totalInactive", productService.getProductCountByStatus(ProductStatus.INACTIVE));
        stats.put("totalPOS", productService.getProductCountByCategory(ProductCategory.POS));
        stats.put("totalQRScanner", productService.getProductCountByCategory(ProductCategory.QR_SCANNER));
        stats.put("totalCardReader", productService.getProductCountByCategory(ProductCategory.CARD_READER));
        stats.put("totalPrinter", productService.getProductCountByCategory(ProductCategory.PRINTER));
        stats.put("totalAccessories", productService.getProductCountByCategory(ProductCategory.ACCESSORIES));

        return ResponseEntity.ok(stats);
    }

    /**
     * Activate product
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<Product> activateProduct(@PathVariable Long id) {
        logger.info("REST request to activate Product ID: {}", id);
        Product product = productService.activateProduct(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Deactivate product
     */
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Product> deactivateProduct(@PathVariable Long id) {
        logger.info("REST request to deactivate Product ID: {}", id);
        Product product = productService.deactivateProduct(id);
        return ResponseEntity.ok(product);
    }
}