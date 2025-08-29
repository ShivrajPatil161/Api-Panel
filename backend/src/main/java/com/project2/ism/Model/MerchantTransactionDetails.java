package com.project2.ism.Model;

import com.project2.ism.Model.Users.Merchant;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

public class MerchantTransactionDetails extends TransactionDetailsBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "merchant_id",nullable = false)
    private Merchant merchant;
}
