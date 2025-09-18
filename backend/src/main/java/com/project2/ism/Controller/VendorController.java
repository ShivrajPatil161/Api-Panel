package com.project2.ism.Controller;

import com.project2.ism.DTO.VendorIDNameDTO;
import com.project2.ism.DTO.VendorStatsDTO;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Service.VendorService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    // 🔹 Create Vendor
    @PostMapping
    public ResponseEntity<?> createVendor(@Valid @RequestBody Vendor vendor) {
        try {
            Vendor savedVendor = vendorService.createVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while creating vendor.");
        }
    }

    // 🔹 Get All Vendors
    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    // 🔹 Get Vendor by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVendorById(@PathVariable Long id) {
        try {
            Vendor vendor = vendorService.getVendorById(id);
            return ResponseEntity.ok(vendor);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // get all vendor with just id and name
    @GetMapping("/id_name")
    public ResponseEntity<List<VendorIDNameDTO>> getAllVendorsIdAndName(){
        return ResponseEntity.ok(vendorService.getAllVendorsIdAndName());
    }

    // 🔹 Update Vendor
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable Long id, @Valid @RequestBody Vendor vendor) {
        try {
            Vendor updatedVendor = vendorService.updateVendor(id, vendor);
            return ResponseEntity.ok(updatedVendor);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while updating vendor.");
        }
    }

    // 🔹 Delete Vendor
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        try {
            vendorService.deleteVendor(id);
            return ResponseEntity.ok("Vendor deleted successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while deleting vendor.");
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<VendorStatsDTO> getVendorStats() {
        return ResponseEntity.ok(vendorService.getVendorStats());
    }


    @GetMapping("/active")
    public ResponseEntity<List<Vendor>> getActiveVendors() {
        return ResponseEntity.ok(vendorService.getAllActiveVendors());
    }
}



