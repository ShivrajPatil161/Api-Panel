package com.project2.ism.Service;

import com.project2.ism.DTO.ApiPartnerDTO.PartnerCredentialDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.ApiPartnerCredentials;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.Users.ApiPartner;
import com.project2.ism.Repository.ApiPartnerCredentialsRepository;
import com.project2.ism.Repository.ApiPartnerRepository;
import com.project2.ism.Repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApiPartnerCredentialsService {

    private final ApiPartnerCredentialsRepository credentialsRepository;
    private final ApiPartnerRepository apiPartnerRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    // ✅ Constructor-based Dependency Injection
    public ApiPartnerCredentialsService(ApiPartnerCredentialsRepository credentialsRepository,
                                        ApiPartnerRepository apiPartnerRepository,
                                        ProductRepository productRepository, MailService mailService) {
        this.credentialsRepository = credentialsRepository;
        this.apiPartnerRepository = apiPartnerRepository;
        this.productRepository = productRepository;
        this.mailService = mailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // 🔹 Helper: Convert Entity → DTO
    private PartnerCredentialDTO toDTO(ApiPartnerCredentials entity) {
        if (entity == null) return null;

        PartnerCredentialDTO dto = new PartnerCredentialDTO();
        dto.setId(entity.getId());
        dto.setApiPartnerId(entity.getApiPartner() != null ? entity.getApiPartner().getId() : null);
        dto.setApiPartnerName(entity.getApiPartner().getBusinessName());
        dto.setProductId(entity.getProduct() != null ? entity.getProduct().getId() : null);
        dto.setProductName(entity.getProduct().getProductName());
        dto.setTokenUrlUat(entity.getTokenUrlUat());
        dto.setTokenUrlProd(entity.getTokenUrlProd());
        dto.setBaseUrlUat(entity.getBaseUrlUat());
        dto.setBaseUrlProd(entity.getBaseUrlProd());
        dto.setCallbackUrl(entity.getCallbackUrl());
        dto.setIsActive(entity.getActive());
        dto.setCreatedOn(entity.getCreatedOn());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setEditedOn(entity.getEditedOn());
        dto.setEditedBy(entity.getEditedBy());
        return dto;
    }

    // 🔹 Helper: Convert DTO → Entity
    private ApiPartnerCredentials toEntity(PartnerCredentialDTO dto, ApiPartner apiPartner, Product product) {
        if (dto == null) return null;

        ApiPartnerCredentials entity = new ApiPartnerCredentials();
        entity.setApiPartner(apiPartner);
        entity.setProduct(product);
        entity.setTokenUrlUat(dto.getTokenUrlUat());
        entity.setTokenUrlProd(dto.getTokenUrlProd());
        entity.setBaseUrlUat(dto.getBaseUrlUat());
        entity.setBaseUrlProd(dto.getBaseUrlProd());
        entity.setCallbackUrl(dto.getCallbackUrl());
        entity.setActive(dto.getIsActive());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setEditedBy(dto.getEditedBy());

        return generateCredentials(entity, apiPartner.getId());

    }

    //========================================= CRUD =================================================

    // 🔹 CREATE
    public PartnerCredentialDTO create(PartnerCredentialDTO dto) {
        ApiPartner apiPartner = apiPartnerRepository.findById(dto.getApiPartnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner", dto.getApiPartnerId()));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", dto.getProductId()));

        ApiPartnerCredentials saved = toEntity(dto, apiPartner, product);
        //ApiPartnerCredentials saved = credentialsRepository.save(entity);
        return toDTO(saved);
    }

    // 🔹 GET ALL
    public List<PartnerCredentialDTO> getAll() {
        return credentialsRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 🔹 GET BY ID
    public PartnerCredentialDTO getById(Long id) {
        ApiPartnerCredentials entity = credentialsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PartnerCredential", id));
        return toDTO(entity);
    }

    // 🔹 UPDATE
    public PartnerCredentialDTO update(Long id, PartnerCredentialDTO dto) {
        ApiPartnerCredentials existing = credentialsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PartnerCredential", id));

        ApiPartner apiPartner = apiPartnerRepository.findById(dto.getApiPartnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Partner", dto.getApiPartnerId()));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", dto.getProductId()));

        // update fields

        existing.setTokenUrlUat(dto.getTokenUrlUat());
        existing.setTokenUrlProd(dto.getTokenUrlProd());
        existing.setBaseUrlUat(dto.getBaseUrlUat());
        existing.setBaseUrlProd(dto.getBaseUrlProd());
        existing.setCallbackUrl(dto.getCallbackUrl());
        existing.setActive(dto.getIsActive());
        existing.setEditedBy(dto.getEditedBy());

        ApiPartnerCredentials updated = credentialsRepository.save(existing);
        return toDTO(updated);
    }

    // 🔹 DELETE
    public void delete(Long id) {
        ApiPartnerCredentials entity = credentialsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PartnerCredential", id));
        credentialsRepository.delete(entity);
    }

//--------------------------------------------------------------------------------------------------



    @Transactional
    public ApiPartnerCredentials generateCredentials(ApiPartnerCredentials entity,Long partnerId) {
        ApiPartner partner = apiPartnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));

        // Generate random values
        String password = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String clientId = "CID-" + UUID.randomUUID().toString().substring(0, 8);
        String clientSecret = UUID.randomUUID().toString().replace("-", "");
        String saltKey = Base64.getEncoder().encodeToString(SecureRandom.getSeed(16));
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String partnerEmail = partner.getContactPerson().getEmail();
        entity.setUsername(partnerEmail);
        entity.setPassword(passwordEncoder.encode(password)); // store encoded
        entity.setClientId(clientId);
        entity.setClientSecret(passwordEncoder.encode(clientSecret));
        entity.setSaltKey(saltKey);
        entity.setActive(true);
        entity.setCreatedBy(auth.getName());

        ApiPartnerCredentials saved = credentialsRepository.save(entity);

        String message = """
                Hello,

                Your api credentials have been created successfully.

                Email: %s
                Password: %s

                You can request for token here: ;

                Note: ;
                """.formatted(partnerEmail, password);

        mailService.sendEmail(
                List.of(partnerEmail),
                "Your Account Credentials",
                message
        );

        return saved;
    }
}
