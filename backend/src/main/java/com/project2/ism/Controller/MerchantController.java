package com.project2.ism.Controller;


import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Service.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/merchants")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @PostMapping
    public ResponseEntity<Merchant> createMerchant(@Valid @RequestBody Merchant merchant) {
        return ResponseEntity.ok(merchantService.createMerchant(merchant));
    }

    @GetMapping
    public ResponseEntity<List<Merchant>> getAllMerchants() {
        return ResponseEntity.ok(merchantService.getAllMerchants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Merchant> getMerchantById(@PathVariable Long id) {
        return ResponseEntity.ok(merchantService.getMerchantById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Merchant> updateMerchant(@PathVariable Long id, @Valid @RequestBody Merchant merchant) {
        return ResponseEntity.ok(merchantService.updateMerchant(id, merchant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMerchant(@PathVariable Long id) {
        merchantService.deleteMerchant(id);
        return ResponseEntity.noContent().build();
    }

    // Extra: Get merchants by Franchise ID
    @GetMapping("/franchise/{franchiseId}")
    public ResponseEntity<List<Merchant>> getMerchantsByFranchise(@PathVariable Long franchiseId) {
        return ResponseEntity.ok(merchantService.getMerchantsByFranchise(franchiseId));
    }
}