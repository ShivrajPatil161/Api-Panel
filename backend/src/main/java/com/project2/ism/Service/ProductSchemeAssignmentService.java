
package com.project2.ism.Service;

        import com.project2.ism.DTO.ProductSchemeAssignmentDTO;
        import com.project2.ism.Exception.ResourceNotFoundException;

        import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
        import com.project2.ism.Model.PricingScheme.PricingScheme;
        import com.project2.ism.Model.ProductSchemeAssignment;
        import com.project2.ism.Repository.OutwardTransactionRepository;
        import com.project2.ism.Repository.PricingSchemeRepository;
        import com.project2.ism.Repository.ProductSchemeAssignmentRepository;
        import org.springframework.stereotype.Service;

        import java.util.List;
        import java.util.stream.Collectors;

@Service
public class ProductSchemeAssignmentService {

    private final ProductSchemeAssignmentRepository assignmentRepo;
    private final PricingSchemeRepository schemeRepo;
    private final OutwardTransactionRepository outwardRepo;



    public ProductSchemeAssignmentService(ProductSchemeAssignmentRepository assignmentRepo, PricingSchemeRepository schemeRepo, OutwardTransactionRepository outwardRepo) {
        this.assignmentRepo = assignmentRepo;
        this.schemeRepo = schemeRepo;
        this.outwardRepo = outwardRepo;
    }

    public ProductSchemeAssignmentDTO createAssignment(ProductSchemeAssignmentDTO dto) {
        System.out.println(dto.schemeId);
        PricingScheme scheme = schemeRepo.findById(dto.schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));
        OutwardTransactions outward = outwardRepo.findById(dto.outwardId)
                .orElseThrow(() -> new ResourceNotFoundException("Outward transaction not found"));

        ProductSchemeAssignment entity = new ProductSchemeAssignment();
        entity.setScheme(scheme);
        entity.setOutwardTransaction(outward);
        entity.setCustomerType(dto.customerType);
        entity.setCustomerId(dto.customerId);
        entity.setEffectiveDate(dto.effectiveDate);
        entity.setExpiryDate(dto.expiryDate);
        entity.setRemarks(dto.remarks);

        ProductSchemeAssignment saved = assignmentRepo.save(entity);
        dto.id = saved.getId();
        return dto;
    }

    public List<ProductSchemeAssignmentDTO> getAssignmentsByCustomer(Long customerId, String customerType) {
        return assignmentRepo.findByCustomerIdAndCustomerType(customerId, customerType)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ProductSchemeAssignmentDTO toDTO(ProductSchemeAssignment entity) {
        ProductSchemeAssignmentDTO dto = new ProductSchemeAssignmentDTO();
        dto.id = entity.getId();
        dto.schemeId = entity.getScheme().getId();
        dto.outwardId = entity.getOutwardTransaction().getId();
        dto.customerType = entity.getCustomerType();
        dto.customerId = entity.getCustomerId();
        dto.effectiveDate = entity.getEffectiveDate();
        dto.expiryDate = entity.getExpiryDate();
        dto.remarks = entity.getRemarks();
        return dto;
    }

    public List<ProductSchemeAssignmentDTO> getAll() {
        return assignmentRepo.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }


    public ProductSchemeAssignmentDTO updateAssignment(Long id, ProductSchemeAssignmentDTO dto) {
        ProductSchemeAssignment entity = assignmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        PricingScheme scheme = schemeRepo.findById(dto.schemeId)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found"));
        OutwardTransactions outward = outwardRepo.findById(dto.outwardId)
                .orElseThrow(() -> new ResourceNotFoundException("Outward transaction not found"));

        // update existing entity
        entity.setScheme(scheme);
        entity.setOutwardTransaction(outward);
        entity.setCustomerType(dto.customerType);
        entity.setCustomerId(dto.customerId);
        entity.setEffectiveDate(dto.effectiveDate);
        entity.setExpiryDate(dto.expiryDate);
        entity.setRemarks(dto.remarks);

        ProductSchemeAssignment saved = assignmentRepo.save(entity);
        return toDTO(saved);
    }

}
