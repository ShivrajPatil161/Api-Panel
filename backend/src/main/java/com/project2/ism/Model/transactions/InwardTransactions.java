package com.project2.ism.Model.transactions;

import com.project2.ism.Model.Product;
import com.project2.ism.Model.ProductCategory;
import com.project2.ism.Model.Vendor.Vendor;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class InwardTransactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Invoice number required")
    private String invoiceNumber;

    @NotNull(message = "Vendor is required")
    @ManyToOne
    @JoinColumn(name = "vendor_id",nullable = false)
    private Vendor vendor;

    @NotNull(message = "Received date required")
    @PastOrPresent(message = "Received date cannot be in the future")
    @Column(nullable = false)
    private LocalDate receivedDate;

    @NotBlank
    @Size(max = 100, message = "Receiver name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String receivedBy;

    @NotNull(message = "Product is required")
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Product Category is required")
    @ManyToOne
    @JoinColumn(name = "product_category_id", nullable = false)
    private ProductCategory productCategory;

    @NotNull(message = "Product Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    @Column(nullable = false)
    private Integer quantity;

    private String batchNumber;

    private Integer warrantyPeriod;

    @NotBlank(message = "Condition is required")
    @Column(nullable = false)
    private String productCondition;

    @OneToMany
    private List<SerialNumbers> serialNumbers;

    @Size(max = 1000)
    private String remark;
}
