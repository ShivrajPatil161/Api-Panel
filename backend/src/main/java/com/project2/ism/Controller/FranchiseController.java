package com.project2.ism.Controller;


import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Service.FranchiseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/franchise")
public class FranchiseController {

    private final FranchiseService franchiseService;

    public FranchiseController(FranchiseService franchiseService) {
        this.franchiseService = franchiseService;
    }

    @PostMapping
    public ResponseEntity<Franchise> createFranchise(@Valid @RequestBody Franchise franchise) {
        return ResponseEntity.ok(franchiseService.createFranchise(franchise));
    }

    @GetMapping
    public ResponseEntity<List<Franchise>> getAllFranchises() {
        return ResponseEntity.ok(franchiseService.getAllFranchises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Franchise> getFranchiseById(@PathVariable Long id) {
        return ResponseEntity.ok(franchiseService.getFranchiseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Franchise> updateFranchise(@PathVariable Long id,
                                                     @Valid @RequestBody Franchise franchise) {
        return ResponseEntity.ok(franchiseService.updateFranchise(id, franchise));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFranchise(@PathVariable Long id) {
        franchiseService.deleteFranchise(id);
        return ResponseEntity.noContent().build();
    }
}