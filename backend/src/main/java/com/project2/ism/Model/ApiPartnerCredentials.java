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

    public ApiPartnerCredentials() {
    }

    public ApiPartnerCredentials(Long id, ApiPartner apiPartner, Product product, String callbackUrl, String tokenUrlUat, String token, String tokenUrlProd, String baseUrlUat, String baseUrlProd, String clientId, String clientSecret, String saltKey, String username, String password, Boolean isActive, Boolean isWhiteLabelAdmin, String whiteLabelAdminId, String userField1, String userField2, String userField3, LocalDateTime createdOn, String createdBy, LocalDateTime editedOn, String editedBy) {
        this.id = id;
        this.apiPartner = apiPartner;
        this.product = product;
        this.callbackUrl = callbackUrl;
        this.tokenUrlUat = tokenUrlUat;
        this.token = token;
        this.tokenUrlProd = tokenUrlProd;
        this.baseUrlUat = baseUrlUat;
        this.baseUrlProd = baseUrlProd;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.saltKey = saltKey;
        this.username = username;
        this.password = password;
        this.isActive = isActive;
        this.isWhiteLabelAdmin = isWhiteLabelAdmin;
        this.whiteLabelAdminId = whiteLabelAdminId;
        this.userField1 = userField1;
        this.userField2 = userField2;
        this.userField3 = userField3;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.editedOn = editedOn;
        this.editedBy = editedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ApiPartner getApiPartner() {
        return apiPartner;
    }

    public void setApiPartner(ApiPartner apiPartner) {
        this.apiPartner = apiPartner;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getTokenUrlUat() {
        return tokenUrlUat;
    }

    public void setTokenUrlUat(String tokenUrlUat) {
        this.tokenUrlUat = tokenUrlUat;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenUrlProd() {
        return tokenUrlProd;
    }

    public void setTokenUrlProd(String tokenUrlProd) {
        this.tokenUrlProd = tokenUrlProd;
    }

    public String getBaseUrlUat() {
        return baseUrlUat;
    }

    public void setBaseUrlUat(String baseUrlUat) {
        this.baseUrlUat = baseUrlUat;
    }

    public String getBaseUrlProd() {
        return baseUrlProd;
    }

    public void setBaseUrlProd(String baseUrlProd) {
        this.baseUrlProd = baseUrlProd;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getSaltKey() {
        return saltKey;
    }

    public void setSaltKey(String saltKey) {
        this.saltKey = saltKey;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getWhiteLabelAdmin() {
        return isWhiteLabelAdmin;
    }

    public void setWhiteLabelAdmin(Boolean whiteLabelAdmin) {
        isWhiteLabelAdmin = whiteLabelAdmin;
    }

    public String getWhiteLabelAdminId() {
        return whiteLabelAdminId;
    }

    public void setWhiteLabelAdminId(String whiteLabelAdminId) {
        this.whiteLabelAdminId = whiteLabelAdminId;
    }

    public String getUserField1() {
        return userField1;
    }

    public void setUserField1(String userField1) {
        this.userField1 = userField1;
    }

    public String getUserField2() {
        return userField2;
    }

    public void setUserField2(String userField2) {
        this.userField2 = userField2;
    }

    public String getUserField3() {
        return userField3;
    }

    public void setUserField3(String userField3) {
        this.userField3 = userField3;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getEditedOn() {
        return editedOn;
    }

    public void setEditedOn(LocalDateTime editedOn) {
        this.editedOn = editedOn;
    }

    public String getEditedBy() {
        return editedBy;
    }

    public void setEditedBy(String editedBy) {
        this.editedBy = editedBy;
    }
}

