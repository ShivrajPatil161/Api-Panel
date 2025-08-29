package com.project2.ism.Service;

import com.project2.ism.DTO.InventoryTransactionStatsDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Repository.InwardTransactionRepository;
import com.project2.ism.Repository.MerchantRepository;
import com.project2.ism.Repository.OutwardTransactionRepository;
import com.project2.ism.Repository.ProductSerialsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSerialService {


    private final ProductSerialsRepository serialRepo;
    private final MerchantRepository merchantRepo;

    private final InwardTransactionRepository inwardTransactionRepository;

    private final OutwardTransactionRepository outwardTransactionRepository;



    public ProductSerialService(ProductSerialsRepository serialRepo, MerchantRepository merchantRepo, InwardTransactionRepository inwardTransactionRepository, OutwardTransactionRepository outwardTransactionRepository) {
        this.serialRepo = serialRepo;
        this.merchantRepo = merchantRepo;
        this.inwardTransactionRepository = inwardTransactionRepository;
        this.outwardTransactionRepository = outwardTransactionRepository;
    }

    @Transactional
    public void assignSerialsToMerchant(Long merchantId, List<Long> serialIds) {
        // ✅ make sure merchant exists
        if (!merchantRepo.existsById(merchantId)) {
            throw new ResourceNotFoundException("Merchant not found with id: " + merchantId);
        }

        // ✅ perform bulk update
        int updated = serialRepo.assignMerchantToSerials(merchantId, serialIds);

        if (updated != serialIds.size()) {
            throw new IllegalStateException("Some serial IDs were not updated. Check if IDs exist.");
        }
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

