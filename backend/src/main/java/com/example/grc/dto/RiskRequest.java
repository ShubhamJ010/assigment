package com.example.grc.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RiskRequest {

    @NotBlank
    private String asset;

    @NotBlank
    private String threat;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer likelihood;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer impact;

    public String getAsset() {
        return asset;
    }

    public void setAsset(String asset) {
        this.asset = asset;
    }

    public String getThreat() {
        return threat;
    }

    public void setThreat(String threat) {
        this.threat = threat;
    }

    public Integer getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(Integer likelihood) {
        this.likelihood = likelihood;
    }

    public Integer getImpact() {
        return impact;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }
}
