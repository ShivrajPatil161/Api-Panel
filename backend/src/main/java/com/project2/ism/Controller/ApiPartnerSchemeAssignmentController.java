package com.project2.ism.Controller;

import com.project2.ism.DTO.ApiPartnerDTO.ApiPartnerSchemeAssignmentDTO;
import com.project2.ism.DTO.SchemeGroupedResponseDTO;
import com.project2.ism.Service.ApiPartnerSchemeAssignmentService;
import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/partner-schemes")
public class ApiPartnerSchemeAssignmentController {

    private final ApiPartnerSchemeAssignmentService assignmentService;



    public ApiPartnerSchemeAssignmentController(ApiPartnerSchemeAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<ApiPartnerSchemeAssignmentDTO> create(@RequestBody ApiPartnerSchemeAssignmentDTO dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

//    @GetMapping
//    public ResponseEntity<List<CustomerSchemeAssignmentDTO>> getALL() {
//        return ResponseEntity.ok(assignmentService.getAll());
//    }

    @GetMapping
    public ResponseEntity<List<SchemeGroupedResponseDTO>> getALL() {
        return ResponseEntity.ok(assignmentService.getAllGroupedByScheme());
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiPartnerSchemeAssignmentDTO> update(
            @PathVariable Long id,
            @RequestBody ApiPartnerSchemeAssignmentDTO dto
    ) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, dto));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }



//----------------------------------For ProductScheme Reports------------------------------------------------

//
//    /**
//     * Get all scheme assignments with complete details for product report
//     */
//    @GetMapping("/report/all")
//    public ResponseEntity<List<ProductSchemeReportDTO>> getAllForReport() {
//        return ResponseEntity.ok(assignmentService.getAllSchemeAssignmentsForReport());
//    }
//
//    /**
//     * Get filtered scheme assignments for product report
//     */
//    @GetMapping("/report/filtered")
//    public ResponseEntity<List<ProductSchemeReportDTO>> getFilteredForReport(
//            @RequestParam(required = false) String customerType,
//            @RequestParam(required = false) Long productId,
//            @RequestParam(required = false) Long schemeId,
//            @RequestParam(required = false) Long categoryId,
//            @RequestParam(required = false) Boolean activeOnly
//    ) {
//        return ResponseEntity.ok(assignmentService.getFilteredSchemeAssignmentsForReport(
//                customerType, productId, schemeId, categoryId, activeOnly
//        ));
//    }
//
//    /**
//     * Get scheme assignments by customer type for report
//     */
//    @GetMapping("/report/customer-type/{customerType}")
//    public ResponseEntity<List<ProductSchemeReportDTO>> getByCustomerTypeForReport(
//            @PathVariable String customerType
//    ) {
//        return ResponseEntity.ok(assignmentService.getSchemeAssignmentsByCustomerTypeForReport(customerType));
//    }
//
//    /**
//     * Get scheme assignments by product for report
//     */
//    @GetMapping("/report/product/{productId}")
//    public ResponseEntity<List<ProductSchemeReportDTO>> getByProductForReport(
//            @PathVariable Long productId
//    ) {
//        return ResponseEntity.ok(assignmentService.getSchemeAssignmentsByProductForReport(productId));
//    }
//
//    /**
//     * Get active scheme assignments for report
//     */
//    @GetMapping("/report/active")
//    public ResponseEntity<List<ProductSchemeReportDTO>> getActiveForReport() {
//        return ResponseEntity.ok(assignmentService.getActiveSchemeAssignmentsForReport());
//    }
}
