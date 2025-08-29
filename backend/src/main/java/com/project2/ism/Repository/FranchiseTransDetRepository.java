package com.project2.ism.Repository;

import com.project2.ism.Model.FranchiseTransactionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FranchiseTransDetRepository extends JpaRepository<FranchiseTransactionDetails,Long> {
    Optional<FranchiseTransactionDetails> findByTransactionId(Long transactionId);

}
