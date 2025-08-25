package com.project2.ism.Repository;

import com.project2.ism.Model.InventoryTransactions.ProductSerialNumbers;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSerialsRepository extends JpaRepository<ProductSerialNumbers,Long> {
    boolean existsBySid(String sid);
    boolean existsByMid(String mid);
    boolean existsByTid(String tid);
    boolean existsByVpaid(String vpaid);
    boolean existsByMobNumber(String mobNumber);

    List<ProductSerialNumbers> findByProduct_IdAndMerchantIsNullAndOutwardTransactionIsNull(Long productId);


    List<ProductSerialNumbers> findByOutwardTransaction_IdAndMerchantIsNull(Long outwardID);
   // List<ProductSerialNumbers> findByOutwardTransaction_Id(Long outwardID, Long franchiseId);

    List<ProductSerialNumbers> findByMerchant_Id(Long merchantId);
    @Modifying
    @Transactional
    @Query("UPDATE ProductSerialNumbers psn SET psn.merchant.id = :merchantId WHERE psn.id IN :serialIds")
    int assignMerchantToSerials(@Param("merchantId") Long merchantId, @Param("serialIds") List<Long> serialIds);
}
