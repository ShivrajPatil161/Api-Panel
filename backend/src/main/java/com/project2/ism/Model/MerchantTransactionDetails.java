package com.project2.ism.Model;

import com.project2.ism.Model.Users.Merchant;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
public class MerchantTransactionDetails extends TransactionDetailsBase{

    @NotNull
    @ManyToOne
    @JoinColumn(name = "merchant_id",nullable = false)
    private Merchant merchant;

    public MerchantTransactionDetails() {
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }
}
