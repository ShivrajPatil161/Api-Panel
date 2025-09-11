package com.project2.ism.Service;


import com.project2.ism.DTO.*;
import com.project2.ism.DTO.ReportDTO.FranchiseReportsDTO;
import com.project2.ism.DTO.ReportDTO.ProductDetailDTO;
import com.project2.ism.DTO.ReportDTO.VendorDetailDTO;
import com.project2.ism.DTO.ReportDTO.VendorReportsDTO;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatsService {

    private final FranchiseRepository franchiseRepository;
    private final MerchantRepository merchantRepository;
    private final OutwardTransactionRepository outwardTransactionRepository;
    private final ProductSerialsRepository productSerialsRepository;
    private final ProductRepository productRepository;
    private final FranchiseService franchiseService;
    private final MerchantService merchantService;

    private final VendorRepository vendorRepository;

    private final VendorRatesRepository vendorRatesRepository;

    private final InwardTransactionRepository inwardTransactionRepository;




    public StatsService(FranchiseRepository franchiseRepository, MerchantRepository merchantRepository, OutwardTransactionRepository outwardTransactionRepository, ProductSerialsRepository productSerialsRepository, ProductRepository productRepository, FranchiseService franchiseService, MerchantService merchantService, VendorRepository vendorRepository, VendorRatesRepository vendorRatesRepository, InwardTransactionRepository inwardTransactionRepository) {
        this.franchiseRepository = franchiseRepository;
        this.merchantRepository = merchantRepository;
        this.outwardTransactionRepository = outwardTransactionRepository;
        this.productSerialsRepository = productSerialsRepository;
        this.productRepository = productRepository;
        this.franchiseService = franchiseService;
        this.merchantService = merchantService;
        this.vendorRepository = vendorRepository;
        this.vendorRatesRepository = vendorRatesRepository;
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
        dto.totalProductSerials = productSerialsRepository.count();

        // inward grouped by vendor
        dto.inwardByVendor = inwardTransactionRepository.countGroupByVendor();

        // outward grouped by customer type
        dto.outwardByCustomer = outwardTransactionRepository.countByCustomerType();

        // return reasons distribution
        //dto.returnReasons = returnRepo.countGroupByReason();

        // serial number status
        dto.productSerialStatus = productSerialsRepository.countByStatus();

        return dto;
    }
    public VendorStatsDTO getVendorStats() {
        VendorStatsDTO dto = new VendorStatsDTO();

        // Vendors
        dto.totalVendors = vendorRepository.count();
        dto.activeVendors = vendorRepository.countByStatus(true);
        dto.inactiveVendors = vendorRepository.countByStatus(false);

        // Vendor Rates
        dto.totalVendorRates = vendorRatesRepository.count();
        LocalDate today = LocalDate.now();
        dto.activeVendorRates = vendorRatesRepository.countByEffectiveDateBeforeAndExpiryDateAfter(today, today);

        // Total Monthly Rent
        dto.totalMonthlyRent = vendorRatesRepository.sumActiveMonthlyRent(today, today);

        // Card Type Distribution
        dto.cardTypeDistribution = vendorRatesRepository.countGroupByCardType();

        return dto;
    }

    public VendorReportsDTO getVendorReports(){
// NEW: Vendors + their products + device counts
        VendorReportsDTO dto = new VendorReportsDTO();

        List<VendorDetailDTO> vendorDetails = vendorRepository.findAll().stream()
                .map(vendor -> {
                    VendorDetailDTO vdto = new VendorDetailDTO();
                    vdto.setVendorId(vendor.getId());
                    vdto.setVendorName(vendor.getName());

                    List<ProductDetailDTO> products = productRepository.findByVendorId(vendor.getId())
                            .stream()
                            .map(product -> {
                                ProductDetailDTO pdto = new ProductDetailDTO();
                                pdto.setProductId(product.getId());
                                pdto.setProductName(product.getProductName());
                                pdto.setTotalDevices(productSerialsRepository.countByProductId(product.getId()));
                                return pdto;
                            })
                            .collect(Collectors.toList());

                    vdto.setProducts(products);
                    return vdto;
                })
                .toList();

        dto.setVendors(vendorDetails);

        return dto;
    }

    public List<FranchiseReportsDTO> getFranchiseReports() {
        return franchiseRepository.getFranchiseReports();
    }
}
