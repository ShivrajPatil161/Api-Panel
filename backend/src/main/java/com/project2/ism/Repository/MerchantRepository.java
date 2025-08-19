package com.project2.ism.Repository;

import com.project2.ism.Model.Users.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    List<Merchant> findByFranchiseId(Long franchiseId); // For filtering by Franchise
    List<Merchant> findByIsApprovedFalse();
}
