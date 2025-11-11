
package com.project2.ism.Service;

import com.project2.ism.DTO.ApiPartnerListDTO;
import com.project2.ism.DTO.ApiPartnerFormDTO;
import com.project2.ism.DTO.ApiPartnerProductsDTO;
import com.project2.ism.DTO.ApiPartnerViewDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ContactPerson;
import com.project2.ism.Model.ApiPartnerWallet;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Model.Users.UploadDocuments;
import com.project2.ism.Model.Users.BankDetails;
import com.project2.ism.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApiPartnerService {

    private final ApiPartnerRepository apiPartnerRepository;
    private final FileStorageService fileStorageService;
    private final UserService userService;
    private final ApiPartnerSchemeAssignmentService apiPartnerSchemeAssignmentService;



    private final ApiPartnerWalletRepository apiPartnerWalletRepository;

    public ApiPartnerService(ApiPartnerRepository apiPartnerRepository,
                             FileStorageService fileStorageService,
                             UserService userService, ApiPartnerSchemeAssignmentService apiPartnerSchemeAssignmentService, ApiPartnerWalletRepository apiPartnerWalletRepository) {
        this.apiPartnerRepository = apiPartnerRepository;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
        this.apiPartnerSchemeAssignmentService = apiPartnerSchemeAssignmentService;
        this.apiPartnerWalletRepository = apiPartnerWalletRepository;
    }

    public void createMerchant(ApiPartnerFormDTO dto) {
        ApiPartner apiPartner = new ApiPartner();


        // Basic details
        apiPartner.setBusinessName(dto.getBusinessName());
        apiPartner.setLegalName(dto.getLegalName());
        apiPartner.setBusinessType(dto.getBusinessType());
        apiPartner.setGstNumber(dto.getGstNumber());
        apiPartner.setPanNumber(dto.getPanNumber());
        apiPartner.setRegistrationNumber(dto.getRegistrationNumber());
        apiPartner.setAddress(dto.getBusinessAddress());

        // Contact Person
        ContactPerson contact = new ContactPerson();
        contact.setName(dto.getPrimaryContactName());
        contact.setPhoneNumber(dto.getPrimaryContactMobile());
        contact.setAlternatePhoneNum(dto.getAlternateContactMobile());
        contact.setEmail(dto.getPrimaryContactEmail());
        contact.setLandlineNumber(dto.getLandlineNumber());
        apiPartner.setContactPerson(contact);

        // Bank Details
        BankDetails bank = new BankDetails();
        bank.setBankName(dto.getBankName());
        bank.setAccountHolderName(dto.getAccountHolderName());
        bank.setAccountNumber(dto.getAccountNumber());
        bank.setIfsc(dto.getIfscCode());
        bank.setBranchName(dto.getBranchName());
        bank.setAccountType(dto.getAccountType());
        apiPartner.setBankDetails(bank);

        // Upload Documents
        UploadDocuments docs = new UploadDocuments();
        if (dto.getPanCardDocument() != null && !dto.getPanCardDocument().isEmpty()) {
            docs.setPanProof(fileStorageService.store(dto.getPanCardDocument(), "merchant_pan"));
        }
        if (dto.getGstCertificate() != null && !dto.getGstCertificate().isEmpty()) {
            docs.setGstCertificateProof(fileStorageService.store(dto.getGstCertificate(), "merchant_gst"));
        }
        if (dto.getAddressProof() != null && !dto.getAddressProof().isEmpty()) {
            docs.setAddressProof(fileStorageService.store(dto.getAddressProof(), "merchant_address"));
        }
        if (dto.getBankProof() != null && !dto.getBankProof().isEmpty()) {
            docs.setBankAccountProof(fileStorageService.store(dto.getBankProof(), "merchant_bank"));
        }
        apiPartner.setUploadDocuments(docs);

        // Set default values
        apiPartner.setStatus("ACTIVE");

        apiPartner.setProducts(0);
        apiPartner.setCreatedAt(LocalDateTime.now());
        apiPartner.setUpdatedAt(LocalDateTime.now());

        // Get role from JWT via SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().iterator().next().getAuthority(); //e.g. ROLE_ADMIN

        ApiPartner savedMerchant = apiPartnerRepository.save(apiPartner);


        // Set approved only if Admin or Super_Admin
        if ("ROLE_ADMIN".equals(role) || "ROLE_SUPER_ADMIN".equals(role)) {
            savedMerchant.setApproved(true);
            ApiPartnerWallet w = new ApiPartnerWallet();
            ApiPartner mRef = new ApiPartner();
            mRef.setId(savedMerchant.getId());
            w.setApiPartner(mRef);
            w.setAvailableBalance(BigDecimal.ZERO);
            w.setLastUpdatedAmount(BigDecimal.ZERO);
            w.setLastUpdatedAt(LocalDateTime.now());
            w.setTotalCash(BigDecimal.ZERO);
            w.setCutOfAmount(BigDecimal.ZERO);
            apiPartnerWalletRepository.save(w);
        } else {
            savedMerchant.setApproved(false);
//            merchantApprovalService.createApproval(savedMerchant);
            // default
        }

        // If approved, create credentials
        if (savedMerchant.isApproved()) {
            userService.createAndSendCredentials(
                    dto.getPrimaryContactEmail(),
                    "MERCHANT",
                    null
            );
        }


    }

    public List<ApiPartnerListDTO> getAllApiPartnersForList() {
        return apiPartnerRepository.findAll()
                .stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    public ApiPartner getApiPartnerById(Long id) {
        return apiPartnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + id));
    }

    public ApiPartnerViewDTO getApiPartnerView(Long id) {
        return mapToViewDTO(getApiPartnerById(id));

    }

    public ApiPartner updateApiPartner(Long id, ApiPartnerFormDTO dto) throws IOException {
        ApiPartner apiPartner = getApiPartnerById(id);

        // Update basic details (only if provided)
        if (dto.getBusinessName() != null && !dto.getBusinessName().isEmpty()) {
            apiPartner.setBusinessName(dto.getBusinessName());
        }
        if (dto.getLegalName() != null && !dto.getLegalName().isEmpty()) {
            apiPartner.setLegalName(dto.getLegalName());
        }
        if (dto.getBusinessType() != null && !dto.getBusinessType().isEmpty()) {
            apiPartner.setBusinessType(dto.getBusinessType());
        }
        if (dto.getBusinessAddress() != null && !dto.getBusinessAddress().isEmpty()) {
            apiPartner.setAddress(dto.getBusinessAddress());
        }
        if (dto.getGstNumber() != null && !dto.getGstNumber().isEmpty()) {
            apiPartner.setGstNumber(dto.getGstNumber());
        }
        if (dto.getPanNumber() != null && !dto.getPanNumber().isEmpty()) {
            apiPartner.setPanNumber(dto.getPanNumber());
        }
        if (dto.getRegistrationNumber() != null && !dto.getRegistrationNumber().isEmpty()) {
            apiPartner.setRegistrationNumber(dto.getRegistrationNumber());
        }


        // Update contact details
        ContactPerson contactPerson = apiPartner.getContactPerson();
        if (contactPerson == null) {
            contactPerson = new ContactPerson();
        }

        if (dto.getPrimaryContactName() != null && !dto.getPrimaryContactName().isEmpty()) {
            contactPerson.setName(dto.getPrimaryContactName());
        }
        if (dto.getPrimaryContactMobile() != null && !dto.getPrimaryContactMobile().isEmpty()) {
            contactPerson.setPhoneNumber(dto.getPrimaryContactMobile());
        }
        if (dto.getPrimaryContactEmail() != null && !dto.getPrimaryContactEmail().isEmpty()) {
            contactPerson.setEmail(dto.getPrimaryContactEmail());
        }
        if (dto.getAlternateContactMobile() != null && !dto.getAlternateContactMobile().isEmpty()) {
            contactPerson.setAlternatePhoneNum(dto.getAlternateContactMobile());
        }
        if (dto.getLandlineNumber() != null && !dto.getLandlineNumber().isEmpty()) {
            contactPerson.setLandlineNumber(dto.getLandlineNumber());
        }

        apiPartner.setContactPerson(contactPerson);

        // Update bank details
        BankDetails bankDetails = apiPartner.getBankDetails();
        if (bankDetails == null) {
            bankDetails = new BankDetails();
        }

        if (dto.getBankName() != null && !dto.getBankName().isEmpty()) {
            bankDetails.setBankName(dto.getBankName());
        }
        if (dto.getAccountHolderName() != null && !dto.getAccountHolderName().isEmpty()) {
            bankDetails.setAccountHolderName(dto.getAccountHolderName());
        }
        if (dto.getAccountNumber() != null && !dto.getAccountNumber().isEmpty()) {
            bankDetails.setAccountNumber(dto.getAccountNumber());
        }
        if (dto.getIfscCode() != null && !dto.getIfscCode().isEmpty()) {
            bankDetails.setIfsc(dto.getIfscCode());
        }
        if (dto.getBranchName() != null && !dto.getBranchName().isEmpty()) {
            bankDetails.setBranchName(dto.getBranchName());
        }
        if (dto.getAccountType() != null && !dto.getAccountType().isEmpty()) {
            bankDetails.setAccountType(dto.getAccountType());
        }

        apiPartner.setBankDetails(bankDetails);

        // Handle document uploads (only if new files are provided)
        UploadDocuments uploadDocuments = apiPartner.getUploadDocuments();
        if (uploadDocuments == null) {
            uploadDocuments = new UploadDocuments();
        }

        if (dto.getPanCardDocument() != null && !dto.getPanCardDocument().isEmpty()) {
            String panPath = fileStorageService.store(dto.getPanCardDocument(), "merchant_pan");
            uploadDocuments.setPanProof(panPath);
        }
        if (dto.getGstCertificate() != null && !dto.getGstCertificate().isEmpty()) {
            String gstPath = fileStorageService.store(dto.getGstCertificate(), "merchant_gst");
            uploadDocuments.setGstCertificateProof(gstPath);
        }
        if (dto.getAddressProof() != null && !dto.getAddressProof().isEmpty()) {
            String addressPath = fileStorageService.store(dto.getAddressProof(), "merchant_address");
            uploadDocuments.setAddressProof(addressPath);
        }
        if (dto.getBankProof() != null && !dto.getBankProof().isEmpty()) {
            String bankPath = fileStorageService.store(dto.getBankProof(), "merchant_bank");
            uploadDocuments.setBankAccountProof(bankPath);
        }

        apiPartner.setUploadDocuments(uploadDocuments);
        apiPartner.setUpdatedAt(LocalDateTime.now());

        return apiPartnerRepository.save(apiPartner);
    }
    public void deleteApiPartner(Long id) {
        ApiPartner apiPartner = getApiPartnerById(id);

        // Delete associated files
        UploadDocuments docs = apiPartner.getUploadDocuments();
        if (docs != null) {
            deleteDocumentFile(docs.getPanProof());
            deleteDocumentFile(docs.getGstCertificateProof());
            deleteDocumentFile(docs.getAddressProof());
            deleteDocumentFile(docs.getBankAccountProof());
            deleteDocumentFile(docs.getOther1());
            deleteDocumentFile(docs.getOther2());
            deleteDocumentFile(docs.getOther3());
        }

        apiPartnerRepository.delete(apiPartner);
    }




    private void deleteDocumentFile(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            try {
                fileStorageService.deleteFile(filePath);
            } catch (Exception e) {
                // Log error but don't fail the deletion
                System.err.println("Failed to delete file: " + filePath + " - " + e.getMessage());
            }
        }
    }

    private ApiPartnerListDTO mapToListDTO(ApiPartner apiPartner) {
        return new ApiPartnerListDTO(
                apiPartner.getId(),
                apiPartner.getBusinessName(),
                apiPartner.getBusinessType(),
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getName() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getEmail() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getPhoneNumber() : null,
                apiPartner.getAddress(),
                apiPartner.getProducts() != null ? apiPartner.getProducts() : 0,
                getWalletBalance(apiPartner.getId()),
                apiPartner.getStatus() != null ? apiPartner.getStatus() : "ACTIVE",
                apiPartner.getCreatedAt()
        );

    }

    private ApiPartnerViewDTO mapToViewDTO(ApiPartner apiPartner) {
        return new ApiPartnerViewDTO(
                apiPartner.getId(),
                apiPartner.getBusinessName(),
                apiPartner.getLegalName(),
                apiPartner.getBusinessType(),
                apiPartner.getGstNumber(),
                apiPartner.getPanNumber(),
                apiPartner.getRegistrationNumber(),
                apiPartner.getAddress(),
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getName() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getPhoneNumber() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getAlternatePhoneNum() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getEmail() : null,
                apiPartner.getContactPerson() != null ? apiPartner.getContactPerson().getLandlineNumber() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getBankName() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getAccountHolderName() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getAccountNumber() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getIfsc() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getBranchName() : null,
                apiPartner.getBankDetails() != null? apiPartner.getBankDetails().getAccountType() : null,
                apiPartner.getUploadDocuments() != null ? apiPartner.getUploadDocuments().getPanProof() : null,
                apiPartner.getUploadDocuments() != null ? apiPartner.getUploadDocuments().getGstCertificateProof() : null,
                apiPartner.getUploadDocuments() != null ? apiPartner.getUploadDocuments().getAddressProof() : null,
                apiPartner.getUploadDocuments() != null ? apiPartner.getUploadDocuments().getBankAccountProof() : null,
                getWalletBalance(apiPartner.getId()),
                apiPartner.getCreatedAt()
        );

    }

    // 1. Get all unapproved apiPartner
    public List<ApiPartner> getUnapprovedApiPartners() {
        return apiPartnerRepository.findByIsApprovedFalse();
    }

    // 2. Approve a ApiPartner
    @Transactional
    public ApiPartner approveApiPartner(Long id) {
        ApiPartner apiPartner = getApiPartnerById(id);
        apiPartner.setApproved(true);
        apiPartner.setUpdatedAt(LocalDateTime.now());
        ApiPartner savedApiPartner = apiPartnerRepository.save(apiPartner);
        ApiPartnerWallet w = new ApiPartnerWallet();
        ApiPartner apRef = new ApiPartner();
        apRef.setId(savedApiPartner.getId());
        w.setApiPartner(apRef);
        w.setAvailableBalance(BigDecimal.ZERO);
        w.setLastUpdatedAmount(BigDecimal.ZERO);
        w.setLastUpdatedAt(LocalDateTime.now());
        w.setTotalCash(BigDecimal.ZERO);
        w.setCutOfAmount(BigDecimal.ZERO);
        apiPartnerWalletRepository.save(w);
        // Create user login credentials when approved
        userService.createAndSendCredentials(
                apiPartner.getContactPerson().getEmail(),
                "ApiPartner",
                null
        );

        return apiPartner;
    }

    // 3. Reject a apiPartner
    @Transactional
    public void rejectApiPartner(Long id) {
        ApiPartner apiPartner = getApiPartnerById(id);
        apiPartnerRepository.delete(apiPartner);
    }

    public ApiPartner getApiPartnerByEmail(String email) {
        return apiPartnerRepository.findByContactPerson_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("ApiPartner not found with email " + email));
    }

    public BigDecimal getWalletBalance(Long apiPartnerId) {
        return apiPartnerWalletRepository.findByApiPartnerId(apiPartnerId)
                .map(ApiPartnerWallet::getAvailableBalance)
                .orElse(BigDecimal.ZERO); // if wallet row not present yet
    }



    public List<ApiPartnerProductsDTO> getProductsOfApiPartner(Long apiPartnerId) {


        return apiPartnerSchemeAssignmentService.getAllProductsOfApiPartner(apiPartnerId);

    }


    public List<ApiPartnerListDTO> getAllApiPartners() {
        return apiPartnerRepository.findAll()
                .stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }


    public ApiPartnerWalletRepository getApiPartnerWalletRepository() {
        return apiPartnerWalletRepository;
    }
}
