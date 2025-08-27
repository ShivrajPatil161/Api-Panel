package com.project2.ism.DTO;

import com.project2.ism.Model.Users.Franchise;

import java.util.List;

public class FranchiseDetailsDTO {
    private final Franchise franchise;
    private final List<MerchantListDTO> merchants;

    public FranchiseDetailsDTO(Franchise franchise, List<MerchantListDTO> merchants) {
        this.franchise = franchise;
        this.merchants = merchants;
    }

    public Franchise getFranchise() {
        return franchise;
    }

    public List<MerchantListDTO> getMerchants() {
        return merchants;
    }
}

