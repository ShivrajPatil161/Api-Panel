package com.project2.ism.Controller;

import com.project2.ism.DTO.ReportDTO.ApiResponse;
import com.project2.ism.DTO.Vendor.VendorCredentialsDTO;
import com.project2.ism.Service.VendorCredentialService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
@RestController
@RequestMapping("/vendor-credential")
public class VendorCredentialController {

    private final VendorCredentialService vendorCredentialService;

    public VendorCredentialController(VendorCredentialService vendorCredentialService) {
        this.vendorCredentialService = vendorCredentialService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VendorCredentialsDTO>> create(@RequestBody VendorCredentialsDTO dto) {
        VendorCredentialsDTO saved = vendorCredentialService.create(dto);
        ApiResponse<VendorCredentialsDTO> response = new ApiResponse<>(
                true, "Vendor credential created successfully", saved, null, LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorCredentialsDTO>> update(
            @PathVariable Long id,
            @RequestBody VendorCredentialsDTO dto
    ) {
        VendorCredentialsDTO updated = vendorCredentialService.update(id, dto);
        ApiResponse<VendorCredentialsDTO> response = new ApiResponse<>(
                true, "Vendor credential updated successfully", updated, null, LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        vendorCredentialService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>(
                true, "Vendor credential deleted successfully", null, null, LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorCredentialsDTO>>> getVendorCredentials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder
    ) {
        Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<VendorCredentialsDTO> pageResult = vendorCredentialService.getAll(pageable);

        ApiResponse<Page<VendorCredentialsDTO>> response = new ApiResponse<>(
                true, "Vendor credentials fetched successfully", pageResult, null, LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorCredentialsDTO>> getById(@PathVariable Long id) {
        VendorCredentialsDTO dto = vendorCredentialService.getById(id);
        ApiResponse<VendorCredentialsDTO> response = new ApiResponse<>(
                true, "Vendor credential fetched successfully", dto, null, LocalDateTime.now()
        );
        return ResponseEntity.ok(response);
    }
}