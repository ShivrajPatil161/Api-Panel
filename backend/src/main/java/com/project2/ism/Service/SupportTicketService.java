package com.project2.ism.Service;

import com.project2.ism.DTO.AdminDTO.SupportTicketDTO;
import com.project2.ism.Model.SupportTicket;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Repository.ApiPartnerRepository;
import com.project2.ism.Repository.SupportTicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SupportTicketService {


    private final SupportTicketRepository supportTicketRepository;

    private final ApiPartnerRepository apiPartnerRepository;

    public SupportTicketService(SupportTicketRepository supportTicketRepository, ApiPartnerRepository apiPartnerRepository, ApiPartnerRepository apiPartnerRepository1) {
        this.supportTicketRepository = supportTicketRepository;
        this.apiPartnerRepository = apiPartnerRepository1;
    }

    public SupportTicket createTicket(SupportTicket ticket,Long customerId) {
        ticket.setPartnerId(customerId);
        ticket.setStatus("PENDING");
        ticket.setAdminRemarks("");
        return supportTicketRepository.save(ticket);
    }

    public List<SupportTicket> getUnresolvedTickets(String customerType, Long customerId) {
        return supportTicketRepository.findByPartnerIdAndStatus(
                customerId, "PENDING"
        );
    }

    public List<SupportTicket> getResolvedTickets(String customerType, Long customerId) {
        return supportTicketRepository.findByPartnerIdAndStatus(
                customerId, "RESOLVED"
        );
    }

    public List<SupportTicketDTO> getAllUnresolvedTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findByStatus("PENDING");
        return tickets.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SupportTicketDTO> getAllResolvedTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findByStatus("RESOLVED");
        return tickets.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<SupportTicketDTO> getTicketById(Long id) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);
        return ticketOpt.map(this::convertToDTO);
    }

    public SupportTicket resolveTicket(Long id, String resolvedBy, String adminRemarks) {
        Optional<SupportTicket> ticketOpt = supportTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            SupportTicket ticket = ticketOpt.get();
            ticket.setStatus("RESOLVED");
            ticket.setResolvedBy(resolvedBy);
            ticket.setAdminRemarks(adminRemarks);
            ticket.setResolvedAt(LocalDateTime.now());
            return supportTicketRepository.save(ticket);
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    private SupportTicketDTO convertToDTO(SupportTicket ticket) {
        SupportTicketDTO dto = new SupportTicketDTO();
        dto.setId(ticket.getId());
        dto.setIssueType(ticket.getIssueType());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setResolvedBy(ticket.getResolvedBy());
        dto.setAdminRemarks(ticket.getAdminRemarks());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());

        // Fetch customer details based on partnerId
        Optional<ApiPartner> partnerOpt = apiPartnerRepository.findById(ticket.getPartnerId());

        if (partnerOpt.isPresent()) {
            ApiPartner partner = partnerOpt.get();
            dto.setCustomerName(partner.getBusinessName()); // or partner.getBusinessName() / partner.getFranchiseName() as per your model
            dto.setPhoneNumber(partner.getContactPerson().getPhoneNumber());
        } else {
            dto.setCustomerName("Unknown Partner");
            dto.setPhoneNumber("N/A");
        }


        return dto;
    }

    public ApiPartnerRepository getApiPartnerRepository() {
        return apiPartnerRepository;
    }
}