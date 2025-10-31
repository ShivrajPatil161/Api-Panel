
package com.project2.ism.Controller;


import com.project2.ism.DTO.ApiPartnerFormDTO;
import com.project2.ism.DTO.ApiPartnerListDTO;

import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Service.FileStorageService;
import com.project2.ism.Service.ApiPartnerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/partners")
public class ApiPartnerController {

    private final ApiPartnerService apiPartnerService;
    private final FileStorageService fileStorageService;

    public ApiPartnerController(ApiPartnerService apiPartnerService, FileStorageService fileStorageService) {
        this.apiPartnerService = apiPartnerService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createApiPartner(@ModelAttribute ApiPartnerFormDTO apiPartnerDTO) {
        try {
            apiPartnerService.createMerchant(apiPartnerDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Api Partner created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to create Api Partner: " + e.getMessage()
            ));
        }
    }
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateApiPartner(
            @PathVariable Long id,
            @ModelAttribute ApiPartnerFormDTO formDTO
    ) {
        try {
            ApiPartner updatedApiPartner = apiPartnerService.updateApiPartner(id, formDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Api Partner updated successfully",
                    "data", updatedApiPartner
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to update Api Partner: " + e.getMessage()
            ));
        }
    }
    @GetMapping
    public ResponseEntity<List<ApiPartnerListDTO>> getAllApiPartners() {
        try {
            List<ApiPartnerListDTO> apiPartners = apiPartnerService.getAllApiPartnersForList();
            return ResponseEntity.ok(apiPartners);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiPartner> getApiPartnerById(@PathVariable Long id) {
        try {
            ApiPartner merchant = apiPartnerService.getApiPartnerById(id);
            return ResponseEntity.ok(merchant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApiPartner(@PathVariable Long id) {
        try {
            apiPartnerService.deleteApiPartner(id);
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


    //admin approval jsx uses this
    // 1. Get unapproved Api Partner
    @GetMapping("/unapproved")
    public List<ApiPartner> getUnapprovedMerchants() {
        return apiPartnerService.getUnapprovedApiPartners();
    }


    //admin approval jsx uses this
    // 2. Approve Api Partner
    @PutMapping("/{id}/approve")
    public ApiPartner approveMerchant(@PathVariable Long id) {
        return apiPartnerService.approveApiPartner(id);
    }

    //admin approval jsx uses this
    // 3. Reject Api Partner
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<String> rejectMerchant(@PathVariable Long id) {
        apiPartnerService.rejectApiPartner(id);
        return ResponseEntity.ok("Api Partner rejected and deleted successfully.");
    }





    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam String email) {
        ApiPartner apiPartner = apiPartnerService.getApiPartnerByEmail(email);
        BigDecimal walletBalance = apiPartnerService.getWalletBalance(apiPartner.getId());

        ApiPartnerListDTO dto = new ApiPartnerListDTO(
                apiPartner.getId(),
                apiPartner.getBusinessName(),
                apiPartner.getContactPerson().getEmail(),
                walletBalance
        );
        return ResponseEntity.ok(dto);
    }


//    //settlement api .js uses this
//    @GetMapping("/products/{id}")
//    public ResponseEntity<?> merchantProducts(@PathVariable Long id){
//        List<?> products = apiPartnerService.getProductsOfApiPartner(id);
//        return ResponseEntity.ok(products);
//    }



    //settlement api .js uses this
    @GetMapping("/api-Partners")
    public ResponseEntity<List<ApiPartnerListDTO>> directMerchant() {
        try {
            List<ApiPartnerListDTO> merchants = apiPartnerService.getAllApiPartners();
            return ResponseEntity.ok(merchants);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

//
}
