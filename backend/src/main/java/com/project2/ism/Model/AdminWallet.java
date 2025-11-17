package com.project2.ism.Model;

import jakarta.persistence.*;

@Entity
public class AdminWallet extends WalletBase{
    @Id
    private Long id = 1L;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    @PrePersist
    private void ensureIdIsAlwaysOne() {
        if (this.id == null) {
            this.id = 1L;
        } else if (this.id != 1L) {
            throw new IllegalStateException("AdminWallet ID must always be 1.");
        }
    }

}
