package com.project2.ism.Model.transactions;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
public class SerialNumbers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String sid;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String mid;

    @Size(max = 50, message = "TID cannot exceed 50 characters")
    private String tid;

    private String vpaid;
    @Size(max = 50, message = "TID cannot exceed 50 characters")

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
    private String mobNumber;

    @ManyToOne
    @JoinColumn(name = "inward_transaction_id", nullable = false)
    private InwardTransactions inwardTransactions;




}
