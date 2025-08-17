    package com.project2.ism.Service;

    import com.project2.ism.Model.PricingScheme.PricingScheme;
    import com.project2.ism.Model.PricingScheme.CardRate;
    import com.project2.ism.Repository.PricingSchemeRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.List;
    import java.util.Optional;

    @Service
    @Transactional
    public class PricingSchemeService {

        private final PricingSchemeRepository pricingSchemeRepository;

        @Autowired
        public PricingSchemeService(PricingSchemeRepository pricingSchemeRepository) {
            this.pricingSchemeRepository = pricingSchemeRepository;
        }

        public PricingScheme createPricingScheme(PricingScheme pricingScheme) {
            // Check for duplicate scheme
            if (pricingSchemeRepository.existsDuplicateSchemeForNew(
                    pricingScheme.getSchemeCode(),
                    pricingScheme.getRentalByMonth(),
                    pricingScheme.getCustomerType())) {
                throw new RuntimeException("Pricing scheme with same code, rental amount and customer type already exists");
            }

            // Set bidirectional relationship for card rates
            if (pricingScheme.getCardRates() != null) {
                pricingScheme.getCardRates().forEach(cardRate -> cardRate.setPricingScheme(pricingScheme));
            }

            return pricingSchemeRepository.save(pricingScheme);
        }

        @Transactional(readOnly = true)
        public Page<PricingScheme> getAllPricingSchemes(Pageable pageable) {
            return pricingSchemeRepository.findAll(pageable);
        }

        @Transactional(readOnly = true)
        public PricingScheme getPricingSchemeById(Long id) {
            return pricingSchemeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pricing scheme not found with id: " + id));
        }

        @Transactional(readOnly = true)
        public PricingScheme getPricingSchemeByCode(String schemeCode) {
            return pricingSchemeRepository.findBySchemeCode(schemeCode)
                    .orElseThrow(() -> new RuntimeException("Pricing scheme not found with code: " + schemeCode));
        }

        public PricingScheme updatePricingScheme(Long id, PricingScheme pricingSchemeDetails) {
            PricingScheme existingScheme = getPricingSchemeById(id);

            // Check for duplicate scheme (excluding current scheme)
            if (pricingSchemeRepository.existsDuplicateScheme(
                    pricingSchemeDetails.getSchemeCode(),
                    pricingSchemeDetails.getRentalByMonth(),
                    pricingSchemeDetails.getCustomerType(),
                    id)) {
                throw new RuntimeException("Pricing scheme with same code, rental amount and customer type already exists");
            }

            // Update basic fields
            existingScheme.setSchemeCode(pricingSchemeDetails.getSchemeCode());
            existingScheme.setRentalByMonth(pricingSchemeDetails.getRentalByMonth());
            existingScheme.setCustomerType(pricingSchemeDetails.getCustomerType());
            existingScheme.setDescription(pricingSchemeDetails.getDescription());

            // Clear existing card rates and add new ones
            existingScheme.getCardRates().clear();
            if (pricingSchemeDetails.getCardRates() != null) {
                pricingSchemeDetails.getCardRates().forEach(cardRate -> {
                    cardRate.setPricingScheme(existingScheme);
                    existingScheme.getCardRates().add(cardRate);
                });
            }

            return pricingSchemeRepository.save(existingScheme);
        }

        public void deletePricingScheme(Long id) {
            PricingScheme pricingScheme = getPricingSchemeById(id);
            pricingSchemeRepository.delete(pricingScheme);
        }

        @Transactional(readOnly = true)
        public Page<PricingScheme> searchPricingSchemes(String query, Pageable pageable) {
            if (query == null || query.trim().isEmpty()) {
                return getAllPricingSchemes(pageable);
            }
            return pricingSchemeRepository.searchSchemes(query.trim(), pageable);
        }

        @Transactional(readOnly = true)
        public boolean schemeCodeExists(String schemeCode) {
            return pricingSchemeRepository.existsBySchemeCode(schemeCode);
        }

        @Transactional(readOnly = true)
        public long getTotalSchemesCount() {
            return pricingSchemeRepository.count();
        }

        @Transactional(readOnly = true)
        public List<PricingScheme> getAllSchemesForCustomerType(String customerType) {
            return pricingSchemeRepository.findAll().stream()
                    .filter(scheme -> scheme.getCustomerType().equals(customerType))
                    .toList();
        }


        @Transactional(readOnly = true)
        public String generateNextSchemeCode() {
            // Get the latest scheme code
            Optional<String> latestCode = pricingSchemeRepository.findTopByOrderBySchemeCodeDesc()
                    .map(PricingScheme::getSchemeCode);

            if (latestCode.isPresent()) {
                String code = latestCode.get();
                // Extract number from scheme code (assuming format like SCHEME_001, SCH_123, etc.)
                String[] parts = code.split("_");
                if (parts.length >= 2) {
                    try {
                        int lastNumber = Integer.parseInt(parts[parts.length - 1]);
                        return parts[0] + "_" + String.format("%03d", lastNumber + 1);
                    } catch (NumberFormatException e) {
                        // If parsing fails, generate default
                        return "SCHEME_001";
                    }
                }
            }

            // If no existing scheme or parsing failed, return default
            return "SCHEME_001";
        }
    }
