package com.project2.ism.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project2.ism.DTO.PaymentGateway.CreateOrderRequest;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ApiPartnerCredentials;
import com.project2.ism.Model.PgTransactionMapping;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Model.Vendor.VendorCredentials;
import com.project2.ism.Model.Vendor.VendorRouting;
import com.project2.ism.Repository.ApiPartnerCredentialsRepository;
import com.project2.ism.Repository.PgTransactionMappingRepository;
import com.project2.ism.Repository.VendorCredentialRepository;
import com.project2.ism.Repository.VendorRoutingRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
public class PaymentGatewayService {

    private static final Logger log = LoggerFactory.getLogger(PaymentGatewayService.class);

    private final ApiPartnerCredentialsRepository apiPartnerCredentialsRepository;
    private final VendorRoutingRepository vendorRoutingRepository;
    private final VendorCredentialRepository vendorCredentialRepository;
    private final PgTransactionMappingRepository pgTransactionMappingRepository;
    private final VendorRoutingService vendorRoutingService;

    public PaymentGatewayService(ApiPartnerCredentialsRepository apiPartnerCredentialsRepository, VendorRoutingRepository vendorRoutingRepository, VendorCredentialRepository vendorCredentialRepository, PgTransactionMappingRepository pgTransactionMappingRepository, VendorRoutingService vendorRoutingService) {
        this.apiPartnerCredentialsRepository = apiPartnerCredentialsRepository;
        this.vendorRoutingRepository = vendorRoutingRepository;
        this.vendorCredentialRepository = vendorCredentialRepository;
        this.pgTransactionMappingRepository = pgTransactionMappingRepository;
        this.vendorRoutingService = vendorRoutingService;
    }


    @Transactional
    public ResponseEntity<String> createOrder(CreateOrderRequest req) {
        log.info("Received createOrder request {}", req);
        LocalDateTime imRequestTime = LocalDateTime.now();
        String partnerId = null;

        try {

            String orderId = req.getOrderId();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            ApiPartnerCredentials apiPartnerCredentials =
                    apiPartnerCredentialsRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("Invalid dummy username"));

            // Get partner's product (PG / Payout)
            Product partnerProduct = new Product();//apiPartnerCredentials.getApiPartner().getProducts();
            if (partnerProduct == null) {
                throw new IllegalArgumentException("No product assigned to partner " + partnerId);
            }
            //dummy code
            partnerProduct.setId(Long.valueOf(req.getProductId()));
            // 3. Find VendorRouting for requested product
            VendorRouting routing = vendorRoutingRepository.findByProductId(partnerProduct.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("No vendor routing found for product " + partnerProduct.getId()));

            // 4. Determine the vendor from routing (your own logic)
            Vendor vendor = vendorRoutingService.getVendorForToken(routing, req.getAmount());
            if (vendor == null) {
                throw new RuntimeException("No vendor determined from routing");
            }

            // 5. Find credentials for vendor + product
//            VendorCredentials credentials = vendorCredentialRepository
//                    .findByVendor_IdAndProduct_Id(vendor.getId(), vendor.getProduct().getId())
//                    .orElseThrow(() -> new RuntimeException("No credentials found for vendor " + vendor.getId()));


            // ====== Save Transaction Mapping (Retailer Context) ======
            PgTransactionMapping txnMap = new PgTransactionMapping();
            txnMap.setOrderId(orderId);
            txnMap.setInitiatedBy(username);  // <-- must come from logged-in user or request
            txnMap.setAmount(req.getAmount());
            txnMap.setStatus("INITIATED");
            //txnMap.setVendorName(vendor.getName());

            pgTransactionMappingRepository.save(txnMap);

            // headers with token
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//            headers.set("client_id", credentials.getClientId());
//            headers.set("token", generateToken(credentials)); /// bruh here api hit to get token from vendor
//
//            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//            body.add("callbackurl", credentials.getCallbackUrl());
//            body.add("order_id", orderId);
//            body.add("amount", String.valueOf(req.getAmount()));
//            if (req.getMerchantRef() != null) {
//                body.add("merc_unq_ref", req.getMerchantRef());
//            }
//
//            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
//            //String url = credentials.getBaseUrlUat() + "/order";
//            String url = credentials.getBaseUrlProd() + "/order";
//            log.info("Old vendor order URL: {}", url);

            // call vendor
//            LocalDateTime vendorRequestTime = LocalDateTime.now();
//            String vendorRequestLog = "Headers: " + headers + ", Body: " + body;
//
//            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
//
            txnMap.setStatus("REQUEST_SENT");
            pgTransactionMappingRepository.save(txnMap);

//            LocalDateTime vendorResponseTime = LocalDateTime.now();
//            String vendorResponseLog = response.getBody();
//
//            commonFunctions.saveVendorLogs(vendorRequestTime, vendorRequestLog, vendor.getId(),
//                    vendorResponseTime, vendorResponseLog, null);
//
//            // save IM logs
//            commonFunctions.saveImLogs(req.toString(), imRequestTime, null,
//                    vendorResponseLog, LocalDateTime.now());

            return ResponseEntity.status(200).body("hi implement this"+ vendor.getName());

        } catch (Exception e) {
            log.error("Error creating order {}", req, e);
//            commonFunctions.saveImLogs(req.toString(), imRequestTime, null,
//                    e.getMessage(), LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    public String handleCallback(Map<String, String> originalPayload, HttpServletRequest request) throws JsonProcessingException {
        LocalDateTime requestTime = LocalDateTime.now();
        String clientIp = request.getRemoteAddr();

        log.info("---- [Callback] Received callback at: {} from IP: {}", requestTime, clientIp);
        log.info("---- [Callback] Raw Payload: {}", originalPayload);

        String rawCallbackData = extractCallbackData(originalPayload);

        try {
//            if (rawCallbackData != null) {
//                VendorCallbackParser parser = callbackParserFactory.getParser(originalPayload);
//                RunPaisaCallback processedCallback = parser.parse(originalPayload);
//                processCallback(processedCallback, originalPayload);
//            } else {
//                RunPaisaCallback processedCallback = convertToCallback(originalPayload);
//                processCallback(processedCallback, originalPayload);
//            }
//
//            commonFunctions.saveCallbackEventLog(originalPayload.toString(), requestTime, clientIp, "Callback processed successfully", LocalDateTime.now());
//            log.info("---- [Callback] Successfully logged callback event");
            return "Callback processed successfully";
        } catch (Exception e) {
            log.error("---- [Callback] Processing failed: {}", e.getMessage(), e);
            try {
//                commonFunctions.saveCallbackEventLog(originalPayload.toString(), requestTime, clientIp, "Callback processing failed: " + e.getMessage(), LocalDateTime.now());
            } catch (Exception logEx) {
                log.error("---- [Callback] Failed to save failure log: {}", logEx.getMessage(), logEx);
            }
            throw new RuntimeException("Callback processing failed", e);
        }
    }

//    public void processCallback(RunPaisaCallback processedCallback, Map<String, String> originalPayload) throws JsonProcessingException {
//        log.info("---- [Callback] Processing for Order ID: {}, Status: {}", processedCallback.getOrderId(), processedCallback.getStatus());
//
//        TransactionSchemeDetailsRequestDto dto = null;
//
//        // Fetch base transaction mapping
//        log.info("---- [Callback] Fetching transaction mapping for Order ID: {}", processedCallback.getOrderId());
//        PgTransactionMapping pgTransactionMapping = pgTransactionMappingRepository.findByOrderId(processedCallback.getOrderId())
//                .orElseThrow(() -> new RuntimeException("Transaction not found for Order ID: " + processedCallback.getOrderId()));
//
//        // Prepare base data
//        Double txnAmt = Double.valueOf(processedCallback.getTxnAmount());
//        log.info("---- [Callback] Parsed transaction amount: {}", txnAmt);
//
//        String callbackOperatorName = toDbOperatorName(
//                processedCallback.getTxnMode(),
//                processedCallback.getCardCategory(),
//                processedCallback.getPgPartner()
//        );
//        log.info("---- [Callback] Using operatorName for DB lookup: {}", callbackOperatorName);
//
//        // always resolve partner once
//        ApiPartner apiPartner = apiPartnerRepository
//                .findByMobileNumber(processedCallback.getCustomerPhone())
//                .orElseThrow(() -> new RuntimeException("No User Found"));
//
//        ApiPartnerCredentials apiPartnerCredentials = apiPartnerCredentialsRepository
//                .findByApiPartner_PartnerId(apiPartner.getPartnerId()) // or getId() depending on your entity
//                .orElseThrow(() -> new RuntimeException("No credentials found for partner: " + apiPartner.getPartnerId()));
//
//
//        log.info("---- [Callback] Status is SUCCESS. Fetching saved transaction data...");
//
//        // Fetch all matching schemes for operator name
//        List<SchemeRate> matchingSchemes = schemeRateRepository.findSchemeByOperatorName(callbackOperatorName);
//        if (matchingSchemes == null || matchingSchemes.isEmpty()) {
//            log.error("---- [Callback] No matching scheme found for operatorName: {}", callbackOperatorName);
//            throw new RuntimeException("No matching scheme found for operatorName: " + callbackOperatorName);
//        }
//        log.info("---- [Callback] Scheme(s) found: {}", matchingSchemes.size());
//
//        // Pick correct scheme by amount range or fixed value
//        SchemeRate selectedScheme = matchingSchemes.stream()
//                .filter(scheme ->
//                        (scheme.getSlabType() == SlabType.FIXED && Objects.equals(scheme.getFixedSlabValue(), txnAmt)) ||
//                                (scheme.getSlabType() == SlabType.VARIABLE && txnAmt >= scheme.getSlabStart() && txnAmt <= scheme.getSlabEnd())
//                )
//                .findFirst()
//                .orElse(matchingSchemes.get(0));
//        log.debug("---- [Callback] Selected scheme: {}", selectedScheme);
//
//        log.info("---- [Callback] Matching scheme found: {}", selectedScheme.getSchemeCode());
//
//        log.debug("---- [Callback] Fetching scheme details for code: {}", selectedScheme.getSchemeCode());
//        Scheme scheme = schemeRepository.findBySchemeCode(selectedScheme.getSchemeCode())
//                .orElseThrow(() -> new RuntimeException("Scheme Not Found for code: " + selectedScheme.getSchemeCode()));
//
//        // 2. Parse schemeCombinationHashCode (e.g., 10-02-001-00001)
//        String[] hashParts = scheme.getSchemeCombinationHashCode().split("-");
//
//        short productId = Short.parseShort(hashParts[0]);
//
//        // 3. Fetch Product and SubProduct
//        Products product = productsRepository.findById(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
//
//        String orderId = processedCallback.getOrderId();
//        String baseTranxId = orderId.startsWith("ORD") ? orderId.substring(3) : orderId;
//
//        // Fill DTO completely
//        dto = new TransactionSchemeDetailsRequestDto();
//        dto.setAmount(txnAmt);
//        dto.setConfirmAmount(txnAmt);
//        dto.setOperatorName(callbackOperatorName);
//        dto.setOperatorCode(selectedScheme.getOperatorCode());
//        dto.setSchemeRate(selectedScheme);
//        dto.setTransactionType(product.getTransactionType());
//        dto.setGstValue(String.valueOf(product.getSgst()));
//        dto.setTdsRate(String.valueOf(product.getTds()));
//        dto.setBaseTranxId(baseTranxId);
//        dto.setMobileNumber(processedCallback.getCustomerPhone());
//
//        dto.setHierarchyId(apiPartner.getPartnerId());
//
//        dto.setProductCode(product.getProductCode());
//        dto.setIsCommission(product.getIsCommissions());
//        dto.setHasCharge(product.getHasCharges());
//
//        log.info("---- [Callback] Deserialized Transaction DTO: {}", dto);
//        transactionServiceImpl.processTransaction(dto, processedCallback.getStatus());
//
//        notifyPartner(apiPartnerCredentials, originalPayload); // or payload, depending on what you want to send
//
//    }

    private String toDbOperatorName(String txnMode, String cardCategory, String pgPartner) {
        log.info("<-----------------------Txn Mode: {}, Card Category: {}, PG Partner: {}", txnMode, cardCategory, pgPartner);

        return Stream.of(txnMode, cardCategory, pgPartner)
                .filter(s -> s != null && !s.isBlank() && !s.equalsIgnoreCase("NA") && !s.equalsIgnoreCase("N/A"))
                .map(s -> Arrays.stream(s.split("_"))
                        .filter(part -> !part.isBlank())
                        .map(part -> part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase())
                        .collect(Collectors.joining("_")))
                .collect(Collectors.joining("_"));
    }


    private String extractCallbackData(Map<String, String> payload) {
        log.info("---- [Callback] Extracting callback data from payload...");

        if (payload.containsKey("CALLBACKRESPONSE")) {
            String callbackResponse = payload.get("CALLBACKRESPONSE");
            log.info("---- [Callback] CALLBACKRESPONSE found (Razorpay): {}", callbackResponse);
            return callbackResponse;
        } else if (payload.containsKey("CALLBACK")) {
            String callback = payload.get("CALLBACK");
            log.info("---- [Callback] CALLBACK found (Cashfree): {}", callback);
            return callback;
        }

        log.warn("---- [Callback] No recognized callback data found in payload.");
        return null;
    }
//
//    private RunPaisaCallback convertToCallback(Map<String, String> payload) {
//        log.info("---- [Callback] Converting raw payload to RunPaisaCallback object...");
//
//        RunPaisaCallback callback = new RunPaisaCallback();
//        callback.setStatus(payload.get("STATUS"));
//        callback.setStatusCode(payload.get("STATUS_CODE"));
//        callback.setOrderId(payload.get("ORDER_ID"));
//        callback.setTxnMode(payload.get("TXN_MODE"));
//        callback.setTxnAmount(payload.get("TXN_AMOUNT"));
//        callback.setCardCategory(payload.get("CARD_CATEGORY"));
//        callback.setTxnDate(payload.get("TXN_DATE"));
//        callback.setTxnInfo(payload.get("TXN_INFO"));
//        callback.setCustomerName(payload.get("CUSTOMER_NAME"));
//        callback.setCustomerEmail(payload.get("CUSTOMER_EMAIL"));
//        callback.setCustomerPhone(payload.get("CUSTOMER_PHONE"));
//        callback.setBankTxnId(payload.get("BANK_TXNID"));
//        callback.setBankCode(payload.get("BANK_CODE"));
//        callback.setErrorId(payload.get("ERROR_ID"));
//        callback.setErrorDesc(payload.get("ERROR_DESC"));
//        callback.setCardNumber(payload.get("CARD_NUMBER"));
//        callback.setCardType(payload.get("CARD_TYPE"));
//        callback.setUnmappedStatus(payload.get("UNMAPPED_STATUS"));
//        callback.setPgPartner(payload.get("PG_PARTNER"));
//        callback.setMercUnqRef(payload.get("MERC_UNQ_REF"));
//
//        log.info("---- [Callback] Callback object created: {}", callback);
//        return callback;
//    }
//
//
//    public void notifyPartner(ApiPartnerCredentials apiPartner, Map<String, String> originalPayload) {
//        if (apiPartner.getCallbackUrl() == null || apiPartner.getCallbackUrl().isBlank()) {
//            log.warn("No callback URL configured for partner {}", apiPartner.getApiPartner().getPartnerId());
//            return;
//        }
//
//        String url = apiPartner.getCallbackUrl();
//        try {
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            HttpEntity<Object> entity = new HttpEntity<>(originalPayload, headers);
//            ResponseEntity<String> resp = restTemplate.postForEntity(url, entity, String.class);
//
//            log.info("Sent callback to partner {} at {}. Status: {} Body: {}",
//                    apiPartner.getApiPartner().getPartnerId(), url, resp.getStatusCode(), resp.getBody());
//        } catch (Exception e) {
//            log.error("Error sending callback to partner {} at {}: {}", apiPartner.getApiPartner().getPartnerId(), url, e.getMessage(), e);
//        }
//    }



}
