package com.project2.ism.Service;



import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Exception.DuplicateProductCodeException;
import com.project2.ism.Model.Product;
import com.project2.ism.Repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Create a new product
     */
    public Product createProduct(Product product) {
        logger.info("Creating new product with code: {}", product.getProductCode());

        // Check if product code already exists
        if (productRepository.existsByProductCode(product.getProductCode())) {
            throw new DuplicateProductCodeException("Product with code " + product.getProductCode() + " already exists");
        }



        Product savedProduct = productRepository.save(product);
        logger.info("Product created successfully with ID: {}", savedProduct.getId());

        return savedProduct;
    }

    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        logger.debug("Fetching product with ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id ));
    }

    /**
     * Get product by ID with specifications
     */


    /**
     * Get product by product code
     */
    @Transactional(readOnly = true)
    public Product getProductByCode(String productCode) {
        logger.debug("Fetching product with code: {}", productCode);
        return productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productCode ));
    }

    /**
     * Update product
     */
    public Product updateProduct(Long id, Product productDetails) {
        logger.info("Updating product with ID: {}", id);

        Product existingProduct = getProductById(id);

        // Check if product code is being changed and if the new code already exists
        if (!existingProduct.getProductCode().equals(productDetails.getProductCode())) {
            if (productRepository.existsByProductCode(productDetails.getProductCode())) {
                throw new DuplicateProductCodeException("Product with code " + productDetails.getProductCode() + " already exists");
            }
        }

        // Update fields
        existingProduct.setProductName(productDetails.getProductName());
        existingProduct.setProductCode(productDetails.getProductCode());
        existingProduct.setVendor(productDetails.getVendor());
        existingProduct.setProductCategory(productDetails.getProductCategory());
        existingProduct.setModel(productDetails.getModel());
        existingProduct.setBrand(productDetails.getBrand());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setWarrantyPeriod(productDetails.getWarrantyPeriod());
        existingProduct.setWarrantyType(productDetails.getWarrantyType());
        existingProduct.setHsn(productDetails.getHsn());
        existingProduct.setStatus(productDetails.getStatus());
        existingProduct.setMinOrderQuantity(productDetails.getMinOrderQuantity());
        existingProduct.setMaxOrderQuantity(productDetails.getMaxOrderQuantity());
        existingProduct.setRemarks(productDetails.getRemarks());




        Product updatedProduct = productRepository.save(existingProduct);
        logger.info("Product updated successfully with ID: {}", updatedProduct.getId());

        return updatedProduct;
    }

    /**
     * Delete product by ID
     */
    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id );
        }

        productRepository.deleteById(id);
        logger.info("Product deleted successfully with ID: {}", id);
    }

    /**
     * Get all products with pagination
     */
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        logger.debug("Fetching all products with pagination");
        return productRepository.findAll(pageable);
    }

    /**
     * Search products
     */
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String searchTerm, Pageable pageable) {
        logger.debug("Searching products with term: {}", searchTerm);
        return productRepository.searchProducts(searchTerm, pageable);
    }

    /**
     * Get products by category
     */
//    @Transactional(readOnly = true)
//    public List<Product> getProductsByCategory(ProductCategory category) {
//        logger.debug("Fetching products by category: {}", category);
//        return productRepository.findByCategory(category);
//    }

    /**
     * Get products by status
     */
//    @Transactional(readOnly = true)
//    public List<Product> getProductsByStatus(ProductStatus status) {
//        logger.debug("Fetching products by status: {}", status);
//        return productRepository.findByStatusOrderByProductNameAsc(status);
//    }

    /**
     * Get products by vendor
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByVendor(Long vendorId) {
        logger.debug("Fetching products by vendor: {}", vendorId);
        return productRepository.findByVendorId(vendorId);
    }

    /**
     * Get products by criteria with pagination
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCriteria(
//            ProductCategory category, ProductStatus status,
                                               Long vendorId, String brand, Pageable pageable) {
        logger.debug("Fetching products by criteria - Category: {}, Status: {}, Vendor: {}, Brand: {}",
                /*category, status,*/vendorId, brand);
        return productRepository.findProductsByCriteria(/*category, status,*/ vendorId, brand, pageable);
    }

    /**
     * Check if product code exists
     */
    @Transactional(readOnly = true)
    public boolean productCodeExists(String productCode) {
        return productRepository.existsByProductCode(productCode);
    }

//    /**
//     * Get product count by status
//     */
//    @Transactional(readOnly = true)
//    public long getProductCountByStatus(ProductStatus status) {
//        return productRepository.countByStatus(status);
//    }
//
//    /**
//     * Get product count by category
//     */
//    @Transactional(readOnly = true)
//    public long getProductCountByCategory(ProductCategory category) {
//        return productRepository.countByCategory(category);
//    }
//
//    /**
//     * Activate product
//     */
//    public Product activateProduct(Long id) {
//        logger.info("Activating product with ID: {}", id);
//        Product product = getProductById(id);
//        product.setStatus(ProductStatus.ACTIVE);
//        return productRepository.save(product);
//    }
//
//    /**
//     * Deactivate product
//     */
//    public Product deactivateProduct(Long id) {
//        logger.info("Deactivating product with ID: {}", id);
//        Product product = getProductById(id);
//        product.setStatus(ProductStatus.INACTIVE);
//        return productRepository.save(product);
//    }
}