package com.project2.ism.Model.Users;

import com.project2.ism.Model.ContactPerson;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.validation.constraints.NotNull;

public class Merchant {

    private Long id;

    private String name;

    private String legalName;

    private String businessType;

    private String GSTNumber;

    private String panNumber;

    private String registrationNumber;

    private String address;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "contact_person_name")),
            @AttributeOverride(name = "email", column = @Column(name = "contact_person_email")),
            @AttributeOverride(name = "phoneNumber", column = @Column(name = "contact_person_phone")),
            @AttributeOverride(name = "alternatePhoneNum", column = @Column(name = "contact_person_alt_phone")),
            @AttributeOverride(name = "LandlineNumber", column = @Column(name = "contact_person_landline"))
    })
    @NotNull(message = "Contact person details are required")
    private ContactPerson contactPerson;

    @Embedded
    private BankDetails bankDetails;

}
