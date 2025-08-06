package com.project2.ism.Model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class ContactPerson {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "phone number is required")
    private String phoneNumber;

    private String alternatePhoneNum;

    @NotBlank
    @Email(message = "Invalid email format")
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

    public String getAlternatePhoneNum() {
        return alternatePhoneNum;
    }

    public void setAlternatePhoneNum(String alternatePhonenum) {
        this.alternatePhoneNum = alternatePhonenum;
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
