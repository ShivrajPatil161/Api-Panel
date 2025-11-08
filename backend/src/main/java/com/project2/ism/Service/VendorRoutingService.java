package com.project2.ism.Service;


import com.project2.ism.DTO.Vendor.VendorRoutingDTO;
import com.project2.ism.DTO.Vendor.VendorRoutingRequest;
import com.project2.ism.DTO.Vendor.VendorRuleDTO;
import com.project2.ism.DTO.Vendor.VendorRuleRequest;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorRouting;
import com.project2.ism.Model.Vendor.VendorRule;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.VendorRepository;
import com.project2.ism.Repository.VendorRoutingRepository;
import com.project2.ism.Repository.VendorRuleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorRoutingService {


    private final VendorRoutingRepository vendorRoutingRepository;
    private final VendorRuleRepository vendorRuleRepository;
    private final ProductRepository productsRepository;
    private final VendorRepository vendorsRepository;

    public VendorRoutingService(VendorRoutingRepository vendorRoutingRepository, VendorRuleRepository vendorRuleRepository, ProductRepository productsRepository, VendorRepository vendorsRepository) {
        this.vendorRoutingRepository = vendorRoutingRepository;
        this.vendorRuleRepository = vendorRuleRepository;
        this.productsRepository = productsRepository;
        this.vendorsRepository = vendorsRepository;
    }


    @Transactional
    public VendorRoutingDTO createVendorRouting(VendorRoutingRequest request) {
        // Validate product exists
        Product product = productsRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        // Check if routing already exists for this product
        vendorRoutingRepository.findByProductId(request.getProductId())
                .ifPresent(existing -> {
                    throw new RuntimeException("Vendor routing already exists for product: " + product.getProductName());
                });

        // Create VendorRouting
        VendorRouting vendorRouting = new VendorRouting();
        vendorRouting.setProduct(product);
        vendorRouting.setStatus(true);

        // Create and add VendorRules
        for (VendorRuleRequest ruleRequest : request.getVendorRules()) {
            Vendor vendor = vendorsRepository.findById(ruleRequest.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + ruleRequest.getVendorId()));

            VendorRule rule = new VendorRule();
            rule.setVendor(vendor);
            rule.setMinAmount(ruleRequest.getMinAmount());
            rule.setMaxAmount(ruleRequest.getMaxAmount());
            rule.setDailyTransactionLimit(ruleRequest.getDailyTransactionLimit());
            rule.setDailyAmountLimit(ruleRequest.getDailyAmountLimit());

            vendorRouting.addVendorRule(rule);
        }

        VendorRouting savedRouting = vendorRoutingRepository.save(vendorRouting);
        return convertToDTO(savedRouting);
    }


    @Transactional
    public VendorRoutingDTO updateVendorRouting(Long id, VendorRoutingRequest request) {
        // Find existing routing
        VendorRouting vendorRouting = vendorRoutingRepository.findByIdWithRules(id)
                .orElseThrow(() -> new RuntimeException("Vendor routing not found with id: " + id));

        // Update product if changed
        if (!vendorRouting.getProduct().getId().equals(request.getProductId())) {
            Product product = productsRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));
            vendorRouting.setProduct(product);
        }

        // Clear existing rules
        vendorRouting.getVendorRules().clear();

        // Add new rules
        for (VendorRuleRequest ruleRequest : request.getVendorRules()) {
            Vendor vendor = vendorsRepository.findById(ruleRequest.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found with id: " + ruleRequest.getVendorId()));

            VendorRule rule = new VendorRule();
            rule.setVendor(vendor);
            rule.setMinAmount(ruleRequest.getMinAmount());
            rule.setMaxAmount(ruleRequest.getMaxAmount());
            rule.setDailyTransactionLimit(ruleRequest.getDailyTransactionLimit());
            rule.setDailyAmountLimit(ruleRequest.getDailyAmountLimit());

            vendorRouting.addVendorRule(rule);
        }

        VendorRouting updatedRouting = vendorRoutingRepository.save(vendorRouting);
        return convertToDTO(updatedRouting);
    }


    @Transactional(readOnly = true)
    public VendorRoutingDTO getVendorRoutingById(Long id) {
        VendorRouting vendorRouting = vendorRoutingRepository.findByIdWithRules(id)
                .orElseThrow(() -> new RuntimeException("Vendor routing not found with id: " + id));
        return convertToDTO(vendorRouting);
    }


    @Transactional(readOnly = true)
    public Page<VendorRoutingDTO> getAllVendorRoutings(Pageable pageable) {
        Page<VendorRouting> routings = vendorRoutingRepository.findAll(pageable);
        return routings.map(this::convertToDTO);
    }


    @Transactional
    public void deleteVendorRouting(Long id) {
        VendorRouting vendorRouting = vendorRoutingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor routing not found with id: " + id));
        vendorRoutingRepository.delete(vendorRouting);
    }


    @Transactional(readOnly = true)
    public VendorRoutingDTO getVendorRoutingByProductId(Long productId) {
        VendorRouting vendorRouting = vendorRoutingRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Vendor routing not found for product id: " + productId));
        return convertToDTO(vendorRouting);
    }

    // Helper method to convert Entity to DTO
    private VendorRoutingDTO convertToDTO(VendorRouting vendorRouting) {
        VendorRoutingDTO dto = new VendorRoutingDTO();
        dto.setId(vendorRouting.getId());
        dto.setProductId(vendorRouting.getProduct().getId());
        dto.setProductName(vendorRouting.getProduct().getProductName());
        dto.setStatus(vendorRouting.getStatus());

        List<VendorRuleDTO> ruleDTOs = vendorRouting.getVendorRules().stream()
                .map(this::convertRuleToDTO)
                .collect(Collectors.toList());
        dto.setVendorRules(ruleDTOs);

        return dto;
    }

    private VendorRuleDTO convertRuleToDTO(VendorRule rule) {
        VendorRuleDTO dto = new VendorRuleDTO();
        dto.setId(rule.getId());
        dto.setVendorId(rule.getVendor().getId());
        dto.setVendorName(rule.getVendor().getName());
        dto.setMinAmount(rule.getMinAmount());
        dto.setMaxAmount(rule.getMaxAmount());
        dto.setDailyTransactionLimit(rule.getDailyTransactionLimit());
        dto.setDailyAmountLimit(rule.getDailyAmountLimit());
        return dto;
    }
}