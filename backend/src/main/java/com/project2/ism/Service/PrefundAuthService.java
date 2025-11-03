package com.project2.ism.Service;


import com.project2.ism.DTO.PrefunAuth.ApproveRejectDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundRequestDTO;
import com.project2.ism.DTO.PrefunAuth.PrefundResponseDTO;
import com.project2.ism.Model.PrefundRequest;
import com.project2.ism.Repository.PrefundRequestRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrefundAuthService {

    private final PrefundRequestRepository prefundRequestRepository;


    public PrefundAuthService(PrefundRequestRepository prefundRequestRepository) {
        this.prefundRequestRepository = prefundRequestRepository;
    }


    /**
     * Create a new prefund request
     * @param requestDTO - Request data from partner
     * @param username - Username from JWT token
     * @param request - HTTP request to extract IP address
     * @return Created prefund request response
     */
    @Transactional
    public PrefundResponseDTO createPrefundRequest(PrefundRequestDTO requestDTO, String username, HttpServletRequest request) {
        PrefundRequest prefundRequest = new PrefundRequest();

        // Fields from DTO
        prefundRequest.setMobileNumber(requestDTO.getMobileNumber());
        prefundRequest.setDepositAmount(requestDTO.getDepositAmount());
        prefundRequest.setDepositImage(requestDTO.getDepositImage());
        prefundRequest.setBankHolderName(requestDTO.getBankHolderName());
        prefundRequest.setBankAccountName(requestDTO.getBankAccountName());
        prefundRequest.setBankAccountNumber(requestDTO.getBankAccountNumber());
        prefundRequest.setBankTranId(requestDTO.getBankTranId());
        prefundRequest.setDepositDate(requestDTO.getDepositDate());
        prefundRequest.setNarration(requestDTO.getNarration());
        prefundRequest.setPaymentMode(requestDTO.getPaymentMode());
        prefundRequest.setDepositType(requestDTO.getDepositType());

        // Fields from backend
        prefundRequest.setRequestedBy(username);
        prefundRequest.setIpAddress(getClientIpAddress(request));
        prefundRequest.setStatus("Pending");

        PrefundRequest saved = prefundRequestRepository.save(prefundRequest);
        return convertToResponseDTO(saved);
    }

    /**
     * Get all pending requests (for admin)
     */
    public List<PrefundResponseDTO> getAllPendingRequests() {
        return prefundRequestRepository.findByStatus("Pending")
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all requests by specific user
     */
    public List<PrefundResponseDTO> getRequestsByUser(String username) {
        return prefundRequestRepository.findByRequestedBy(username)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get requests by user and status
     */
    public List<PrefundResponseDTO> getRequestsByUserAndStatus(String username, String status) {
        return prefundRequestRepository.findByRequestedByAndStatus(username, status)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all requests (for admin)
     */
    public List<PrefundResponseDTO> getAllRequests() {
        return prefundRequestRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve or reject a prefund request
     */
    @Transactional
    public PrefundResponseDTO approveOrRejectRequest(Long requestId, ApproveRejectDTO approveRejectDTO) {
        PrefundRequest prefundRequest = prefundRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Prefund request not found with id: " + requestId));

        if (!"Pending".equals(prefundRequest.getStatus())) {
            throw new RuntimeException("Only pending requests can be approved or rejected");
        }

        prefundRequest.setStatus(approveRejectDTO.getAction());
        prefundRequest.setRemarks(approveRejectDTO.getRemarks() != null ? approveRejectDTO.getRemarks() : "-");
        prefundRequest.setApproveOrRejectDate(LocalDate.now());
        prefundRequest.setApproveOrRejectTime(LocalTime.now());

        PrefundRequest updated = prefundRequestRepository.save(prefundRequest);
        return convertToResponseDTO(updated);
    }

    /**
     * Get single request by ID
     */
    public PrefundResponseDTO getRequestById(Long id) {
        PrefundRequest prefundRequest = prefundRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prefund request not found with id: " + id));
        return convertToResponseDTO(prefundRequest);
    }

    /**
     * Extract client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * Convert entity to response DTO
     * Constructor needed: All fields constructor for PrefundResponseDTO
     */
    private PrefundResponseDTO convertToResponseDTO(PrefundRequest entity) {
        PrefundResponseDTO dto = new PrefundResponseDTO();
        dto.setId(entity.getId());
        dto.setRequestedBy(entity.getRequestedBy());
        dto.setMobileNumber(entity.getMobileNumber());
        dto.setDepositAmount(entity.getDepositAmount());
        dto.setDepositImage(entity.getDepositImage());
        dto.setStatus(entity.getStatus());
        dto.setCreateDateTime(entity.getCreateDateTime());
        dto.setBankHolderName(entity.getBankHolderName());
        dto.setBankAccountName(entity.getBankAccountName());
        dto.setBankAccountNumber(entity.getBankAccountNumber());
        dto.setBankTranId(entity.getBankTranId());
        dto.setDepositDate(entity.getDepositDate());
        dto.setNarration(entity.getNarration());
        dto.setPaymentMode(entity.getPaymentMode());
        dto.setIpAddress(entity.getIpAddress());
        dto.setApproveOrRejectDate(entity.getApproveOrRejectDate());
        dto.setApproveOrRejectTime(entity.getApproveOrRejectTime());
        dto.setRemarks(entity.getRemarks());
        dto.setDepositType(entity.getDepositType());
        return dto;
    }

}
