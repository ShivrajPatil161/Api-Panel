package com.project2.ism.Service;


import com.project2.ism.DTO.AdminDTO.AdminBankDTO;
import com.project2.ism.Model.AdminBank;
import com.project2.ism.Repository.AdminBankRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Service
public class AdminBankService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final AdminBankRepository adminBankRepository;

    public AdminBankService(AdminBankRepository adminBankRepository) {
        this.adminBankRepository = adminBankRepository;
    }

    @Transactional
    public AdminBankDTO createBank(AdminBankDTO bankDTO) {


//        // Validate charges logic
//        if (bankDTO.getCharges() && (bankDTO.getChargesType() == null ||
//                (!bankDTO.getChargesType().equals("percentage") && !bankDTO.getChargesType().equals("flat")))) {
//            throw new IllegalArgumentException("Valid charges type is required when charges is enabled");
//        }

        AdminBank bank = convertToEntity(bankDTO);
        AdminBank savedBank = adminBankRepository.save(bank);
        return convertToDTO(savedBank);
    }

    // Get bank by ID
    public AdminBankDTO getBankById(Long id) {
        AdminBank bank = adminBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found with id: " + id));
        return convertToDTO(bank);
    }

    // Get all banks with pagination
    public Page<AdminBankDTO> getAllBanks(Pageable pageable) {
        Page<AdminBank> banks = adminBankRepository.findAll(pageable);
        return banks.map(this::convertToDTO);
    }

    // Update bank
    @Transactional
    public AdminBankDTO updateBank(Long id, AdminBankDTO bankDTO) {
        AdminBank existingBank = adminBankRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank not found with id: " + id));

        // Check if account number is being changed and if it already exists
        if (!existingBank.getAccountNumber().equals(bankDTO.getAccountNumber()) &&
                adminBankRepository.existsByAccountNumber(bankDTO.getAccountNumber())) {
            throw new IllegalArgumentException("Account number already exists");
        }

        // Validate charges logic
        if (bankDTO.getCharges() && (bankDTO.getChargesType() == null ||
                (!bankDTO.getChargesType().equals("percentage") && !bankDTO.getChargesType().equals("flat")))) {
            throw new IllegalArgumentException("Valid charges type is required when charges is enabled");
        }

        // Update fields
        existingBank.setBankName(bankDTO.getBankName());
        existingBank.setAccountNumber(bankDTO.getAccountNumber());
        existingBank.setIfscCode(bankDTO.getIfscCode());
        existingBank.setCharges(bankDTO.getCharges());
        existingBank.setChargesType(bankDTO.getChargesType());

        AdminBank updatedBank = adminBankRepository.save(existingBank);
        return convertToDTO(updatedBank);
    }

    // Delete bank
    @Transactional
    public void deleteBank(Long id) {
        if (!adminBankRepository.existsById(id)) {
            throw new RuntimeException("Bank not found with id: " + id);
        }
        adminBankRepository.deleteById(id);
    }

    // Search banks by name with pagination
    public Page<AdminBankDTO> searchBanksByName(String searchTerm, Pageable pageable) {
        Page<AdminBank> banks = adminBankRepository.searchByBankName(searchTerm, pageable);
        return banks.map(this::convertToDTO);
    }

    // Get banks with charges enabled
    public Page<AdminBankDTO> getBanksWithCharges(Pageable pageable) {
        Page<AdminBank> banks = adminBankRepository.findByChargesTrue(pageable);
        return banks.map(this::convertToDTO);
    }

    // Advanced search with multiple filters
    public Page<AdminBankDTO> searchBanks(String bankName, String ifscCode, Boolean charges, Pageable pageable) {
        Page<AdminBank> banks = adminBankRepository.searchBanks(bankName, ifscCode, charges, pageable);
        return banks.map(this::convertToDTO);
    }

    // Check if account number exists
    public boolean accountNumberExists(String accountNumber) {
        return adminBankRepository.existsByAccountNumber(accountNumber);
    }

    // Utility methods for conversion
    private AdminBankDTO convertToDTO(AdminBank bank) {
        AdminBankDTO dto = new AdminBankDTO();
        dto.setId(bank.getId());
        dto.setBankName(bank.getBankName());
        dto.setAccountNumber(bank.getAccountNumber());
        dto.setIfscCode(bank.getIfscCode());
        dto.setCharges(bank.getCharges());
        dto.setChargesType(bank.getChargesType());

        if (bank.getCreatedAt() != null) {
            dto.setCreatedAt(bank.getCreatedAt().format(DATE_FORMATTER));
        }
        if (bank.getUpdatedAt() != null) {
            dto.setUpdatedAt(bank.getUpdatedAt().format(DATE_FORMATTER));
        }

        return dto;
    }

    private AdminBank convertToEntity(AdminBankDTO dto) {
        AdminBank bank = new AdminBank();
        bank.setBankName(dto.getBankName());
        bank.setAccountNumber(dto.getAccountNumber());
        bank.setIfscCode(dto.getIfscCode().toUpperCase());
        bank.setCharges(dto.getCharges());
        bank.setChargesType(dto.getChargesType());
        return bank;
    }
}
