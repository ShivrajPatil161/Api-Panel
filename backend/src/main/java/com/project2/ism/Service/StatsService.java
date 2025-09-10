package com.project2.ism.Service;


import com.project2.ism.DTO.*;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class StatsService {

    private final FranchiseRepository franchiseRepository;
    private final MerchantRepository merchantRepository;
    private final OutwardTransactionRepository outwardTransactionRepository;
    private final ProductSerialsRepository productSerialsRepository;

    private final FranchiseService franchiseService;
    private final MerchantService merchantService;

    private final ProductSerialsRepository serialRepo;


    private final InwardTransactionRepository inwardTransactionRepository;




    public StatsService(FranchiseRepository franchiseRepository, MerchantRepository merchantRepository, OutwardTransactionRepository outwardTransactionRepository, ProductSerialsRepository productSerialsRepository, FranchiseService franchiseService, MerchantService merchantService, ProductSerialsRepository serialRepo, InwardTransactionRepository inwardTransactionRepository) {
        this.franchiseRepository = franchiseRepository;
        this.merchantRepository = merchantRepository;
        this.outwardTransactionRepository = outwardTransactionRepository;
        this.productSerialsRepository = productSerialsRepository;
        this.franchiseService = franchiseService;
        this.merchantService = merchantService;
        this.serialRepo = serialRepo;
        this.inwardTransactionRepository = inwardTransactionRepository;
    }

    public FranchiseStatsDTO getFranchiseStats(Long franchiseId) {
        Long merchantCount = merchantRepository.countByFranchiseId(franchiseId);
        Long outwardCount = outwardTransactionRepository.countByFranchiseId(franchiseId);
        BigDecimal wallet = franchiseRepository.findById(franchiseId)
                .map(Franchise::getWalletBalance).orElse(BigDecimal.ZERO);

        // ✅ fetch product-level stats
        List<FranchiseProductSummaryDTO> productSummary = franchiseService.getProductsOfFranchise(franchiseId);

        return new FranchiseStatsDTO(franchiseId, merchantCount, outwardCount, wallet, productSummary);
    }

    public MerchantStatsDTO getMerchantStats(Long merchantId) {
        Long outwardCount = outwardTransactionRepository.countByMerchantId(merchantId);
        Long allocatedProducts = productSerialsRepository.countByMerchantId(merchantId);
        BigDecimal wallet = merchantRepository.findById(merchantId)
                .map(Merchant::getWalletBalance).orElse(BigDecimal.ZERO);

        // ✅ fetch product-level stats
        List<MerchantProductSummaryDTO> productSummary = merchantService.getProductsOfMerchant(merchantId);

        return new MerchantStatsDTO(merchantId, outwardCount,  allocatedProducts,productSummary);
    }

    public InventoryTransactionStatsDTO getTransactionStats() {
        InventoryTransactionStatsDTO dto = new InventoryTransactionStatsDTO();

        // basic counts
        dto.totalInwardTransactions = inwardTransactionRepository.count();
        dto.totalOutwardTransactions = outwardTransactionRepository.count();
        //dto.totalReturnTransactions = returnRepo.count();
        dto.totalProductSerials = serialRepo.count();

        // inward grouped by vendor
        dto.inwardByVendor = inwardTransactionRepository.countGroupByVendor();

        // outward grouped by customer type
        dto.outwardByCustomer = outwardTransactionRepository.countByCustomerType();

        // return reasons distribution
        //dto.returnReasons = returnRepo.countGroupByReason();

        // serial number status
        dto.productSerialStatus = serialRepo.countByStatus();

        return dto;
    }
}
