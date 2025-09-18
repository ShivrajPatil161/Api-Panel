package com.project2.ism.Service;

import com.project2.ism.DTO.VendorIDNameDTO;
import com.project2.ism.DTO.VendorStatsDTO;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Repository.VendorRatesRepository;
import com.project2.ism.Repository.VendorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VendorService {


    private final VendorRepository vendorRepository;

    private final VendorRatesRepository vendorRatesRepository;

    public VendorService(VendorRepository vendorRepository, VendorRatesRepository vendorRatesRepository) {
        this.vendorRepository = vendorRepository;
        this.vendorRatesRepository = vendorRatesRepository;
    }

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

    public List<VendorIDNameDTO> getAllVendorsIdAndName() {
        return vendorRepository.findByStatusTrue()
                .stream()
                .map(v -> new VendorIDNameDTO(v.getId(), v.getName()))
                .toList();
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

    // Get all vendors
    public List<Vendor> getAllActiveVendors() {
        return vendorRepository.findByStatusTrue();
    }
}
