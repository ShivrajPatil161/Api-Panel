package com.project2.ism.Service;

import com.project2.ism.Exception.DuplicateResourceException;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Repository.OutwardTransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutwardTransactionService {

    private final OutwardTransactionRepository repository;


    public OutwardTransactionService(OutwardTransactionRepository repository) {
        this.repository = repository;
    }

    public List<OutwardTransactions> getAll() {
        return repository.findAll();
    }

    public OutwardTransactions getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outward Transaction not found with id " + id));
    }

    @Transactional
    public OutwardTransactions create(OutwardTransactions outwardTransactions) {
        if (repository.existsByDeliveryNumber(outwardTransactions.getDelivery_number())) {
            throw new DuplicateResourceException("Delivery number already exists: " + outwardTransactions.getDelivery_number());
        }
        return repository.save(outwardTransactions);
    }

    @Transactional
    public OutwardTransactions update(Long id, OutwardTransactions outwardTransactions) {
        OutwardTransactions existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outward Transaction not found with id " + id));

        existing.setDelivery_number(outwardTransactions.getDelivery_number());
        existing.setFranchise(outwardTransactions.getFranchise());
        existing.setMerchant(outwardTransactions.getMerchant());
        existing.setProduct(outwardTransactions.getProduct());
        existing.setProductCategory(outwardTransactions.getProductCategory());
        existing.setDispatchDate(outwardTransactions.getDispatchDate());
        existing.setDispatchedBy(outwardTransactions.getDispatchedBy());
        existing.setQuantity(outwardTransactions.getQuantity());
        existing.setUnitPrice(outwardTransactions.getUnitPrice());
        existing.setTotal_amount(outwardTransactions.getTotal_amount());
        existing.setDeliveryAddress(outwardTransactions.getDeliveryAddress());
        existing.setContactPerson(outwardTransactions.getContactPerson());
        existing.setContactPersonNumber(outwardTransactions.getContactPersonNumber());
        existing.setDeliveryMethod(outwardTransactions.getDeliveryMethod());
        existing.setTrackingNumber(outwardTransactions.getTrackingNumber());
        existing.setExpectedDeliveryDate(outwardTransactions.getExpectedDeliveryDate());
        existing.setProductSerialNumbers(outwardTransactions.getProductSerialNumbers());
        existing.setRemarks(outwardTransactions.getRemarks());

        return repository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        OutwardTransactions existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outward Transaction not found with id " + id));
        repository.delete(existing);
    }
}