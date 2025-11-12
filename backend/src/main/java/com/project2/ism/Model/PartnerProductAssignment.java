package com.project2.ism.Model;

import com.project2.ism.Model.Users.ApiPartner;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partner_products",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_partner_product", columnNames = {"partner_id", "product_id"})
        })
public class PartnerProductAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private ApiPartner partner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String assignedBy;

    @CreationTimestamp
    @Column(name = "assigned_on", nullable = false, updatable = false)
    private LocalDateTime assignedOn;

    @Column(name = "remarks")
    private String remarks;

    public PartnerProductAssignment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ApiPartner getPartner() {
        return partner;
    }

    public void setPartner(ApiPartner partner) {
        this.partner = partner;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }

    public LocalDateTime getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(LocalDateTime assignedOn) {
        this.assignedOn = assignedOn;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

