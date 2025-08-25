package com.project2.ism.Controller;


import com.project2.ism.DTO.AssignMerchantRequest;
import com.project2.ism.Service.ProductSerialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product-serial-number")
public class ProductSerialController {


    public final ProductSerialService productSerialService;

    public ProductSerialController(ProductSerialService productSerialService) {
        this.productSerialService = productSerialService;
    }

    @PostMapping("/assign-merchant")
    public ResponseEntity<?> assignDevicesToMerchant(@RequestBody AssignMerchantRequest request) {
        productSerialService.assignSerialsToMerchant(request.getMerchantId(), request.getSelectedDeviceIds());
        return ResponseEntity.ok("Assigned " + request.getSelectedDeviceIds().size() + " devices to merchant " + request.getMerchantId());
    }

}
