package com.project2.ism.Service;


import com.project2.ism.DTO.Vendor.*;
import com.project2.ism.Enum.TransactionStatus;
import com.project2.ism.Exception.NoAvailableVendorException;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.*;
import com.project2.ism.Repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorRoutingService {


    private final VendorRoutingRepository vendorRoutingRepository;
    private final VendorRuleRepository vendorRuleRepository;
    private final ProductRepository productsRepository;
    private final VendorRepository vendorsRepository;

    private final VendorLogRepository vendorLogRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;


    private static final int FAILURE_CHECK_LIMIT = 5;
    private static final int FAILURE_THRESHOLD = 3; // 3 out of 5 = multiple failures

    public VendorRoutingService(VendorRoutingRepository vendorRoutingRepository, VendorRuleRepository vendorRuleRepository, ProductRepository productsRepository, VendorRepository vendorsRepository, VendorLogRepository vendorLogRepository, TransactionHistoryRepository transactionHistoryRepository) {
        this.vendorRoutingRepository = vendorRoutingRepository;
        this.vendorRuleRepository = vendorRuleRepository;
        this.productsRepository = productsRepository;
        this.vendorsRepository = vendorsRepository;
        this.vendorLogRepository = vendorLogRepository;
        this.transactionHistoryRepository = transactionHistoryRepository;
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
        // Validate all three vendors exist
        Vendor vendor1 = vendorsRepository.findById(request.getVendor1Id())
                .orElseThrow(() -> new RuntimeException("Vendor 1 not found with id: " + request.getVendor1Id()));

        Vendor vendor2 = vendorsRepository.findById(request.getVendor2Id())
                .orElseThrow(() -> new RuntimeException("Vendor 2 not found with id: " + request.getVendor2Id()));

        Vendor vendor3 = vendorsRepository.findById(request.getVendor3Id())
                .orElseThrow(() -> new RuntimeException("Vendor 3 not found with id: " + request.getVendor3Id()));

        // Validate that all three vendors are different
        validateUniqueVendors(request.getVendor1Id(), request.getVendor2Id(), request.getVendor3Id());

        // Validate that vendor rules only contain the three selected vendors
        validateVendorRulesMatchSelectedVendors(request);


        // Create VendorRouting
        VendorRouting vendorRouting = new VendorRouting();
        vendorRouting.setProduct(product);
        vendorRouting.setVendor1(vendor1);
        vendorRouting.setVendor2(vendor2);
        vendorRouting.setVendor3(vendor3);
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

        // Validate and update all three vendors
        Vendor vendor1 = vendorsRepository.findById(request.getVendor1Id())
                .orElseThrow(() -> new RuntimeException("Vendor 1 not found with id: " + request.getVendor1Id()));

        Vendor vendor2 = vendorsRepository.findById(request.getVendor2Id())
                .orElseThrow(() -> new RuntimeException("Vendor 2 not found with id: " + request.getVendor2Id()));

        Vendor vendor3 = vendorsRepository.findById(request.getVendor3Id())
                .orElseThrow(() -> new RuntimeException("Vendor 3 not found with id: " + request.getVendor3Id()));

        // Validate that all three vendors are different
        validateUniqueVendors(request.getVendor1Id(), request.getVendor2Id(), request.getVendor3Id());

        // Validate that vendor rules only contain the three selected vendors
        validateVendorRulesMatchSelectedVendors(request);

        vendorRouting.setVendor1(vendor1);
        vendorRouting.setVendor2(vendor2);
        vendorRouting.setVendor3(vendor3);
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



    private void validateUniqueVendors(Long vendor1Id, Long vendor2Id, Long vendor3Id) {
        if (vendor1Id.equals(vendor2Id) || vendor1Id.equals(vendor3Id) || vendor2Id.equals(vendor3Id)) {
            throw new RuntimeException("All three vendors must be different");
        }
    }

    private void validateVendorRulesMatchSelectedVendors(VendorRoutingRequest request) {
        List<Long> selectedVendorIds = Arrays.asList(
                request.getVendor1Id(),
                request.getVendor2Id(),
                request.getVendor3Id()
        );

        for (VendorRuleRequest ruleRequest : request.getVendorRules()) {
            if (!selectedVendorIds.contains(ruleRequest.getVendorId())) {
                throw new RuntimeException("Vendor rule contains vendor ID " + ruleRequest.getVendorId() +
                        " which is not in the selected vendor priority list");
            }
        }
    }


    @Transactional(noRollbackFor = NoAvailableVendorException.class)
    public Vendor getVendorForToken(VendorRouting routing, Double transactionAmount) {
        List<Vendor> vendorPriority = Arrays.asList(
                routing.getVendor1(),
                routing.getVendor2(),
                routing.getVendor3()
        );

        LocalDate today = LocalDate.now();

        for (Vendor vendor : vendorPriority) {
            if (vendor == null) continue;

            // Priority 1: Check failure rate
            if (hasMultipleRecentFailures(vendor)) {
                continue; // Skip to next vendor
            }

            // Priority 2: Check transaction amount range
            VendorRule applicableRule = getApplicableRule(routing, vendor, transactionAmount);
            if (applicableRule == null) {
                continue; // Amount not in range
            }

            // Get or create today's log (with pessimistic lock for concurrency)
            VendorLog todayLog = getTodayLogWithLock(vendor, today);

            // Priority 3: Check daily amount limit
            if (todayLog.getTotalAmountProcessed() + transactionAmount > applicableRule.getDailyAmountLimit()) {
                continue; // Would exceed daily amount limit
            }

            // Priority 4: Check daily transaction count limit
            if (todayLog.getTransactionCount() >= applicableRule.getDailyTransactionLimit()) {
                continue; // Would exceed daily transaction limit
            }

            // All checks passed - Reserve capacity immediately
            reserveVendorCapacity(todayLog, transactionAmount);

            return vendor;
        }

        throw new NoAvailableVendorException("No vendor available matching all routing criteria");
    }

    private boolean hasMultipleRecentFailures(Vendor vendor) {
        List<TransactionHistory> recentTransactions =
                transactionHistoryRepository.findTop5ByVendorOrderByCreatedAtDesc(vendor);

        if (recentTransactions.size() < FAILURE_CHECK_LIMIT) {
            return false; // Not enough history
        }

        long failureCount = recentTransactions.stream()
                .filter(t -> t.getStatus() == TransactionStatus.FAILED)
                .count();

        return failureCount >= FAILURE_THRESHOLD;
    }

    private VendorRule getApplicableRule(VendorRouting routing, Vendor vendor, Double amount) {
        return routing.getVendorRules().stream()
                .filter(rule -> rule.getVendor().equals(vendor))
                .filter(rule -> amount >= rule.getMinAmount() && amount <= rule.getMaxAmount())
                .findFirst()
                .orElse(null);
    }

    @Transactional
    private VendorLog getTodayLogWithLock(Vendor vendor, LocalDate date) {
        // Use pessimistic lock to prevent race conditions
        VendorLog log = vendorLogRepository
                .findByVendorAndLogDateWithLock(vendor, date);

        if (log == null) {
            log = new VendorLog();
            log.setVendor(vendor);
            log.setLogDate(date);
            log = vendorLogRepository.save(log);
        }

        return log;
    }

    private void reserveVendorCapacity(VendorLog log, Double amount) {
        log.setTotalAmountProcessed(log.getTotalAmountProcessed() + amount);
        log.setTransactionCount(log.getTransactionCount() + 1);
        vendorLogRepository.save(log);
    }

    // Call this after successful transaction
    public void confirmTransaction(Vendor vendor, String transactionRef, Double amount) {
        TransactionHistory history = new TransactionHistory();
        history.setVendor(vendor);
        history.setStatus(TransactionStatus.SUCCESS);
        history.setAmount(amount);
        history.setTransactionRef(transactionRef);
        transactionHistoryRepository.save(history);
    }

    // Call this if transaction fails - rollback the reservation
    @Transactional
    public void handleTransactionFailure(Vendor vendor, String transactionRef, Double amount) {
        // Rollback the reserved capacity
        LocalDate today = LocalDate.now();
        VendorLog log = vendorLogRepository.findByVendorAndLogDate(vendor, today);

        if (log != null) {
            log.setTotalAmountProcessed(Math.max(0, log.getTotalAmountProcessed() - amount));
            log.setTransactionCount(Math.max(0, log.getTransactionCount() - 1));
            log.setFailureCount(log.getFailureCount() + 1);
            vendorLogRepository.save(log);
        }

        // Record failure in history
        TransactionHistory history = new TransactionHistory();
        history.setVendor(vendor);
        history.setStatus(TransactionStatus.FAILED);
        history.setAmount(amount);
        history.setTransactionRef(transactionRef);
        transactionHistoryRepository.save(history);
    }


    // Helper method to convert Entity to DTO
    private VendorRoutingDTO convertToDTO(VendorRouting vendorRouting) {
        VendorRoutingDTO dto = new VendorRoutingDTO();
        dto.setId(vendorRouting.getId());
        dto.setProductId(vendorRouting.getProduct().getId());
        dto.setProductName(vendorRouting.getProduct().getProductName());

        // Set vendor1
        VendorIDNameDTO vendor1DTO = new VendorIDNameDTO(vendorRouting.getVendor1().getId(),vendorRouting.getVendor1().getName());
        dto.setVendor1(vendor1DTO);

        // Set vendor2
        VendorIDNameDTO vendor2DTO = new VendorIDNameDTO(vendorRouting.getVendor2().getId(),vendorRouting.getVendor2().getName());
        dto.setVendor2(vendor2DTO);

        // Set vendor3
        VendorIDNameDTO vendor3DTO = new VendorIDNameDTO(vendorRouting.getVendor3().getId(),vendorRouting.getVendor3().getName());
        dto.setVendor3(vendor3DTO);

        // Convert vendor rules
        List<VendorRuleDTO> ruleDTOs = vendorRouting.getVendorRules().stream()
                .map(this::convertRuleToDTO)
                .collect(Collectors.toList());
        dto.setVendorRules(ruleDTOs);

        dto.setStatus(vendorRouting.getStatus());
        dto.setCreatedAt(vendorRouting.getCreatedAt());
        dto.setUpdatedAt(vendorRouting.getUpdatedAt());

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