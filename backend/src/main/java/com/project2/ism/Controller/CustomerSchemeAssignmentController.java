package com.project2.ism.Controller;

import com.project2.ism.DTO.CustomerSchemeAssignmentDTO;
import com.project2.ism.DTO.SchemeGroupedResponseDTO;
import com.project2.ism.Service.CustomerSchemeAssignmentService;
import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/outward-schemes")
public class CustomerSchemeAssignmentController {

    private final CustomerSchemeAssignmentService assignmentService;



    public CustomerSchemeAssignmentController(CustomerSchemeAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<CustomerSchemeAssignmentDTO> create(@RequestBody CustomerSchemeAssignmentDTO dto) {
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
    @GetMapping("/customer/{type}/{id}")
    public ResponseEntity<List<CustomerSchemeAssignmentDTO>> getByCustomer(
            @PathVariable String type,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCustomer(id, type.toUpperCase()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerSchemeAssignmentDTO> update(
            @PathVariable Long id,
            @RequestBody CustomerSchemeAssignmentDTO dto
    ) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, dto));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
