package com.project2.ism.Controller;



import com.project2.ism.DTO.FranchiseInwardDTO;
import com.project2.ism.DTO.OutwardTransactionDTO;
import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Service.OutwardTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/outward-transactions")
public class OutwardTransactionController {

    private final OutwardTransactionService service;

    public OutwardTransactionController(OutwardTransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OutwardTransactionDTO>> getAll() {
        List<OutwardTransactions> entities = service.getAll();
        List<OutwardTransactionDTO> dtoList = entities.stream()
                .map(OutwardTransactionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutwardTransactionDTO> getById(@PathVariable Long id) {
        OutwardTransactions entity = service.getById(id);
        return ResponseEntity.ok(OutwardTransactionDTO.fromEntity(entity));
    }

    @PostMapping
    public ResponseEntity<OutwardTransactionDTO> create(@Valid @RequestBody OutwardTransactionDTO outwardDTO) {
        OutwardTransactions savedEntity = service.createFromDTO(outwardDTO);
        return ResponseEntity.ok(OutwardTransactionDTO.fromEntity(savedEntity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OutwardTransactionDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody OutwardTransactionDTO outwardDTO
    ) {
        OutwardTransactions updatedEntity = service.updateFromDTO(id, outwardDTO);
        return ResponseEntity.ok(OutwardTransactionDTO.fromEntity(updatedEntity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{outwardId}/received")
    public ResponseEntity<?> updateReceivedDate(@PathVariable Long outwardId){
        service.receivedDateService(outwardId);
        return ResponseEntity.ok("Outward Transaction "+ outwardId + " marked as received.");
    }

    @GetMapping("/franchise/{franchiseId}")
    public ResponseEntity<List<FranchiseInwardDTO>> getFranchiseInward(@PathVariable Long franchiseId) {
        return ResponseEntity.ok(service.getFranchiseInward(franchiseId));
    }
}