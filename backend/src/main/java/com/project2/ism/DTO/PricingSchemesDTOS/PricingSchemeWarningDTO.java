package com.project2.ism.DTO.PricingSchemesDTOS;


/**
 * Individual pricing scheme summary with warning
 */
public class PricingSchemeWarningDTO {
    private String schemeCode;
    private Double monthlyRent;
    private String warning;  // Warning if below vendor rates, null otherwise

    public PricingSchemeWarningDTO() {}

    public PricingSchemeWarningDTO(String schemeCode, Double monthlyRent, String warning) {
        this.schemeCode = schemeCode;
        this.monthlyRent = monthlyRent;
        this.warning = warning;
    }

    // Getters and Setters
    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }

    public Double getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(Double monthlyRent) { this.monthlyRent = monthlyRent; }

    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
}
