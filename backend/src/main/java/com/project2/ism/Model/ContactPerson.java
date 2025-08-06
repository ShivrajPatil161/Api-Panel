package com.project2.ism.Model;

import jakarta.persistence.Embeddable;

@Embeddable
public class ContactPerson {
    private String name;
    private String phoneNumber;
    private String alternatePhonenum;
    private String email;
    private String LandlineNumber;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAlternatePhonenum() {
        return alternatePhonenum;
    }

    public void setAlternatePhonenum(String alternatePhonenum) {
        this.alternatePhonenum = alternatePhonenum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLandlineNumber() {
        return LandlineNumber;
    }

    public void setLandlineNumber(String landlineNumber) {
        LandlineNumber = landlineNumber;
    }
}
