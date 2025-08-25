package com.project2.ism.Service;

import com.project2.ism.DTO.OutwardTransactionDTO;
import com.project2.ism.Exception.DuplicateResourceException;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OutwardTransactionService {

        private final OutwardTransactionRepository repository;
        private final FranchiseRepository franchiseRepo;
        private final MerchantRepository merchantRepo;
        private final ProductRepository productRepo;
        private final ProductSerialsRepository serialRepo;

        public OutwardTransactionService(
                OutwardTransactionRepository repository,
                FranchiseRepository franchiseRepo,
                MerchantRepository merchantRepo,
                ProductRepository productRepo,
                ProductSerialsRepository serialRepo) {
            this.repository = repository;
            this.franchiseRepo = franchiseRepo;
            this.merchantRepo = merchantRepo;
            this.productRepo = productRepo;
            this.serialRepo = serialRepo;
        }

        public List<OutwardTransactions> getAll() {
            return repository.findAll();
        }

        public OutwardTransactions getById(Long id) {
            return repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Outward Transaction not found with id " + id));
        }

        @Transactional
        public OutwardTransactions
        createFromDTO(OutwardTransactionDTO dto) {
            if (repository.existsByDeliveryNumber(dto.deliveryNumber)) {
                throw new DuplicateResourceException("Delivery number already exists: " + dto.deliveryNumber);
            }

            Franchise franchise = dto.franchiseId != null
                    ? franchiseRepo.findById(dto.franchiseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Franchise not found"))
                    : null;

            Merchant merchant = dto.merchantId != null
                    ? merchantRepo.findById(dto.merchantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"))
                    : null;

            Product product = dto.productId != null
                    ? productRepo.findById(dto.productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"))
                    : null;

            OutwardTransactions outward = dto.toEntity(franchise, merchant, product,serialRepo);
            return repository.save(outward);
        }

        @Transactional
        public OutwardTransactions updateFromDTO(Long id, OutwardTransactionDTO dto) {
            OutwardTransactions existing = getById(id);

            Franchise franchise = dto.franchiseId != null
                    ? franchiseRepo.findById(dto.franchiseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Franchise not found"))
                    : null;

            Merchant merchant = dto.merchantId != null
                    ? merchantRepo.findById(dto.merchantId)
                    .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"))
                    : null;

            Product product = dto.productId != null
                    ? productRepo.findById(dto.productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"))
                    : null;

            // map DTO → existing entity
            existing.setDeliveryNumber(dto.deliveryNumber);
            existing.setFranchise(franchise);
            existing.setMerchant(merchant);
            existing.setProduct(product);
            existing.setDispatchDate(dto.dispatchDate);
            existing.setDispatchedBy(dto.dispatchedBy);
            existing.setQuantity(dto.quantity);
            existing.setDeliveryAddress(dto.deliveryAddress);
            existing.setContactPerson(dto.contactPerson);
            existing.setContactPersonNumber(dto.contactPersonNumber);
            existing.setDeliveryMethod(dto.deliveryMethod);
            existing.setTrackingNumber(dto.trackingNumber);
            existing.setExpectedDeliveryDate(dto.expectedDelivery);
            existing.setRemarks(dto.remarks);

            if (dto.serialNumbers != null) {
                existing.setProductSerialNumbers(
                        dto.serialNumbers.stream()
                                .map(sn -> sn.toOutwardEntity(existing, serialRepo))
                                .collect(Collectors.toList())
                );
            }

            return repository.save(existing);
        }

        @Transactional
        public void delete(Long id) {
            OutwardTransactions existing = getById(id);
            // Break relationship manually
//            for (ProductSerialNumbers psn : existing.getProductSerialNumbers()) {
//                psn.setOutwardTransaction(null);
//            }
            repository.delete(existing);
        }


    }

