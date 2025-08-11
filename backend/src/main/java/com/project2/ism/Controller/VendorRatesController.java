package com.project2.ism.Controller;

import com.project2.ism.Model.Vendor.VendorRates;
import com.project2.ism.Service.VendorRatesService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendor-rates")
public class VendorRatesController {

    private final VendorRatesService vendorRatesService;

    public VendorRatesController(VendorRatesService vendorRatesService) {
        this.vendorRatesService = vendorRatesService;
    }

    @PostMapping
    public ResponseEntity<VendorRates> createVendorRate(@Valid @RequestBody VendorRates vendorRates) {
        return ResponseEntity.ok(vendorRatesService.createVendorRates(vendorRates));
    }

    @GetMapping
    public ResponseEntity<List<VendorRates>> getAllVendorRates() {
        return ResponseEntity.ok(vendorRatesService.getAllVendorRates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorRates> getVendorRateById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorRatesService.getVendorRatesById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorRates> updateVendorRate(
            @PathVariable Long id,
            @Valid @RequestBody VendorRates vendorRates
    ) {
        return ResponseEntity.ok(vendorRatesService.updateVendorRates(id, vendorRates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendorRate(@PathVariable Long id) {
        vendorRatesService.deleteVendorRates(id);
        return ResponseEntity.noContent().build();
    }
}