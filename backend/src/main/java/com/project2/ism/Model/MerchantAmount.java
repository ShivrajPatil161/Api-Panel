package com.project2.ism.Model;

import com.project2.ism.Model.Users.Merchant;
import jakarta.persistence.*;
import jakarta.validation.groups.Default;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;

@Entity
public class MerchantAmount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "merchant_id",nullable = false)
    private Merchant merchant;

    @Column(nullable = false, columnDefinition = "DECIMAL(38,2) DEFAULT 0.00")
    private BigDecimal availableBalance = BigDecimal.ZERO;

    private BigDecimal cutOfAmount;

    private BigDecimal lastUpdatedAmount;

    private LocalDate lastUpdatedDate;

    private Time lastUpdatedTime;

    private BigDecimal totalCash;

    private BigDecimal usedCash;

}
