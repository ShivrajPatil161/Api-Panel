package com.project2.ism.Model;


import com.project2.ism.Model.InventoryTransactions.OutwardTransactions;
import com.project2.ism.Model.PricingScheme.PricingScheme;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "outward_scheme_assignments")
public class ProductSchemeAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)   // FK → pricing_schemes
    @JoinColumn(name = "scheme_id", nullable = false)
    private PricingScheme scheme;

    @ManyToOne(fetch = FetchType.LAZY)   // FK → outward_transactions
    @JoinColumn(name = "outward_transaction_id", nullable = false)
    private OutwardTransactions outwardTransaction;

    @Column(name = "customer_type", nullable = false)
    private String customerType; // "FRANCHISE" / "MERCHANT"

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private String remarks;

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PricingScheme getScheme() { return scheme; }
    public void setScheme(PricingScheme scheme) { this.scheme = scheme; }

    public OutwardTransactions getOutwardTransaction() { return outwardTransaction; }
    public void setOutwardTransaction(OutwardTransactions outwardTransaction) { this.outwardTransaction = outwardTransaction; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
