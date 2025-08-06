package com.project2.ism.Model;

import jakarta.persistence.Embeddable;

@Embeddable
public class ContactPerson {
    private String name;
    private String phoneNumber;
    private String alternatePhonenum;
    private String email;
    private String LandlineNumber;
}
