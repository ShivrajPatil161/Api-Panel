//package com.project2.ism.Controller;
//
//
//import com.project2.ism.DTO.MerchantFormDTO;
//import com.project2.ism.Model.Users.Merchant;
//import com.project2.ism.Service.MerchantService;
//import jakarta.validation.Valid;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/merchants")
//public class MerchantController {
//
//    private final MerchantService merchantService;
//
//    public MerchantController(MerchantService merchantService) {
//        this.merchantService = merchantService;
//    }
//
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> createMerchant(@ModelAttribute MerchantFormDTO merchantDTO) {
//        merchantService.createMerchant(merchantDTO);
//        return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "Franchise created successfully"
//        ));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Merchant>> getAllMerchants() {
//        return ResponseEntity.ok(merchantService.getAllMerchants());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Merchant> getMerchantById(@PathVariable Long id) {
//        return ResponseEntity.ok(merchantService.getMerchantById(id));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Merchant> updateMerchant(@PathVariable Long id, @Valid @RequestBody Merchant merchant) {
//        return ResponseEntity.ok(merchantService.updateMerchant(id, merchant));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteMerchant(@PathVariable Long id) {
//        merchantService.deleteMerchant(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // Extra: Get merchants by Franchise ID
//    @GetMapping("/franchise/{franchiseId}")
//    public ResponseEntity<List<Merchant>> getMerchantsByFranchise(@PathVariable Long franchiseId) {
//        return ResponseEntity.ok(merchantService.getMerchantsByFranchise(franchiseId));
//    }
//}




package com.project2.ism.Controller;

import com.project2.ism.DTO.MerchantFormDTO;
import com.project2.ism.DTO.MerchantListDTO;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Service.FileStorageService;
import com.project2.ism.Service.MerchantService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/merchants")
public class MerchantController {

    private final MerchantService merchantService;
    private final FileStorageService fileStorageService;

    public MerchantController(MerchantService merchantService, FileStorageService fileStorageService) {
        this.merchantService = merchantService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createMerchant(@ModelAttribute MerchantFormDTO merchantDTO) {
        try {
            merchantService.createMerchant(merchantDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Merchant created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to create merchant: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<MerchantListDTO>> getAllMerchants() {
        try {
            List<MerchantListDTO> merchants = merchantService.getAllMerchantsForList();
            return ResponseEntity.ok(merchants);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Merchant> getMerchantById(@PathVariable Long id) {
        try {
            Merchant merchant = merchantService.getMerchantById(id);
            return ResponseEntity.ok(merchant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMerchant(@PathVariable Long id, @Valid @RequestBody Merchant merchant) {
        try {
            Merchant updatedMerchant = merchantService.updateMerchant(id, merchant);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Merchant updated successfully",
                    "data", updatedMerchant
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to update merchant: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMerchant(@PathVariable Long id) {
        try {
            merchantService.deleteMerchant(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Merchant deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to delete merchant: " + e.getMessage()
            ));
        }
    }

    // Get merchants by franchise ID
    @GetMapping("/franchise/{franchiseId}")
    public ResponseEntity<List<MerchantListDTO>> getMerchantsByFranchise(@PathVariable Long franchiseId) {
        try {
            List<MerchantListDTO> merchants = merchantService.getMerchantsByFranchise(franchiseId);
            return ResponseEntity.ok(merchants);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Serve uploaded documents
    @GetMapping("/api/documents/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename, HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadAsResource("documents/" + filename);

            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    // 1. Get unapproved merchants
    @GetMapping("/unapproved")
    public List<Merchant> getUnapprovedMerchants() {
        return merchantService.getUnapprovedMerchants();
    }

    // 2. Approve merchant
    @PutMapping("/{id}/approve")
    public Merchant approveMerchant(@PathVariable Long id) {
        return merchantService.approveMerchant(id);
    }

    // 3. Reject merchant
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<String> rejectMerchant(@PathVariable Long id) {
        merchantService.rejectMerchant(id);
        return ResponseEntity.ok("Merchant rejected and deleted successfully.");
    }
}