package com.project2.ism.Controller;


import com.project2.ism.DTO.PartnerCredentialDTO;
import com.project2.ism.Service.ApiPartnerCredentialsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/partner-credentials")
public class ApiPartnerCredentialsController {

    private final ApiPartnerCredentialsService credentialsService;

    public ApiPartnerCredentialsController(ApiPartnerCredentialsService credentialsService) {
        this.credentialsService = credentialsService;
    }

    // 🔹 Create
    @PostMapping
    public ResponseEntity<PartnerCredentialDTO> create(@RequestBody PartnerCredentialDTO dto) {
        PartnerCredentialDTO created = credentialsService.create(dto);
        return ResponseEntity.ok(created);
    }

    // 🔹 Get All
    @GetMapping
    public ResponseEntity<List<PartnerCredentialDTO>> getAll() {
        return ResponseEntity.ok(credentialsService.getAll());
    }

    // 🔹 Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<PartnerCredentialDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(credentialsService.getById(id));
    }

    // 🔹 Update
    @PutMapping("/{id}")
    public ResponseEntity<PartnerCredentialDTO> update(
            @PathVariable Long id,
            @RequestBody PartnerCredentialDTO dto) {
        PartnerCredentialDTO updated = credentialsService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        credentialsService.delete(id);
        return ResponseEntity.ok("Partner Credential deleted successfully.");
    }
}
