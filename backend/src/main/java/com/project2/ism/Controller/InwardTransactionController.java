package com.project2.ism.Controller;


import com.project2.ism.Model.InventoryTransactions.InwardTransactions;
import com.project2.ism.Service.InwardTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inward-transactions")
public class InwardTransactionController {

    private final InwardTransactionService inwardService;

    public InwardTransactionController(InwardTransactionService inwardService) {
        this.inwardService = inwardService;
    }

    @PostMapping
    public ResponseEntity<InwardTransactions> create(@RequestBody InwardTransactions inward) {
        return ResponseEntity.ok(inwardService.createTransaction(inward));
    }

    @GetMapping
    public ResponseEntity<List<InwardTransactions>> getAll() {
        return ResponseEntity.ok(inwardService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InwardTransactions> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inwardService.getTransaction(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InwardTransactions> update(@PathVariable Long id, @RequestBody InwardTransactions inward) {
        return ResponseEntity.ok(inwardService.updateTransaction(id, inward));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inwardService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}