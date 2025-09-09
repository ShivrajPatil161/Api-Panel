package com.project2.ism.Service;


import com.project2.ism.DTO.FranchiseProductSummaryDTO;
import com.project2.ism.DTO.FranchiseStatsDTO;
import com.project2.ism.DTO.MerchantProductSummaryDTO;
import com.project2.ism.DTO.MerchantStatsDTO;
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


    public StatsService(FranchiseRepository franchiseRepository, MerchantRepository merchantRepository, OutwardTransactionRepository outwardTransactionRepository, ProductSerialsRepository productSerialsRepository, FranchiseService franchiseService, MerchantService merchantService) {
        this.franchiseRepository = franchiseRepository;
        this.merchantRepository = merchantRepository;
        this.outwardTransactionRepository = outwardTransactionRepository;
        this.productSerialsRepository = productSerialsRepository;
        this.franchiseService = franchiseService;
        this.merchantService = merchantService;
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

}
