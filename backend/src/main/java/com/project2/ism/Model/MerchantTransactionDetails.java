package com.project2.ism.Model;

import com.project2.ism.Model.Users.Merchant;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.BitSet;

@Entity
@Table(name = "merchant_transaction_details",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_mtd_vendor_tx", columnNames = {"vendor_transaction_id"})
        })
public class MerchantTransactionDetails extends TransactionDetailsBase{

    @NotNull
    @ManyToOne
    @JoinColumn(name = "merchant_id",nullable = false)
    private Merchant merchant;

    private BigDecimal charge;

    private BigDecimal grossCharge;

    public MerchantTransactionDetails() {
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public BigDecimal getCharge() {
        return charge;
    }

    public void setCharge(BigDecimal charge) {
        this.charge = charge;
    }

    public BigDecimal getGrossCharge() {
        return grossCharge;
    }

    public void setGrossCharge(BigDecimal grossCharge) {
        this.grossCharge = grossCharge;
    }
}
