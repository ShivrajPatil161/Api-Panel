package com.project2.ism.Repository;


import com.project2.ism.Model.ApiPartnerCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApiPartnerCredentialsRepository extends JpaRepository<ApiPartnerCredentials, Long> {

    Optional<ApiPartnerCredentials> findByUsername(String decryptedUsername);
}
