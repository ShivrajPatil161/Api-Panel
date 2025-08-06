package com.project2.ism.Service;

import com.project2.ism.Model.Vendor;
import com.project2.ism.Repository.VendorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    // Create or Save Vendor
    public Vendor createVendor(@Valid Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    // Get all vendors
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // Get vendor by ID with error handling
    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found with ID: " + id));
    }

    // Update vendor
    public Vendor updateVendor(Long id, @Valid Vendor updatedVendor) {
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cannot update. Vendor not found with ID: " + id));

        updatedVendor.setId(existingVendor.getId()); // ensure ID consistency
        return vendorRepository.save(updatedVendor);
    }

    // Delete vendor
    public void deleteVendor(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete. Vendor not found with ID: " + id);
        }
        vendorRepository.deleteById(id);
    }
}
