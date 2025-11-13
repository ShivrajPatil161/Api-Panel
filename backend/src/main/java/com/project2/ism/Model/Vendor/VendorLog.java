package com.project2.ism.Model.Vendor;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_logs",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_vendor_date",
                        columnNames = {"vendor_id", "log_date"}
                )
        }
)
public class VendorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "total_amount_processed", nullable = false)
    private Double totalAmountProcessed = 0.0;

    @Column(name = "transaction_count", nullable = false)
    private Integer transactionCount = 0;

    @Column(name = "failure_count", nullable = false)
    private Integer failureCount = 0;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Unique constraint on vendor + date
    // Add in schema: UNIQUE KEY unique_vendor_date (vendor_id, log_date)

    public VendorLog() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Double getTotalAmountProcessed() {
        return totalAmountProcessed;
    }

    public void setTotalAmountProcessed(Double totalAmountProcessed) {
        this.totalAmountProcessed = totalAmountProcessed;
    }

    public Integer getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(Integer transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Integer getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(Integer failureCount) {
        this.failureCount = failureCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
