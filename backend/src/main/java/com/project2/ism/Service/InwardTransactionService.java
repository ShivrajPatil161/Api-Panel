package com.project2.ism.Service;

import com.project2.ism.Exception.DuplicateResourceException;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.InventoryTransactions.InwardTransactions;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Repository.InwardTransactionRepository;
import com.project2.ism.Repository.ProductSerialsRepository;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InwardTransactionService {

    private final InwardTransactionRepository inwardRepo;
    private final ProductSerialsRepository serialRepo;

    public InwardTransactionService(InwardTransactionRepository inwardRepo, ProductSerialsRepository serialRepo) {
        this.inwardRepo = inwardRepo;
        this.serialRepo = serialRepo;
    }

    @Transactional
    public InwardTransactions createTransaction(InwardTransactions inward) {
        validateAndAttachSerials(inward);
        return inwardRepo.save(inward);
    }

    public List<InwardTransactions> getAllTransactions() {
        return inwardRepo.findAll();
    }

    public InwardTransactions getTransaction(Long id) {
        return inwardRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inward transaction not found with id: " + id));
    }

    @Transactional
    public InwardTransactions updateTransaction(Long id, InwardTransactions updated) {
        InwardTransactions existing = getTransaction(id);

        existing.setInvoiceNumber(updated.getInvoiceNumber());
        existing.setVendor(updated.getVendor());
        existing.setReceivedDate(updated.getReceivedDate());
        existing.setReceivedBy(updated.getReceivedBy());
        existing.setProduct(updated.getProduct());
        existing.setProductCategory(updated.getProductCategory());
        existing.setQuantity(updated.getQuantity());
        existing.setBatchNumber(updated.getBatchNumber());
        existing.setWarrantyPeriod(updated.getWarrantyPeriod());
        existing.setProductCondition(updated.getProductCondition());
        existing.setRemark(updated.getRemark());

        if (updated.getSerialNumbers() != null && !updated.getSerialNumbers().isEmpty()) {
            validateAndAttachSerials(updated);
            existing.setSerialNumbers(updated.getSerialNumbers());
        }

        return inwardRepo.save(existing);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        InwardTransactions inward = getTransaction(id);
        inwardRepo.delete(inward);
    }

    private void validateAndAttachSerials(InwardTransactions inward) {
        for (ProductSerialNumbers sn : inward.getSerialNumbers()) {
            if (serialRepo.existsBySid(sn.getSid())) {
                throw new DuplicateResourceException("SID already exists: " + sn.getSid());
            }
            if (serialRepo.existsByMid(sn.getMid())) {
                throw new DuplicateResourceException("MID already exists: " + sn.getMid());
            }
            if (serialRepo.existsByTid(sn.getTid())) {
                throw new DuplicateResourceException("TID already exists: " + sn.getTid());
            }
            if (serialRepo.existsByVpaid(sn.getVpaid())) {
                throw new DuplicateResourceException("VPAID already exists: " + sn.getVpaid());
            }
            sn.setInwardTransaction(inward);
            sn.setProduct(inward.getProduct());
        }
    }
}

