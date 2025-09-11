package com.project2.ism.Repository;


import com.project2.ism.DTO.FranchiseListDTO;
import com.project2.ism.DTO.ReportDTO.FranchiseReportsDTO;
import com.project2.ism.Model.Users.Franchise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FranchiseRepository extends JpaRepository<Franchise, Long> {

    Optional<Franchise> findByContactPerson_Email(String email);

    @Query("""
    SELECT new com.project2.ism.DTO.FranchiseListDTO(
        f.id,
        f.franchiseName,
        cp.name,
        cp.email,
        cp.phoneNumber,
        f.address,
        COUNT(m.id),
        COALESCE(f.walletBalance, 0),
        COALESCE(f.status, 'ACTIVE'),
        f.createdAt
    )
    FROM Franchise f
    LEFT JOIN f.contactPerson cp
    LEFT JOIN f.merchants m
    GROUP BY f.id, f.franchiseName, cp.name, cp.email, cp.phoneNumber, 
             f.address, f.walletBalance, f.status, f.createdAt
""")
    List<FranchiseListDTO> findAllWithMerchantCount();


    //stats
    @Query("SELECT SUM(f.walletBalance) FROM Franchise f")
    BigDecimal sumWalletBalances();

    @Query(value = """
    SELECT new com.project2.ism.DTO.ReportDTO.FranchiseReportsDTO(
        f.franchiseName,
        COUNT(DISTINCT m.id),
        f.walletBalance,
        COUNT(DISTINCT psn.id),
        COUNT(DISTINCT p.id)   
    )
    FROM Franchise f
    LEFT JOIN Merchant m ON m.franchise.id = f.id
    LEFT JOIN OutwardTransactions ot ON ot.franchise.id = f.id
    LEFT JOIN ProductSerialNumbers psn ON psn.outwardTransaction.id = ot.id
    LEFT JOIN Product p ON p.id = ot.product.id
    GROUP BY f.id,f.franchiseName, f.walletBalance
""")
    List<FranchiseReportsDTO> getFranchiseReports();




}