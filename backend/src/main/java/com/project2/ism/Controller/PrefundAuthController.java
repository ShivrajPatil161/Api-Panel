package com.project2.ism.Controller;


import com.project2.ism.DTO.PrefunAuth.ApproveRejectDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundRequestDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundResponseDTO;
import com.project2.ism.DTO.ReportDTO.ApiResponse;
import com.project2.ism.Service.PrefundAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    public ResponseEntity<ApiResponse<Page<PrefundResponseDTO>>> getAllPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PrefundResponseDTO> pendingRequests = prefundAuthService.getAllPendingRequests(pageable);

        ApiResponse<Page<PrefundResponseDTO>> response = new ApiResponse<>(
                true,
                "Fetched pending requests successfully",
                pendingRequests,
                null,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Get all requests (paginated)
     */
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<PrefundResponseDTO>>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PrefundResponseDTO> requests = prefundAuthService.getAllRequests(pageable);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Fetched all requests successfully",
                requests,
                null,
                LocalDateTime.now()
        ));
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
    public ResponseEntity<ApiResponse<Page<PrefundResponseDTO>>> getMyRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<PrefundResponseDTO> requests = prefundAuthService.getRequestsByUser(username, pageable);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Fetched user requests successfully",
                requests,
                null,
                LocalDateTime.now()
        ));
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
