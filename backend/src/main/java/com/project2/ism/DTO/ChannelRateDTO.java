package com.project2.ism.DTO;

import com.project2.ism.Model.PricingScheme.ChannelRate;

public record ChannelRateDTO(
        Long id,
        String channelName,

        Double rate
) {
    public static ChannelRateDTO fromEntity(ChannelRate entity) {
        return new ChannelRateDTO(
                entity.getId(),
                entity.getChannelName(),

                entity.getRate()
        );
    }
}
