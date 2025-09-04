package com.project2.ism.Repository;

import com.project2.ism.Model.VendorTransactions;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VendorTransactionsRepository extends JpaRepository<VendorTransactions, Long> {

    @Query(value = """
    SELECT * FROM vendor_transactions vt
    WHERE vt.settled = 0
      AND vt.date BETWEEN :from AND :to
      AND (
        ( :#{#mids.size()} > 0 AND vt.mid IN (:mids) ) OR
        ( :#{#tids.size()} > 0 AND vt.tid IN (:tids) )
      )
    """, nativeQuery = true)
    List<VendorTransactions> findCandidates(
            @Param("from") LocalDateTime from,
            @Param("to")   LocalDateTime to,
            @Param("mids") List<String> mids,
            @Param("tids") List<String> tids
//            @Param("sids") List<String> sids
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT vt FROM VendorTransactions vt WHERE vt.internalId = :id")
    Optional<VendorTransactions> lockById(@Param("id") Long id);

    Optional<VendorTransactions> findByTransactionReferenceId(String vendorTxPrimaryKey);

    @Query("""
    SELECT MIN(v.date)
    FROM VendorTransactions v
    WHERE v.settled = false AND v.mid IN :mids
""")
    Optional<LocalDateTime> findEarliestUnsettledDateByMids(@Param("mids") List<String> mids);


}

//
//OR
////        ( :#{#sids.size()} > 0 AND vt.`device serial` IN (:sids)