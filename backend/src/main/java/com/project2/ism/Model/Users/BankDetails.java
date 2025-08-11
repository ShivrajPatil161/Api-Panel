package com.project2.ism.Model.Users;


import jakarta.persistence.Embeddable;

@Embeddable
public class BankDetails {

    private Long id;
    private String bankName;
    private String accountHolderName;
    private Integer accountNumber;
    private Integer IFSC;
    private String branchName;
    private String accountType;
}
