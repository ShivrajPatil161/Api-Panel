package com.project2.ism.Repository;

import com.project2.ism.Model.PricingScheme.ChannelRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChannelRateRepository extends JpaRepository<ChannelRate, Long> {
    Optional<ChannelRate> findByPricingScheme_IdAndChannelNameIgnoreCase(Long schemeId, String channelName);
    Optional<ChannelRate> findByPricingScheme_IdAndChannelNameContainingIgnoreCase(Long schemeId, String partOfChannelName);


}
