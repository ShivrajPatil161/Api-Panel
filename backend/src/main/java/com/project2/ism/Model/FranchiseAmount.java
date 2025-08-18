package com.project2.ism.Model;

import com.project2.ism.Model.Users.Franchise;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;

@Entity
public class FranchiseAmount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "franchise_id",nullable = false)
    private Franchise franchise;

    @Column(nullable = false, columnDefinition = "DECIMAL(38,2) DEFAULT 0.00")
    private BigDecimal availableBalance = BigDecimal.ZERO;

    private BigDecimal cutOfAmount;

    private BigDecimal lastUpdatedAmount;

    private LocalDate lastUpdatedDate;

    private Time lastUpdatedTime;

    private BigDecimal totalCash;

    private BigDecimal usedCash;

}
