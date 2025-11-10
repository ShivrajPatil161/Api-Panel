package com.project2.ism.Controller;


import com.project2.ism.DTO.Vendor.VendorRoutingDTO;
import com.project2.ism.DTO.Vendor.VendorRoutingRequest;
import com.project2.ism.Service.VendorRoutingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendor-routing")
public class VendorRoutingController {

    private final VendorRoutingService vendorRoutingService;

    public VendorRoutingController(VendorRoutingService vendorRoutingService) {
        this.vendorRoutingService = vendorRoutingService;
    }

    @PostMapping
    public ResponseEntity<VendorRoutingDTO> createVendorRouting(@RequestBody VendorRoutingRequest request) {
        VendorRoutingDTO created = vendorRoutingService.createVendorRouting(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorRoutingDTO> updateVendorRouting(
            @PathVariable Long id,
            @RequestBody VendorRoutingRequest request) {
        VendorRoutingDTO updated = vendorRoutingService.updateVendorRouting(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorRoutingDTO> getVendorRoutingById(@PathVariable Long id) {
        VendorRoutingDTO dto = vendorRoutingService.getVendorRoutingById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<Page<VendorRoutingDTO>> getAllVendorRoutings(Pageable pageable) {
        Page<VendorRoutingDTO> routings = vendorRoutingService.getAllVendorRoutings(pageable);
        return ResponseEntity.ok(routings);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<VendorRoutingDTO> getVendorRoutingByProductId(@PathVariable Long productId) {
        VendorRoutingDTO dto = vendorRoutingService.getVendorRoutingByProductId(productId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendorRouting(@PathVariable Long id) {
        vendorRoutingService.deleteVendorRouting(id);
        return ResponseEntity.noContent().build();
    }
}

