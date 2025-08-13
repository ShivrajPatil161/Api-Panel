package com.project2.ism.Service;

import com.project2.ism.Model.Product;
import com.project2.ism.Model.ProductCategory;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.ProductCategoryRepository;
import com.project2.ism.Exception.DuplicateProductCodeException;
import com.project2.ism.Exception.ResourceNotFoundException;
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
    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository productCategoryRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    /**
     * Create a new product with auto-generated product code
     */
    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getProductName());
        System.out.println("Creating new product: {}"+product.getProductName());
        if (product.getProductCategory() == null) {
            throw new IllegalArgumentException("Product category is required");
        }

        // Get or create category and generate product code
        ProductCategory category = getOrCreateCategory(product.getProductCategory());
        System.out.println(category);
        // Generate product code
        String productCode = generateProductCode(category);
        System.out.println(productCode);
        // Set the generated product code and updated category
        product.setProductCode(productCode);
        product.setProductCategory(category);

        Product savedProduct = productRepository.save(product);
        logger.info("Product created successfully with ID: {} and code: {}",
                savedProduct.getId(), savedProduct.getProductCode());

        return savedProduct;
    }

    /**
     * Get or create product category with auto code generation
     */
    private ProductCategory getOrCreateCategory(ProductCategory inputCategory) {
        logger.debug("Processing category: {}", inputCategory.getCategoryName());

        // Try to find existing category by name (case-insensitive)
        return productCategoryRepository.findByCategoryNameIgnoreCase(inputCategory.getCategoryName())
                .map(existingCategory -> {
                    // Increment product count for existing category
                    existingCategory.setProductCount(existingCategory.getProductCount() + 1);
                    return productCategoryRepository.save(existingCategory);
                })
                .orElseGet(() -> {
                    logger.info("Creating new category: {}", inputCategory.getCategoryName());

                    // Generate new category code
                    Integer newCategoryCode = productCategoryRepository.findTopByOrderByCategoryCodeDesc()
                            .map(lastCategory -> lastCategory.getCategoryCode() + 100)
                            .orElse(101); // Start with 101 if no categories exist

                    // Create new category
                    ProductCategory newCategory = new ProductCategory();
                    newCategory.setCategoryName(inputCategory.getCategoryName().toUpperCase());
                    newCategory.setCategoryCode(newCategoryCode);
                    newCategory.setProductCount(1); // First product in this category

                    ProductCategory savedCategory = productCategoryRepository.save(newCategory);
                    logger.info("New category created with code: {} and name: {}",
                            savedCategory.getCategoryCode(), savedCategory.getCategoryName());
                    System.out.println(savedCategory);
                    return savedCategory;
                });
    }

    /**
     * Generate product code in format: CATEGORY_NAME-CATEGORY_CODE-PRODUCT_COUNT
     * Example: POS-101-1, QR_CODE-201-4
     */
    private String generateProductCode(ProductCategory category) {
        String productCode = String.format("%s-%d-%d",
                category.getCategoryName().toUpperCase(),
                category.getCategoryCode(),
                category.getProductCount()
        );

        logger.debug("Generated product code: {}", productCode);
        return productCode;
    }

    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        logger.debug("Fetching product with ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    /**
     * Get product by product code
     */
    @Transactional(readOnly = true)
    public Product getProductByCode(String productCode) {
        logger.debug("Fetching product with code: {}", productCode);
        return productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productCode));
    }

    /**
     * Update product (Note: Product code cannot be changed after creation)
     */
    public Product updateProduct(Long id, Product productDetails) {
        logger.info("Updating product with ID: {}", id);

        Product existingProduct = getProductById(id);

        // Product code should not be changeable after creation
        if (productDetails.getProductCode() != null &&
                !existingProduct.getProductCode().equals(productDetails.getProductCode())) {
            logger.warn("Attempt to change product code from {} to {} - ignored",
                    existingProduct.getProductCode(), productDetails.getProductCode());
        }

        // Update fields (excluding product code and category which shouldn't change)
        existingProduct.setProductName(productDetails.getProductName());
        existingProduct.setVendor(productDetails.getVendor());
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
     * Note: This will also decrement the category count
     */
    public void deleteProduct(Long id) {
        logger.info("Deleting product with ID: {}", id);

        Product product = getProductById(id);

        // Decrement category count
        ProductCategory category = product.getProductCategory();
        if (category.getProductCount() > 0) {
            category.setProductCount(category.getProductCount() - 1);
            productCategoryRepository.save(category);
            logger.debug("Decremented product count for category: {} to {}",
                    category.getCategoryName(), category.getProductCount());
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
     * Get products by vendor
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByVendor(Long vendorId) {
        logger.debug("Fetching products by vendor: {}", vendorId);
        return productRepository.findByVendorId(vendorId);
    }

    /**
     * Get products by category
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByCategory(Long categoryId) {
        logger.debug("Fetching products by category: {}", categoryId);
        return productRepository.findByProductCategoryId(categoryId);
    }

    /**
     * Get products by criteria with pagination
     */
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCriteria(Long vendorId, String brand,
                                               Long categoryId, Pageable pageable) {
        logger.debug("Fetching products by criteria - Vendor: {}, Brand: {}, Category: {}",
                vendorId, brand, categoryId);
        return productRepository.findProductsByCriteria(vendorId, brand, categoryId, pageable);
    }

    /**
     * Check if product code exists
     */
    @Transactional(readOnly = true)
    public boolean productCodeExists(String productCode) {
        return productRepository.existsByProductCode(productCode);
    }

    /**
     * Get product category by name
     */
    @Transactional(readOnly = true)
    public ProductCategory getCategoryByName(String categoryName) {
        return productCategoryRepository.findByCategoryNameIgnoreCase(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", categoryName));
    }

    /**
     * Get all product categories
     */
    @Transactional(readOnly = true)
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAllByOrderByCategoryNameAsc();
    }

    /**
     * Get product statistics by category
     */
    @Transactional(readOnly = true)
    public List<ProductCategory> getCategoryStats() {
        return productCategoryRepository.findAllByOrderByProductCountDesc();
    }
}