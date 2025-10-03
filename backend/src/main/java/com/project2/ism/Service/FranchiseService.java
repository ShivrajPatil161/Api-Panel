
package com.project2.ism.Service;

import com.project2.ism.DTO.*;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.*;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.Users.BankDetails;
import com.project2.ism.Model.Users.Franchise;

import com.project2.ism.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class FranchiseService {

    private final FranchiseRepository franchiseRepository;
    private final FileStorageService fileStorageService;
    private final UserService userService;
    private final MerchantRepository merchantRepository;
    private final MerchantWalletRepository merchantWalletRepository;

    private final ProductSerialsRepository serialRepo;
    private final OutwardTransactionRepository outwardRepo;

    private final FranchiseWalletRepository franchiseWalletRepository;
    public FranchiseService(FranchiseRepository franchiseRepository,
                            FileStorageService fileStorageService,
                            UserService userService, MerchantRepository merchantRepository, MerchantWalletRepository merchantWalletRepository, ProductSerialsRepository serialRepo, OutwardTransactionRepository outwardRepo, FranchiseWalletRepository franchiseWalletRepository) {
        this.franchiseRepository = franchiseRepository;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
        this.merchantRepository = merchantRepository;
        this.merchantWalletRepository = merchantWalletRepository;
        this.serialRepo = serialRepo;
        this.outwardRepo = outwardRepo;
        this.franchiseWalletRepository = franchiseWalletRepository;
    }

    public void createFranchise(FranchiseFormDTO dto) {
        Franchise franchise = new Franchise();

        // Basic details
        franchise.setFranchiseName(dto.getFranchiseName());
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
        if (dto.getPanCardDocument() != null && !dto.getPanCardDocument().isEmpty()) {
            docs.setPanProof(fileStorageService.store(dto.getPanCardDocument(), "franchise_pan"));
        }
        if (dto.getGstCertificate() != null && !dto.getGstCertificate().isEmpty()) {
            docs.setGstCertificateProof(fileStorageService.store(dto.getGstCertificate(), "franchise_gst"));
        }
        if (dto.getAddressProof() != null && !dto.getAddressProof().isEmpty()) {
            docs.setAddressProof(fileStorageService.store(dto.getAddressProof(), "franchise_address"));
        }
        if (dto.getBankProof() != null && !dto.getBankProof().isEmpty()) {
            docs.setBankAccountProof(fileStorageService.store(dto.getBankProof(), "franchise_bank"));
        }
        if (dto.getFranchiseAgreement() != null && !dto.getFranchiseAgreement().isEmpty()) {
            docs.setOther1(fileStorageService.store(dto.getFranchiseAgreement(), "franchise_agreement"));
        }
        franchise.setUploadDocuments(docs);

        // Set default values
        franchise.setStatus("ACTIVE");
        franchise.setCreatedAt(LocalDateTime.now());
        franchise.setUpdatedAt(LocalDateTime.now());


        Franchise saved = franchiseRepository.save(franchise);

        FranchiseWallet w = new FranchiseWallet();
        Franchise fRef = new Franchise();
        fRef.setId(saved.getId());
      
        w.setFranchise(fRef);
        w.setAvailableBalance(BigDecimal.ZERO);
        w.setLastUpdatedAmount(BigDecimal.ZERO);
        w.setLastUpdatedAt(LocalDateTime.now());
        w.setTotalCash(BigDecimal.ZERO);
        w.setCutOfAmount(BigDecimal.ZERO);
        w.setUsedCash(BigDecimal.ZERO);
        franchiseWalletRepository.save(w);
        // Create login credentials
        userService.createAndSendCredentials(
                dto.getPrimaryContactEmail(),
                "FRANCHISE",
                null
        );
    }

    public List<FranchiseListDTO> getAllFranchisesForList() {
        Map<Long, BigDecimal> walletBalances = franchiseWalletRepository.findAll().stream()
                .collect(Collectors.toMap(wallet -> wallet.getFranchise().getId(),
                        FranchiseWallet::getAvailableBalance));

        return franchiseRepository.findAll()
                .stream()
                .map(franchise -> {
                    Long merchantCount = merchantRepository.countByFranchiseId(franchise.getId());
                    BigDecimal walletBalance = walletBalances.getOrDefault(franchise.getId(), BigDecimal.ZERO);
                    return mapToListDTO(franchise, walletBalance, merchantCount);
                })
                .collect(Collectors.toList());

    }

    public List<FranchiseListDTO> getAllFranchisesWithMerchantCount() {
        return franchiseRepository.findAllWithMerchantCount();
    }


    public Franchise getFranchiseById(Long id) {

        return franchiseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found with ID: " + id));
    }

    public Franchise updateFranchise(Long id, Franchise franchiseDetails) {
        Franchise franchise = getFranchiseById(id);

        // Update basic details
        if (franchiseDetails.getFranchiseName() != null) {
            franchise.setFranchiseName(franchiseDetails.getFranchiseName());
        }
        if (franchiseDetails.getLegalName() != null) {
            franchise.setLegalName(franchiseDetails.getLegalName());
        }
        if (franchiseDetails.getBusinessType() != null) {
            franchise.setBusinessType(franchiseDetails.getBusinessType());
        }
        if (franchiseDetails.getAddress() != null) {
            franchise.setAddress(franchiseDetails.getAddress());
        }

        franchise.setUpdatedAt(LocalDateTime.now());
        return franchiseRepository.save(franchise);
    }

    public void deleteFranchise(Long id) {
        Franchise franchise = getFranchiseById(id);

        // Delete associated files
        UploadDocuments docs = franchise.getUploadDocuments();
        if (docs != null) {
            deleteDocumentFile(docs.getPanProof());
            deleteDocumentFile(docs.getGstCertificateProof());
            deleteDocumentFile(docs.getAddressProof());
            deleteDocumentFile(docs.getBankAccountProof());
            deleteDocumentFile(docs.getOther1());
            deleteDocumentFile(docs.getOther2());
            deleteDocumentFile(docs.getOther3());
        }

        franchiseRepository.delete(franchise);
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

    private FranchiseListDTO mapToListDTO(Franchise franchise,BigDecimal walletBalance, Long merchantCount) {
        return new FranchiseListDTO(
                franchise.getId(),
                franchise.getFranchiseName(),
                franchise.getContactPerson() != null ? franchise.getContactPerson().getName() : null,
                franchise.getContactPerson() != null ? franchise.getContactPerson().getEmail() : null,
                franchise.getContactPerson() != null ? franchise.getContactPerson().getPhoneNumber() : null,
                franchise.getAddress(),
                merchantCount,
                walletBalance != null ? walletBalance : BigDecimal.ZERO,
                franchise.getStatus() != null ? franchise.getStatus() : "ACTIVE",
                franchise.getCreatedAt()
        );
    }


    public Franchise getFranchiseByEmail(String email) {
        return franchiseRepository.findByContactPerson_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found with email " + email));
    }


    public List<ProductSerialNumbers> getValidPSN(Long productId,Long franchiseId){
        return serialRepo.findByFranchise_IdAndProduct_IdAndMerchant_IdIsNullAndReceivedDateByFranchiseIsNotNull(franchiseId,productId);

    }
//    public List<ProductSerialNumbers> getInTransitPSN(Long outwardID) {
//        return serialRepo.findByOutwardTransaction_IdAndMerchantIsNotNullAndReceivedDateIsNull(outwardID);
//    }



//    public List<FranchiseProductSummaryDTO> getProductsOfFranchise(Long franchiseId) {
//        List<OutwardTransactions> outwardList = outwardRepo.findByFranchiseIdAndReceivedDateIsNotNull(franchiseId);
//
//        List<FranchiseProductSummaryDTO> result = new ArrayList<>();
//        for (OutwardTransactions o : outwardList) {
//            int totalQty = o.getQuantity();
//            int valid = getValidPSN(o.getId()).size();
//            int inTransit = getInTransitPSN(o.getId()).size();
//
//            result.add(new FranchiseProductSummaryDTO(
//                    o.getProduct().getId(),
//                    o.getProduct().getProductName(),
//                    o.getProduct().getProductCode(),
//                    o.getProduct().getProductCategory().getCategoryName(), // assuming you have category relation
//                    totalQty,
//                    valid,
//                    inTransit
//            ));
//        }
//        return result;
//    }

    public List<FranchiseProductSummaryDTO> getProductsOfFranchise(Long franchiseId) {

        // Fetch all PSNs for the franchise
        List<ProductSerialNumbers> psns = serialRepo.findByFranchise_IdAndReceivedDateByFranchiseIsNotNull(franchiseId);

        // Map<productId, DTO> for aggregation
        Map<Long, FranchiseProductSummaryDTO> summaryMap = new HashMap<>();

        for (ProductSerialNumbers psn : psns) {
            Product product = psn.getProduct();
            Long productId = product.getId();

            // Aggregate per product
            FranchiseProductSummaryDTO dto = summaryMap.get(productId);
            if (dto == null) {
                dto = new FranchiseProductSummaryDTO(
                        productId,
                        product.getProductName(),
                        product.getProductCode(),
                        product.getProductCategory().getCategoryName(),
                        0,
                        0,
                        0
                );
                summaryMap.put(productId, dto);
            }

            // Total quantity = all PSNs
            dto.setTotalQuantity(dto.getTotalQuantity() + 1);

            // Valid = franchise has received, but merchant is still null
            if (psn.getReceivedDateByFranchise() != null && psn.getMerchant() == null) {
                dto.setValid(dto.getValid() + 1);
            }

            // In transit = franchise has received and merchant assigned, but merchant hasn't received physically
            if (psn.getReceivedDateByFranchise() != null && psn.getMerchant() != null && psn.getReceivedDate() == null) {
                dto.setInTransit(dto.getInTransit() + 1);
            }
        }

        return new ArrayList<>(summaryMap.values());
    }



    public FranchiseMerchantStatsDTO getStats() {
        FranchiseMerchantStatsDTO dto = new FranchiseMerchantStatsDTO();

        dto.totalFranchises = franchiseRepository.count();
        dto.totalMerchants = merchantRepository.count();
        dto.totalDirectMerchants = merchantRepository.countDirectMerchants();
        dto.totalFranchiseMerchants = merchantRepository.countFranchiseMerchants();

        dto.totalFranchiseWalletBalance = franchiseWalletRepository.getTotalFranchiseWalletBalance();
        dto.totalDirectMerchantWalletBalance = merchantWalletRepository.getTotalDirectMerchantWalletBalance();
        dto.totalFranchiseMerchantWalletBalance = merchantWalletRepository.getTotalFranchiseMerchantWalletBalance();

        dto.merchantsPerFranchise = merchantRepository.countByFranchise().stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (Long) row[1]
                ));

        return dto;
    }

    public BigDecimal getWalletBalance(Long franchiseId) {
        return franchiseWalletRepository.findByFranchiseId(franchiseId)
                .map(FranchiseWallet::getAvailableBalance)
                .orElse(BigDecimal.ZERO); // if wallet row not present yet
    }
}