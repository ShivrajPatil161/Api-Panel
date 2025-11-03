package com.project2.ism.Repository;

import com.project2.ism.Model.AdminBank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminBankRepository extends JpaRepository<AdminBank, Long> {

    // Check if account number already exists
    boolean existsByAccountNumber(String accountNumber);

    // Check if account number exists for a different bank (for updates)
    boolean existsByAccountNumberAndIdNot(String accountNumber, Long id);

    // Find by account number
    Optional<AdminBank> findByAccountNumber(String accountNumber);

    // Find by IFSC code
    Page<AdminBank> findByIfscCode(String ifscCode, Pageable pageable);

    // Find banks with charges enabled
    Page<AdminBank> findByChargesTrue(Pageable pageable);

    // Search banks by name (case-insensitive)
    @Query("SELECT ab FROM AdminBank ab WHERE LOWER(ab.bankName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<AdminBank> searchByBankName(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Advanced search with multiple criteria
    @Query("SELECT ab FROM AdminBank ab WHERE " +
            "(:bankName IS NULL OR LOWER(ab.bankName) LIKE LOWER(CONCAT('%', :bankName, '%'))) AND " +
            "(:ifscCode IS NULL OR ab.ifscCode = :ifscCode) AND " +
            "(:charges IS NULL OR ab.charges = :charges)")
    Page<AdminBank> searchBanks(
            @Param("bankName") String bankName,
            @Param("ifscCode") String ifscCode,
            @Param("charges") Boolean charges,
            Pageable pageable
    );

}
