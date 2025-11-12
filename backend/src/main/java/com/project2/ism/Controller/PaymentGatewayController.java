package com.project2.ism.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project2.ism.DTO.PaymentGateway.CreateOrderRequest;
import com.project2.ism.Service.PaymentGatewayService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/pg")
public class PaymentGatewayController {

    private final PaymentGatewayService paymentGatewayService;
    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayController.class);

    public PaymentGatewayController(PaymentGatewayService paymentGatewayService) {
        this.paymentGatewayService = paymentGatewayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody CreateOrderRequest request) {
        return paymentGatewayService.createOrder(request);
    }

    @PostMapping("/payment/callback")
    public ResponseEntity<String> handleCallback(@RequestBody Map<String, String> payload,
                                                 HttpServletRequest request) throws JsonProcessingException {
        log.info("Received callback request from IP: {}, payload: {}", request.getRemoteAddr(), payload);
        String result = paymentGatewayService.handleCallback(payload, request);
        log.info("Callback response sent: {}", result);
        return ResponseEntity.ok(result);
    }
}
