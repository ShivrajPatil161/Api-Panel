package com.project2.ism.Service;

import com.project2.ism.DTO.ApiPartnerProductsDTO;
import com.project2.ism.DTO.ApiPartnerSchemeAssignmentDTO;
import com.project2.ism.DTO.ProductSchemeReportDTO;
import com.project2.ism.DTO.SchemeGroupedResponseDTO;
import com.project2.ism.Exception.DuplicateResourceException;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ApiPartnerSchemeAssignment;
import com.project2.ism.Model.PricingScheme.PricingScheme;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApiPartnerSchemeAssignmentService {

    private final ApiPartnerSchemeAssignmentRepository assignmentRepo;
    private final PricingSchemeRepository schemeRepo;
    private final ProductRepository productRepository;
    private final ApiPartnerRepository apiPartnerRepository;

    public ApiPartnerSchemeAssignmentService(
            ApiPartnerSchemeAssignmentRepository assignmentRepo,
            PricingSchemeRepository schemeRepo,
            ProductRepository productRepository, ApiPartnerRepository apiPartnerRepository) {
        this.assignmentRepo = assignmentRepo;
        this.schemeRepo = schemeRepo;
        this.productRepository = productRepository;
        this.apiPartnerRepository = apiPartnerRepository;

    }

    public ApiPartnerSchemeAssignmentDTO createAssignment(ApiPartnerSchemeAssignmentDTO dto) {
        PricingScheme scheme = schemeRepo.findById(dto.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Long apiPartnerId = dto.getApiPartnerId();


        // 🔍 Check for overlaps before assigning
        List<ApiPartnerSchemeAssignment> overlaps = assignmentRepo.findOverlappingAssignments(
                apiPartnerId,
                product.getId(),
                dto.getEffectiveDate(),
                dto.getExpiryDate()
        );

        if (!overlaps.isEmpty()) {
            throw new DuplicateResourceException("Customer already has a scheme assigned for this product during the given period.");
        }


        ApiPartnerSchemeAssignment entity = new ApiPartnerSchemeAssignment();
        entity.setScheme(scheme);
        entity.setProduct(product);
        entity.setEffectiveDate(dto.getEffectiveDate());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setRemarks(dto.getRemarks());

            ApiPartner apiPartner = apiPartnerRepository.findById(dto.getApiPartnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Api Partner not found"));
            entity.setApiPartner(apiPartner);


        ApiPartnerSchemeAssignment saved = assignmentRepo.save(entity);
        return toDTO(saved);
    }


    public List<ApiPartnerSchemeAssignmentDTO> getAssignmentsByApiPartner(Long apiPartnerId) {
        List<ApiPartnerSchemeAssignment> assignments = assignmentRepo.findByApiPartnerId(apiPartnerId);

        return assignments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ApiPartnerSchemeAssignmentDTO> getAll() {
        return assignmentRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SchemeGroupedResponseDTO> getAllGroupedByScheme() {
        List<PricingScheme> allSchemes = schemeRepo.findAll();
        Map<Long, List<ApiPartnerSchemeAssignment>> assignmentsByScheme =
                assignmentRepo.findAll().stream()
                        .collect(Collectors.groupingBy(a -> a.getScheme().getId()));

        return allSchemes.stream()
                .map(scheme -> {
                    SchemeGroupedResponseDTO dto = new SchemeGroupedResponseDTO();
                    dto.setSchemeCode(scheme.getSchemeCode());
                    dto.setDescription(scheme.getDescription());
                    dto.setRentalByMonth(scheme.getRentalByMonth());

                    List<ApiPartnerSchemeAssignment> assignments =
                            assignmentsByScheme.getOrDefault(scheme.getId(), Collections.emptyList());
                    dto.setAssignments(assignments.stream()
                            .map(this::toDTO)
                            .collect(Collectors.toList()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ApiPartnerSchemeAssignmentDTO updateAssignment(Long id, ApiPartnerSchemeAssignmentDTO dto) {
        ApiPartnerSchemeAssignment entity = assignmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        PricingScheme scheme = schemeRepo.findById(dto.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Update entity fields
        entity.setScheme(scheme);
        entity.setProduct(product);
        entity.setEffectiveDate(dto.getEffectiveDate());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setRemarks(dto.getRemarks());
        entity.setApiPartner(null);

        ApiPartner apiPartner = apiPartnerRepository.findById(dto.getApiPartnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Api partner not found"));
            entity.setApiPartner(apiPartner);


        ApiPartnerSchemeAssignment saved = assignmentRepo.save(entity);
        return toDTO(saved);
    }

    public void deleteAssignment(Long id) {
        ApiPartnerSchemeAssignment entity = assignmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        assignmentRepo.delete(entity);
    }

    public List<ApiPartnerSchemeAssignmentDTO> getTop5ExpiryDateForDashboard(){
        return assignmentRepo.findTop5ByExpiryDateGreaterThanEqualOrderByExpiryDateAsc(LocalDate.now())
                .stream()
                .map(this::toDTO)
                .toList();

    }

    public List<ApiPartnerProductsDTO> getAllProductsOfApiPartner(Long apiPartnerId){
        return assignmentRepo.findAllProductByApiPartnerId(apiPartnerId);
    }


    private ApiPartnerSchemeAssignmentDTO toDTO(ApiPartnerSchemeAssignment entity) {
        ApiPartnerSchemeAssignmentDTO dto = new ApiPartnerSchemeAssignmentDTO();
        dto.setId(entity.getId());
        dto.setSchemeId(entity.getScheme().getId());
        dto.setSchemeCode(entity.getScheme().getSchemeCode());
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getProductName());
        dto.setEffectiveDate(entity.getEffectiveDate());
        dto.setExpiryDate(entity.getExpiryDate());
        dto.setRemarks(entity.getRemarks());
        dto.setApiPartnerId(entity.getApiPartner().getId());
        dto.setApiPartnerName(entity.getApiPartner().getBusinessName());


        return dto;
    }


//----------------------------------For ProductScheme Reports------------------------------------------------


//
//    // Add these methods to the existing CustomerSchemeAssignmentService class
//
//    /**
//     * Get all scheme assignments with complete product and customer details for reporting
//     */
//    public List<ProductSchemeReportDTO> getAllSchemeAssignmentsForReport() {
//        List<CustomerSchemeAssignment> assignments = assignmentRepo.findAllWithCompleteDetails();
//        return assignments.stream()
//                .map(this::toProductSchemeReportDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Get filtered scheme assignments for reporting
//     */
//    public List<ProductSchemeReportDTO> getFilteredSchemeAssignmentsForReport(
//            String customerType,
//            Long productId,
//            Long schemeId,
//            Long categoryId,
//            Boolean activeOnly) {
//
//        LocalDate currentDate = LocalDate.now();
//        boolean active = activeOnly != null && activeOnly;
//
//        List<CustomerSchemeAssignment> assignments = assignmentRepo.findAllWithCompleteDetailsFiltered(
//                customerType,
//                productId,
//                schemeId,
//                categoryId,
//                active,
//                currentDate
//        );
//
//        return assignments.stream()
//                .map(this::toProductSchemeReportDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Get scheme assignments by customer type for reporting
//     */
//    public List<ProductSchemeReportDTO> getSchemeAssignmentsByCustomerTypeForReport(String customerType) {
//        List<CustomerSchemeAssignment> assignments =
//                assignmentRepo.findAllWithCompleteDetailsByCustomerType(customerType);
//        return assignments.stream()
//                .map(this::toProductSchemeReportDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Get scheme assignments by product for reporting
//     */
//    public List<ProductSchemeReportDTO> getSchemeAssignmentsByProductForReport(Long productId) {
//        List<CustomerSchemeAssignment> assignments =
//                assignmentRepo.findAllWithCompleteDetailsByProduct(productId);
//        return assignments.stream()
//                .map(this::toProductSchemeReportDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Get active scheme assignments for reporting
//     */
//    public List<ProductSchemeReportDTO> getActiveSchemeAssignmentsForReport() {
//        LocalDate currentDate = LocalDate.now();
//        List<CustomerSchemeAssignment> assignments =
//                assignmentRepo.findAllActiveWithCompleteDetails(currentDate);
//        return assignments.stream()
//                .map(this::toProductSchemeReportDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * Convert CustomerSchemeAssignment entity to ProductSchemeReportDTO
//     */
//    private ProductSchemeReportDTO toProductSchemeReportDTO(CustomerSchemeAssignment entity) {
//        ProductSchemeReportDTO dto = new ProductSchemeReportDTO();
//
//        // Assignment details
//        dto.setAssignmentId(entity.getId());
//        dto.setEffectiveDate(entity.getEffectiveDate());
//        dto.setExpiryDate(entity.getExpiryDate());
//        dto.setRemarks(entity.getRemarks());
//        dto.setCreatedAt(entity.getCreatedAt());
//        dto.setUpdatedAt(entity.getUpdatedAt());
//
//        // Check if assignment is active
//        LocalDate now = LocalDate.now();
//        boolean isActive = entity.getEffectiveDate() != null &&
//                !entity.getEffectiveDate().isAfter(now) &&
//                (entity.getExpiryDate() == null || !entity.getExpiryDate().isBefore(now));
//        dto.setActive(isActive);
//
//        // Scheme details
//        if (entity.getScheme() != null) {
//            dto.setSchemeId(entity.getScheme().getId());
//            dto.setSchemeCode(entity.getScheme().getSchemeCode());
//            dto.setSchemeDescription(entity.getScheme().getDescription());
//            dto.setRentalByMonth(entity.getScheme().getRentalByMonth());
//            dto.setSchemeCustomerType(entity.getScheme().getCustomerType());
//        }
//
//        // Product details
//        if (entity.getProduct() != null) {
//            dto.setProductId(entity.getProduct().getId());
//            dto.setProductCode(entity.getProduct().getProductCode());
//            dto.setProductName(entity.getProduct().getProductName());
//            dto.setProductModel(entity.getProduct().getModel());
//            dto.setProductBrand(entity.getProduct().getBrand());
//            dto.setProductDescription(entity.getProduct().getDescription());
//            dto.setWarrantyPeriod(entity.getProduct().getWarrantyPeriod());
//            dto.setWarrantyType(entity.getProduct().getWarrantyType());
//            dto.setHsn(entity.getProduct().getHsn());
//            dto.setProductStatus(entity.getProduct().getStatus());
//            dto.setMinOrderQuantity(entity.getProduct().getMinOrderQuantity());
//            dto.setMaxOrderQuantity(entity.getProduct().getMaxOrderQuantity());
//
//            // Product Category details
//            if (entity.getProduct().getProductCategory() != null) {
//                dto.setCategoryId(entity.getProduct().getProductCategory().getId());
//                dto.setCategoryName(entity.getProduct().getProductCategory().getCategoryName());
//                dto.setCategoryCode(entity.getProduct().getProductCategory().getCategoryCode());
//            }
//
//            // Vendor details
//            if (entity.getProduct().getVendor() != null) {
//                dto.setVendorId(entity.getProduct().getVendor().getId());
//                dto.setVendorName(entity.getProduct().getVendor().getName());
//            }
//        }
//
//        // Customer details
//        dto.setCustomerType(entity.getCustomerType());
//
//        if ("FRANCHISE".equalsIgnoreCase(entity.getCustomerType()) && entity.getFranchise() != null) {
//            dto.setPartnerId(entity.getFranchise().getId());
//            dto.setCustomerName(entity.getFranchise().getFranchiseName());
//            dto.setFranchiseAddress(entity.getFranchise().getAddress());
//            dto.setFranchiseContact(entity.getFranchise().getContactPerson().getPhoneNumber());
//        } else if ("MERCHANT".equalsIgnoreCase(entity.getCustomerType()) && entity.getApiPartner() != null) {
//            dto.setPartnerId(entity.getApiPartner().getId());
//            dto.setCustomerName(entity.getApiPartner().getBusinessName());
//            dto.setMerchantBusinessName(entity.getApiPartner().getBusinessName());
//            dto.setMerchantAddress(entity.getApiPartner().getAddress());
//            dto.setMerchantContact(entity.getApiPartner().getContactPerson().getPhoneNumber());
//        }
//
//        return dto;
//    }
}