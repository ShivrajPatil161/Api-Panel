package com.project2.ism.Service;

import com.project2.ism.DTO.Vendor.VendorCredentialsDTO;
import com.project2.ism.DTO.Vendor.VendorIDNameDTO;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorCredentials;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.VendorCredentialRepository;
import com.project2.ism.Repository.VendorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VendorCredentialService {

    private final VendorCredentialRepository repository;
    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;

    public VendorCredentialService(
            VendorCredentialRepository repository,
            VendorRepository vendorRepository,
            ProductRepository productRepository
    ) {
        this.repository = repository;
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
    }

    // ---------------------------
    // CRUD Methods
    // ---------------------------

    @Transactional
    public VendorCredentialsDTO create(VendorCredentialsDTO dto) {
        VendorCredentials entity = mapToEntity(dto);
        VendorCredentials saved = repository.save(entity);
        return mapToDTO(saved);
    }

    @Transactional
    public VendorCredentialsDTO update(Long id, VendorCredentialsDTO dto) {
        VendorCredentials existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("VendorCredentials not found with id: " + id));

        // update relationships safely
        if (dto.getVendorInfo() != null && dto.getVendorInfo().getId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendorInfo().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Vendor not found with id: " + dto.getVendorInfo().getId()));
            existing.setVendor(vendor);
        }

        if (dto.getProductId() != null) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + dto.getProductId()));
            existing.setProduct(product);
        }

        updateEntity(existing, dto);
        VendorCredentials updated = repository.save(existing);
        return mapToDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("VendorCredentials not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Page<VendorCredentialsDTO> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToDTO);
    }

    public VendorCredentialsDTO getById(Long id) {
        VendorCredentials entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("VendorCredentials not found with id: " + id));
        return mapToDTO(entity);
    }

    // ---------------------------
    // Mapping Helpers
    // ---------------------------

    private VendorCredentialsDTO mapToDTO(VendorCredentials entity) {
        VendorCredentialsDTO dto = new VendorCredentialsDTO();
        dto.setId(entity.getId());

        if (entity.getVendor() != null) {
            dto.setVendorInfo(new VendorIDNameDTO(
                    entity.getVendor().getId(),
                    entity.getVendor().getName()
            ));
        }

        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductName(entity.getProduct().getProductName());
        }

        dto.setBaseUrlProd(entity.getBaseUrlProd());
        dto.setBaseUrlUat(entity.getBaseUrlUat());
        dto.setClientId(entity.getClientId());
        dto.setClientSecret(entity.getClientSecret());
        dto.setTokenUrlProd(entity.getTokenUrlProd());
        dto.setTokenUrlUat(entity.getTokenUrlUat());
        dto.setToken(entity.getToken());
        dto.setSaltKey(entity.getSaltKey());
        dto.setUsername(entity.getUsername());
        dto.setPassword(entity.getPassword());
        dto.setIsActive(entity.getIsActive());
        dto.setUserField1(entity.getUserField1());
        dto.setUserField2(entity.getUserField2());
        dto.setUserField3(entity.getUserField3());
        dto.setTokenType(entity.getTokenType());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setCreatedAt(entity.getCreatedOn());
        dto.setEditedBy(entity.getEditedBy());
        dto.setUpdatedAt(entity.getEditedOn());
        return dto;
    }

    private VendorCredentials mapToEntity(VendorCredentialsDTO dto) {
        VendorCredentials entity = new VendorCredentials();

        // ✅ Validate vendor
        if (dto.getVendorInfo() == null || dto.getVendorInfo().getId() == null) {
            throw new EntityNotFoundException("Vendor ID is required");
        }
        Vendor vendor = vendorRepository.findById(dto.getVendorInfo().getId())
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found with id: " + dto.getVendorInfo().getId()));
        entity.setVendor(vendor);

        // ✅ Validate product
        if (dto.getProductId() == null) {
            throw new EntityNotFoundException("Product ID is required");
        }
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + dto.getProductId()));
        entity.setProduct(product);

        entity.setBaseUrlProd(dto.getBaseUrlProd());
        entity.setBaseUrlUat(dto.getBaseUrlUat());
        entity.setClientId(dto.getClientId());
        entity.setClientSecret(dto.getClientSecret());
        entity.setTokenUrlProd(dto.getTokenUrlProd());
        entity.setTokenUrlUat(dto.getTokenUrlUat());
        entity.setToken(dto.getToken());
        entity.setSaltKey(dto.getSaltKey());
        entity.setUsername(dto.getUsername());
        entity.setPassword(dto.getPassword());
        entity.setIsActive(dto.getIsActive());
        entity.setUserField1(dto.getUserField1());
        entity.setUserField2(dto.getUserField2());
        entity.setUserField3(dto.getUserField3());
        entity.setTokenType(dto.getTokenType());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        entity.setCreatedBy(auth.getName());
        entity.setEditedBy(auth.getName());

        return entity;
    }

    private void updateEntity(VendorCredentials existing, VendorCredentialsDTO dto) {
        existing.setBaseUrlProd(dto.getBaseUrlProd());
        existing.setBaseUrlUat(dto.getBaseUrlUat());
        existing.setToken(dto.getToken());
        existing.setClientId(dto.getClientId());
        existing.setClientSecret(dto.getClientSecret());
        existing.setSaltKey(dto.getSaltKey());
        existing.setUsername(dto.getUsername());
        existing.setPassword(dto.getPassword());
        existing.setIsActive(dto.getIsActive());
        existing.setTokenUrlProd(dto.getTokenUrlProd());
        existing.setTokenUrlUat(dto.getTokenUrlUat());

        existing.setUserField1(dto.getUserField1());
        existing.setUserField2(dto.getUserField2());
        existing.setUserField3(dto.getUserField3());
        existing.setTokenType(dto.getTokenType());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        existing.setEditedBy(auth.getName());


    }
}
