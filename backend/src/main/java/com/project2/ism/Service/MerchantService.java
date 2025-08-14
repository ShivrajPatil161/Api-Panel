package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.FranchiseRepository;
import com.project2.ism.Repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;

    private final FranchiseRepository franchiseRepository;

    public MerchantService(MerchantRepository merchantRepository, FranchiseRepository franchiseRepository) {
        this.merchantRepository = merchantRepository;
        this.franchiseRepository = franchiseRepository;
    }

    public Merchant createMerchant(Merchant merchant) {
        // Check if franchise is provided

        if (merchant.getFranchise() != null && merchant.getFranchise().getId() != null) {
            Long franchiseId = merchant.getFranchise().getId();
            System.out.printf(String.valueOf(franchiseId));
            // Verify if franchise exists
            boolean exists = franchiseRepository.existsById(franchiseId);
            if (!exists) {
                throw new IllegalArgumentException("Franchise with ID " + franchiseId + " does not exist");
            }
        }

        // Save and return
        return merchantRepository.save(merchant);
    }

    public List<Merchant> getAllMerchants() {
        return merchantRepository.findAll();
    }

    public Merchant getMerchantById(Long id) {
        return merchantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found with ID: " + id));
    }

    public Merchant updateMerchant(Long id, Merchant merchantDetails) {
        Merchant merchant = getMerchantById(id);
        merchant.setBusinessName(merchantDetails.getBusinessName());
        merchant.setFranchise(merchantDetails.getFranchise()); // Optional if you allow changing Franchise
        // Map other fields from CustomerBase if needed
        return merchantRepository.save(merchant);
    }

    public void deleteMerchant(Long id) {
        Merchant merchant = getMerchantById(id);
        merchantRepository.delete(merchant);
    }

    public List<Merchant> getMerchantsByFranchise(Long franchiseId) {
        // Optional: check if franchise exists
        if (!franchiseRepository.existsById(franchiseId)) {
            throw new IllegalArgumentException("Franchise not found with ID " + franchiseId);
        }
        return merchantRepository.findByFranchiseId(franchiseId);
    }
}