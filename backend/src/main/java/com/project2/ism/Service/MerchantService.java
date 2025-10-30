//
//package com.project2.ism.Service;
//
//import com.project2.ism.DTO.MerchantFormDTO;
//import com.project2.ism.DTO.MerchantListDTO;
//import com.project2.ism.DTO.MerchantProductSummaryDTO;
//import com.project2.ism.Exception.ResourceNotFoundException;
//import com.project2.ism.Model.ContactPerson;
//import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
//import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
//import com.project2.ism.Model.Product;
//import com.project2.ism.Model.MerchantWallet;
//import com.project2.ism.Model.Users.UploadDocuments;
//import com.project2.ism.Model.Users.BankDetails;
//import com.project2.ism.Model.Users.Franchise;
//import com.project2.ism.Model.Users.Merchant;
//import com.project2.ism.Repository.*;
//import jakarta.transaction.Transactional;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Service
//@Transactional
//public class MerchantService {
//
//    private final MerchantRepository merchantRepository;
////    private final FileStorageService fileStorageService;
//    private final UserService userService;
//
//
//
//    private final MerchantWalletRepository merchantWalletRepository;
//
//    public MerchantService(MerchantRepository merchantRepository,
//                           FranchiseRepository franchiseRepository,
//                           FileStorageService fileStorageService,
//                           UserService userService, OutwardTransactionRepository outwardRepo, ProductSerialsRepository serialRepo, MerchantWalletRepository merchantWalletRepository) {
//        this.merchantRepository = merchantRepository;
//        this.franchiseRepository = franchiseRepository;
//        this.fileStorageService = fileStorageService;
//        this.userService = userService;
//        this.outwardRepo = outwardRepo;
//        this.serialRepo = serialRepo;
//        this.merchantWalletRepository = merchantWalletRepository;
//    }
//
//    public void createMerchant(MerchantFormDTO dto) {
//        Merchant merchant = new Merchant();
//
//        // Set franchise if provided
//        if (dto.getFranchiseId() != null) {
//            Franchise franchise = franchiseRepository.findById(dto.getFranchiseId())
//                    .orElseThrow(() -> new IllegalArgumentException("Franchise with ID " + dto.getFranchiseId() + " does not exist"));
//            merchant.setFranchise(franchise);
//        }
//
//        // Basic details
//        merchant.setBusinessName(dto.getBusinessName());
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
//        if (dto.getPanCardDocument() != null && !dto.getPanCardDocument().isEmpty()) {
//            docs.setPanProof(fileStorageService.store(dto.getPanCardDocument(), "merchant_pan"));
//        }
//        if (dto.getGstCertificate() != null && !dto.getGstCertificate().isEmpty()) {
//            docs.setGstCertificateProof(fileStorageService.store(dto.getGstCertificate(), "merchant_gst"));
//        }
//        if (dto.getAddressProof() != null && !dto.getAddressProof().isEmpty()) {
//            docs.setAddressProof(fileStorageService.store(dto.getAddressProof(), "merchant_address"));
//        }
//        if (dto.getBankProof() != null && !dto.getBankProof().isEmpty()) {
//            docs.setBankAccountProof(fileStorageService.store(dto.getBankProof(), "merchant_bank"));
//        }
//        merchant.setUploadDocuments(docs);
//
//        // Set default values
//        merchant.setStatus("ACTIVE");
//        merchant.setWalletBalance(BigDecimal.ZERO);
//        merchant.setMonthlyRevenue(BigDecimal.ZERO);
//        merchant.setProducts(0);
//        merchant.setCreatedAt(LocalDateTime.now());
//        merchant.setUpdatedAt(LocalDateTime.now());
//
//        // Get role from JWT via SecurityContext
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String role = authentication.getAuthorities().iterator().next().getAuthority(); //e.g. ROLE_ADMIN
//
//        Merchant savedMerchant = merchantRepository.save(merchant);
//
//
//        // Set approved only if Admin or Super_Admin
//        if ("ROLE_ADMIN".equals(role) || "ROLE_SUPER_ADMIN".equals(role)) {
//            savedMerchant.setApproved(true);
//            MerchantWallet w = new MerchantWallet();
//            Merchant mRef = new Merchant();
//            mRef.setId(savedMerchant.getId());
//            w.setMerchant(mRef);
//            w.setAvailableBalance(BigDecimal.ZERO);
//            w.setLastUpdatedAmount(BigDecimal.ZERO);
//            w.setLastUpdatedAt(LocalDateTime.now());
//            w.setTotalCash(BigDecimal.ZERO);
//            w.setCutOfAmount(BigDecimal.ZERO);
//            merchantWalletRepository.save(w);
//        } else {
//            savedMerchant.setApproved(false);
////            merchantApprovalService.createApproval(savedMerchant);
//            // default
//        }
//
//        // If approved, create credentials
//        if (savedMerchant.isApproved()) {
//            userService.createAndSendCredentials(
//                    dto.getPrimaryContactEmail(),
//                    "MERCHANT",
//                    null
//            );
//        }
//
//
//    }
//
//    public List<MerchantListDTO> getAllMerchantsForList() {
//        return merchantRepository.findAll()
//                .stream()
//                .map(this::mapToListDTO)
//                .collect(Collectors.toList());
//    }
//
//    public Merchant getMerchantById(Long id) {
//        return merchantRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + id));
//    }
//
//    public Merchant updateMerchant(Long id, MerchantFormDTO dto) throws IOException {
//        Merchant merchant = getMerchantById(id);
//
//        // Update basic details (only if provided)
//        if (dto.getBusinessName() != null && !dto.getBusinessName().isEmpty()) {
//            merchant.setBusinessName(dto.getBusinessName());
//        }
//        if (dto.getLegalName() != null && !dto.getLegalName().isEmpty()) {
//            merchant.setLegalName(dto.getLegalName());
//        }
//        if (dto.getBusinessType() != null && !dto.getBusinessType().isEmpty()) {
//            merchant.setBusinessType(dto.getBusinessType());
//        }
//        if (dto.getBusinessAddress() != null && !dto.getBusinessAddress().isEmpty()) {
//            merchant.setAddress(dto.getBusinessAddress());
//        }
//        if (dto.getGstNumber() != null && !dto.getGstNumber().isEmpty()) {
//            merchant.setGstNumber(dto.getGstNumber());
//        }
//        if (dto.getPanNumber() != null && !dto.getPanNumber().isEmpty()) {
//            merchant.setPanNumber(dto.getPanNumber());
//        }
//        if (dto.getRegistrationNumber() != null && !dto.getRegistrationNumber().isEmpty()) {
//            merchant.setRegistrationNumber(dto.getRegistrationNumber());
//        }
//
//        // Update franchise relationship if provided
//        if (dto.getFranchiseId() != null) {
//            Franchise franchise = franchiseRepository.findById(dto.getFranchiseId())
//                    .orElseThrow(() -> new RuntimeException("Franchise not found"));
//            merchant.setFranchise(franchise);
//        }
//
//        // Update contact details
//        ContactPerson contactPerson = merchant.getContactPerson();
//        if (contactPerson == null) {
//            contactPerson = new ContactPerson();
//        }
//
//        if (dto.getPrimaryContactName() != null && !dto.getPrimaryContactName().isEmpty()) {
//            contactPerson.setName(dto.getPrimaryContactName());
//        }
//        if (dto.getPrimaryContactMobile() != null && !dto.getPrimaryContactMobile().isEmpty()) {
//            contactPerson.setPhoneNumber(dto.getPrimaryContactMobile());
//        }
//        if (dto.getPrimaryContactEmail() != null && !dto.getPrimaryContactEmail().isEmpty()) {
//            contactPerson.setEmail(dto.getPrimaryContactEmail());
//        }
//        if (dto.getAlternateContactMobile() != null && !dto.getAlternateContactMobile().isEmpty()) {
//            contactPerson.setAlternatePhoneNum(dto.getAlternateContactMobile());
//        }
//        if (dto.getLandlineNumber() != null && !dto.getLandlineNumber().isEmpty()) {
//            contactPerson.setLandlineNumber(dto.getLandlineNumber());
//        }
//
//        merchant.setContactPerson(contactPerson);
//
//        // Update bank details
//        BankDetails bankDetails = merchant.getBankDetails();
//        if (bankDetails == null) {
//            bankDetails = new BankDetails();
//        }
//
//        if (dto.getBankName() != null && !dto.getBankName().isEmpty()) {
//            bankDetails.setBankName(dto.getBankName());
//        }
//        if (dto.getAccountHolderName() != null && !dto.getAccountHolderName().isEmpty()) {
//            bankDetails.setAccountHolderName(dto.getAccountHolderName());
//        }
//        if (dto.getAccountNumber() != null && !dto.getAccountNumber().isEmpty()) {
//            bankDetails.setAccountNumber(dto.getAccountNumber());
//        }
//        if (dto.getIfscCode() != null && !dto.getIfscCode().isEmpty()) {
//            bankDetails.setIfsc(dto.getIfscCode());
//        }
//        if (dto.getBranchName() != null && !dto.getBranchName().isEmpty()) {
//            bankDetails.setBranchName(dto.getBranchName());
//        }
//        if (dto.getAccountType() != null && !dto.getAccountType().isEmpty()) {
//            bankDetails.setAccountType(dto.getAccountType());
//        }
//
//        merchant.setBankDetails(bankDetails);
//
//        // Handle document uploads (only if new files are provided)
//        UploadDocuments uploadDocuments = merchant.getUploadDocuments();
//        if (uploadDocuments == null) {
//            uploadDocuments = new UploadDocuments();
//        }
//
//        if (dto.getPanCardDocument() != null && !dto.getPanCardDocument().isEmpty()) {
//            String panPath = fileStorageService.store(dto.getPanCardDocument(), "merchant_pan");
//            uploadDocuments.setPanProof(panPath);
//        }
//        if (dto.getGstCertificate() != null && !dto.getGstCertificate().isEmpty()) {
//            String gstPath = fileStorageService.store(dto.getGstCertificate(), "merchant_gst");
//            uploadDocuments.setGstCertificateProof(gstPath);
//        }
//        if (dto.getAddressProof() != null && !dto.getAddressProof().isEmpty()) {
//            String addressPath = fileStorageService.store(dto.getAddressProof(), "merchant_address");
//            uploadDocuments.setAddressProof(addressPath);
//        }
//        if (dto.getBankProof() != null && !dto.getBankProof().isEmpty()) {
//            String bankPath = fileStorageService.store(dto.getBankProof(), "merchant_bank");
//            uploadDocuments.setBankAccountProof(bankPath);
//        }
//
//        merchant.setUploadDocuments(uploadDocuments);
//        merchant.setUpdatedAt(LocalDateTime.now());
//
//        return merchantRepository.save(merchant);
//    }
//    public void deleteMerchant(Long id) {
//        Merchant merchant = getMerchantById(id);
//
//        // Delete associated files
//        UploadDocuments docs = merchant.getUploadDocuments();
//        if (docs != null) {
//            deleteDocumentFile(docs.getPanProof());
//            deleteDocumentFile(docs.getGstCertificateProof());
//            deleteDocumentFile(docs.getAddressProof());
//            deleteDocumentFile(docs.getBankAccountProof());
//            deleteDocumentFile(docs.getOther1());
//            deleteDocumentFile(docs.getOther2());
//            deleteDocumentFile(docs.getOther3());
//        }
//
//        merchantRepository.delete(merchant);
//    }
//
//
//    public List<MerchantListDTO> getMerchantsByFranchise(Long franchiseId) {
//        List<Merchant> merchants = merchantRepository.findByFranchiseId(franchiseId);
//        return merchants.stream()
//                .map(this::mapToListDTO)
//                .collect(Collectors.toList());
//    }
//
//    private void deleteDocumentFile(String filePath) {
//        if (filePath != null && !filePath.isEmpty()) {
//            try {
//                fileStorageService.deleteFile(filePath);
//            } catch (Exception e) {
//                // Log error but don't fail the deletion
//                System.err.println("Failed to delete file: " + filePath + " - " + e.getMessage());
//            }
//        }
//    }
//
//    private MerchantListDTO mapToListDTO(Merchant merchant) {
//        return new MerchantListDTO(
//                merchant.getId(),
//                merchant.getBusinessName(),
//                merchant.getBusinessType(),
//                merchant.getContactPerson() != null ? merchant.getContactPerson().getName() : null,
//                merchant.getContactPerson() != null ? merchant.getContactPerson().getEmail() : null,
//                merchant.getContactPerson() != null ? merchant.getContactPerson().getPhoneNumber() : null,
//                merchant.getAddress(),
//                merchant.getFranchise() != null ? merchant.getFranchise().getId() : null,
//                merchant.getFranchise() != null ? merchant.getFranchise().getFranchiseName() : "Direct Merchant",
//                merchant.getProducts() != null ? merchant.getProducts() : 0,
//                getWalletBalance(merchant.getId()),
//                merchant.getMonthlyRevenue() != null ? merchant.getMonthlyRevenue() : BigDecimal.ZERO,
//                merchant.getStatus() != null ? merchant.getStatus() : "ACTIVE",
//                merchant.getCreatedAt()
//        );
//
//    }
//    // 1. Get all unapproved merchants
//    public List<Merchant> getUnapprovedMerchants() {
//        return merchantRepository.findByIsApprovedFalse();
//    }
//
//    // 2. Approve a merchant
//    @Transactional
//    public Merchant approveMerchant(Long id) {
//        Merchant merchant = getMerchantById(id);
//        merchant.setApproved(true);
//        merchant.setUpdatedAt(LocalDateTime.now());
//        Merchant savedMerchant = merchantRepository.save(merchant);
//        MerchantWallet w = new MerchantWallet();
//        Merchant mRef = new Merchant();
//        mRef.setId(savedMerchant.getId());
//        w.setMerchant(mRef);
//        w.setAvailableBalance(BigDecimal.ZERO);
//        w.setLastUpdatedAmount(BigDecimal.ZERO);
//        w.setLastUpdatedAt(LocalDateTime.now());
//        w.setTotalCash(BigDecimal.ZERO);
//        w.setCutOfAmount(BigDecimal.ZERO);
//        merchantWalletRepository.save(w);
//        // Create user login credentials when approved
//        userService.createAndSendCredentials(
//                merchant.getContactPerson().getEmail(),
//                "MERCHANT",
//                null
//        );
//
//        return merchant;
//    }
//
//    // 3. Reject a merchant
//    @Transactional
//    public void rejectMerchant(Long id) {
//        Merchant merchant = getMerchantById(id);
//        merchantRepository.delete(merchant);
//    }
//
//    public Merchant getMerchantByEmail(String email) {
//        return merchantRepository.findByContactPerson_Email(email)
//                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with email " + email));
//    }
//
//    public BigDecimal getWalletBalance(Long merchantId) {
//        return merchantWalletRepository.findByMerchantId(merchantId)
//                .map(MerchantWallet::getAvailableBalance)
//                .orElse(BigDecimal.ZERO); // if wallet row not present yet
//    }
//    public List<MerchantProductSummaryDTO> getProductsOfMerchant(Long merchantId) {
//        // ✅ Step 1: Check if merchant belongs to a franchise
//        boolean belongsToFranchise = merchantRepository.findFranchiseByMerchantId(merchantId).isPresent();
//
//        List<MerchantProductSummaryDTO> result = new ArrayList<>();
//
//        if (!belongsToFranchise) {
//            // ✅ Case 1: Independent Merchant → use outward transactions
//            List<OutwardTransactions> outwardList = outwardRepo.findByMerchantId(merchantId);
//
//            for (OutwardTransactions o : outwardList) {
//                int totalQty = o.getQuantity();
//
//                result.add(new MerchantProductSummaryDTO(
//                        o.getId(),
//                        o.getProduct().getId(),
//                        o.getProduct().getProductName(),
//                        o.getProduct().getProductCode(),
//                        o.getProduct().getProductCategory().getCategoryName(),
//                        totalQty
//                ));
//            }
//
//        } else {
//            // ✅ Case 2: Merchant under a Franchise → use product serial numbers
//            List<ProductSerialNumbers> serials = serialRepo.findByMerchant_Id(merchantId);
//
//            // Group by product
//            Map<Product, Long> grouped = serials.stream()
//                    .collect(Collectors.groupingBy(ProductSerialNumbers::getProduct, Collectors.counting()));
//
//            for (Map.Entry<Product, Long> entry : grouped.entrySet()) {
//                Product p = entry.getKey();
//                long qty = entry.getValue();
//
//                result.add(new MerchantProductSummaryDTO(
//
//                        p.getId(),
//                        p.getProductName(),
//                        p.getProductCode(),
//                        p.getProductCategory().getCategoryName(),
//                        (int) qty
//                ));
//            }
//        }
//
//        return result;
//    }
//
//
//    public List<MerchantListDTO> getAllDirectMerchantsForList() {
//        return merchantRepository.findByFranchiseIsNull()
//                .stream()
//                .map(this::mapToListDTO)
//                .collect(Collectors.toList());
//    }
//
//    public List<MerchantListDTO> getAllFranchiseMerchantsForList() {
//        return merchantRepository.findByFranchiseIsNotNull()
//                .stream()
//                .map(this::mapToListDTO)
//                .collect(Collectors.toList());
//    }
//}
