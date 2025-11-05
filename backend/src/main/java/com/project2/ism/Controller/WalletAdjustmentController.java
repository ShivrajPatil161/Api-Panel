package com.project2.ism.Controller;


import com.project2.ism.Service.WalletAdjustmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/wallet-adjustment")
public class WalletAdjustmentController {


    private final WalletAdjustmentService walletAdjustmentService;

    public WalletAdjustmentController(WalletAdjustmentService walletAdjustmentService) {
        this.walletAdjustmentService = walletAdjustmentService;
    }


    @PostMapping("/apiPartner")
    public ResponseEntity<?> adjustApiPartnerWallet(@RequestBody WalletAdjustmentRequest request) {
        try {

            walletAdjustmentService.adjustApiPartnerWallet(
                    request.getApiPartnerId(),
                    request.getActionOnBalance(),
                    request.getAmount(),
                    request.getRemark()
            );
            return ResponseEntity.ok().body(new MessageResponse("ApiPartner wallet adjusted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }



    @GetMapping("/apiPartner/{apiPartnerId}")
    public ResponseEntity<?> getApiPartnerWalletBalance(@PathVariable Long apiPartnerId) {
        try {
            BigDecimal balance = walletAdjustmentService.getApiPartnerWalletBalance(apiPartnerId);
            return ResponseEntity.ok().body(new WalletBalanceResponse(apiPartnerId, balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // Inner response class for balance
    static class WalletBalanceResponse {
        private Long apiPartnerId;
        private BigDecimal availableBalance;

        public WalletBalanceResponse(Long apiPartnerId, BigDecimal availableBalance) {
            this.apiPartnerId = apiPartnerId;
            this.availableBalance = availableBalance;
        }

        public Long getApiPartnerId() {
            return apiPartnerId;
        }

        public void setApiPartnerId(Long apiPartnerId) {
            this.apiPartnerId = apiPartnerId;
        }

        public BigDecimal getAvailableBalance() {
            return availableBalance;
        }

        public void setAvailableBalance(BigDecimal availableBalance) {
            this.availableBalance = availableBalance;
        }
    }


    static class WalletAdjustmentRequest    {
        private Long apiPartnerId;
        private String actionOnBalance;
        private BigDecimal amount;
        private String remark;

        public Long getApiPartnerId() {
            return apiPartnerId;
        }

        public void setApiPartnerId(Long apiPartnerId) {
            this.apiPartnerId = apiPartnerId;
        }

        public String getActionOnBalance() {
            return actionOnBalance;
        }

        public void setActionOnBalance(String actionOnBalance) {
            this.actionOnBalance = actionOnBalance;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }

    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}