package com.project2.ism.Service;

import com.project2.ism.Model.Product;
import com.project2.ism.Model.ProductCategory;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.ProductCategoryRepository;
import com.project2.ism.Repository.VendorRepository;
import com.project2.ism.DTO.ProductDTO;
import com.project2.ism.DTO.VendorIDNameDTO;
import com.project2.ism.DTO.ProductCategoryDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final VendorRepository vendorRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ProductCategoryRepository productCategoryRepository,
                          VendorRepository vendorRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.vendorRepository = vendorRepository;
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        logger.info("Creating new product: {}", productDTO.getProductName());

        Product product = convertToEntity(productDTO);

        if (product.getProductCategory() == null) {
            throw new IllegalArgumentException("Product category is required");
        }

        ProductCategory category = getOrCreateCategory(product.getProductCategory());
        String productCode = generateProductCode(category);

        product.setProductCode(productCode);
        product.setProductCategory(category);

        Product savedProduct = productRepository.save(product);
        logger.info("Product created with ID: {} and code: {}", savedProduct.getId(), savedProduct.getProductCode());

        return mapToDTO(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return mapToDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductByCode(String productCode) {
        Product product = productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productCode));
        return mapToDTO(product);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        logger.info("Updating product with ID: {}", id);

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        updateProductFields(existingProduct, productDTO);

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        ProductCategory category = product.getProductCategory();
        if (category.getProductCount() > 0) {
            category.setProductCount(category.getProductCount() - 1);
            productCategoryRepository.save(category);
        }

        productRepository.deleteById(id);
        logger.info("Product deleted with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.searchProducts(searchTerm, pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorId(vendorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByProductCategoryId(categoryId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByCriteria(Long vendorId, String brand,
                                                  Long categoryId, Pageable pageable) {
        return productRepository.findProductsByCriteria(vendorId, categoryId, pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public boolean productCodeExists(String productCode) {
        return productRepository.existsByProductCode(productCode);
    }

    @Transactional(readOnly = true)
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAllByOrderByCategoryNameAsc();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProductStats() {
        List<ProductCategory> categories = getAllCategories();
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByStatus(true);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("activeProducts", activeProducts);
        stats.put("inactiveProducts", totalProducts - activeProducts);
        stats.put("totalCategories", categories.size());
        stats.put("categoryBreakdown", categories);

        return stats;
    }

    // Private helper methods

    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductName(dto.getProductName());

        // Handle vendor
        if (dto.getVendor() != null && dto.getVendor().getId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendor().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor", dto.getVendor().getId()));
            product.setVendor(vendor);
        }

        // Handle category
        if (dto.getCategory() != null) {
            if (dto.getCategory().getProductCategoryId() != null) {
                // Use existing category by ID
                ProductCategory category = productCategoryRepository.findById(dto.getCategory().getProductCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException("ProductCategory", dto.getCategory().getProductCategoryId()));
                product.setProductCategory(category);
            } else if (StringUtils.hasText(dto.getCategory().getProductCategoryName())) {
                // Create temporary category for processing (will be handled in getOrCreateCategory)
                ProductCategory tempCategory = new ProductCategory();
                tempCategory.setCategoryName(dto.getCategory().getProductCategoryName());
                product.setProductCategory(tempCategory);
            }
        } else {
            // This should not happen if frontend sends proper data, but let's be safe
            throw new IllegalArgumentException("Product category information is missing");
        }


        product.setDescription(dto.getDescription());

        product.setStatus(dto.isStatus());

        product.setRemarks(dto.getRemarks());

        return product;
    }

    private ProductDTO mapToDTO(Product product) {
        VendorIDNameDTO vendorDTO = null;
        if (product.getVendor() != null) {
            vendorDTO = new VendorIDNameDTO(product.getVendor().getId(), product.getVendor().getName());
        }

        ProductCategoryDTO categoryDTO = null;
        if (product.getProductCategory() != null) {
            categoryDTO = new ProductCategoryDTO(
                    product.getProductCategory().getId(),
                    product.getProductCategory().getCategoryName()
            );
        }

        return new ProductDTO(
                product.getId(),
                product.getProductName(),
                product.getProductCode(),
                vendorDTO,
                categoryDTO,

                product.getDescription(),

                product.getStatus(),

                product.getRemarks()
        );
    }

    private void updateProductFields(Product product, ProductDTO dto) {
        if (StringUtils.hasText(dto.getProductName())) {
            product.setProductName(dto.getProductName());
        }

        if (dto.getVendor() != null && dto.getVendor().getId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendor().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor", dto.getVendor().getId()));
            product.setVendor(vendor);
        }


        if (StringUtils.hasText(dto.getDescription())) {
            product.setDescription(dto.getDescription());
        }



        product.setStatus(dto.isStatus());

        if (StringUtils.hasText(dto.getRemarks())) {
            product.setRemarks(dto.getRemarks());
        }
    }

    private ProductCategory getOrCreateCategory(ProductCategory inputCategory) {
        return productCategoryRepository.findByCategoryNameIgnoreCase(inputCategory.getCategoryName())
                .map(existingCategory -> {
                    existingCategory.setProductCount(existingCategory.getProductCount() + 1);
                    return productCategoryRepository.save(existingCategory);
                })
                .orElseGet(() -> {
                    Integer newCategoryCode = productCategoryRepository.findTopByOrderByCategoryCodeDesc()
                            .map(lastCategory -> lastCategory.getCategoryCode() + 100)
                            .orElse(101);

                    ProductCategory newCategory = new ProductCategory();
                    newCategory.setCategoryName(inputCategory.getCategoryName().toUpperCase());
                    newCategory.setCategoryCode(newCategoryCode);
                    newCategory.setProductCount(1);

                    return productCategoryRepository.save(newCategory);
                });
    }

    private String generateProductCode(ProductCategory category) {
        String categoryName = category.getCategoryName().trim();
        String shortCode;

        // Split by whitespace
        String[] words = categoryName.split("\\s+");

        if (words.length > 1) {
            // Multi-word category → take first letter of each
            StringBuilder initials = new StringBuilder();
            for (String word : words) {
                if (!word.isEmpty()) {
                    initials.append(Character.toUpperCase(word.charAt(0)));
                }
            }
            shortCode = initials.toString();
        } else {
            // Single word → check if already short form (all uppercase and <= 4 letters)
            if (categoryName.equals(categoryName.toUpperCase()) && categoryName.length() <= 4) {
                shortCode = categoryName; // already short form like POS, QR
            } else {
                // Otherwise take first 2 or 3 letters and uppercase them
                shortCode = categoryName.substring(0, Math.min(3, categoryName.length())).toUpperCase();
            }
        }

        return String.format("%s-%d-%d",
                shortCode,
                category.getCategoryCode(),
                category.getProductCount()
        );
    }

}