package com.project2.ism.Repository;

import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorMonthlyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorMonthlyLogRepository extends JpaRepository<VendorMonthlyLog, Long> {
    Optional<VendorMonthlyLog> findByVendorAndYearAndMonth(
            Vendor vendor,
            Integer year,
            Integer month
    );

    // Get vendor performance for a year
    @Query("SELECT vml FROM VendorMonthlyLog vml " +
            "WHERE vml.vendor = :vendor AND vml.year = :year " +
            "ORDER BY vml.month")
    List<VendorMonthlyLog> findByVendorAndYear(@Param("vendor") Vendor vendor,
                                               @Param("year") Integer year);

    // Compare vendors for a specific month
    @Query("SELECT vml FROM VendorMonthlyLog vml " +
            "WHERE vml.year = :year AND vml.month = :month " +
            "ORDER BY vml.totalAmountProcessed DESC")
    List<VendorMonthlyLog> findByYearAndMonth(@Param("year") Integer year,
                                              @Param("month") Integer month);

}
