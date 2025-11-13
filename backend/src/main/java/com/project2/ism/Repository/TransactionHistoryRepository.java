package com.project2.ism.Repository;

import com.project2.ism.Model.Vendor.TransactionHistory;
import com.project2.ism.Model.Vendor.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    List<TransactionHistory> findTop5ByVendorOrderByCreatedAtDesc(Vendor vendor);

    // Cleanup old records periodically
    @Modifying
    @Query("DELETE FROM TransactionHistory th WHERE th.createdAt < :cutoffDate")
    void deleteOldRecords(@Param("cutoffDate") LocalDateTime cutoffDate);

}
