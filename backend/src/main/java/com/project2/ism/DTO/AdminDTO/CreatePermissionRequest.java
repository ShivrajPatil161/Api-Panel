package com.project2.ism.DTO.AdminDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreatePermissionRequest {
    @NotBlank(message = "Permission name is required")
    private String name;

    private String description;

    // Constructors, getters, setters
    public CreatePermissionRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

