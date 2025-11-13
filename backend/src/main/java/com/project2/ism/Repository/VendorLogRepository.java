package com.project2.ism.Repository;

import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorLog;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VendorLogRepository extends JpaRepository<VendorLog, Long> {



    @Query("SELECT vl FROM VendorLog vl WHERE vl.vendor = :vendor AND vl.logDate = :date")
    VendorLog findByVendorAndLogDate(@Param("vendor") Vendor vendor, @Param("date") LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT vl FROM VendorLog vl WHERE vl.vendor = :vendor AND vl.logDate = :date")
    VendorLog findByVendorAndLogDateWithLock(@Param("vendor") Vendor vendor, @Param("date") LocalDate date);

    // For monthly aggregation
    @Query("SELECT vl.vendor, " +
            "SUM(vl.totalAmountProcessed), " +
            "SUM(vl.transactionCount), " +
            "SUM(vl.failureCount) " +
            "FROM VendorLog vl " +
            "WHERE vl.logDate BETWEEN :startDate AND :endDate " +
            "GROUP BY vl.vendor")
    List<Object[]> getMonthlyAggregates(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    // For analytics - daily performance
    @Query("SELECT vl FROM VendorLog vl " +
            "WHERE vl.vendor = :vendor " +
            "AND vl.logDate BETWEEN :startDate AND :endDate " +
            "ORDER BY vl.logDate DESC")
    List<VendorLog> findByVendorAndDateRange(@Param("vendor") Vendor vendor,
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);


}
