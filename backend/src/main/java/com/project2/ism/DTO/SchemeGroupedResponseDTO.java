package com.project2.ism.DTO;

import java.util.List;

public class SchemeGroupedResponseDTO {
    private String schemeCode;
    private String description;

    private Double rentalByMonth;
    private List<ApiPartnerSchemeAssignmentDTO> assignments;

    public String getSchemeCode() {
        return schemeCode;
    }

    public void setSchemeCode(String schemeCode) {
        this.schemeCode = schemeCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



    public Double getRentalByMonth() {
        return rentalByMonth;
    }

    public void setRentalByMonth(Double rentalByMonth) {
        this.rentalByMonth = rentalByMonth;
    }

    public List<ApiPartnerSchemeAssignmentDTO> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<ApiPartnerSchemeAssignmentDTO> assignments) {
        this.assignments = assignments;
    }
}
