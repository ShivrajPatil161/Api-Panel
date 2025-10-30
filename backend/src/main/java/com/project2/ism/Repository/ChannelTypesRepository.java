package com.project2.ism.Repository;

import com.project2.ism.Model.ChannelTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelTypesRepository extends JpaRepository<ChannelTypes, Long> {

    // Find channel type by name (case-insensitive)
    Optional<ChannelTypes> findByChannelNameIgnoreCase(String channelName);

    // Check if channel type exists by name (case-insensitive)
    boolean existsByChannelNameIgnoreCase(String channelName);

    // Find all channel types ordered by name
    List<ChannelTypes> findAllByOrderByChannelNameAsc();

    // Find channel types by name containing (for search functionality)
    List<ChannelTypes> findByChannelNameContainingIgnoreCase(String channelName);
}