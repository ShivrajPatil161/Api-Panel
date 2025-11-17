package com.project2.ism.Model;


import com.project2.ism.Model.Users.ApiPartner;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class AdminTransactionDetails extends TransactionDetailsBase{

    @NotNull
    @ManyToOne
    @JoinColumn(name = "apiPartner_id",nullable = false)
    private ApiPartner apiPartner;

    private BigDecimal charge;

    private BigDecimal grossCharge;

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
