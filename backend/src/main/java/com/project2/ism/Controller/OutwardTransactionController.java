package com.project2.ism.Controller;


import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Service.OutwardTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/outward-transactions")
public class OutwardTransactionController {

    private final OutwardTransactionService service;

    public OutwardTransactionController(OutwardTransactionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OutwardTransactions>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutwardTransactions> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<OutwardTransactions> create(@Valid @RequestBody OutwardTransactions outwardTransactions) {
        return ResponseEntity.ok(service.create(outwardTransactions));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OutwardTransactions> update(@PathVariable Long id,
                                                      @Valid @RequestBody OutwardTransactions outwardTransactions) {
        return ResponseEntity.ok(service.update(id, outwardTransactions));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}