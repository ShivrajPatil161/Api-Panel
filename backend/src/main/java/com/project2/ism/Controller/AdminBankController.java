package com.project2.ism.Controller;


import com.project2.ism.DTO.AdminDTO.AdminBankDTO;
import com.project2.ism.Service.AdminBankService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin-banks")
public class AdminBankController {
    private final AdminBankService adminBankService;

    @Autowired
    public AdminBankController(AdminBankService adminBankService) {
        this.adminBankService = adminBankService;
    }

    // Create new bank
    @PostMapping
    public ResponseEntity<?> createBank(@Valid @RequestBody AdminBankDTO bankDTO) {
        try {
            AdminBankDTO createdBank = adminBankService.createBank(bankDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createSuccessResponse("Bank created successfully", createdBank));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to create bank"));
        }
    }

    // Get bank by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBankById(@PathVariable Long id) {
        try {
            AdminBankDTO bank = adminBankService.getBankById(id);
            return ResponseEntity.ok(createSuccessResponse("Bank retrieved successfully", bank));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to retrieve bank"));
        }
    }

    // Get all banks with pagination and sorting
    @GetMapping
    public ResponseEntity<?> getAllBanks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        try {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<AdminBankDTO> banks = adminBankService.getAllBanks(pageable);
            return ResponseEntity.ok(createPageResponse("Banks retrieved successfully", banks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to retrieve banks"));
        }
    }

    // Update bank
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBank(@PathVariable Long id, @Valid @RequestBody AdminBankDTO bankDTO) {
        try {
            AdminBankDTO updatedBank = adminBankService.updateBank(id, bankDTO);
            return ResponseEntity.ok(createSuccessResponse("Bank updated successfully", updatedBank));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to update bank"));
        }
    }

    // Delete bank
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBank(@PathVariable Long id) {
        try {
            adminBankService.deleteBank(id);
            return ResponseEntity.ok(createSuccessResponse("Bank deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to delete bank"));
        }
    }

    // Search banks by name
    @GetMapping("/search")
    public ResponseEntity<?> searchBanks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bankName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        try {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<AdminBankDTO> banks = adminBankService.searchBanksByName(query, pageable);
            return ResponseEntity.ok(createPageResponse("Search results retrieved successfully", banks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to search banks"));
        }
    }

    // Advanced search with filters
    @GetMapping("/search/advanced")
    public ResponseEntity<?> advancedSearch(
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) String ifscCode,
            @RequestParam(required = false) Boolean charges,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bankName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        try {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<AdminBankDTO> banks = adminBankService.searchBanks(bankName, ifscCode, charges, pageable);
            return ResponseEntity.ok(createPageResponse("Advanced search results retrieved successfully", banks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to perform advanced search"));
        }
    }

    // Get banks with charges
    @GetMapping("/with-charges")
    public ResponseEntity<?> getBanksWithCharges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "bankName") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {
        try {
            Sort.Direction direction = sortOrder.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<AdminBankDTO> banks = adminBankService.getBanksWithCharges(pageable);
            return ResponseEntity.ok(createPageResponse("Banks with charges retrieved successfully", banks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to retrieve banks with charges"));
        }
    }

    // Check if account number exists
    @GetMapping("/check-account/{accountNumber}")
    public ResponseEntity<?> checkAccountNumber(@PathVariable String accountNumber) {
        try {
            boolean exists = adminBankService.accountNumberExists(accountNumber);
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("accountNumber", accountNumber);
            return ResponseEntity.ok(createSuccessResponse("Account number check completed", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Failed to check account number"));
        }
    }

    // Utility methods for response formatting
    private Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        return response;
    }

    private Map<String, Object> createPageResponse(String message, Page<?> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);

        Map<String, Object> pageData = new HashMap<>();
        pageData.put("content", page.getContent());
        pageData.put("currentPage", page.getNumber());
        pageData.put("totalPages", page.getTotalPages());
        pageData.put("totalElements", page.getTotalElements());
        pageData.put("size", page.getSize());
        pageData.put("hasNext", page.hasNext());
        pageData.put("hasPrevious", page.hasPrevious());

        response.put("data", pageData);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }


}
