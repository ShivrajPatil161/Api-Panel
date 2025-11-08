package com.project2.ism.Model;

import com.project2.ism.Model.Users.ApiPartner;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;


@Entity
@Table(name = "api_partner_credentials")
public class ApiPartnerCredentials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    @NotNull(message = "Partner is required")
    private ApiPartner apiPartner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @Column(name = "callback_url")
    private String callbackUrl;

    @Column(name = "token_url_uat")
    private String tokenUrlUat;

    @Column(name = "token", length = 2000)
    private String token;

    @Column(name = "token_url_prod")
    private String tokenUrlProd;

    @Column(name = "base_url_uat")
    private String baseUrlUat;

    @Column(name = "base_url_prod")
    private String baseUrlProd;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "client_secret")
    private String clientSecret;

    @Column(name = "salt_key")
    private String saltKey;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(name = "is_white_label_admin")
    private Boolean isWhiteLabelAdmin;

    @Column(name = "white_label_admin_id")
    private String whiteLabelAdminId;

    @Column(name = "user_field_1")
    private String userField1;

    @Column(name = "user_field_2")
    private String userField2;

    @Column(name = "user_field_3")
    private String userField3;

    @CreationTimestamp
    @Column(name = "created_on", updatable = false)
    private LocalDateTime createdOn;

    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @UpdateTimestamp
    @Column(name = "edited_on")
    private LocalDateTime editedOn;

    @Column(name = "edited_by")
    private String editedBy;
}

