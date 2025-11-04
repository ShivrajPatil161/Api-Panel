package com.project2.ism.Repository;

import com.project2.ism.Model.Vendor.VendorCredentials;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorCredentialRepository extends JpaRepository<VendorCredentials, Long> {
}
