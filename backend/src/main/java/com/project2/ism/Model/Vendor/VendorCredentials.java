package com.project2.ism.Model.Vendor;

import com.project2.ism.Model.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_credentials")
public class VendorCredentials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    @NotNull(message = "Vendor is required")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

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


    @Column(name = "user_field_1")
    private String userField1;

    @Column(name = "user_field_2")
    private String userField2;

    @Column(name = "user_field_3")
    private String userField3;

    @Column(name = "token_type")
    private String tokenType;

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


    public VendorCredentials() {
    }

    public VendorCredentials(Long id, Vendor vendor, Product product, String tokenUrlUat, String token, String tokenUrlProd, String baseUrlUat, String baseUrlProd, String clientId, String clientSecret, String saltKey, String username, String password, Boolean isActive,String userField1, String userField2, String userField3, String tokenType, LocalDateTime createdOn, String createdBy, LocalDateTime editedOn, String editedBy) {
        this.id = id;
        this.vendor = vendor;
        this.product = product;
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

        this.userField1 = userField1;
        this.userField2 = userField2;
        this.userField3 = userField3;
        this.tokenType = tokenType;
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

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
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

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

