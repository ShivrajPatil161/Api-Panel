package com.project2.ism.Controller;


import com.project2.ism.DTO.PrefunAuth.ApproveRejectDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundRequestDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundResponseDTO;
import com.project2.ism.Service.PrefundAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prefund-auth")
public class PrefundAuthController {

    private final PrefundAuthService prefundAuthService;

    public PrefundAuthController(PrefundAuthService prefundAuthService) {
        this.prefundAuthService = prefundAuthService;
    }
    /**
     * Partner creates a new prefund request
     */
    @PostMapping("/request")
    public ResponseEntity<PrefundResponseDTO> createPrefundRequest(
            @Valid @RequestBody PrefundRequestDTO requestDTO,
            Authentication authentication,
            HttpServletRequest request) {

        String username = authentication.getName(); // Get username from JWT
        PrefundResponseDTO response = prefundAuthService.createPrefundRequest(requestDTO, username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Admin: Get all pending requests
     */
    @GetMapping("/admin/pending")
    public ResponseEntity<List<PrefundResponseDTO>> getAllPendingRequests() {
        List<PrefundResponseDTO> requests = prefundAuthService.getAllPendingRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * Admin: Get all requests
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<PrefundResponseDTO>> getAllRequests() {
        List<PrefundResponseDTO> requests = prefundAuthService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * Admin: Approve or reject a request
     */
    @PutMapping("/admin/action/{requestId}")
    public ResponseEntity<PrefundResponseDTO> approveOrRejectRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody ApproveRejectDTO approveRejectDTO) {

        PrefundResponseDTO response = prefundAuthService.approveOrRejectRequest(requestId, approveRejectDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * User: Get all their requests
     */
    @GetMapping("/my-requests")
    public ResponseEntity<List<PrefundResponseDTO>> getMyRequests(Authentication authentication) {
        String username = authentication.getName();
        List<PrefundResponseDTO> requests = prefundAuthService.getRequestsByUser(username);
        return ResponseEntity.ok(requests);
    }

    /**
     * User: Get their requests by status
     */
    @GetMapping("/my-requests/status/{status}")
    public ResponseEntity<List<PrefundResponseDTO>> getMyRequestsByStatus(
            @PathVariable String status,
            Authentication authentication) {

        String username = authentication.getName();
        List<PrefundResponseDTO> requests = prefundAuthService.getRequestsByUserAndStatus(username, status);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get single request by ID
     */
    @GetMapping("/request/{id}")
    public ResponseEntity<PrefundResponseDTO> getRequestById(@PathVariable Long id) {
        PrefundResponseDTO response = prefundAuthService.getRequestById(id);
        return ResponseEntity.ok(response);
    }

}
