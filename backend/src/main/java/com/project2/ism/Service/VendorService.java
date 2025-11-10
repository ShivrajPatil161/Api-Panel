package com.project2.ism.Service;

import com.project2.ism.DTO.Vendor.VendorFormDTO;
import com.project2.ism.DTO.Vendor.VendorIDNameDTO;
import com.project2.ism.DTO.Vendor.VendorResponseDTO;
import com.project2.ism.DTO.Vendor.VendorStatsDTO;
import com.project2.ism.Exception.DuplicateResourceException;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ContactPerson;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.VendorRatesRepository;
import com.project2.ism.Repository.VendorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {


    private final VendorRepository vendorRepository;

    private final VendorRatesRepository vendorRatesRepository;

    private final ProductRepository productRepository;

    @Autowired
    public VendorService(VendorRepository vendorRepository, VendorRatesRepository vendorRatesRepository, ProductRepository productRepository) {
        this.vendorRepository = vendorRepository;
        this.vendorRatesRepository = vendorRatesRepository;
        this.productRepository = productRepository;
    }

    // Create or Save Vendor
    public VendorResponseDTO createVendor(VendorFormDTO vendorDto) {
        Vendor vendor = convertToEntity(vendorDto);
        if (vendorRepository.existsByNameIgnoreCase(vendor.getName())) {
            throw new DuplicateResourceException("Vendor name already exists: " + vendor.getName());
        }
        Vendor savedVendor =  vendorRepository.save(vendor);

        return mapToDTO(savedVendor);
    }

    private Vendor convertToEntity(VendorFormDTO dto) {
        Vendor vendor = new Vendor();

        // Set basic info
        vendor.setName(dto.getName());
        vendor.setBankType(dto.getBankType());
        vendor.setStatus(dto.getStatus());

        // Handle product relation
        if (dto.getProductId() != null) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", dto.getProductId()));
            vendor.setProduct(product);
        } else {
            throw new IllegalArgumentException("Product ID is required for Vendor");
        }

        // Handle contact person
        ContactPerson contactPerson = new ContactPerson();
        contactPerson.setName(dto.getContactPersonName());
        contactPerson.setPhoneNumber(dto.getContactNumber());
        contactPerson.setEmail(dto.getContactEmail());
        vendor.setContactPerson(contactPerson);

        // Address
        vendor.setAddress(dto.getAddress());
        vendor.setCity(dto.getCity());
        vendor.setState(dto.getState());
        vendor.setPinCode(dto.getPinCode());

        // Legal info
        vendor.setGstNumber(dto.getGstNumber());
        vendor.setPan(dto.getPan());

        // Agreement and terms
        vendor.setAgreementStartDate(dto.getAgreementStartDate());
        vendor.setAgreementEndDate(dto.getAgreementEndDate());
        vendor.setCreditPeriodDays(dto.getCreditPeriodDays());
        vendor.setPaymentTerms(dto.getPaymentTerms());
        vendor.setRemarks(dto.getRemark());

        return vendor;
    }

    // =============== Convert Entity -> DTO ===============
    private VendorResponseDTO mapToDTO(Vendor vendor) {
        VendorResponseDTO dto = new VendorResponseDTO();

        dto.setId(vendor.getId());
        dto.setName(vendor.getName());
        dto.setBankType(vendor.getBankType());
        dto.setStatus(vendor.getStatus());

        if (vendor.getProduct() != null) {
            dto.setProductId(vendor.getProduct().getId());
        }

        // ✅ Directly set ContactPerson object
        if (vendor.getContactPerson() != null) {
            dto.setContactPerson(vendor.getContactPerson());
        }

        dto.setAddress(vendor.getAddress());
        dto.setCity(vendor.getCity());
        dto.setState(vendor.getState());
        dto.setPinCode(vendor.getPinCode());
        dto.setGstNumber(vendor.getGstNumber());
        dto.setPan(vendor.getPan());
        dto.setAgreementStartDate(vendor.getAgreementStartDate());
        dto.setAgreementEndDate(vendor.getAgreementEndDate());
        dto.setCreditPeriodDays(vendor.getCreditPeriodDays());
        dto.setPaymentTerms(vendor.getPaymentTerms());
        dto.setRemarks(vendor.getRemarks()); // ✅ note: use correct getter name `getRemarks()`

        return dto;
    }





    // Get all vendors
    public List<VendorResponseDTO> getAllVendors() {
        List<Vendor> vendors =  vendorRepository.findAll();

        return vendors.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());


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

        if (vendorRepository.existsByNameIgnoreCase(updatedVendor.getName()) &&
                !existingVendor.getName().equalsIgnoreCase(updatedVendor.getName())) {
            throw new DuplicateResourceException("Vendor name already exists: " + updatedVendor.getName());
        }

        updatedVendor.setId(existingVendor.getId());// ensure ID consistency
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

        // Channel Type Distribution
        dto.channelTypeDistribution = vendorRatesRepository.countGroupByChannelType();

        return dto;
    }

    // Get all vendors
    public List<Vendor> getAllActiveVendors() {
        return vendorRepository.findByStatusTrue();
    }

    public ProductRepository getProductRepository() {
        return productRepository;
    }
}
