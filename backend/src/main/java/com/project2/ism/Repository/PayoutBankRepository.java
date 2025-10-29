//package com.project2.ism.Repository;
//
//import com.project2.ism.Model.PayoutBanks;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface PayoutBankRepository extends JpaRepository<PayoutBanks, Long> {
//
//    List<PayoutBanks> findByCustomerTypeAndCustomerId(String customerType, Long customerId);
//
//    long countByCustomerTypeAndCustomerId(String customerType, Long customerId);
//
//    boolean existsByCustomerTypeAndCustomerIdAndAccountNumber(String customerType, Long customerId, String accountNumber);
//}
