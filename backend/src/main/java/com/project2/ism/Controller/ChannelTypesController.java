package com.project2.ism.Controller;

import com.project2.ism.Model.ChannelTypes;
import com.project2.ism.Service.ChannelTypesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/channel-types")
public class ChannelTypesController {

    @Autowired
    private ChannelTypesService channelTypesService;

    // Get all channel types
    @GetMapping
    public ResponseEntity<List<ChannelTypes>> getAllChannelTypes() {
        try {
            List<ChannelTypes> channelTypes = channelTypesService.getAllChannelTypes();
            return ResponseEntity.ok(channelTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get channel type by ID
    @GetMapping("/{id}")
    public ResponseEntity<ChannelTypes> getChannelTypeById(@PathVariable Long id) {
        try {
            Optional<ChannelTypes> channelType = channelTypesService.getChannelTypeById(id);
            return channelType.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create new channel type
    @PostMapping
    public ResponseEntity<?> createChannelType(@Valid @RequestBody ChannelTypes channelType) {
        try {
            ChannelTypes createdChannelType = channelTypesService.createChannelType(channelType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdChannelType);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating channel type: " + e.getMessage());
        }
    }

    // Update channel type
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChannelType(@PathVariable Long id, @Valid @RequestBody ChannelTypes channelTypeDetails) {
        try {
            ChannelTypes updatedChannelType = channelTypesService.updateChannelType(id, channelTypeDetails);
            return ResponseEntity.ok(updatedChannelType);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating channel type: " + e.getMessage());
        }
    }

    // Delete channel type
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChannelType(@PathVariable Long id) {
        try {
            channelTypesService.deleteChannelType(id);
            return ResponseEntity.ok().body("Channel type deleted successfully");
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting channel type: " + e.getMessage());
        }
    }

    // Search channel types
    @GetMapping("/search")
    public ResponseEntity<List<ChannelTypes>> searchChannelTypes(@RequestParam String q) {
        try {
            List<ChannelTypes> channelTypes = channelTypesService.searchChannelTypes(q);
            return ResponseEntity.ok(channelTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Check if channel type exists
    @GetMapping("/exists")
    public ResponseEntity<Boolean> channelTypeExists(@RequestParam String channelName) {
        try {
            boolean exists = channelTypesService.channelTypeExists(channelName);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}