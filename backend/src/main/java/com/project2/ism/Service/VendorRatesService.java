package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Vendor.VendorRates;
import com.project2.ism.Repository.VendorRatesRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorRatesService {

    private final VendorRatesRepository vendorRatesRepository;

    public VendorRatesService(VendorRatesRepository vendorRatesRepository) {
        this.vendorRatesRepository = vendorRatesRepository;
    }

    // CREATE
    public VendorRates createVendorRates(@Valid VendorRates vendorRates) {
        return vendorRatesRepository.save(vendorRates);
    }

    // READ ALL
    public List<VendorRates> getAllVendorRates() {
        return vendorRatesRepository.findAll();
    }

    // READ BY ID
    public VendorRates getVendorRatesById(Long id) {
        return vendorRatesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VendorRates",id));
    }

    // UPDATE
    public VendorRates updateVendorRates(Long id, @Valid VendorRates updatedRates) {
        VendorRates existingRates = getVendorRatesById(id);

        //existingRates.setProductName(updatedRates.getProductName());
        existingRates.setMonthlyRent(updatedRates.getMonthlyRent());
        existingRates.setEffectiveDate(updatedRates.getEffectiveDate());
        existingRates.setExpiryDate(updatedRates.getExpiryDate());
        existingRates.setVendor(updatedRates.getVendor());

        return vendorRatesRepository.save(existingRates);
    }

    // DELETE
    public void deleteVendorRates(Long id) {
        VendorRates existingRates = getVendorRatesById(id);
        vendorRatesRepository.delete(existingRates);
    }
}