package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.MerchantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    public Merchant createMerchant(Merchant merchant) {
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
        return merchantRepository.findByFranchiseId(franchiseId);
    }
}