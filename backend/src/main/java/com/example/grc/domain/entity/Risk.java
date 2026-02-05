package com.example.grc.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "risks")
public class Risk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String asset;

    @Column(nullable = false)
    private String threat;

    @Column(nullable = false)
    private Integer likelihood;

    @Column(nullable = false)
    private Integer impact;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private String level;

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
