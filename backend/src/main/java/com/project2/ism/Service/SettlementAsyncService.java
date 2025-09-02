package com.project2.ism.Service;

import com.project2.ism.DTO.TempDTOs.SettlementResultDTO;
import com.project2.ism.Model.*;
import com.project2.ism.Model.PricingScheme.CardRate;
import com.project2.ism.Model.Users.Merchant;
import com.project2.ism.Repository.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.Executor;

@Service
public class SettlementAsyncService {

    private final SettlementService settlementService;





    public SettlementAsyncService(SettlementService settlementService) {
        this.settlementService = settlementService;

    }

    @Async("settlementExecutor")
    @Transactional
    public void settleOneAsync(Long merchantId, Long batchId, String vendorTxPrimaryKey) {
        settlementService.settleOne(merchantId, batchId, vendorTxPrimaryKey);
    }



}


