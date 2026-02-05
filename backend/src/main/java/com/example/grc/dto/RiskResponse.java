package com.example.grc.dto;

public class RiskResponse {

    private Long id;
    private String asset;
    private String threat;
    private Integer likelihood;
    private Integer impact;
    private Integer score;
    private String level;

    public RiskResponse() {
    }

    public RiskResponse(Long id, String asset, String threat, Integer likelihood, Integer impact, Integer score, String level) {
        this.id = id;
        this.asset = asset;
        this.threat = threat;
        this.likelihood = likelihood;
        this.impact = impact;
        this.score = score;
        this.level = level;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
