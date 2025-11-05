package com.project2.ism.Repository;

import com.project2.ism.Model.PayoutBanks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutBankRepository extends JpaRepository<PayoutBanks, Long> {


    long countByApiPartner(String customerType, Long customerId);

    boolean existsByApiPartnerAndAccountNumber(String customerType, Long customerId, String accountNumber);
}
