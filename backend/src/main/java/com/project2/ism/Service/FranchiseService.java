package com.project2.ism.Service;

import com.project2.ism.DTO.FranchiseFormDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ContactPerson;
import com.project2.ism.Model.UploadDocuments;
import com.project2.ism.Model.Users.BankDetails;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Repository.FranchiseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FranchiseService {

    private final FranchiseRepository franchiseRepository;
    private final FileStorageService fileStorageService;

    private final UserService userService;

    public FranchiseService(FranchiseRepository franchiseRepository, FileStorageService fileStorageService, UserService userService) {
        this.franchiseRepository = franchiseRepository;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
    }

    @Transactional
    public void createFranchise(FranchiseFormDTO dto) {
        Franchise franchise = new Franchise();

        franchise.setFranchiseName(dto.getFranchiseName());
        // Basic details
        franchise.setLegalName(dto.getLegalName());
        franchise.setBusinessType(dto.getBusinessType());
        franchise.setGstNumber(dto.getGstNumber());
        franchise.setPanNumber(dto.getPanNumber());
        franchise.setRegistrationNumber(dto.getRegistrationNumber());
        franchise.setAddress(dto.getBusinessAddress());

        // Contact Person
        ContactPerson contact = new ContactPerson();
        contact.setName(dto.getPrimaryContactName());
        contact.setPhoneNumber(dto.getPrimaryContactMobile());
        contact.setAlternatePhoneNum(dto.getAlternateContactMobile());
        contact.setEmail(dto.getPrimaryContactEmail());
        contact.setLandlineNumber(dto.getLandlineNumber());
        franchise.setContactPerson(contact);

        // Bank Details
        BankDetails bank = new BankDetails();
        bank.setBankName(dto.getBankName());
        bank.setAccountHolderName(dto.getAccountHolderName());
        bank.setAccountNumber(dto.getAccountNumber());
        bank.setIfsc(dto.getIfscCode());
        bank.setBranchName(dto.getBranchName());
        bank.setAccountType(dto.getAccountType());
        franchise.setBankDetails(bank);

        // Upload Documents
        UploadDocuments docs = new UploadDocuments();
        docs.setPanProof(fileStorageService.store(dto.getPanCardDocument(), "pan"));
        docs.setGstCertificateProof(fileStorageService.store(dto.getGstCertificate(), "gst"));
        docs.setAddressProof(fileStorageService.store(dto.getAddressProof(), "address"));
        docs.setBankAccountProof(fileStorageService.store(dto.getBankProof(), "bank"));
        franchise.setUploadDocuments(docs);

        franchiseRepository.save(franchise);
        // Create login for this franchise
        userService.createAndSendCredentials(
                dto.getPrimaryContactEmail(), // email
                "FRANCHISE",                  // role
                null                          // password (null → auto-generate)
        );
    }

    public List<Franchise> getAllFranchises() {
        return franchiseRepository.findAll();
    }

    public Franchise getFranchiseById(Long id) {
        return franchiseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found with ID: " + id));
    }

    public Franchise updateFranchise(Long id, Franchise franchiseDetails) {
        Franchise franchise = getFranchiseById(id); // throws exception if not found
        franchise.setFranchiseName(franchiseDetails.getFranchiseName());
        // Map other fields from CustomerBase if needed
        return franchiseRepository.save(franchise);
    }

    public void deleteFranchise(Long id) {
        Franchise franchise = getFranchiseById(id); // throws exception if not found
        franchiseRepository.delete(franchise);
    }
}