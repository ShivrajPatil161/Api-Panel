package com.project2.ism.Model;

import com.project2.ism.Model.Users.ApiPartner;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.BitSet;

@Entity
@Table(name = "apiPartner_transaction_details",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_mtd_vendor_tx", columnNames = {"vendor_transaction_id"})
        })
public class ApiPartnerTransactionDetails extends TransactionDetailsBase{

    @NotNull
    @ManyToOne
    @JoinColumn(name = "apiPartner_id",nullable = false)
    private ApiPartner apiPartner;

    private BigDecimal charge;

    private BigDecimal grossCharge;

    public ApiPartnerTransactionDetails() {
    }

    public ApiPartner getApiPartner() {
        return apiPartner;
    }

    public void setApiPartner(ApiPartner apiPartner) {
        this.apiPartner = apiPartner;
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
