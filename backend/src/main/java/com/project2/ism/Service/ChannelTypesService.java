package com.project2.ism.Service;

import com.project2.ism.Model.ChannelTypes;
import com.project2.ism.Repository.ChannelTypesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChannelTypesService {

    @Autowired
    private ChannelTypesRepository channelTypesRepository;

    // Get all channel types
    public List<ChannelTypes> getAllChannelTypes() {
        return channelTypesRepository.findAllByOrderByChannelNameAsc();
    }

    // Get channel type by ID
    public Optional<ChannelTypes> getChannelTypeById(Long id) {
        return channelTypesRepository.findById(id);
    }

    // Get channel type by name
    public Optional<ChannelTypes> getChannelTypeByName(String channelName) {
        return channelTypesRepository.findByChannelNameIgnoreCase(channelName);
    }

    // Create new channel type
    public ChannelTypes createChannelType(ChannelTypes channelType) {
        // Check if channel type already exists
        if (channelTypesRepository.existsByChannelNameIgnoreCase(channelType.getChannelName())) {
            throw new RuntimeException("Channel type with name '" + channelType.getChannelName() + "' already exists");
        }
        return channelTypesRepository.save(channelType);
    }

    // Update channel type
    public ChannelTypes updateChannelType(Long id, ChannelTypes channelTypeDetails) {
        ChannelTypes channelType = channelTypesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Channel type not found with id: " + id));

        // Check if the new name conflicts with existing channel types (excluding current one)
        if (!channelType.getChannelName().equalsIgnoreCase(channelTypeDetails.getChannelName()) &&
                channelTypesRepository.existsByChannelNameIgnoreCase(channelTypeDetails.getChannelName())) {
            throw new RuntimeException("Channel type with name '" + channelTypeDetails.getChannelName() + "' already exists");
        }

        channelType.setChannelName(channelTypeDetails.getChannelName());
        return channelTypesRepository.save(channelType);
    }

    // Delete channel type
    public void deleteChannelType(Long id) {
        ChannelTypes channelType = channelTypesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Channel type not found with id: " + id));
        channelTypesRepository.delete(channelType);
    }

    // Check if channel type exists
    public boolean channelTypeExists(String channelName) {
        return channelTypesRepository.existsByChannelNameIgnoreCase(channelName);
    }

    // Search channel types
    public List<ChannelTypes> searchChannelTypes(String searchTerm) {
        return channelTypesRepository.findByChannelNameContainingIgnoreCase(searchTerm);
    }
}