package com.project2.ism.Controller;

import com.project2.ism.DTO.TransactionUploadRequest;
import com.project2.ism.Model.Transaction;
import com.project2.ism.Service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @PostMapping("/bulk")
    public ResponseEntity<String> uploadTransactions(@RequestBody TransactionUploadRequest request) {
        // Optional: validate/normalize date/number fields here before saving
        transactionService.saveAll(request.getTransactions());
        return ResponseEntity.ok("Saved " + request.getTransactions().size()
                + " transactions for vendor=" + request.getVendorName()
                + ", product=" + request.getProduct());
    }


    // Get all
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
