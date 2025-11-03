package com.project2.ism.DTO.PrefunAuth;


/**
 * DTO for admin to approve/reject request
 * Constructor needed: All fields constructor, No-args constructor
 * Getters and Setters needed: All fields
 */
public class ApproveRejectDTO {
    private String action; // "APPROVED" or "REJECTED"
    private String remarks;

    public ApproveRejectDTO() {
    }

    public ApproveRejectDTO(String action, String remarks) {
        this.action = action;
        this.remarks = remarks;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}