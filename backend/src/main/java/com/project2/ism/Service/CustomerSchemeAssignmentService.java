package com.project2.ism.Service;

import com.project2.ism.DTO.CustomerSchemeAssignmentDTO;
import com.project2.ism.DTO.SchemeGroupedResponseDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.CustomerSchemeAssignment;
import com.project2.ism.Model.PricingScheme.PricingScheme;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomerSchemeAssignmentService {

    private final CustomerSchemeAssignmentRepository assignmentRepo;
    private final PricingSchemeRepository schemeRepo;
    private final ProductRepository productRepository;
    private final FranchiseRepository franchiseRepository;
    private final MerchantRepository merchantRepository;

    public CustomerSchemeAssignmentService(
            CustomerSchemeAssignmentRepository assignmentRepo,
            PricingSchemeRepository schemeRepo,
            ProductRepository productRepository,
            FranchiseRepository franchiseRepository,
            MerchantRepository merchantRepository) {
        this.assignmentRepo = assignmentRepo;
        this.schemeRepo = schemeRepo;
        this.productRepository = productRepository;
        this.franchiseRepository = franchiseRepository;
        this.merchantRepository = merchantRepository;
    }

    public CustomerSchemeAssignmentDTO createAssignment(CustomerSchemeAssignmentDTO dto) {
        PricingScheme scheme = schemeRepo.findById(dto.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CustomerSchemeAssignment entity = new CustomerSchemeAssignment();
        entity.setScheme(scheme);
        entity.setProduct(product);
        entity.setCustomerType(dto.getCustomerType());
        entity.setEffectiveDate(dto.getEffectiveDate());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setRemarks(dto.getRemarks());

        // Set either franchise or merchant based on customer type
        if ("FRANCHISE".equalsIgnoreCase(dto.getCustomerType()) && dto.getCustomerId() != null) {
            Franchise franchise = franchiseRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Franchise not found"));
            entity.setFranchise(franchise);
        } else if ("MERCHANT".equalsIgnoreCase(dto.getCustomerType()) && dto.getCustomerId() != null) {
            Merchant merchant = merchantRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
            entity.setMerchant(merchant);
        }

        CustomerSchemeAssignment saved = assignmentRepo.save(entity);
        return toDTO(saved);
    }


    public List<CustomerSchemeAssignmentDTO> getAssignmentsByCustomer(Long customerId, String customerType) {
        List<CustomerSchemeAssignment> assignments;

        if ("FRANCHISE".equals(customerType)) {
            assignments = assignmentRepo.findByFranchiseId(customerId);
        } else if ("MERCHANT".equals(customerType)) {
            assignments = assignmentRepo.findByMerchantId(customerId);
        } else {
            throw new IllegalArgumentException("Invalid customer type: " + customerType);
        }

        return assignments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerSchemeAssignmentDTO> getAll() {
        return assignmentRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SchemeGroupedResponseDTO> getAllGroupedByScheme() {
        List<PricingScheme> allSchemes = schemeRepo.findAll();
        Map<Long, List<CustomerSchemeAssignment>> assignmentsByScheme =
                assignmentRepo.findAll().stream()
                        .collect(Collectors.groupingBy(a -> a.getScheme().getId()));

        return allSchemes.stream()
                .map(scheme -> {
                    SchemeGroupedResponseDTO dto = new SchemeGroupedResponseDTO();
                    dto.setSchemeCode(scheme.getSchemeCode());
                    dto.setDescription(scheme.getDescription());
                    dto.setCustomerType(scheme.getCustomerType());
                    dto.setRentalByMonth(scheme.getRentalByMonth());

                    List<CustomerSchemeAssignment> assignments =
                            assignmentsByScheme.getOrDefault(scheme.getId(), Collections.emptyList());
                    dto.setAssignments(assignments.stream()
                            .map(this::toDTO)
                            .collect(Collectors.toList()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public CustomerSchemeAssignmentDTO updateAssignment(Long id, CustomerSchemeAssignmentDTO dto) {
        CustomerSchemeAssignment entity = assignmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        PricingScheme scheme = schemeRepo.findById(dto.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Update entity fields
        entity.setScheme(scheme);
        entity.setProduct(product);
        entity.setCustomerType(dto.getCustomerType());
        entity.setEffectiveDate(dto.getEffectiveDate());
        entity.setExpiryDate(dto.getExpiryDate());
        entity.setRemarks(dto.getRemarks());

        // Clear existing customer assignments
        entity.setFranchise(null);
        entity.setMerchant(null);

        // Set new customer assignment
        if ("FRANCHISE".equals(dto.getCustomerType()) && dto.getCustomerId() != null) {
            Franchise franchise = franchiseRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Franchise not found"));
            entity.setFranchise(franchise);
        } else if ("MERCHANT".equals(dto.getCustomerType()) && dto.getCustomerId() != null) {
            Merchant merchant = merchantRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
            entity.setMerchant(merchant);
        }

        CustomerSchemeAssignment saved = assignmentRepo.save(entity);
        return toDTO(saved);
    }

    public void deleteAssignment(Long id) {
        CustomerSchemeAssignment entity = assignmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        assignmentRepo.delete(entity);
    }

    private CustomerSchemeAssignmentDTO toDTO(CustomerSchemeAssignment entity) {
        CustomerSchemeAssignmentDTO dto = new CustomerSchemeAssignmentDTO();
        dto.setId(entity.getId());
        dto.setSchemeId(entity.getScheme().getId());
        dto.setSchemeCode(entity.getScheme().getSchemeCode());
        dto.setProductId(entity.getProduct().getId());
        dto.setProductName(entity.getProduct().getProductName());
        dto.setCustomerType(entity.getCustomerType());
        dto.setEffectiveDate(entity.getEffectiveDate());
        dto.setExpiryDate(entity.getExpiryDate());
        dto.setRemarks(entity.getRemarks());

        // Set customer ID and name based on type
        if ("FRANCHISE".equalsIgnoreCase(entity.getCustomerType()) && entity.getFranchise() != null) {
            dto.setCustomerId(entity.getFranchise().getId());
            dto.setCustomerName(entity.getFranchise().getFranchiseName());
        } else if ("MERCHANT".equalsIgnoreCase(entity.getCustomerType()) && entity.getMerchant() != null) {
            dto.setCustomerId(entity.getMerchant().getId());
            dto.setCustomerName(entity.getMerchant().getBusinessName());
        }

        return dto;
    }
}