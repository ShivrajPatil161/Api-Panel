package com.project2.ism.Controller;

import com.project2.ism.DTO.ProductSchemeAssignmentDTO;
import com.project2.ism.Service.ProductSchemeAssignmentService;
import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/outward-schemes")
public class ProductSchemeAssignmentController {

    private final ProductSchemeAssignmentService assignmentService;



    public ProductSchemeAssignmentController(ProductSchemeAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<ProductSchemeAssignmentDTO> create(@RequestBody ProductSchemeAssignmentDTO dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProductSchemeAssignmentDTO>> getALL() {
        return ResponseEntity.ok(assignmentService.getAll());
    }

    @GetMapping("/customer/{type}/{id}")
    public ResponseEntity<List<ProductSchemeAssignmentDTO>> getByCustomer(
            @PathVariable String type,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCustomer(id, type.toUpperCase()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductSchemeAssignmentDTO> update(
            @PathVariable Long id,
            @RequestBody ProductSchemeAssignmentDTO dto
    ) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, dto));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
