package com.project2.ism.Repository;


import com.project2.ism.Model.PrefundRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrefundRequestRepository extends JpaRepository<PrefundRequest, Long>, JpaSpecificationExecutor<PrefundRequest> {

    @Query("SELECT w FROM PrefundRequest w WHERE w.bankTranId = :bankTranId AND w.status = 'APPROVED'")
    Optional<PrefundRequest> findApprovedByBankTranId(@Param("bankTranId") String bankTranId);

    @Query("SELECT w FROM PrefundRequest w WHERE w.bankTranId = :bankTranId AND w.depositAmount = :amount AND w.createDateTime >= :thresholdTime")
    List<PrefundRequest> findDuplicatesWithinTime(
            @Param("bankTranId") String bankTranId,
            @Param("amount") double amount,
            @Param("thresholdTime") LocalDateTime thresholdTime);

    @Query("""
    SELECT p FROM PrefundRequest p
    ORDER BY 
        CASE 
            WHEN p.status = 'Pending' THEN 1 
            WHEN p.status = 'Approved' THEN 2
            WHEN p.status = 'Rejected' THEN 3
            ELSE 4
        END,
        p.createDateTime DESC
""")
    Page<PrefundRequest> findAllOrdered(Pageable pageable);


    Page<PrefundRequest> findByRequestedBy(String requestedBy, Pageable pageable);

    Page<PrefundRequest> findByStatus(String status, Pageable pageable);

    List<PrefundRequest> findByRequestedByAndStatus(String requestedBy, String status);
}
