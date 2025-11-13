package com.project2.ism.Repository;

import com.project2.ism.Model.PgTransactionMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PgTransactionMappingRepository extends JpaRepository<PgTransactionMapping, Long> {

    Optional<PgTransactionMapping> findByOrderId(String orderId);

}