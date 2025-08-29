package com.project2.ism.Model;

import com.project2.ism.Model.Users.Franchise;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
public class FranchiseTransactionDetails extends TransactionDetailsBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "franchise_id",nullable = false)
    private Franchise franchise;
}
