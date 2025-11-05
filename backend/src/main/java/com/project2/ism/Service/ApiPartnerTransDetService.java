package com.project2.ism.Service;


import com.project2.ism.Model.ApiPartnerTransactionDetails;

import com.project2.ism.Repository.ApiPartnerTransDetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApiPartnerTransDetService {

    private final ApiPartnerTransDetRepository apiPartnerTransDetRepository;

    public ApiPartnerTransDetService(ApiPartnerTransDetRepository apiPartnerTransDetRepository) {
        this.apiPartnerTransDetRepository = apiPartnerTransDetRepository;
    }

    public List<ApiPartnerTransactionDetails> getAllFranchiseTransactionDetails() {
        return apiPartnerTransDetRepository.findAll();
    }

    public Optional<ApiPartnerTransactionDetails> getFranchiseTransactionDetailsById(Long id) {
        return apiPartnerTransDetRepository.findById(id);
    }

    public Optional<ApiPartnerTransactionDetails> getFranchiseTransactionDetailsByTransactionDetailsId(Long transactionId) {
        return apiPartnerTransDetRepository.findByTransactionId(transactionId);
    }

    public ApiPartnerTransactionDetails saveTransaction(ApiPartnerTransactionDetails apiPartnerTransactionDetails) {
        return apiPartnerTransDetRepository.save(apiPartnerTransactionDetails);
    }

    public void deleteTransactionDetails(Long id) {
        apiPartnerTransDetRepository.deleteById(id);
    }
}


