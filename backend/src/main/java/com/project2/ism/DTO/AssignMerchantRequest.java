package com.project2.ism.DTO;

import java.util.List;

public class AssignMerchantRequest {
    private Long merchantId;
    private List<Long> selectedDeviceIds;

    // getters & setters

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
    }

    public List<Long> getSelectedDeviceIds() {
        return selectedDeviceIds;
    }

    public void setSelectedDeviceIds(List<Long> selectedDeviceIds) {
        this.selectedDeviceIds = selectedDeviceIds;
    }
}

