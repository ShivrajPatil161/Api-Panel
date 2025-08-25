package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Repository.MerchantRepository;
import com.project2.ism.Repository.ProductSerialsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSerialService {


    private final ProductSerialsRepository serialRepo;
    private final MerchantRepository merchantRepo;

    public ProductSerialService(ProductSerialsRepository serialRepo, MerchantRepository merchantRepo) {
        this.serialRepo = serialRepo;
        this.merchantRepo = merchantRepo;
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
}

