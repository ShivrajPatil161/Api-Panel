package com.project2.ism.Repository;


import com.project2.ism.Model.ApiPartnerCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiPartnerCredentialsRepository extends JpaRepository<ApiPartnerCredentials, Long> {

}
