package com.project2.ism.Repository;

import com.project2.ism.Model.Vendor.VendorCredentials;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VendorCredentialRepository extends JpaRepository<VendorCredentials, Long> {


    Optional<VendorCredentials> findByVendor_IdAndProduct_Id(Long id, Long id1);
}
