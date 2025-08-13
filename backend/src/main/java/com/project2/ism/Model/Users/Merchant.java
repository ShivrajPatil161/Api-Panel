package com.project2.ism.Model.Users;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;


@Entity
public class Merchant extends CustomerBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "franchise_id", nullable = true)
    private Franchise franchise;

    @NotBlank(message = "Business name required")
    private String businessName;

    public Merchant() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Franchise getFranchise() {
        return franchise;
    }

    public void setFranchise(Franchise franchise) {
        this.franchise = franchise;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}
