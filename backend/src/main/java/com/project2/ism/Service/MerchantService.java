//package com.project2.ism.Service;
//
//import com.project2.ism.DTO.MerchantFormDTO;
//import com.project2.ism.Exception.ResourceNotFoundException;
//import com.project2.ism.Model.ContactPerson;
//import com.project2.ism.Model.UploadDocuments;
//import com.project2.ism.Model.Users.BankDetails;
//import com.project2.ism.Model.Users.Merchant;
//import com.project2.ism.Repository.FranchiseRepository;
//import com.project2.ism.Repository.MerchantRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class MerchantService {
//
//    private final MerchantRepository merchantRepository;
//    private final FranchiseRepository franchiseRepository;
//
//
//    private final FileStorageService fileStorageService;
//
//    private final UserService userService;
//
//    public MerchantService(MerchantRepository merchantRepository, FranchiseRepository franchiseRepository, FileStorageService fileStorageService, UserService userService) {
//        this.merchantRepository = merchantRepository;
//        this.fileStorageService = fileStorageService;
//        this.franchiseRepository = franchiseRepository;
//        this.userService = userService;
//    }
//
//    public void createMerchant(MerchantFormDTO dto) {
//        // Check if franchise is provided
//            //System.out.printf(String.valueOf(franchiseId));
//            // Verify if franchise exists
//            boolean exists = franchiseRepository.existsById(dto.getFranchiseId());
//            if (!exists) {
//                throw new IllegalArgumentException("Franchise with ID " + dto.getFranchiseId() + " does not exist");
//            }
//        Merchant merchant = new Merchant();
//
//        merchant.setBusinessName(dto.getBusinessName());
//        // Basic details
//        merchant.setLegalName(dto.getLegalName());
//        merchant.setBusinessType(dto.getBusinessType());
//        merchant.setGstNumber(dto.getGstNumber());
//        merchant.setPanNumber(dto.getPanNumber());
//        merchant.setRegistrationNumber(dto.getRegistrationNumber());
//        merchant.setAddress(dto.getBusinessAddress());
//
//        // Contact Person
//        ContactPerson contact = new ContactPerson();
//        contact.setName(dto.getPrimaryContactName());
//        contact.setPhoneNumber(dto.getPrimaryContactMobile());
//        contact.setAlternatePhoneNum(dto.getAlternateContactMobile());
//        contact.setEmail(dto.getPrimaryContactEmail());
//        contact.setLandlineNumber(dto.getLandlineNumber());
//        merchant.setContactPerson(contact);
//
//        // Bank Details
//        BankDetails bank = new BankDetails();
//        bank.setBankName(dto.getBankName());
//        bank.setAccountHolderName(dto.getAccountHolderName());
//        bank.setAccountNumber(dto.getAccountNumber());
//        bank.setIfsc(dto.getIfscCode());
//        bank.setBranchName(dto.getBranchName());
//        bank.setAccountType(dto.getAccountType());
//        merchant.setBankDetails(bank);
//
//        // Upload Documents
//        UploadDocuments docs = new UploadDocuments();
//        docs.setPanProof(fileStorageService.store(dto.getPanCardDocument(), "pan"));
//        docs.setGstCertificateProof(fileStorageService.store(dto.getGstCertificate(), "gst"));
//        docs.setAddressProof(fileStorageService.store(dto.getAddressProof(), "address"));
//        docs.setBankAccountProof(fileStorageService.store(dto.getBankProof(), "bank"));
//        merchant.setUploadDocuments(docs);
//
//        merchantRepository.save(merchant);
//        userService.createAndSendCredentials(
//                "htaien277353@gmail.com",
//                "MERCHANT",
//                null
//        );
//
//
//    }
//
//    public List<Merchant> getAllMerchants() {
//        return merchantRepository.findAll();
//    }
//
//    public Merchant getMerchantById(Long id) {
//        return merchantRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + id));
//    }
//
//    public Merchant updateMerchant(Long id, Merchant merchantDetails) {
//        Merchant merchant = getMerchantById(id);
//        merchant.setBusinessName(merchantDetails.getBusinessName());
//        merchant.setFranchise(merchantDetails.getFranchise()); // Optional if you allow changing Franchise
//        // Map other fields from CustomerBase if needed
//        return merchantRepository.save(merchant);
//    }
//
//    public void deleteMerchant(Long id) {
//        Merchant merchant = getMerchantById(id);
//        merchantRepository.delete(merchant);
//    }
//
//    public List<Merchant> getMerchantsByFranchise(Long franchiseId) {
//        return merchantRepository.findByFranchiseId(franchiseId);
//    }
//}





package com.project2.ism.Service;

import com.project2.ism.DTO.MerchantFormDTO;
import com.project2.ism.DTO.MerchantListDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ContactPerson;
import com.project2.ism.Model.UploadDocuments;
import com.project2.ism.Model.Users.BankDetails;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.FranchiseRepository;
import com.project2.ism.Repository.MerchantRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MerchantService {

    private final MerchantRepository merchantRepository;
    private final FranchiseRepository franchiseRepository;
    private final FileStorageService fileStorageService;
    private final UserService userService;

    public MerchantService(MerchantRepository merchantRepository,
                           FranchiseRepository franchiseRepository,
                           FileStorageService fileStorageService,
                           UserService userService) {
        this.merchantRepository = merchantRepository;
        this.franchiseRepository = franchiseRepository;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
    }

    public void createMerchant(MerchantFormDTO dto) {
        Merchant merchant = new Merchant();

        // Set franchise if provided
        if (dto.getFranchiseId() != null) {
            Franchise franchise = franchiseRepository.findById(dto.getFranchiseId())
                    .orElseThrow(() -> new IllegalArgumentException("Franchise with ID " + dto.getFranchiseId() + " does not exist"));
            merchant.setFranchise(franchise);
        }

        // Basic details
        merchant.setBusinessName(dto.getBusinessName());
        merchant.setLegalName(dto.getLegalName());
        merchant.setBusinessType(dto.getBusinessType());
        merchant.setGstNumber(dto.getGstNumber());
        merchant.setPanNumber(dto.getPanNumber());
        merchant.setRegistrationNumber(dto.getRegistrationNumber());
        merchant.setAddress(dto.getBusinessAddress());

        // Contact Person
        ContactPerson contact = new ContactPerson();
        contact.setName(dto.getPrimaryContactName());
        contact.setPhoneNumber(dto.getPrimaryContactMobile());
        contact.setAlternatePhoneNum(dto.getAlternateContactMobile());
        contact.setEmail(dto.getPrimaryContactEmail());
        contact.setLandlineNumber(dto.getLandlineNumber());
        merchant.setContactPerson(contact);

        // Bank Details
        BankDetails bank = new BankDetails();
        bank.setBankName(dto.getBankName());
        bank.setAccountHolderName(dto.getAccountHolderName());
        bank.setAccountNumber(dto.getAccountNumber());
        bank.setIfsc(dto.getIfscCode());
        bank.setBranchName(dto.getBranchName());
        bank.setAccountType(dto.getAccountType());
        merchant.setBankDetails(bank);

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
        merchant.setUploadDocuments(docs);

        // Set default values
        merchant.setStatus("ACTIVE");
        merchant.setWalletBalance(BigDecimal.ZERO);
        merchant.setMonthlyRevenue(BigDecimal.ZERO);
        merchant.setProducts(0);
        merchant.setCreatedAt(LocalDateTime.now());
        merchant.setUpdatedAt(LocalDateTime.now());

        merchantRepository.save(merchant);

        // Create login credentials
       if(dto.isApproved()){
           merchant.setApproved(true);
           userService.createAndSendCredentials(
                   dto.getPrimaryContactEmail(),
                   "MERCHANT",
                   null
           );
       }

    }

    public List<MerchantListDTO> getAllMerchantsForList() {
        return merchantRepository.findAll()
                .stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
    }

    public Merchant getMerchantById(Long id) {
        return merchantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + id));
    }

    public Merchant updateMerchant(Long id, Merchant merchantDetails) {
        Merchant merchant = getMerchantById(id);

        // Update basic details
        if (merchantDetails.getBusinessName() != null) {
            merchant.setBusinessName(merchantDetails.getBusinessName());
        }
        if (merchantDetails.getLegalName() != null) {
            merchant.setLegalName(merchantDetails.getLegalName());
        }
        if (merchantDetails.getBusinessType() != null) {
            merchant.setBusinessType(merchantDetails.getBusinessType());
        }
        if (merchantDetails.getAddress() != null) {
            merchant.setAddress(merchantDetails.getAddress());
        }

        merchant.setUpdatedAt(LocalDateTime.now());
        return merchantRepository.save(merchant);
    }

    public void deleteMerchant(Long id) {
        Merchant merchant = getMerchantById(id);

        // Delete associated files
        UploadDocuments docs = merchant.getUploadDocuments();
        if (docs != null) {
            deleteDocumentFile(docs.getPanProof());
            deleteDocumentFile(docs.getGstCertificateProof());
            deleteDocumentFile(docs.getAddressProof());
            deleteDocumentFile(docs.getBankAccountProof());
            deleteDocumentFile(docs.getOther1());
            deleteDocumentFile(docs.getOther2());
            deleteDocumentFile(docs.getOther3());
        }

        merchantRepository.delete(merchant);
    }

    public List<MerchantListDTO> getMerchantsByFranchise(Long franchiseId) {
        List<Merchant> merchants = merchantRepository.findByFranchiseId(franchiseId);
        return merchants.stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());
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

    private MerchantListDTO mapToListDTO(Merchant merchant) {
        return new MerchantListDTO(
                merchant.getId(),
                merchant.getBusinessName(),
                merchant.getBusinessType(),
                merchant.getContactPerson() != null ? merchant.getContactPerson().getName() : null,
                merchant.getContactPerson() != null ? merchant.getContactPerson().getEmail() : null,
                merchant.getContactPerson() != null ? merchant.getContactPerson().getPhoneNumber() : null,
                merchant.getAddress(),
                merchant.getFranchise() != null ? merchant.getFranchise().getId() : null,
                merchant.getFranchise() != null ? merchant.getFranchise().getFranchiseName() : "Direct Merchant",
                merchant.getProducts() != null ? merchant.getProducts() : 0,
                merchant.getWalletBalance() != null ? merchant.getWalletBalance() : BigDecimal.ZERO,
                merchant.getMonthlyRevenue() != null ? merchant.getMonthlyRevenue() : BigDecimal.ZERO,
                merchant.getStatus() != null ? merchant.getStatus() : "ACTIVE",
                merchant.getCreatedAt()
        );
    }

    // 1. Get all unapproved merchants
    public List<Merchant> getUnapprovedMerchants() {
        return merchantRepository.findByIsApprovedFalse();
    }

    // 2. Approve a merchant
    @Transactional
    public Merchant approveMerchant(Long id) {
        Merchant merchant = getMerchantById(id);
        merchant.setApproved(true);
        merchant.setUpdatedAt(LocalDateTime.now());
        merchantRepository.save(merchant);

        // Create user login credentials when approved
        userService.createAndSendCredentials(
                merchant.getContactPerson().getEmail(),
                "MERCHANT",
                null
        );

        return merchant;
    }

    // 3. Reject a merchant
    @Transactional
    public void rejectMerchant(Long id) {
        Merchant merchant = getMerchantById(id);
        merchantRepository.delete(merchant);
    }

}