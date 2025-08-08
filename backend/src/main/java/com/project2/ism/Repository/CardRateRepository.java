package com.project2.ism.Repository;

import com.project2.ism.Model.PricingScheme.CardRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRateRepository extends JpaRepository<CardRate, Long> {
}
